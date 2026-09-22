import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { SignatureRequest } from "@caelix-business-os/database";
import { createHash, randomBytes } from "node:crypto";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";
import { CommunicationService } from "@/capabilities/communication/communication.service";

import { CreateSignatureRequestDto } from "./dto/signature.dto";

const DAY_MS = 24 * 60 * 60 * 1000;

const hashContent = (title: string, body: string) => createHash("sha256").update(`${title}\n${body}`).digest("hex");

// The token is the signer's credential — deliberately absent, so list/detail never expose it.
export const SAFE_SELECT = {
  id: true,
  organizationId: true,
  contactId: true,
  title: true,
  body: true,
  bodyHash: true,
  signerName: true,
  signerEmail: true,
  status: true,
  expiresAt: true,
  signedAt: true,
  signedName: true,
  signerIp: true,
  signerUserAgent: true,
  declineReason: true,
  createdByUserId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface SigningContext {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class SignaturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly communication: CommunicationService,
    private readonly config: ConfigService,
  ) {}

  private signingUrl(token: string) {
    return `${this.config.get<string>("APP_URL", "http://localhost:3000")}/sign/${token}`;
  }

  private async expireOverdue(where: { organizationId?: string; token?: string }) {
    await this.prisma.client.signatureRequest.updateMany({
      where: { ...where, status: "PENDING", expiresAt: { lt: new Date() } },
      data: { status: "EXPIRED" },
    });
  }

  async create(organizationId: string, createdByUserId: string, dto: CreateSignatureRequestDto) {
    const token = randomBytes(32).toString("hex");

    const request = await this.prisma.client.signatureRequest.create({
      data: {
        id: customUUID.generate(),
        organizationId,
        contactId: dto.contactId,
        title: dto.title,
        body: dto.body,
        bodyHash: hashContent(dto.title, dto.body),
        signerName: dto.signerName,
        signerEmail: dto.signerEmail,
        token,
        expiresAt: new Date(Date.now() + (dto.expiresInDays ?? 14) * DAY_MS),
        createdByUserId,
      },
      select: SAFE_SELECT,
    });

    const organization = await this.prisma.client.organization.findUniqueOrThrow({
      where: { id: organizationId },
      select: { name: true },
    });

    await this.communication.send({
      organizationId,
      channel: "EMAIL",
      contactId: dto.contactId,
      to: dto.signerEmail,
      subject: `${organization.name} has asked you to sign: ${dto.title}`,
      body: `Hi ${dto.signerName},\n\n${organization.name} has asked you to review and sign "${dto.title}".\n\nReview and sign here:\n${this.signingUrl(token)}\n\nThis link is personal to you and expires in ${dto.expiresInDays ?? 14} days.`,
      source: `esign:${request.id}`,
      sentByUserId: createdByUserId,
    });

    return { ...request, signingUrl: this.signingUrl(token) };
  }

  async list(organizationId: string) {
    await this.expireOverdue({ organizationId });
    return this.prisma.client.signatureRequest.findMany({
      where: { organizationId },
      select: SAFE_SELECT,
      orderBy: { createdAt: "desc" },
    });
  }

  async link(organizationId: string, id: string): Promise<{ signingUrl: string }> {
    const request = await this.prisma.client.signatureRequest.findFirst({
      where: { id, organizationId, status: "PENDING", expiresAt: { gt: new Date() } },
      select: { token: true },
    });
    if (!request) throw new NotFoundException("No pending signature request found.");
    return { signingUrl: this.signingUrl(request.token) };
  }

  async cancel(organizationId: string, id: string): Promise<void> {
    const { count } = await this.prisma.client.signatureRequest.updateMany({
      where: { id, organizationId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    if (count === 0) throw new NotFoundException("No pending signature request found.");
  }

  // ---- Public (signer, no account) ----

  async viewByToken(token: string) {
    await this.expireOverdue({ token });
    const request = await this.prisma.client.signatureRequest.findUnique({
      where: { token },
      include: { organization: { select: { name: true } } },
    });
    if (!request) throw new NotFoundException("This signing link isn't valid.");

    return {
      title: request.title,
      body: request.body,
      signerName: request.signerName,
      organizationName: request.organization.name,
      status: request.status,
      expiresAt: request.expiresAt,
      signedAt: request.signedAt,
      signedName: request.signedName,
      bodyHash: request.bodyHash,
    };
  }

  async sign(token: string, typedName: string, agreed: boolean, context: SigningContext) {
    if (!agreed) throw new BadRequestException("You need to agree before signing.");
    await this.expireOverdue({ token });

    const request = await this.prisma.client.signatureRequest.findUnique({ where: { token } });
    if (!request) throw new NotFoundException("This signing link isn't valid.");
    if (hashContent(request.title, request.body) !== request.bodyHash) {
      throw new ConflictException("This document changed after it was sent and can't be signed.");
    }

    const { count } = await this.prisma.client.signatureRequest.updateMany({
      where: { id: request.id, status: "PENDING" },
      data: {
        status: "SIGNED",
        signedAt: new Date(),
        signedName: typedName.trim(),
        signerIp: context.ip,
        signerUserAgent: context.userAgent?.slice(0, 300),
      },
    });
    if (count === 0) throw new ConflictException(`This request is no longer open for signing (${request.status.toLowerCase()}).`);

    await this.afterSigned(request);
    return this.viewByToken(token);
  }

  async decline(token: string, reason?: string) {
    await this.expireOverdue({ token });
    const { count } = await this.prisma.client.signatureRequest.updateMany({
      where: { token, status: "PENDING" },
      data: { status: "DECLINED", declineReason: reason?.slice(0, 500) },
    });
    if (count === 0) throw new ConflictException("This request can no longer be declined.");
    return this.viewByToken(token);
  }

  private async afterSigned(request: SignatureRequest) {
    if (request.createdByUserId) {
      await this.prisma.client.notification.create({
        data: {
          id: customUUID.generate(),
          organizationId: request.organizationId,
          userId: request.createdByUserId,
          type: "signature.signed",
          title: `${request.signerName} signed "${request.title}"`,
          message: "The signed record is in E-signature.",
          metadata: { signatureRequestId: request.id },
        },
      });
    }

    await this.communication.send({
      organizationId: request.organizationId,
      channel: "EMAIL",
      contactId: request.contactId ?? undefined,
      to: request.signerEmail,
      subject: `You signed: ${request.title}`,
      body: `Hi ${request.signerName},\n\nThis confirms you signed "${request.title}". Keep this reference for your records:\n${request.bodyHash}`,
      source: `esign:${request.id}`,
    });
  }
}

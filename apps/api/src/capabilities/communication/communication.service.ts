import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Message, MessageChannel } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { MailService } from "./mail/mail.service";
import { escapeHtml, normalizePhone, renderTemplate } from "./template.util";
import { isTwilioConfigured, sendViaTwilio } from "./twilio.client";

export interface SendMessageInput {
  organizationId: string;
  channel: MessageChannel;
  contactId?: string;
  /** Explicit recipient; otherwise the contact's email/phone for the channel is used. */
  to?: string;
  subject?: string;
  body: string;
  source: string;
  sentByUserId?: string;
  variables?: Record<string, string>;
}

/**
 * One entry point for every outbound message so each send is recorded in
 * the same log, whatever the channel or the caller (a person, an
 * automation, e-signature). With no provider credentials configured the
 * message is recorded as LOGGED instead of delivered — the same
 * dev-friendly behaviour MailService already had.
 */
@Injectable()
export class CommunicationService {
  private readonly logger = new Logger(CommunicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  channelStatus(): Record<MessageChannel, boolean> {
    return {
      EMAIL: this.mail.isConfigured(),
      SMS: isTwilioConfigured(this.config, "SMS"),
      WHATSAPP: isTwilioConfigured(this.config, "WHATSAPP"),
    };
  }

  async send(input: SendMessageInput): Promise<Message> {
    const contact = input.contactId
      ? await this.prisma.client.contact.findFirst({ where: { id: input.contactId, organizationId: input.organizationId } })
      : null;

    const countryCode = this.config.get<string>("DEFAULT_PHONE_COUNTRY_CODE", "+91");
    const rawTo = input.to ?? (input.channel === "EMAIL" ? contact?.email : contact?.phone);
    if (!rawTo) {
      throw new BadRequestException(
        input.channel === "EMAIL" ? "No email address to send to." : "No phone number to send to.",
      );
    }
    const to = input.channel === "EMAIL" ? rawTo : normalizePhone(rawTo, countryCode);

    const variables = {
      contactName: [contact?.firstName, contact?.lastName].filter(Boolean).join(" ") || contact?.companyName || "",
      contactEmail: contact?.email ?? "",
      contactPhone: contact?.phone ?? "",
      ...input.variables,
    };
    const subject = input.subject ? renderTemplate(input.subject, variables) : undefined;
    const body = renderTemplate(input.body, variables);

    let status: Message["status"] = "SENT";
    let error: string | undefined;

    try {
      status = await this.deliver(input.channel, to, subject ?? "Message", body);
    } catch (err) {
      status = "FAILED";
      error = err instanceof Error ? err.message : String(err);
      this.logger.error(`${input.channel} to ${to} failed: ${error}`);
    }

    return this.prisma.client.message.create({
      data: {
        id: customUUID.generate(),
        organizationId: input.organizationId,
        contactId: contact?.id,
        channel: input.channel,
        toAddress: to,
        subject,
        body,
        status,
        error,
        source: input.source,
        sentByUserId: input.sentByUserId,
      },
    });
  }

  private async deliver(channel: MessageChannel, to: string, subject: string, body: string): Promise<Message["status"]> {
    if (channel === "EMAIL") {
      await this.mail.send({ to, subject, html: escapeHtml(body).replace(/\n/g, "<br>") });
      return this.mail.isConfigured() ? "SENT" : "LOGGED";
    }

    if (!isTwilioConfigured(this.config, channel)) {
      this.logger.log(`[dev ${channel}, Twilio not configured] to=${to}`);
      return "LOGGED";
    }

    await sendViaTwilio(this.config, channel, to, body);
    return "SENT";
  }
}

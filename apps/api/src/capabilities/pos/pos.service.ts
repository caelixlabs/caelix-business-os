import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@caelix-business-os/database";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { CheckoutDto } from "./dto/checkout.dto";

// select, not include, for every User relation here — a bare `include`
// would serialize passwordHash straight into the API response.
const SAFE_USER_SELECT = { select: { id: true, firstName: true, lastName: true, email: true } } as const;

const WITH_LINES = {
  include: {
    lines: { include: { product: true, staffUser: SAFE_USER_SELECT } },
    contact: true,
    soldByUser: SAFE_USER_SELECT,
  },
} as const;

export type SaleWithLines = Prisma.SaleGetPayload<typeof WITH_LINES>;

@Injectable()
export class PosService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(organizationId: string, input: CheckoutDto): Promise<SaleWithLines> {
    const productIds = input.lines.map((line) => line.productId).filter((id): id is string => Boolean(id));

    const products = productIds.length
      ? await this.prisma.client.product.findMany({ where: { id: { in: productIds }, organizationId } })
      : [];
    const productById = new Map(products.map((product) => [product.id, product]));

    const lines = input.lines.map((line) => {
      const product = line.productId ? productById.get(line.productId) : undefined;

      if (line.productId && !product) {
        throw new NotFoundException(`Product ${line.productId} not found.`);
      }

      const description = line.description ?? product?.name;
      if (!description) {
        throw new BadRequestException("Each line needs a description or a valid productId.");
      }

      const lineTotal = round2(line.quantity * line.unitPrice);
      const commissionAmount = line.commissionPct != null ? round2(lineTotal * (line.commissionPct / 100)) : undefined;

      return {
        id: customUUID.generate(),
        productId: line.productId,
        description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal,
        staffUserId: line.staffUserId,
        commissionPct: line.commissionPct,
        commissionAmount,
      };
    });

    const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
    const discountAmount = input.discountAmount ?? 0;
    const taxAmount = input.taxAmount ?? 0;
    const totalAmount = round2(subtotal - discountAmount + taxAmount);

    return this.prisma.client.sale.create({
      data: {
        id: customUUID.generate(),
        organizationId,
        branchId: input.branchId,
        contactId: input.contactId,
        soldByUserId: input.soldByUserId,
        paymentMethod: input.paymentMethod,
        subtotal,
        discountAmount,
        taxAmount,
        totalAmount,
        lines: { create: lines },
      },
      ...WITH_LINES,
    });
  }

  list(organizationId: string): Promise<SaleWithLines[]> {
    return this.prisma.client.sale.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      ...WITH_LINES,
    });
  }

  async get(organizationId: string, id: string): Promise<SaleWithLines> {
    const sale = await this.prisma.client.sale.findFirst({
      where: { id, organizationId },
      ...WITH_LINES,
    });

    if (!sale) {
      throw new NotFoundException("Sale not found.");
    }

    return sale;
  }

  async refund(organizationId: string, id: string): Promise<SaleWithLines> {
    await this.get(organizationId, id);

    return this.prisma.client.sale.update({
      where: { id },
      data: { status: "REFUNDED" },
      ...WITH_LINES,
    });
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

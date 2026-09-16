import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(organizationId: string) {
    const [contactsTotal, enquiriesByStatus, bookingsByStatus, invoiceAgg, paymentAgg, documentsTotal] =
      await Promise.all([
        this.prisma.client.contact.count({ where: { organizationId } }),
        this.prisma.client.enquiry.groupBy({
          by: ["status"],
          where: { organizationId },
          _count: { _all: true },
        }),
        this.prisma.client.booking.groupBy({
          by: ["status"],
          where: { organizationId },
          _count: { _all: true },
        }),
        this.prisma.client.invoice.aggregate({
          where: { organizationId },
          _count: { _all: true },
          _sum: { totalAmount: true, amountPaid: true },
        }),
        this.prisma.client.payment.aggregate({
          where: { organizationId },
          _sum: { amount: true },
        }),
        this.prisma.client.document.count({ where: { organizationId } }),
      ]);

    const totalInvoiced = Number(invoiceAgg._sum.totalAmount ?? 0);
    const totalPaid = Number(invoiceAgg._sum.amountPaid ?? 0);

    return {
      contacts: { total: contactsTotal },
      enquiries: {
        total: sumCounts(enquiriesByStatus),
        byStatus: toCountMap(enquiriesByStatus),
      },
      bookings: {
        total: sumCounts(bookingsByStatus),
        byStatus: toCountMap(bookingsByStatus),
      },
      invoices: {
        total: invoiceAgg._count._all,
        totalAmount: totalInvoiced,
        amountPaid: totalPaid,
        outstandingAmount: totalInvoiced - totalPaid,
      },
      payments: { totalAmount: Number(paymentAgg._sum.amount ?? 0) },
      documents: { total: documentsTotal },
    };
  }
}

type StatusCount = { status: string; _count: { _all: number } };

function sumCounts(rows: StatusCount[]): number {
  return rows.reduce((sum, row) => sum + row._count._all, 0);
}

function toCountMap(rows: StatusCount[]): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row.status, row._count._all]));
}

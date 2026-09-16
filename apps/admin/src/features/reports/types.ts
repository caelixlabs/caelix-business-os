export interface ReportsOverview {
  contacts: { total: number };
  enquiries: { total: number; byStatus: Record<string, number> };
  bookings: { total: number; byStatus: Record<string, number> };
  invoices: {
    total: number;
    totalAmount: number;
    amountPaid: number;
    outstandingAmount: number;
  };
  payments: { totalAmount: number };
  documents: { total: number };
}

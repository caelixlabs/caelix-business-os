import { WorkflowDefinition } from "@/business/workflows";

export const MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW: WorkflowDefinition = {
  code: "music.customer-lifecycle",
  name: "Music Customer Lifecycle",
  industry: "MUSIC_ORG",

  steps: [
    {
      code: "ENQUIRY",
      name: "Enquiry",
      capability: "enquiries",
      next: "BOOKING",
    },

    {
      code: "BOOKING",
      name: "Booking",
      capability: "booking",
      next: "ENROLLMENT",
    },

    {
      code: "ENROLLMENT",
      name: "Enrollment",
      capability: "music.enrollment",
      next: "ORDER",
    },

    {
      code: "ORDER",
      name: "Order",
      capability: "orders",
      next: "PAYMENT",
    },

    {
      code: "PAYMENT",
      name: "Payment",
      capability: "payments",
    },
  ],

  triggers: [
    {
      eventName: "EnquiryConvertedEvent",
      fromStep: "ENQUIRY",
      toStep: "BOOKING",
    },

    {
      eventName: "BookingConfirmedEvent",
      fromStep: "BOOKING",
      toStep: "ENROLLMENT",
    },

    {
      eventName: "EnrollmentCompletedEvent",
      fromStep: "ENROLLMENT",
      toStep: "ORDER",
    },

    {
      eventName: "OrderCreatedEvent",
      fromStep: "ORDER",
      toStep: "PAYMENT",
    },

    {
      eventName: "PaymentCompletedEvent",
      fromStep: "PAYMENT",
      toStep: "PAYMENT",
    },
  ],
};

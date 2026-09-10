import { WorkflowDefinition } from "@/business/workflows";

export const GYM_CUSTOMER_LIFECYCLE_WORKFLOW: WorkflowDefinition = {
  code: "gym.customer-lifecycle",
  name: "Gym Customer Lifecycle",
  industry: "GYM",

  steps: [
    {
      code: "ENQUIRY",
      name: "Enquiry",
      capability: "enquiries",
      next: "BOOKING",
    },

    {
      code: "BOOKING",
      name: "Booking / Cart",
      capability: "booking",
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

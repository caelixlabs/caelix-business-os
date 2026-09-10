# integrations/

Reserved for third-party integrations: stripe, razorpay, spotify,
whatsapp, google, openai, zoom. Each should be an adapter behind a
domain-owned port (e.g. a PaymentGateway interface in business/payments)
rather than business modules depending on a vendor SDK directly — keeps
Stripe-vs-Razorpay, or swapping providers later, an infrastructure-only
change.

Not yet implemented.
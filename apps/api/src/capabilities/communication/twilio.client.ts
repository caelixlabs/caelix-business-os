import { ConfigService } from "@nestjs/config";

export type TwilioChannel = "SMS" | "WHATSAPP";

const SETTINGS: Record<TwilioChannel, { fromKey: string; prefix: string }> = {
  SMS: { fromKey: "TWILIO_SMS_FROM", prefix: "" },
  WHATSAPP: { fromKey: "TWILIO_WHATSAPP_FROM", prefix: "whatsapp:" },
};

export function isTwilioConfigured(config: ConfigService, channel: TwilioChannel): boolean {
  return Boolean(
    config.get("TWILIO_ACCOUNT_SID") && config.get("TWILIO_AUTH_TOKEN") && config.get(SETTINGS[channel].fromKey),
  );
}

export async function sendViaTwilio(config: ConfigService, channel: TwilioChannel, to: string, body: string) {
  const sid = config.getOrThrow<string>("TWILIO_ACCOUNT_SID");
  const token = config.getOrThrow<string>("TWILIO_AUTH_TOKEN");
  const { fromKey, prefix } = SETTINGS[channel];

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: `${prefix}${to}`, From: `${prefix}${config.getOrThrow<string>(fromKey)}`, Body: body }),
  });

  if (!response.ok) throw new Error(`Twilio responded ${response.status}: ${(await response.text()).slice(0, 200)}`);
}

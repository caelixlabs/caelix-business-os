import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Thin wrapper around nodemailer. With no SMTP_HOST configured (the
 * local-dev default), mail is logged instead of sent — every other
 * capability can call send()/sendWelcomeEmail() unconditionally, in any
 * environment, without knowing which mode it's in.
 */
@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;
  private transporter?: Transporter;

  constructor(private readonly config: ConfigService) {
    this.from = this.config.get<string>('MAIL_FROM', 'Caelix <no-reply@caelix.dev>');
  }

  onModuleInit() {
    const host = this.config.get<string>('SMTP_HOST');
    if (!host) return;

    const user = this.config.get<string>('SMTP_USER');

    this.transporter = createTransport({
      host,
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: user ? { user, pass: this.config.get<string>('SMTP_PASS') } : undefined,
    });
  }

  isConfigured(): boolean {
    return Boolean(this.transporter);
  }

  async send({ to, subject, html }: SendMailInput): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[dev mail, no SMTP_HOST set] to=${to} subject="${subject}"`);
      return;
    }

    await this.transporter.sendMail({ from: this.from, to, subject, html });
  }

  sendWelcomeEmail(to: string, recipientName: string, organizationName: string): Promise<void> {
    return this.send({
      to,
      subject: `Welcome to ${organizationName} on Caelix`,
      html: `<p>Hi ${recipientName},</p><p>Your account on <b>${organizationName}</b>'s Caelix workspace is ready. Sign in to get started.</p>`,
    });
  }
}

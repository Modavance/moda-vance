import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

const LOGO_HTML = `
<div style="text-align:center;margin-bottom:32px">
  <a href="https://modavance.co" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z" fill="url(#lg)"/>
      <path d="M11 27V14L16 21L20 15L24 21L29 14V27" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <defs><linearGradient id="lg" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse"><stop stop-color="#2563EB"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs>
    </svg>
    <span style="font-family:sans-serif;font-size:24px;font-weight:700;color:#0f172a">Moda<span style="color:#2563eb">Vance</span></span>
  </a>
</div>`;

const FOOTER_HTML = `
<hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0">
<p style="color:#94a3b8;font-size:12px;text-align:center">
  ModaVance · <a href="mailto:support@modavance.co" style="color:#94a3b8">support@modavance.co</a><br>
  Questions? Simply reply to this email — we respond within 24 hours.
</p>`;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST'),
      port: config.get<number>('SMTP_PORT') ?? 587,
      secure: config.get<boolean>('SMTP_SECURE') ?? false,
      auth: {
        user: config.get<string>('SMTP_USER'),
        pass: config.get<string>('SMTP_PASS'),
      },
    });
  }

  private get from() {
    return `ModaVance <${this.config.get('SMTP_USER')}>`;
  }

  private wrap(content: string): string {
    return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff">${LOGO_HTML}${content}${FOOTER_HTML}</div>`;
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html: this.wrap(html) });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
    }
  }

  async sendWelcome(to: string, firstName: string) {
    await this.send(
      to,
      'Welcome to ModaVance!',
      `
      <h1 style="font-size:22px;color:#0f172a;margin-bottom:12px">Welcome aboard, ${firstName}! 👋</h1>
      <p style="color:#475569;line-height:1.7;margin-bottom:16px">
        Your account is all set. You can now track your orders, save your shipping address, and enjoy a faster checkout every time.
      </p>
      <p style="color:#475569;line-height:1.7;">
        If you have any questions, our support team is always here to help — just reply to this email.
      </p>
      <a href="https://modavance.co/shop" style="display:inline-block;margin-top:28px;padding:13px 32px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">Browse Products →</a>
      `,
    );
  }

  async sendOrderConfirmation(to: string, order: {
    id: string;
    firstName: string;
    items: { productName: string; quantity: number; price: number }[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    paymentMethod: string;
  }) {
    const itemsHtml = order.items.map(i =>
      `<tr>
        <td style="padding:10px 0;color:#0f172a;border-bottom:1px solid #f1f5f9">${i.productName}</td>
        <td style="padding:10px 0;text-align:center;color:#64748b;border-bottom:1px solid #f1f5f9">×${i.quantity}</td>
        <td style="padding:10px 0;text-align:right;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9">$${i.price.toFixed(2)}</td>
      </tr>`
    ).join('');

    const paymentLabel: Record<string, string> = {
      bitcoin:  'Bitcoin (BTC) — 15% discount applied',
      ethereum: 'Ethereum (ETH) — 15% discount applied',
      card:     'Card Payment — 10% discount applied',
      paypal:   'PayPal',
    };

    await this.send(
      to,
      `Order Confirmed — ${order.id}`,
      `
      <div style="background:#0f172a;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px">
        <p style="color:#94a3b8;font-size:13px;margin:0 0 4px">Order Confirmed</p>
        <h1 style="color:#fff;font-size:20px;margin:0">✓ Thank you, ${order.firstName}!</h1>
        <p style="color:#64748b;font-size:12px;margin:8px 0 0;font-family:monospace">${order.id}</p>
      </div>

      <p style="color:#475569;line-height:1.7;margin-bottom:24px">
        We've received your order and will begin processing it as soon as your payment is confirmed.
        You'll receive another email once your package is on its way.
      </p>

      <h2 style="font-size:15px;color:#0f172a;margin-bottom:12px">Order Summary</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="padding:10px;text-align:left;color:#64748b;font-weight:600">Product</th>
            <th style="padding:10px;text-align:center;color:#64748b;font-weight:600">Qty</th>
            <th style="padding:10px;text-align:right;color:#64748b;font-weight:600">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="margin-top:12px;padding:16px;background:#f8fafc;border-radius:10px;font-size:14px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:#64748b">Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
        ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#16a34a"><span>Discount</span><span>−$${order.discount.toFixed(2)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:#64748b">Shipping</span><span>${order.shipping === 0 ? '<span style="color:#16a34a">FREE</span>' : '$' + order.shipping.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:16px;padding-top:10px;border-top:1px solid #e2e8f0"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
      </div>

      <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:10px;border:1px solid #bfdbfe;font-size:14px">
        <strong style="color:#1e40af">Payment: ${paymentLabel[order.paymentMethod.toLowerCase()] ?? order.paymentMethod}</strong>
        <p style="color:#3b82f6;margin:6px 0 0">Payment instructions will be sent to you in a separate email within 1 hour.</p>
      </div>

      <a href="https://modavance.co/orders/${order.id}" style="display:inline-block;margin-top:24px;padding:13px 32px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">Track Your Order →</a>
      `,
    );
  }

  async sendStatusUpdate(to: string, firstName: string, orderId: string, status: string, trackingNumber?: string) {
    const statusMessages: Record<string, { label: string; msg: string; color: string }> = {
      confirmed:  { label: 'Order Confirmed',    msg: 'Your order has been confirmed and is now being prepared for shipment.',                                                                   color: '#2563eb' },
      processing: { label: 'Payment Verified',   msg: 'Great news — your payment has been verified. Our team is now packing your order and it will be dispatched shortly.',                     color: '#7c3aed' },
      shipped:    { label: 'Your Order Is On Its Way! 🚀', msg: 'Your package has been dispatched and is heading your way. Delivery typically takes 4–12 business days depending on your shipping center. Please check the delivery details for your region to get a more accurate estimate.', color: '#0891b2' },
      delivered:  { label: 'Order Delivered ✓',  msg: "Your order has been marked as delivered. We hope you're satisfied with your purchase! If you have any questions or concerns, don't hesitate to reach out.", color: '#16a34a' },
      cancelled:  { label: 'Order Cancelled',    msg: 'Your order has been cancelled. If this was a mistake or you have any questions, please contact our support team and we\'ll be happy to help.', color: '#dc2626' },
    };

    const s = statusMessages[status.toLowerCase()] ?? { label: status, msg: '', color: '#64748b' };

    await this.send(
      to,
      `${s.label} — ${orderId}`,
      `
      <div style="background:${s.color};border-radius:12px;padding:24px;text-align:center;margin-bottom:28px">
        <h1 style="color:#fff;font-size:20px;margin:0">${s.label}</h1>
        <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:13px;font-family:monospace">${orderId}</p>
      </div>

      <p style="color:#475569;line-height:1.7;margin-bottom:20px">Hi ${firstName}, ${s.msg}</p>

      ${trackingNumber ? `
      <div style="padding:16px;background:#f8fafc;border-radius:10px;font-size:14px;margin-bottom:20px">
        <span style="color:#64748b;font-weight:600">Tracking Number: </span>
        <span style="font-family:monospace;background:#e2e8f0;padding:3px 10px;border-radius:6px;font-size:13px">${trackingNumber}</span>
      </div>` : ''}

      <a href="https://modavance.co/orders/${orderId}" style="display:inline-block;padding:13px 32px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">View Order →</a>
      `,
    );
  }
}

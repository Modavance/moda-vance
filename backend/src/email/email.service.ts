import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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
    return `Modavance <${this.config.get('SMTP_USER')}>`;
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
    }
  }

  async sendWelcome(to: string, firstName: string) {
    await this.send(
      to,
      'Welcome to Modavance!',
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff">
        <h1 style="font-size:24px;color:#0f172a;margin-bottom:8px">Welcome, ${firstName}! 👋</h1>
        <p style="color:#475569;line-height:1.6">Your account has been created successfully. You can now track your orders and save your shipping address.</p>
        <a href="https://modavance.co/shop" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Start Shopping</a>
        <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0">
        <p style="color:#94a3b8;font-size:12px">Modavance · support@modavance.co</p>
      </div>
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
      bitcoin: 'Bitcoin (BTC) — 15% discount applied',
      ethereum: 'Ethereum (ETH) — 15% discount applied',
      card: 'Card Payment — 10% discount applied',
      paypal: 'PayPal',
    };

    await this.send(
      to,
      `Order Confirmed — ${order.id}`,
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff">
        <div style="background:#0f172a;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px">
          <h1 style="color:#fff;font-size:22px;margin:0">Order Confirmed ✓</h1>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:14px">${order.id}</p>
        </div>
        <p style="color:#475569">Hi ${order.firstName}, thank you for your order! We'll process it as soon as we confirm your payment.</p>

        <h2 style="font-size:16px;color:#0f172a;margin:28px 0 12px">Order Summary</h2>
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

        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:10px;font-size:14px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:#64748b">Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
          ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#16a34a"><span>Discount</span><span>−$${order.discount.toFixed(2)}</span></div>` : ''}
          <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:#64748b">Shipping</span><span>${order.shipping === 0 ? 'FREE' : '$' + order.shipping.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;font-weight:700;font-size:16px;padding-top:10px;border-top:1px solid #e2e8f0"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
        </div>

        <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:10px;border:1px solid #bfdbfe;font-size:14px">
          <strong style="color:#1e40af">Payment: ${paymentLabel[order.paymentMethod.toLowerCase()] ?? order.paymentMethod}</strong>
          <p style="color:#1e40af;margin:6px 0 0">Payment instructions will follow in a separate email within 1 hour.</p>
        </div>

        <a href="https://modavance.co/orders/${order.id}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Track Your Order</a>

        <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0">
        <p style="color:#94a3b8;font-size:12px">Modavance · support@modavance.co · Questions? Reply to this email.</p>
      </div>
      `,
    );
  }

  async sendStatusUpdate(to: string, firstName: string, orderId: string, status: string, trackingNumber?: string) {
    const statusMessages: Record<string, { label: string; msg: string; color: string }> = {
      confirmed:  { label: 'Order Confirmed',   msg: 'Your order has been confirmed and is being prepared.',               color: '#2563eb' },
      processing: { label: 'Payment Verified',  msg: 'Your payment has been verified. We are preparing your shipment.',    color: '#7c3aed' },
      shipped:    { label: 'Order Shipped! 🚀', msg: 'Your package is on its way. Estimated delivery: 4–12 business days.', color: '#0891b2' },
      delivered:  { label: 'Order Delivered ✓', msg: 'Your order has been delivered. Enjoy!',                               color: '#16a34a' },
      cancelled:  { label: 'Order Cancelled',   msg: 'Your order has been cancelled. Contact us if you have questions.',    color: '#dc2626' },
    };

    const s = statusMessages[status.toLowerCase()] ?? { label: status, msg: '', color: '#64748b' };

    await this.send(
      to,
      `${s.label} — ${orderId}`,
      `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff">
        <div style="background:${s.color};border-radius:12px;padding:24px;text-align:center;margin-bottom:32px">
          <h1 style="color:#fff;font-size:20px;margin:0">${s.label}</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">${orderId}</p>
        </div>
        <p style="color:#475569">Hi ${firstName}, ${s.msg}</p>
        ${trackingNumber ? `<div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:10px;font-size:14px"><strong>Tracking Number:</strong> <span style="font-family:monospace;background:#e2e8f0;padding:2px 8px;border-radius:4px">${trackingNumber}</span></div>` : ''}
        <a href="https://modavance.co/orders/${orderId}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">View Order</a>
        <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0">
        <p style="color:#94a3b8;font-size:12px">Modavance · support@modavance.co</p>
      </div>
      `,
    );
  }
}

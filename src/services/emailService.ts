const SERVICE_ID  = 'service_cj88d3i';
const PUBLIC_KEY  = 'S8J9IGTnectA_Td-v';

const TEMPLATES = {
  orderConfirmed: 'template_vlg257m',
  orderShipped:   'template_q9uj58k',
};

async function sendEmail(templateId: string, params: Record<string, string>) {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  SERVICE_ID,
        template_id: templateId,
        user_id:     PUBLIC_KEY,
        template_params: params,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
  } catch (err) {
    console.error('EmailJS error:', err);
  }
}

function getPaymentInstructions(method: string, total: number): string {
  switch (method.toLowerCase()) {
    case 'bitcoin':
      return `Send the BTC equivalent of $${total.toFixed(2)} USD to the wallet address provided in your account. Payment must be received within 48 hours to hold your order.`;
    case 'ethereum':
      return `Send the ETH equivalent of $${total.toFixed(2)} USD to the wallet address provided in your account. Payment must be received within 48 hours to hold your order.`;
    case 'zelle':
      return `Send $${total.toFixed(2)} to payments@modavance.com via Zelle. Include your order number in the memo field. Your order will be processed within 2 hours of receiving payment.`;
    case 'bill':
      return `Send $${total.toFixed(2)} cash (no checks) in a plain sealed envelope to our P.O. Box. Include a slip of paper with your order number inside. Processing begins upon receipt.`;
    default:
      return `Please complete your payment of $${total.toFixed(2)} as instructed.`;
  }
}

export const emailService = {
  sendOrderConfirmation: async (order: any) => {
    const itemsList = order.items
      .map((i: any) => `${i.productName} (${i.pillCount} pills x${i.quantity})`)
      .join(', ');

    await sendEmail(TEMPLATES.orderConfirmed, {
      to_email:             order.shippingAddress.email,
      customer_name:        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      order_id:             order.id,
      order_items:          itemsList,
      order_subtotal:       `$${order.subtotal.toFixed(2)}`,
      order_discount:       order.discount > 0 ? `$${order.discount.toFixed(2)}` : 'No discount',
      dispatch_fee:         order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'No fee',
      order_total:          `$${order.total.toFixed(2)}`,
      payment_method:       order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1),
      payment_instructions: getPaymentInstructions(order.paymentMethod, order.total),
    });
  },

  sendOrderShipped: async (order: any, trackingNumber?: string) => {
    await sendEmail(TEMPLATES.orderShipped, {
      to_email:        order.shippingAddress.email,
      customer_name:   `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      order_id:        order.id,
      order_total:     `$${order.total.toFixed(2)}`,
      tracking_number: trackingNumber || 'Will be updated shortly',
    });
  },
};

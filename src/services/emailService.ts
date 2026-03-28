import emailjs from '@emailjs/browser';

const SERVICE_ID  = 'service_cj88d3i';
const PUBLIC_KEY  = 'S8J9IGTnectA_Td-v';

const TEMPLATES = {
  orderConfirmed: 'template_vlg257m',
  orderShipped:   'template_q9uj58k',
};

emailjs.init(PUBLIC_KEY);

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
    try {
      const itemsList = order.items
        .map((i: any) => `${i.productName} (${i.pillCount} pills x${i.quantity})`)
        .join(', ');

      const discountAmount = order.discount > 0 ? `$${order.discount.toFixed(2)}` : 'No discount';
      const dispatchFee = order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'No fee';

      await emailjs.send(SERVICE_ID, TEMPLATES.orderConfirmed, {
        to_email:             order.shippingAddress.email,
        customer_name:        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        order_id:             order.id,
        order_items:          itemsList,
        order_subtotal:       `$${order.subtotal.toFixed(2)}`,
        order_discount:       discountAmount,
        dispatch_fee:         dispatchFee,
        order_total:          `$${order.total.toFixed(2)}`,
        payment_method:       order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1),
        payment_instructions: getPaymentInstructions(order.paymentMethod, order.total),
      });
    } catch (err) {
      console.error('Failed to send order confirmation email:', err);
    }
  },

  sendOrderShipped: async (order: any, trackingNumber?: string) => {
    try {
      await emailjs.send(SERVICE_ID, TEMPLATES.orderShipped, {
        to_email:       order.shippingAddress.email,
        customer_name:  `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        order_id:       order.id,
        order_total:    `$${order.total.toFixed(2)}`,
        tracking_number: trackingNumber || 'Will be updated shortly',
      });
    } catch (err) {
      console.error('Failed to send shipped email:', err);
    }
  },
};

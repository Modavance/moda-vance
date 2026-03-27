export function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-400 mb-10">Last updated: January 1, 2025</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-800">
          <strong>Important Notice:</strong> The products sold on this website are marketed for research purposes. ModaVance LLC is not a licensed pharmacy and does not provide medical advice. You must be 18 years of age or older to purchase. By purchasing, you confirm you understand and accept all legal responsibilities.
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By accessing or using the ModaVance website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our website.',
            },
            {
              title: '2. Age Requirement',
              body: 'You must be at least 18 years of age to purchase products from ModaVance. By placing an order, you certify that you are 18 years of age or older.',
            },
            {
              title: '3. Product Use',
              body: 'Products are sold for research and personal use only. ModaVance does not provide medical advice. Always consult a qualified healthcare professional before using any supplement or pharmaceutical product. Do not use our products if you are pregnant, nursing, or have any pre-existing medical conditions without consulting a doctor.',
            },
            {
              title: '4. Legal Compliance',
              body: 'It is your responsibility to ensure that ordering, possessing, and using our products is legal in your jurisdiction. ModaVance is not responsible for any legal consequences arising from your purchase or use of our products.',
            },
            {
              title: '5. Payment',
              body: 'Payment must be received before orders are shipped. We accept Bitcoin, Ethereum, Zelle, and cash by mail. Prices are in USD. We reserve the right to cancel any order at our discretion.',
            },
            {
              title: '6. Shipping & Delivery',
              body: 'Estimated delivery times are not guaranteed. ModaVance is not responsible for delays caused by postal services, customs, or events outside our control. We will reship orders seized by customs at no additional cost, once per order.',
            },
            {
              title: '7. Refunds',
              body: 'We offer refunds or reshipping for orders that are lost in transit, seized by customs, or arrive damaged. Refund requests must be submitted within 30 days of the estimated delivery date. We do not accept returns of opened pharmaceutical products.',
            },
            {
              title: '8. Limitation of Liability',
              body: 'ModaVance LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or website, to the maximum extent permitted by law.',
            },
            {
              title: '9. Contact',
              body: 'Questions about these terms? Contact legal@modavance.com.',
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

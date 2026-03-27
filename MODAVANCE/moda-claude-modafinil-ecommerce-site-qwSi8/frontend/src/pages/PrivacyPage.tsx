export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-400 mb-10">Last updated: January 1, 2025</p>

        <div className="prose prose-slate max-w-none space-y-8">
          {[
            {
              title: '1. Information We Collect',
              body: 'We collect information you provide when creating an account or placing an order: name, email address, shipping address, and phone number. We do not store payment information — all payment processing is handled externally (cryptocurrency wallets, Zelle).',
            },
            {
              title: '2. How We Use Your Information',
              body: 'We use your information solely to process orders, send shipping notifications, and respond to customer service inquiries. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
            },
            {
              title: '3. Data Storage',
              body: 'Your personal data is stored locally in your browser\'s IndexedDB. We do not maintain a central database of customer personal information. Order data is encrypted and stored securely.',
            },
            {
              title: '4. Cookies',
              body: 'We use only essential cookies required for site functionality (session management, cart persistence). We do not use tracking, analytics, or advertising cookies.',
            },
            {
              title: '5. Communications',
              body: 'By placing an order, you agree to receive transactional emails related to your order (confirmation, shipping updates). You may opt out of marketing emails at any time.',
            },
            {
              title: '6. Your Rights',
              body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@modavance.com to exercise these rights.',
            },
            {
              title: '7. Contact',
              body: 'Questions about this policy? Contact our privacy team at privacy@modavance.com.',
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

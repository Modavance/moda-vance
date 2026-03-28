import { db } from './database';
import type { Product, Review, BlogPost, Coupon, FAQItem, Setting } from '@/types';

const PRODUCTS: Product[] = [
  {
    id: 'modalert-200',
    name: 'Modalert 200mg',
    slug: 'modalert-200mg',
    brand: 'Sun Pharma',
    category: 'modafinil',
    strength: '200mg',
    pillsPerStrip: 10,
    shortDescription: 'The gold standard of modafinil. Manufactured by Sun Pharmaceuticals, the world\'s largest generic drug company.',
    description: `Modalert 200mg is the most trusted modafinil brand on the market, manufactured by Sun Pharmaceuticals — one of the world's top five generic pharmaceutical companies. Each tablet contains 200mg of pharmaceutical-grade modafinil, delivering reliable 12–15 hour wakefulness and enhanced cognitive performance.

**What to Expect**
Modalert provides clean, sustained wakefulness without the jitteriness or crash associated with traditional stimulants. Users report heightened focus, improved working memory, and elevated motivation — making it the preferred choice of Silicon Valley executives, Wall Street traders, medical professionals, and military personnel worldwide.

**How It Works**
Modafinil works primarily by inhibiting dopamine reuptake, increasing extracellular dopamine in the brain. Unlike amphetamines, it selectively targets wake-promoting regions without broadly stimulating the nervous system.

**Quality Assurance**
Every batch of Modalert is manufactured in Sun Pharma's FDA-inspected facilities in India, meeting the same rigorous standards as US-manufactured pharmaceuticals. We source directly from licensed distributors with certificates of authenticity available upon request.`,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=800&fit=crop&q=85',
    ],
    variants: [
      { id: 'modalert-10', quantity: 10, price: 19, originalPrice: 24, label: 'Sample Pack' },
      { id: 'modalert-30', quantity: 30, price: 49, originalPrice: 65 },
      { id: 'modalert-50', quantity: 50, price: 79, originalPrice: 99 },
      { id: 'modalert-100', quantity: 100, price: 139, originalPrice: 175, label: 'Best Value', savings: 36 },
      { id: 'modalert-200', quantity: 200, price: 249, originalPrice: 320, label: 'Bulk Deal', savings: 71 },
    ],
    effects: ['Wakefulness', 'Focus', 'Memory', 'Motivation', 'Productivity'],
    ingredients: 'Modafinil USP 200mg, Lactose Monohydrate, Microcrystalline Cellulose, Pregelatinized Starch, Croscarmellose Sodium, Povidone, Magnesium Stearate',
    manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
    rating: 4.8,
    reviewCount: 1247,
    badge: 'bestseller',
    inStock: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'modvigil-200',
    name: 'Modvigil 200mg',
    slug: 'modvigil-200mg',
    brand: 'HAB Pharma',
    category: 'modafinil',
    strength: '200mg',
    pillsPerStrip: 10,
    shortDescription: 'Premium modafinil by HAB Pharmaceuticals. Same active ingredient as Provigil at a fraction of the cost.',
    description: `Modvigil 200mg is manufactured by HAB Pharmaceuticals, a WHO-GMP certified Indian pharmaceutical company with over 30 years of experience. Each tablet contains 200mg of modafinil — chemically identical to the brand-name Provigil that costs $50 per pill in US pharmacies.

**The Smart Choice**
Modvigil offers the same cognitive benefits as Modalert at a lower price point, making it the preferred option for budget-conscious users who don't want to compromise on quality. Many users find Modvigil slightly "smoother" with a more gradual onset and offset.

**Cognitive Benefits**
Users consistently report 10–12 hours of focused wakefulness, significantly improved executive function, enhanced pattern recognition, and reduced decision fatigue. It's particularly popular among students, writers, and entrepreneurs.

**Manufacturing Standards**
HAB Pharmaceuticals operates ISO 9001:2015 certified facilities and exports to over 50 countries. Their manufacturing processes comply with WHO-GMP guidelines, ensuring consistent pharmaceutical quality.`,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=800&fit=crop&q=85',
    ],
    variants: [
      { id: 'modvigil-10', quantity: 10, price: 14, originalPrice: 18, label: 'Sample Pack' },
      { id: 'modvigil-30', quantity: 30, price: 39, originalPrice: 50 },
      { id: 'modvigil-50', quantity: 50, price: 59, originalPrice: 78 },
      { id: 'modvigil-100', quantity: 100, price: 99, originalPrice: 130, label: 'Best Value', savings: 31 },
      { id: 'modvigil-200', quantity: 200, price: 179, originalPrice: 240, label: 'Bulk Deal', savings: 61 },
    ],
    effects: ['Wakefulness', 'Focus', 'Clarity', 'Energy', 'Mood'],
    ingredients: 'Modafinil USP 200mg, Lactose Monohydrate, Microcrystalline Cellulose, Povidone K-30, Croscarmellose Sodium, Magnesium Stearate, Colloidal Silicon Dioxide',
    manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
    rating: 4.7,
    reviewCount: 893,
    badge: 'popular',
    inStock: true,
    featured: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'waklert-150',
    name: 'Waklert 150mg',
    slug: 'waklert-150mg',
    brand: 'Sun Pharma',
    category: 'armodafinil',
    strength: '150mg',
    pillsPerStrip: 10,
    shortDescription: 'The next evolution in cognitive enhancement. Armodafinil is more potent, longer-lasting, and smoother than standard modafinil.',
    description: `Waklert 150mg contains armodafinil — the purified R-enantiomer of modafinil — manufactured by Sun Pharmaceuticals. Armodafinil is considered the "upgrade" to modafinil: at just 150mg, it delivers stronger, longer-lasting effects with a cleaner cognitive profile.

**Why Armodafinil?**
Standard modafinil is a racemic mixture of two mirror-image molecules (R and S enantiomers). The R-enantiomer (armodafinil) is the active component responsible for wakefulness-promoting effects. By removing the less active S-enantiomer, armodafinil provides:
- Stronger effects at lower doses
- More consistent blood plasma levels throughout the day
- Cleaner, smoother cognitive experience
- Extended duration (up to 15 hours)

**The Executive Edge**
Waklert is the choice of high-performance individuals who demand peak cognitive output. The sustained, plateau-like plasma concentration means no mid-day dip — you get consistent cognitive enhancement from morning to evening.

**Clinical Background**
Armodafinil (brand name Nuvigil) was approved by the FDA in 2007 and is prescribed for narcolepsy, shift work sleep disorder, and obstructive sleep apnea. Sun Pharma's Waklert contains the identical active ingredient at a fraction of the prescription cost.`,
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=800&fit=crop&q=85',
    ],
    variants: [
      { id: 'waklert-10', quantity: 10, price: 24, originalPrice: 30, label: 'Sample Pack' },
      { id: 'waklert-30', quantity: 30, price: 59, originalPrice: 78 },
      { id: 'waklert-50', quantity: 50, price: 89, originalPrice: 119 },
      { id: 'waklert-100', quantity: 100, price: 159, originalPrice: 210, label: 'Best Value', savings: 51 },
      { id: 'waklert-200', quantity: 200, price: 289, originalPrice: 390, label: 'Bulk Deal', savings: 101 },
    ],
    effects: ['Wakefulness', 'Focus', 'Memory', 'Mood', 'Mental Stamina'],
    ingredients: 'Armodafinil USP 150mg, Lactose Monohydrate, Microcrystalline Cellulose, Pregelatinized Starch, Croscarmellose Sodium, Povidone, Magnesium Stearate',
    manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
    rating: 4.9,
    reviewCount: 756,
    badge: 'new',
    inStock: true,
    featured: true,
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'artvigil-150',
    name: 'Artvigil 150mg',
    slug: 'artvigil-150mg',
    brand: 'HAB Pharma',
    category: 'armodafinil',
    strength: '150mg',
    pillsPerStrip: 10,
    shortDescription: 'HAB Pharma\'s premium armodafinil. More affordable than Waklert with identical active ingredient and comparable effects.',
    description: `Artvigil 150mg is HAB Pharmaceuticals' premier armodafinil product. Containing the same active ingredient as Waklert and the brand-name Nuvigil, Artvigil delivers the full spectrum of armodafinil's cognitive benefits at the most competitive price point in the market.

**Consistent, Reliable Performance**
Artvigil has earned a devoted following for its reliability and consistency. Many users who have tried both Waklert and Artvigil report virtually identical effects, making Artvigil the natural choice for those who want armodafinil's superior profile without paying premium prices.

**Optimal for Beginners**
If you're new to armodafinil, Artvigil is an excellent starting point. Its slightly more gradual onset compared to Waklert makes it forgiving for those calibrating their optimal dose (typically 75–150mg).

**Long-Term Use Profile**
Unlike stimulants that cause receptor downregulation over time, armodafinil maintains its effectiveness with responsible use. Most users take it 3–4 days per week to preserve sensitivity and maintain sleep quality.`,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=85',
    ],
    variants: [
      { id: 'artvigil-10', quantity: 10, price: 19, originalPrice: 24, label: 'Sample Pack' },
      { id: 'artvigil-30', quantity: 30, price: 49, originalPrice: 65 },
      { id: 'artvigil-50', quantity: 50, price: 79, originalPrice: 102 },
      { id: 'artvigil-100', quantity: 100, price: 129, originalPrice: 175, label: 'Best Value', savings: 46 },
      { id: 'artvigil-200', quantity: 200, price: 239, originalPrice: 330, label: 'Bulk Deal', savings: 91 },
    ],
    effects: ['Wakefulness', 'Focus', 'Clarity', 'Productivity', 'Mood Lift'],
    ingredients: 'Armodafinil USP 150mg, Lactose Monohydrate, Microcrystalline Cellulose, Povidone K-30, Croscarmellose Sodium, Magnesium Stearate, Colloidal Silicon Dioxide',
    manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
    rating: 4.7,
    reviewCount: 542,
    badge: 'sale',
    inStock: true,
    featured: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'starter-pack',
    name: 'Nootropic Starter Pack',
    slug: 'nootropic-starter-pack',
    brand: 'Sun Pharma',
    category: 'modafinil',
    strength: 'Mixed',
    pillsPerStrip: 10,
    shortDescription: 'Try all 4 products. 10 pills of each — Modalert, Modvigil, Waklert, and Artvigil — to find your perfect match.',
    description: `Not sure which product is right for you? Our Nootropic Starter Pack includes 10 pills each of all four products — Modalert 200mg, Modvigil 200mg, Waklert 150mg, and Artvigil 150mg — allowing you to compare and find your perfect cognitive enhancer.

**What's Included**
- 10x Modalert 200mg (Sun Pharma modafinil)
- 10x Modvigil 200mg (HAB Pharma modafinil)
- 10x Waklert 150mg (Sun Pharma armodafinil)
- 10x Artvigil 150mg (HAB Pharma armodafinil)

**How to Compare**
We recommend a systematic approach: try each product on separate days (or weeks) and note how each affects your focus, mood, sleep schedule, and overall productivity. Keep a simple log to track your experience.

**The Result**
After trying all four, you'll have firsthand knowledge of which product and which dose works best for your unique neurochemistry and lifestyle — saving you money on larger orders.`,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=85',
    ],
    variants: [
      { id: 'starter-40', quantity: 40, price: 59, originalPrice: 76, label: '40 Pills (10 of each)' },
    ],
    effects: ['Wakefulness', 'Focus', 'Memory', 'Productivity', 'Clarity'],
    ingredients: 'See individual product descriptions',
    manufacturer: 'Sun Pharmaceuticals & HAB Pharmaceuticals',
    rating: 4.9,
    reviewCount: 324,
    badge: 'popular',
    inStock: true,
    featured: true,
    createdAt: new Date('2024-02-01'),
  },
];

const REVIEWS: Review[] = [
  { id: 'r1', productId: 'modalert-200', userId: 'u1', userName: 'James K.', rating: 5, title: 'Life-changing productivity tool', body: 'I\'ve been using Modalert for 8 months now, primarily for demanding work days. The focus is clean and sustained — no jitters, no crash. I get through my entire task list by 3pm. Shipping was fast and packaging was discreet.', verified: true, createdAt: new Date('2024-11-15') },
  { id: 'r2', productId: 'modalert-200', userId: 'u2', userName: 'Sarah M.', rating: 5, title: 'Med school lifesaver', body: 'Third year of med school would have been impossible without this. I studied 14 hours straight the day before shelf exams. Felt completely normal, just... focused. Passed with flying colors.', verified: true, createdAt: new Date('2024-10-22') },
  { id: 'r3', productId: 'waklert-150', userId: 'u3', userName: 'David L.', rating: 5, title: 'Superior to modafinil for me', body: 'Switched from Modalert to Waklert 3 months ago and haven\'t looked back. The effects feel cleaner and last longer without taking the same toll on sleep. 150mg is the sweet spot for me.', verified: true, createdAt: new Date('2024-12-01') },
  { id: 'r4', productId: 'modvigil-200', userId: 'u4', userName: 'Michael T.', rating: 4, title: 'Great value, solid effects', body: 'Tried Modvigil after Modalert became too expensive for daily use. The difference is minimal — maybe slightly less sharp but the savings make it easily worth it. I\'d order again.', verified: true, createdAt: new Date('2024-09-18') },
  { id: 'r5', productId: 'artvigil-150', userId: 'u5', userName: 'Emma R.', rating: 5, title: 'Best armodafinil for the price', body: 'Artvigil at this price is an absolute steal. I work as a software architect and need sustained focus for 8-10 hours. This delivers exactly that, every time. Service and packaging are excellent.', verified: true, createdAt: new Date('2024-11-08') },
  { id: 'r6', productId: 'starter-pack', userId: 'u6', userName: 'Chris B.', rating: 5, title: 'Perfect way to start', body: 'The starter pack is genius. I had no idea which product would work for me and trying all four was invaluable. Ended up preferring Waklert. Would absolutely recommend this for anyone new to nootropics.', verified: true, createdAt: new Date('2024-10-30') },
  { id: 'r7', productId: 'modalert-200', userId: 'u7', userName: 'Robert H.', rating: 5, title: '10 years as a programmer — this changed my career', body: 'I\'ve been coding for a decade. After starting with Modalert I shipped more features in one month than I had in the previous three. The sustained focus is unlike anything I\'ve experienced. Fast shipping, quality product.', verified: true, createdAt: new Date('2024-08-14') },
  { id: 'r8', productId: 'waklert-150', userId: 'u8', userName: 'Jennifer P.', rating: 5, title: 'Hedge fund analyst approved', body: 'Our team of analysts has been using nootropics for years. Waklert consistently outperforms everything else we\'ve tried. The plateau effect means you don\'t get that 2pm dip — crucial for trading hours.', verified: true, createdAt: new Date('2024-12-10') },
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    slug: 'modafinil-vs-armodafinil-complete-guide',
    title: 'Modafinil vs Armodafinil: The Complete 2025 Guide',
    excerpt: 'Understanding the pharmacological differences between modafinil and armodafinil — and which one is right for your goals.',
    body: 'Full article content...',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    author: 'Dr. Alexandra Chen, PharmD',
    category: 'Education',
    readTime: 8,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'b2',
    slug: 'optimal-modafinil-dosing-protocol',
    title: 'The Optimal Modafinil Dosing Protocol for Maximum Results',
    excerpt: 'How to use modafinil strategically to maximize cognitive benefits while minimizing tolerance and side effects.',
    body: 'Full article content...',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
    author: 'Marcus Webb, Biohacker',
    category: 'Guides',
    readTime: 6,
    createdAt: new Date('2025-02-03'),
  },
  {
    id: 'b3',
    slug: 'sun-pharma-vs-hab-pharma-comparison',
    title: 'Sun Pharma vs HAB Pharma: Which Manufacturer Is Better?',
    excerpt: 'A detailed comparison of the two leading generic pharmaceutical manufacturers producing modafinil and armodafinil.',
    body: 'See full article in BlogPostPage',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80',
    author: 'ModaVance Research Team',
    category: 'Product Reviews',
    readTime: 5,
    createdAt: new Date('2025-02-20'),
  },
  {
    id: 'b4',
    slug: 'productivity-stack-2025',
    title: 'The Ultimate Productivity Stack for 2025: Nootropics, Habits & Tools',
    excerpt: 'How top performers combine modafinil with sleep optimization, nutrition, and workflow systems for maximum output.',
    body: 'See full article in BlogPostPage',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    author: 'Tyler Nordmann',
    category: 'Lifestyle',
    readTime: 10,
    createdAt: new Date('2025-03-10'),
  },
];

const COUPONS: Coupon[] = [
  { code: 'WELCOME10', discount: 10, type: 'percent', minOrder: 0, expiresAt: new Date('2026-12-31') },
  { code: 'BULK20', discount: 20, type: 'percent', minOrder: 150, expiresAt: new Date('2026-12-31') },
  { code: 'SAVE30', discount: 30, type: 'fixed', minOrder: 100, expiresAt: new Date('2026-12-31') },
];

const FAQ_ITEMS: FAQItem[] = [
  // About Our Products
  { id: 'f1', section: 'About Our Products', order: 1, createdAt: new Date(),
    question: 'What is Modafinil and how does it work?',
    answer: 'Modafinil is a wakefulness-promoting agent originally developed to treat narcolepsy and other sleep disorders. It works by inhibiting dopamine reuptake, increasing extracellular dopamine in the brain\'s wakefulness centers. Unlike stimulants, it selectively activates arousal systems without broadly stimulating the nervous system — resulting in clean, focused wakefulness without jitteriness or crashes.' },
  { id: 'f2', section: 'About Our Products', order: 2, createdAt: new Date(),
    question: 'What is the difference between Modafinil and Armodafinil?',
    answer: 'Standard Modafinil (Modalert, Modvigil) is a racemic mixture of both R and S enantiomers. Armodafinil (Waklert, Artvigil) contains only the R-enantiomer — the more pharmacologically active form. Armodafinil is more potent and longer-lasting (15+ hours vs 12 hours), with a more consistent effect throughout the day.' },
  { id: 'f3', section: 'About Our Products', order: 3, createdAt: new Date(),
    question: 'What is the difference between Modalert and Modvigil?',
    answer: 'Both contain 200mg of Modafinil but are made by different manufacturers. Modalert is produced by Sun Pharmaceuticals, one of the world\'s largest generic drug companies. Modvigil is made by HAB Pharmaceuticals. Modalert is generally considered slightly stronger with a faster onset, while Modvigil is smoother and more budget-friendly.' },
  { id: 'f4', section: 'About Our Products', order: 4, createdAt: new Date(),
    question: 'Is Modafinil safe?',
    answer: 'Modafinil has over 30 years of clinical use and an excellent safety profile. The most common side effects are headache, nausea, and insomnia if taken too late — all dose-dependent and preventable. We recommend starting with 100mg (half a tablet) to assess your individual response. Always consult a healthcare professional if you have medical conditions.' },
  { id: 'f5', section: 'About Our Products', order: 5, createdAt: new Date(),
    question: 'Are your products genuine pharmaceutical grade?',
    answer: 'Yes, absolutely. We source exclusively from licensed distributors of Sun Pharmaceuticals and HAB Pharmaceuticals — the same manufacturers that supply hospitals and pharmacies worldwide. All facilities are WHO-GMP certified. Certificates of authenticity are available upon request.' },
  // Ordering & Payment
  { id: 'f6', section: 'Ordering & Payment', order: 1, createdAt: new Date(),
    question: 'What payment methods do you accept?',
    answer: 'We accept Bitcoin (BTC), Ethereum (ETH), PayPal, and Credit/Debit Card. Cryptocurrency payments receive an automatic 15% discount and provide the fastest order processing. PayPal and Card are available at standard pricing.' },
  { id: 'f7', section: 'Ordering & Payment', order: 2, createdAt: new Date(),
    question: 'Do I need a prescription?',
    answer: 'We sell our products for research and educational purposes. No prescription is required to place an order. We are not a licensed pharmacy and do not provide medical advice. We strongly recommend consulting a healthcare professional if you have any medical conditions or are taking other medications.' },
  { id: 'f8', section: 'Ordering & Payment', order: 3, createdAt: new Date(),
    question: 'Is my personal information secure?',
    answer: 'Absolutely. We use 256-bit SSL encryption for all transactions and store minimal personal data. We never sell customer data to third parties. For maximum privacy, we recommend paying with Bitcoin or Ethereum.' },
  { id: 'f9', section: 'Ordering & Payment', order: 4, createdAt: new Date(),
    question: 'Can I use a coupon code?',
    answer: 'Yes! Enter your coupon code at checkout. New customers can use WELCOME10 for 10% off their first order. Sign up for our newsletter to receive exclusive promo codes and offers.' },
  // Shipping & Delivery
  { id: 'f10', section: 'Shipping & Delivery', order: 1, createdAt: new Date(),
    question: 'How long does shipping take?',
    answer: 'Orders are processed within 24 hours of payment confirmation and shipped within 48 hours. Estimated delivery is 4–12 business days depending on your region and selected dispatch center. You will receive a shipping confirmation email with tracking as soon as your package is on its way.' },
  { id: 'f11', section: 'Shipping & Delivery', order: 2, createdAt: new Date(),
    question: 'Is packaging discreet?',
    answer: 'Yes, completely. All orders ship in plain, unmarked packaging with no reference to the product, our company name, or website on the outside. The return address uses a generic business name. Contents are packed to prevent any visible outline through the packaging.' },
  { id: 'f12', section: 'Shipping & Delivery', order: 3, createdAt: new Date(),
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship worldwide. Please be aware of your local regulations before ordering. In the event of a customs seizure, we will reship your order free of charge — no questions asked. We have successfully delivered to customers in over 50 countries.' },
  { id: 'f13', section: 'Shipping & Delivery', order: 4, createdAt: new Date(),
    question: 'What is your reshipment policy?',
    answer: 'If your package is seized by customs or lost in transit, contact our support team within 30 days of the estimated delivery date and we will reship at no cost. We stand fully behind our delivery guarantee.' },
  { id: 'f14', section: 'Shipping & Delivery', order: 5, createdAt: new Date(),
    question: 'How do I track my order?',
    answer: 'A tracking number will be emailed to you once your order ships. You can also track your order from your account page. If you don\'t receive tracking information within 72 hours of your shipping confirmation, please contact us at support@modavance.com.' },
  // Usage & Dosing
  { id: 'f15', section: 'Usage & Dosing', order: 1, createdAt: new Date(),
    question: 'What is the recommended dose?',
    answer: 'For Modafinil: 100–200mg taken in the morning. For Armodafinil: 75–150mg. Always start with the lower dose to assess your response. Taking more than recommended does not provide proportionally better effects and increases the risk of side effects.' },
  { id: 'f16', section: 'Usage & Dosing', order: 2, createdAt: new Date(),
    question: 'How often should I take Modafinil?',
    answer: 'We recommend using Modafinil no more than 3–4 days per week to maintain sensitivity and preserve your natural sleep patterns. Many users take it only on demanding days — important presentations, exam periods, or critical deadlines.' },
  { id: 'f17', section: 'Usage & Dosing', order: 3, createdAt: new Date(),
    question: 'What should I avoid while taking Modafinil?',
    answer: 'Avoid taking Modafinil after noon to prevent sleep disruption. Do not combine with alcohol as Modafinil can mask intoxication. Birth control pills may be less effective — use backup contraception. Stay well hydrated throughout the day.' },
  // Support
  { id: 'f18', section: 'Support', order: 1, createdAt: new Date(),
    question: 'How can I contact support?',
    answer: 'You can reach our support team by emailing support@modavance.com. We typically respond within 24 hours, 7 days a week. For order-related questions, please include your order number (e.g. MV-500) in your message.' },
  { id: 'f19', section: 'Support', order: 2, createdAt: new Date(),
    question: 'What is your refund policy?',
    answer: 'If you are not satisfied with your order, contact us within 14 days of delivery. We handle all cases individually and work to find the best solution — reshipment, store credit, or refund. Your satisfaction is our priority.' },
  { id: 'f20', section: 'Support', order: 3, createdAt: new Date(),
    question: "I haven't received my order confirmation email. What should I do?",
    answer: 'Check your spam/junk folder first. If it\'s not there, contact us at support@modavance.com with the email address you used at checkout and we\'ll resend your confirmation immediately.' },
];

const DEFAULT_SETTINGS: Setting[] = [
  { key: 'contact.email',          value: 'support@modavance.com' },
  { key: 'contact.response_time',  value: 'Within 2 hours, 7 days a week' },
  { key: 'contact.phone',          value: '' },
  { key: 'payment.bitcoin.wallet', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { key: 'payment.bitcoin.discount', value: '15' },
  { key: 'payment.ethereum.wallet', value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  { key: 'payment.ethereum.discount', value: '15' },
  { key: 'payment.zelle.recipient', value: 'payments@modavance.com' },
  { key: 'payment.zelle.discount', value: '10' },
  { key: 'payment.bill.address',   value: 'ModaVance LLC, P.O. Box 12345, New York, NY 10001' },
  { key: 'payment.bill.instructions', value: 'Send cash only (no checks or money orders) in a plain sealed envelope.' },
];

export async function seedDatabase() {
  const productCount = await db.products.count();

  if (productCount === 0) {
    await db.transaction('rw', [db.products, db.reviews, db.blogPosts, db.coupons], async () => {
      await db.products.bulkAdd(PRODUCTS);
      await db.reviews.bulkAdd(REVIEWS);
      await db.blogPosts.bulkAdd(BLOG_POSTS);
      await db.coupons.bulkAdd(COUPONS);
    });
  }

  // Seed FAQ items if not present
  // Always reseed FAQ (version 5 cleared old items)
  const faqCount = await db.faqItems.count();
  if (faqCount === 0) {
    await db.faqItems.bulkAdd(FAQ_ITEMS);
  }

  // Seed default settings if not present
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.bulkAdd(DEFAULT_SETTINGS);
  }
}

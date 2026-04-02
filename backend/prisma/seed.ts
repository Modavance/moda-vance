import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Admin ────────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@modavance.com';
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
    const adminHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({ data: { email: adminEmail, passwordHash: adminHash } });
    console.log('✓ Admin created');
  } else {
    console.log('✓ Admin already exists, skipping');
  }

  // ─── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Modalert 200mg',
      slug: 'modalert-200mg',
      brand: 'SUN_PHARMA' as const,
      category: 'MODAFINIL' as const,
      strength: '200mg',
      pillsPerStrip: 10,
      shortDescription: "The gold standard of modafinil. Manufactured by Sun Pharmaceuticals, the world's largest generic drug company.",
      description: `Modalert 200mg is the most trusted modafinil brand on the market, manufactured by Sun Pharmaceuticals — one of the world's top five generic pharmaceutical companies. Each tablet contains 200mg of pharmaceutical-grade modafinil, delivering reliable 12–15 hour wakefulness and enhanced cognitive performance.

**What to Expect**
Modalert provides clean, sustained wakefulness without the jitteriness or crash associated with traditional stimulants. Users report heightened focus, improved working memory, and elevated motivation — making it the preferred choice of Silicon Valley executives, Wall Street traders, medical professionals, and military personnel worldwide.

**How It Works**
Modafinil works primarily by inhibiting dopamine reuptake, increasing extracellular dopamine in the brain. Unlike amphetamines, it selectively targets wake-promoting regions without broadly stimulating the nervous system.

**Quality Assurance**
Every batch of Modalert is manufactured in Sun Pharma's FDA-inspected facilities in India, meeting the same rigorous standards as US-manufactured pharmaceuticals.`,
      image: 'https://i.imgur.com/9g5ftDZ.png',
      images: ['https://i.imgur.com/9g5ftDZ.png'],
      effects: ['Wakefulness', 'Focus', 'Memory', 'Motivation', 'Productivity'],
      ingredients: 'Modafinil USP 200mg, Lactose Monohydrate, Microcrystalline Cellulose, Pregelatinized Starch, Croscarmellose Sodium, Povidone, Magnesium Stearate',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
      rating: 4.8,
      reviewCount: 1247,
      badge: 'BESTSELLER' as const,
      inStock: true,
      featured: true,
      createdAt: new Date('2024-01-01'),
      variants: [
        { quantity: 30, price: 89, originalPrice: 100, sortOrder: 0 },
        { quantity: 50, price: 119, originalPrice: 159, sortOrder: 1 },
        { quantity: 100, price: 179, originalPrice: 239, sortOrder: 2 },
        { quantity: 200, price: 279, originalPrice: 349, label: 'Bulk Deal', savings: 71, sortOrder: 3 },
        { quantity: 300, price: 359, originalPrice: 409, label: 'Bulk Deal', savings: 71, sortOrder: 4 },
      ],
    },
    {
      name: 'Modvigil 200mg',
      slug: 'modvigil-200mg',
      brand: 'HAB_PHARMA' as const,
      category: 'MODAFINIL' as const,
      strength: '200mg',
      pillsPerStrip: 10,
      shortDescription: 'Premium modafinil by HAB Pharmaceuticals. Same active ingredient as Provigil at a fraction of the cost.',
      description: `Modvigil 200mg is manufactured by HAB Pharmaceuticals, a WHO-GMP certified Indian pharmaceutical company with over 30 years of experience. Each tablet contains 200mg of modafinil — chemically identical to the brand-name Provigil.

**The Smart Choice**
Modvigil offers the same cognitive benefits as Modalert at a lower price point, making it the preferred option for budget-conscious users who don't want to compromise on quality.

**Cognitive Benefits**
Users consistently report 10–12 hours of focused wakefulness, significantly improved executive function, enhanced pattern recognition, and reduced decision fatigue.

**Manufacturing Standards**
HAB Pharmaceuticals operates ISO 9001:2015 certified facilities and exports to over 50 countries.`,
      image: 'https://i.imgur.com/3LL6LVL.png',
      images: ['https://i.imgur.com/3LL6LVL.png'],
      effects: ['Wakefulness', 'Focus', 'Clarity', 'Energy', 'Mood'],
      ingredients: 'Modafinil USP 200mg, Lactose Monohydrate, Microcrystalline Cellulose, Povidone K-30, Croscarmellose Sodium, Magnesium Stearate, Colloidal Silicon Dioxide',
      manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
      rating: 4.7,
      reviewCount: 893,
      badge: 'POPULAR' as const,
      inStock: true,
      featured: true,
      createdAt: new Date('2024-01-01'),
      variants: [
        { quantity: 30, price: 79, originalPrice: 99, sortOrder: 0 },
        { quantity: 50, price: 99, originalPrice: 139, sortOrder: 1 },
        { quantity: 100, price: 159, originalPrice: 199, sortOrder: 2 },
        { quantity: 200, price: 259, originalPrice: 309, label: 'Bulk Deal', savings: 61, sortOrder: 3 },
        { quantity: 300, price: 359, originalPrice: 409, label: 'Bulk Deal', savings: 61, sortOrder: 4 },
      ],
    },
    {
      name: 'Waklert 150mg',
      slug: 'waklert-150mg',
      brand: 'SUN_PHARMA' as const,
      category: 'ARMODAFINIL' as const,
      strength: '150mg',
      pillsPerStrip: 10,
      shortDescription: 'The next evolution in cognitive enhancement. Armodafinil is more potent, longer-lasting, and smoother than standard modafinil.',
      description: `Waklert 150mg contains armodafinil — the purified R-enantiomer of modafinil — manufactured by Sun Pharmaceuticals. At just 150mg, it delivers stronger, longer-lasting effects with a cleaner cognitive profile.

**Why Armodafinil?**
Standard modafinil is a racemic mixture of both R and S enantiomers. The R-enantiomer (armodafinil) is the active component. By removing the less active S-enantiomer, armodafinil provides:
- Stronger effects at lower doses
- More consistent blood plasma levels throughout the day
- Cleaner, smoother cognitive experience
- Extended duration (up to 15 hours)

**Clinical Background**
Armodafinil (brand name Nuvigil) was approved by the FDA in 2007.`,
      image: 'https://i.imgur.com/OpITGJ8.png',
      images: ['https://i.imgur.com/OpITGJ8.png'],
      effects: ['Wakefulness', 'Focus', 'Memory', 'Mood', 'Mental Stamina'],
      ingredients: 'Armodafinil USP 150mg, Lactose Monohydrate, Microcrystalline Cellulose, Pregelatinized Starch, Croscarmellose Sodium, Povidone, Magnesium Stearate',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
      rating: 4.9,
      reviewCount: 756,
      badge: 'NEW' as const,
      inStock: true,
      featured: true,
      createdAt: new Date('2024-03-01'),
      variants: [
        { quantity: 30, price: 89, originalPrice: 100, sortOrder: 0 },
        { quantity: 50, price: 119, originalPrice: 159, sortOrder: 1 },
        { quantity: 100, price: 179, originalPrice: 239, sortOrder: 2 },
        { quantity: 200, price: 279, originalPrice: 349, label: 'Bulk Deal', savings: 71, sortOrder: 3 },
        { quantity: 300, price: 359, originalPrice: 409, label: 'Bulk Deal', savings: 71, sortOrder: 4 },
      ],
    },
    {
      name: 'Artvigil 150mg',
      slug: 'artvigil-150mg',
      brand: 'HAB_PHARMA' as const,
      category: 'ARMODAFINIL' as const,
      strength: '150mg',
      pillsPerStrip: 10,
      shortDescription: "HAB Pharma's premium armodafinil. More affordable than Waklert with identical active ingredient and comparable effects.",
      description: `Artvigil 150mg is HAB Pharmaceuticals' premier armodafinil product. Containing the same active ingredient as Waklert and the brand-name Nuvigil, Artvigil delivers the full spectrum of armodafinil's cognitive benefits at the most competitive price point.

**Consistent, Reliable Performance**
Artvigil has earned a devoted following for its reliability and consistency. Many users report virtually identical effects to Waklert, making it the natural choice for those who want armodafinil's superior profile without paying premium prices.

**Optimal for Beginners**
If you're new to armodafinil, Artvigil is an excellent starting point. Its slightly more gradual onset makes it forgiving for those calibrating their optimal dose (typically 75–150mg).`,
      image: 'https://i.imgur.com/gGB9wIC.png',
      images: ['https://i.imgur.com/gGB9wIC.png'],
      effects: ['Wakefulness', 'Focus', 'Clarity', 'Productivity', 'Mood Lift'],
      ingredients: 'Armodafinil USP 150mg, Lactose Monohydrate, Microcrystalline Cellulose, Povidone K-30, Croscarmellose Sodium, Magnesium Stearate, Colloidal Silicon Dioxide',
      manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
      rating: 4.7,
      reviewCount: 542,
      badge: 'SALE' as const,
      inStock: true,
      featured: false,
      createdAt: new Date('2024-01-01'),
      variants: [
        { quantity: 30, price: 79, originalPrice: 99, sortOrder: 0 },
        { quantity: 50, price: 99, originalPrice: 139, sortOrder: 1 },
        { quantity: 100, price: 159, originalPrice: 199, sortOrder: 2 },
        { quantity: 200, price: 259, originalPrice: 309, label: 'Bulk Deal', savings: 91, sortOrder: 3 },
        { quantity: 300, price: 359, originalPrice: 409, label: 'Bulk Deal', savings: 91, sortOrder: 4 },
      ],
    },
    {
      name: 'Nootropic Starter Pack',
      slug: 'nootropic-starter-pack',
      brand: 'SUN_PHARMA' as const,
      category: 'MIX' as const,
      strength: 'Mixed',
      pillsPerStrip: 10,
      shortDescription: 'Try all best seller products to find your perfect match.',
      description: `Not sure which product is right for you? Our Nootropic Starter Pack includes pills of all four products — Modalert 200mg, Modvigil 200mg, Waklert 150mg, and Artvigil 150mg — allowing you to compare and find your perfect cognitive enhancer.

**What's Included**
- Modalert 200mg (Sun Pharma modafinil)
- Modvigil 200mg (HAB Pharma modafinil)
- Waklert 150mg (Sun Pharma armodafinil)
- Artvigil 150mg (HAB Pharma armodafinil)

**How to Compare**
Try each product on separate days and note how each affects your focus, mood, and productivity. The result: firsthand knowledge of which product works best for your unique neurochemistry.`,
      image: 'https://i.imgur.com/bdrmUxR.png',
      images: ['https://i.imgur.com/bdrmUxR.png'],
      effects: ['Wakefulness', 'Focus', 'Memory', 'Productivity', 'Clarity'],
      ingredients: 'See individual product descriptions',
      manufacturer: 'Sun Pharmaceuticals & HAB Pharmaceuticals',
      rating: 4.9,
      reviewCount: 324,
      badge: 'POPULAR' as const,
      inStock: true,
      featured: true,
      createdAt: new Date('2024-02-01'),
      variants: [
        { quantity: 20, price: 59, originalPrice: 79, label: '20 Pills (5 of each)', sortOrder: 0 },
        { quantity: 40, price: 99, originalPrice: 149, label: '40 Pills (10 of each)', sortOrder: 1 },
      ],
    },
  ];

  const productMap: Record<string, string> = {};

  for (const { variants, images, effects, ...productData } of products) {
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    const product = existing
      ? await prisma.product.update({
          where: { slug: productData.slug },
          data: {
            ...productData,
            images: images as unknown as object[],
            effects: effects as unknown as string[],
          },
        })
      : await prisma.product.create({
          data: {
            ...productData,
            images: images as unknown as object[],
            effects: effects as unknown as string[],
            variants: { create: variants },
          },
        });
    productMap[productData.slug] = product.id;
  }
  console.log('✓ Products seeded');

  // ─── Reviews ─────────────────────────────────────────────────────────────
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    const reviews = [
      { slug: 'modalert-200mg', userName: 'James K.', rating: 5, title: 'Life-changing productivity tool', body: "I've been using Modalert for 8 months now. The focus is clean and sustained — no jitters, no crash. Fast shipping and discreet packaging.", verified: true },
      { slug: 'modalert-200mg', userName: 'Sarah M.', rating: 5, title: 'Med school lifesaver', body: 'Third year of med school would have been impossible without this. Studied 14 hours straight before shelf exams. Passed with flying colors.', verified: true },
      { slug: 'waklert-150mg', userName: 'David L.', rating: 5, title: 'Superior to modafinil for me', body: "Switched from Modalert to Waklert 3 months ago and haven't looked back. Effects feel cleaner and last longer.", verified: true },
      { slug: 'modvigil-200mg', userName: 'Michael T.', rating: 4, title: 'Great value, solid effects', body: 'Tried Modvigil after Modalert became too expensive. The difference is minimal — savings make it easily worth it.', verified: true },
      { slug: 'artvigil-150mg', userName: 'Emma R.', rating: 5, title: 'Best armodafinil for the price', body: 'Artvigil at this price is an absolute steal. I work as a software architect and need sustained focus for 8–10 hours. Delivers every time.', verified: true },
      { slug: 'nootropic-starter-pack', userName: 'Chris B.', rating: 5, title: 'Perfect way to start', body: "The starter pack is genius. I had no idea which product would work for me. Ended up preferring Waklert. Would absolutely recommend.", verified: true },
      { slug: 'modalert-200mg', userName: 'Robert H.', rating: 5, title: '10 years as a programmer — this changed my career', body: "Shipped more features in one month than the previous three. The sustained focus is unlike anything I've experienced.", verified: true },
      { slug: 'waklert-150mg', userName: 'Jennifer P.', rating: 5, title: 'Hedge fund analyst approved', body: "The plateau effect means you don't get that 2pm dip — crucial for trading hours. Consistently outperforms everything else.", verified: true },
    ];

    for (const review of reviews) {
      const { slug, ...reviewData } = review;
      const productId = productMap[slug];
      if (productId) {
        await prisma.review.create({ data: { productId, userId: null, ...reviewData } });
      }
    }
    console.log('✓ Reviews seeded');
  }

  // ─── Blog Posts ──────────────────────────────────────────────────────────
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.createMany({
      data: [
        { slug: 'modafinil-vs-armodafinil-complete-guide', title: 'Modafinil vs Armodafinil: The Complete 2025 Guide', excerpt: 'Understanding the pharmacological differences between modafinil and armodafinil — and which one is right for your goals.', body: 'Full article content...', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', author: 'Dr. Alexandra Chen, PharmD', category: 'Education', readTime: 8, createdAt: new Date('2025-01-15') },
        { slug: 'optimal-modafinil-dosing-protocol', title: 'The Optimal Modafinil Dosing Protocol for Maximum Results', excerpt: 'How to use modafinil strategically to maximize cognitive benefits while minimizing tolerance and side effects.', body: 'Full article content...', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80', author: 'Marcus Webb, Biohacker', category: 'Guides', readTime: 6, createdAt: new Date('2025-02-03') },
        { slug: 'sun-pharma-vs-hab-pharma-comparison', title: 'Sun Pharma vs HAB Pharma: Which Manufacturer Is Better?', excerpt: 'A detailed comparison of the two leading generic pharmaceutical manufacturers producing modafinil and armodafinil.', body: 'Full article content...', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80', author: 'ModaVance Research Team', category: 'Product Reviews', readTime: 5, createdAt: new Date('2025-02-20') },
        { slug: 'productivity-stack-2025', title: 'The Ultimate Productivity Stack for 2025: Nootropics, Habits & Tools', excerpt: 'How top performers combine modafinil with sleep optimization, nutrition, and workflow systems for maximum output.', body: 'Full article content...', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', author: 'Tyler Nordmann', category: 'Lifestyle', readTime: 10, createdAt: new Date('2025-03-10') },
      ],
    });
    console.log('✓ Blog posts seeded');
  }

  // ─── Coupons ─────────────────────────────────────────────────────────────
  const couponCount = await prisma.coupon.count();
  if (couponCount === 0) {
    await prisma.coupon.createMany({
      data: [
        { code: 'WELCOME10', discount: 10, type: 'PERCENT', minOrder: 0, expiresAt: new Date('2026-12-31') },
        { code: 'BULK20', discount: 20, type: 'PERCENT', minOrder: 150, expiresAt: new Date('2026-12-31') },
        { code: 'SAVE30', discount: 30, type: 'FIXED', minOrder: 100, expiresAt: new Date('2026-12-31') },
      ],
    });
    console.log('✓ Coupons seeded');
  }

  // ─── FAQ ─────────────────────────────────────────────────────────────────
  await prisma.faqItem.deleteMany();
  await prisma.faqItem.createMany({
    data: [
      // About Our Products
      { section: 'About Our Products', order: 1, question: 'What is Modafinil and how does it work?', answer: "Modafinil is a wakefulness-promoting agent originally developed to treat narcolepsy. It works by inhibiting dopamine reuptake, increasing extracellular dopamine in the brain's wakefulness centers. Unlike stimulants, it selectively activates arousal systems without broadly stimulating the nervous system." },
      { section: 'About Our Products', order: 2, question: 'What is the difference between Modafinil and Armodafinil?', answer: 'Standard Modafinil (Modalert, Modvigil) is a racemic mixture of both R and S enantiomers. Armodafinil (Waklert, Artvigil) contains only the R-enantiomer — the more pharmacologically active form. Armodafinil is more potent and longer-lasting (15+ hours vs 12 hours).' },
      { section: 'About Our Products', order: 3, question: 'What is the difference between Modalert and Modvigil?', answer: "Both contain 200mg of Modafinil but are made by different manufacturers. Modalert is produced by Sun Pharmaceuticals. Modvigil is made by HAB Pharmaceuticals. Modalert is generally considered slightly stronger with a faster onset, while Modvigil is smoother and more budget-friendly." },
      { section: 'About Our Products', order: 4, question: 'Is Modafinil safe?', answer: 'Modafinil has over 30 years of clinical use and an excellent safety profile. The most common side effects are headache, nausea, and insomnia if taken too late. We recommend starting with 100mg to assess your individual response. Always consult a healthcare professional if you have medical conditions.' },
      { section: 'About Our Products', order: 5, question: 'Are your products genuine pharmaceutical grade?', answer: 'Yes, absolutely. We source exclusively from licensed distributors of Sun Pharmaceuticals and HAB Pharmaceuticals — WHO-GMP certified manufacturers. Certificates of authenticity are available upon request.' },
      // Ordering & Payment
      { section: 'Ordering & Payment', order: 1, question: 'What payment methods do you accept?', answer: 'We accept Bitcoin (BTC), Ethereum (ETH), Card Payment, and PayPal. Cryptocurrency payments receive an automatic 15% discount and provide the fastest order processing. Card payments receive a 10% discount.' },
      { section: 'Ordering & Payment', order: 2, question: 'Do I need a prescription?', answer: 'We sell our products for research and educational purposes. No prescription is required to place an order. We are not a licensed pharmacy and do not provide medical advice. Consult a healthcare professional if you have medical conditions.' },
      { section: 'Ordering & Payment', order: 3, question: 'Is my personal information secure?', answer: 'Absolutely. We use 256-bit SSL encryption for all transactions and store minimal personal data. We never sell customer data to third parties. For maximum privacy, we recommend paying with Bitcoin or Ethereum.' },
      { section: 'Ordering & Payment', order: 4, question: 'Can I use a coupon code?', answer: 'Yes! Enter your coupon code at checkout. New customers can use WELCOME10 for 10% off their first order. Sign up for our newsletter to receive exclusive promo codes.' },
      // Shipping & Delivery
      { section: 'Shipping & Delivery', order: 1, question: 'How long does shipping take?', answer: 'Orders are processed within 24 hours of payment confirmation. Estimated delivery is 4–12 business days depending on your region. You will receive a tracking number once your package ships.' },
      { section: 'Shipping & Delivery', order: 2, question: 'Is packaging discreet?', answer: 'Yes, completely. All orders ship in plain, unmarked packaging with no reference to the product or our company on the outside. The return address uses a generic business name.' },
      { section: 'Shipping & Delivery', order: 3, question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide. In the event of a customs seizure, we will reship your order free of charge — no questions asked. We have successfully delivered to customers in over 50 countries.' },
      { section: 'Shipping & Delivery', order: 4, question: 'What is your reshipment policy?', answer: 'If your package is seized by customs or lost in transit, contact our support team within 30 days of the estimated delivery date and we will reship at no cost.' },
      { section: 'Shipping & Delivery', order: 5, question: 'How do I track my order?', answer: "A tracking number will be emailed to you once your order ships. You can also track from your account page. If you don't receive tracking within 72 hours, contact us at support@modavance.com." },
      // Usage & Dosing
      { section: 'Usage & Dosing', order: 1, question: 'What is the recommended dose?', answer: 'For Modafinil: 100–200mg taken in the morning. For Armodafinil: 75–150mg. Always start with the lower dose to assess your response. Taking more than recommended does not provide proportionally better effects.' },
      { section: 'Usage & Dosing', order: 2, question: 'How often should I take Modafinil?', answer: 'We recommend using Modafinil no more than 3–4 days per week to maintain sensitivity and preserve your natural sleep patterns. Many users take it only on demanding days — important presentations, exam periods, or critical deadlines.' },
      { section: 'Usage & Dosing', order: 3, question: 'What should I avoid while taking Modafinil?', answer: 'Avoid taking Modafinil after noon to prevent sleep disruption. Do not combine with alcohol. Birth control pills may be less effective — use backup contraception. Stay well hydrated throughout the day.' },
      // Support
      { section: 'Support', order: 1, question: 'How can I contact support?', answer: 'You can reach our support team by emailing support@modavance.com. We typically respond within 24 hours, 7 days a week. For order-related questions, please include your order number in your message.' },
      { section: 'Support', order: 2, question: 'What is your refund policy?', answer: 'If you are not satisfied with your order, contact us within 14 days of delivery. We handle all cases individually and work to find the best solution — reshipment, store credit, or refund.' },
      { section: 'Support', order: 3, question: "I haven't received my order confirmation email. What should I do?", answer: "Check your spam/junk folder first. If it's not there, contact us at support@modavance.com with the email address you used at checkout." },
    ],
  });
  console.log('✓ FAQ seeded');

  // ─── Settings ────────────────────────────────────────────────────────────
  const settingsCount = await prisma.setting.count();
  if (settingsCount === 0) {
    await prisma.setting.createMany({
      data: [
        { key: 'contact.email', value: 'support@modavance.com' },
        { key: 'contact.response_time', value: 'Within 24 hours, 7 days a week' },
        { key: 'contact.phone', value: '' },
        { key: 'payment.bitcoin.wallet', value: '' },
        { key: 'payment.bitcoin.discount', value: '15' },
        { key: 'payment.ethereum.wallet', value: '' },
        { key: 'payment.ethereum.discount', value: '15' },
        { key: 'payment.zelle.recipient', value: '' },
        { key: 'payment.zelle.discount', value: '10' },
        { key: 'payment.bill.address', value: '' },
        { key: 'payment.bill.instructions', value: 'Send a physical bill to the provided address. Order processing begins upon receipt.' },
      ],
    });
    console.log('✓ Settings seeded');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

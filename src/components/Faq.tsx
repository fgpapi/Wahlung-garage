import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { FAQ_ITEMS } from '../data/faq';
import { FAQ_ASIDE, HERO, SECTIONS } from '../data/copy';

/**
 * The one accordion on the page. Collapsing is genuinely useful here — six long
 * answers would otherwise bury the contact section — which is exactly why the
 * services are not built this way.
 */
export function Faq() {
  const meta = SECTIONS.faq;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section aria-labelledby="faq-title" className="bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="faq-title"
        />

        <div className="mt-12 grid gap-12 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ul className="border-t border-line">
              {FAQ_ITEMS.map((item) => {
                const open = openId === item.id;
                const buttonId = `faq-button-${item.id}`;
                const panelId = `faq-panel-${item.id}`;

                return (
                  <li key={item.id} className="border-b border-line">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenId(open ? null : item.id)}
                        className="group/faq flex w-full cursor-pointer items-center justify-between gap-5 py-5 text-left"
                      >
                        <span className="type-heading text-base text-ink transition-colors group-hover/faq:text-brand-primary-ink sm:text-lg">
                          {item.question}
                        </span>
                        <span
                          aria-hidden
                          className="inline-flex size-9 shrink-0 items-center justify-center border border-line-strong text-ink transition-colors group-hover/faq:border-ink"
                        >
                          {open ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                    </h3>

                    {/* Animated with grid-template-rows so the panel can slide,
                        and made inert when closed so it leaves the tab order and
                        the accessibility tree. */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      inert={!open}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[68ch] pb-6 leading-relaxed text-ink-muted">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-line bg-surface-alt p-7">
              <p className="type-heading text-lg text-ink">{FAQ_ASIDE.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{FAQ_ASIDE.body}</p>
              <WhatsAppCta size="md" className="mt-6 w-full">
                {HERO.primaryCta}
              </WhatsAppCta>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

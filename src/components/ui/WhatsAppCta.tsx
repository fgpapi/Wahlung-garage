import { MessageCircle } from 'lucide-react';
import { Button, type ButtonProps } from './Button';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

type WhatsAppCtaProps = Omit<
  Extract<ButtonProps, { href: string }>,
  'href' | 'icon' | 'target' | 'children'
> & {
  /** Appended to the pre-filled message, e.g. "Polarizado". Omit for the generic ask. */
  service?: string;
  /** Which line to open. Defaults to the primary number. */
  phone?: string;
  children: React.ReactNode;
};

/**
 * A CTA that opens WhatsApp with the message already written. Every such button
 * on the page goes through here, so the number and the wording stay in one place.
 *
 * The icon is lucide's MessageCircle rather than a WhatsApp brand glyph: the brief
 * mandates lucide for every icon, and lucide dropped brand marks.
 */
export function WhatsAppCta({ service, phone, children, ...rest }: WhatsAppCtaProps) {
  return (
    <Button
      href={buildWhatsAppUrl(service, phone)}
      target="_blank"
      icon={MessageCircle}
      {...rest}
    >
      {children}
    </Button>
  );
}

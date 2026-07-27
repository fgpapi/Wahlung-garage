import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'outline-invert' | 'solid-dark';
type Size = 'md' | 'lg';

/**
 * Square corners and flat fills throughout — no radius, no gradient, no glow.
 *
 * `primary` carries INK text on the orange fill rather than white: white on
 * #FF6600 is 2.94:1 and fails AA, while ink is 6.67:1. That constraint is the
 * reason the buttons read like shop safety markings, which suits the brief.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-primary text-ink hover:bg-brand-primary-hover active:bg-brand-primary-hover',
  outline:
    'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ink-invert',
  'outline-invert':
    'border border-ink-invert/35 text-ink-invert hover:border-ink-invert hover:bg-ink-invert hover:text-ink',
  'solid-dark': 'bg-ink text-ink-invert hover:bg-brand-navy',
};

const SIZES: Record<Size, string> = {
  // 44px minimum height on every target, per the touch requirement.
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-13 px-7 py-3.5 text-base',
};

const BASE =
  'group/btn inline-flex items-center justify-center gap-2.5 font-sans font-semibold ' +
  'tracking-tight no-underline transition-colors duration-200 ' +
  'motion-safe:transition-[background-color,border-color,color] cursor-pointer';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  /** Renders the icon after the label instead of before. */
  iconTrailing?: boolean;
  children: ReactNode;
  className?: string;
}

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconTrailing = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const iconSize = size === 'lg' ? 20 : 18;

  const content = (
    <>
      {Icon && !iconTrailing && <Icon size={iconSize} aria-hidden strokeWidth={2} />}
      <span>{children}</span>
      {Icon && iconTrailing && (
        <Icon
          size={iconSize}
          aria-hidden
          strokeWidth={2}
          className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    const { href, target, rel, ...anchorRest } = rest as AnchorProps;
    return (
      <a
        href={href}
        target={target}
        // Any link opening a new tab gets noopener, including the WhatsApp CTAs.
        rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
        className={classes}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as NativeButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

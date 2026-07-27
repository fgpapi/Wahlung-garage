/**
 * Every WhatsApp call-to-action on the page is built here. Phone numbers and the
 * message template live in this file and nowhere else, so changing the shop's
 * number is a one-line edit.
 */

/** Primary line. Receives all quote requests unless a CTA says otherwise. */
export const WHATSAPP_PRIMARY = '50488250870';

/** Secondary line, used as the fallback contact. */
export const WHATSAPP_SECONDARY = '50433669984';

const MESSAGE_BASE = 'Hola, quiero cotizar un servicio';

/**
 * Builds a wa.me link with the message pre-filled.
 *
 * @param service Service name to append, e.g. "Enderezado y Pintura". Omit for
 *   the generic request used by the header and floating buttons.
 * @param phone   Which line to open. Defaults to {@link WHATSAPP_PRIMARY}.
 *
 * @example
 * buildWhatsAppUrl('Polarizado')
 * // https://wa.me/50488250870?text=Hola%2C%20quiero%20cotizar%20un%20servicio%20de%20Polarizado
 */
export function buildWhatsAppUrl(service?: string, phone: string = WHATSAPP_PRIMARY): string {
  const trimmed = service?.trim();
  const message = trimmed ? `${MESSAGE_BASE} de ${trimmed}` : MESSAGE_BASE;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Formats a raw number for display: 50488250870 -> +504 8825-0870 */
export function formatPhone(raw: string): string {
  const local = raw.replace(/^504/, '');
  return `+504 ${local.slice(0, 4)}-${local.slice(4)}`;
}

/** Formats a raw number as a tel: href. */
export function telHref(raw: string): string {
  return `tel:+${raw}`;
}

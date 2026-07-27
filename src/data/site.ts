/**
 * Business facts: address, hours, phones, navigation. Edit here and the header,
 * footer, contact section and JSON-LD all follow.
 */
import { WHATSAPP_PRIMARY, WHATSAPP_SECONDARY } from '../lib/whatsapp';

export const SITE = {
  name: 'Wahlung Garage',
  tagline: 'Mecánica & Pintura',
  /** Update once the domain is live; used for canonical, Open Graph and JSON-LD. */
  url: 'https://wahlung-garage.vercel.app',
  city: 'Tegucigalpa',
  country: 'Honduras',
} as const;

export const ADDRESS = {
  street: 'Aldea Germania, calle principal',
  reference: 'Atrás de Economuebles',
  city: 'Tegucigalpa',
  region: 'Francisco Morazán',
  country: 'Honduras',
  countryCode: 'HN',
  /** Full single-line form, for JSON-LD and the map link. */
  full: 'Aldea Germania, calle principal, atrás de Economuebles, Tegucigalpa, Honduras',
} as const;

export const HOURS = {
  label: 'Lunes a domingo',
  range: '8:00 AM – 6:00 PM',
  /** Schema.org openingHours: every day, 08:00 to 18:00. */
  opens: '08:00',
  closes: '18:00',
  days: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
} as const;

export interface PhoneEntry {
  raw: string;
  label: string;
  role: string;
}

export const PHONES: readonly PhoneEntry[] = [
  { raw: WHATSAPP_PRIMARY, label: '+504 8825-0870', role: 'Principal · WhatsApp' },
  { raw: WHATSAPP_SECONDARY, label: '+504 3366-9984', role: 'Alterno' },
] as const;

export interface NavLink {
  label: string;
  href: string;
}

/** The four services, in menu order. `href` doubles as the section anchor. */
export const SERVICE_NAV: readonly NavLink[] = [
  { label: 'Enderezado y Pintura', href: '#enderezado-y-pintura' },
  { label: 'Mecánica General', href: '#mecanica-general' },
  { label: 'Polarizado', href: '#polarizado' },
  { label: 'Tapicería', href: '#tapiceria' },
] as const;

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/** Corporate accounts shown in the trust bar. */
export const CORPORATE_CLIENTS = [
  { name: 'Hertz', note: 'Flota de alquiler' },
  { name: 'Blintec', note: 'Flota corporativa' },
  { name: 'Aseguradoras', note: 'Siniestros y peritajes' },
] as const;

/**
 * Google Maps embed for the shop, loaded only after the user activates the
 * facade. Replace the query with the exact pin once the shop claims its
 * Business Profile.
 */
export const MAP_QUERY = encodeURIComponent(ADDRESS.full);
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
export const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

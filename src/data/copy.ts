/**
 * All display copy that is not already tied to a data record. Spanish (Honduras),
 * "usted" throughout. Edit here — no strings are hard-coded in the components.
 */

export const HERO = {
  eyebrow: 'Taller certificado · Tegucigalpa',
  headline: 'Su carro sale como salió de fábrica',
  support:
    'Enderezado, pintura, mecánica, polarizado y tapicería en Aldea Germania. Le cotizamos por WhatsApp el mismo día y cada trabajo sale con garantía por escrito.',
  primaryCta: 'Cotiza ya por WhatsApp',
  secondaryCta: 'Ver servicios',
  /** Alt text for the still shown in place of the video under reduced motion. */
  posterAlt:
    'Técnico de Wahlung Garage aplicando pintura a un vehículo dentro de la cabina cerrada',
} as const;

export const TRUST_BAR = {
  label: 'Empresas que confían en nosotros',
} as const;

/** Section headers: eyebrow, title and lede for each block down the page. */
export const SECTIONS = {
  servicios: {
    eyebrow: 'Servicios',
    title: 'Cuatro trabajos, hechos completos',
    lede: 'No subcontratamos. El enderezado, la pintura, la mecánica, el polarizado y la tapicería se hacen aquí mismo, con el mismo responsable de principio a fin.',
  },
  beneficios: {
    eyebrow: 'Por qué aquí',
    title: 'Lo que le garantizamos',
    lede: 'Cuatro compromisos concretos, no promesas generales.',
  },
  proceso: {
    eyebrow: 'Proceso',
    title: 'De la foto a la entrega',
    lede: 'Cuatro pasos. Usted sabe en qué va su vehículo en cada uno.',
  },
  galeria: {
    eyebrow: 'Galería',
    title: 'Trabajos del taller',
    lede: 'Filtre por tipo de trabajo. Toque cualquier imagen para verla completa.',
  },
  comparador: {
    eyebrow: 'Antes y después',
    title: 'Arrastre y compare',
    lede: 'La misma puerta, el mismo ángulo y la misma luz. Mueva el control para ver el trabajo completo.',
    instructions:
      'Arrastre el control, o use las flechas del teclado para moverlo.',
    beforeLabel: 'Antes',
    afterLabel: 'Después',
    /** Accessible name for the slider handle. */
    sliderLabel: 'Comparador de antes y después',
  },
  nosotros: {
    eyebrow: 'Nosotros',
    title: 'Un taller, no una agencia',
    lede: 'Wahlung Garage trabaja en Aldea Germania, sobre la calle principal, atrás de Economuebles.',
    body: [
      'Somos un taller de enderezado, pintura y mecánica en Tegucigalpa. Atendemos particulares, casos de seguro y flotas corporativas como Hertz y Blintec, que nos exigen tiempos y estándares fijos. Ese mismo estándar es el que aplicamos a cualquier carro que entra.',
      'Trabajamos con orden: revisión antes de cotizar, presupuesto por escrito antes de empezar y garantía impresa al entregar. Si algo no se puede hacer bien, se lo decimos en lugar de improvisar.',
    ],
    stats: [
      { value: 'Lun–Dom', label: 'Abierto los siete días' },
      { value: '6 meses', label: 'Garantía en pintura' },
      { value: '2', label: 'Flotas corporativas atendidas' },
    ],
  },
  testimonios: {
    eyebrow: 'Clientes',
    title: 'Lo que dicen',
    lede: 'Comentarios de clientes del taller.',
  },
  faq: {
    eyebrow: 'Preguntas',
    title: 'Lo que más nos preguntan',
    lede: 'Si su duda no está aquí, escríbanos por WhatsApp y se la respondemos.',
  },
  contacto: {
    eyebrow: 'Contacto',
    title: 'Dónde estamos',
    lede: 'Sobre la calle principal de Aldea Germania, atrás de Economuebles. Abierto todos los días.',
  },
} as const;

export const SERVICE_SECTION = {
  includes: 'Qué incluye',
  ctaPrefix: 'Cotizar',
  /** Rendered before the service name on the anchor link in the overview card. */
  detailLink: 'Ver detalle',
} as const;

export const FAQ_ASIDE = {
  title: '¿Tiene otra pregunta?',
  body: 'Escríbanos por WhatsApp con las fotos del vehículo y le respondemos el mismo día.',
} as const;

export const GALLERY = {
  filterLabel: 'Filtrar trabajos por tipo',
  /** Prefixed to each tile's alt text for the "open in lightbox" button. */
  enlargePrefix: 'Ampliar',
  empty: 'Todavía no hay trabajos publicados en esta categoría.',
  lightbox: {
    label: 'Visor de imágenes',
    close: 'Cerrar el visor',
    previous: 'Imagen anterior',
    next: 'Imagen siguiente',
    counter: (current: number, total: number) => `${current} de ${total}`,
  },
} as const;

export const CONTACT = {
  addressLabel: 'Dirección',
  hoursLabel: 'Horario',
  phonesLabel: 'Teléfonos',
  mapCta: 'Cómo llegar',
  mapFacadeTitle: 'Ver el taller en el mapa',
  mapFacadeBody: 'El mapa se carga solo cuando usted lo pide, para no gastarle datos.',
  mapFacadeCta: 'Cargar el mapa',
  mapIframeTitle: 'Mapa de la ubicación de Wahlung Garage',
  mapOpenExternal: 'Abrir en Google Maps',
} as const;

export const FLOATING_CTA = {
  label: 'Cotizar por WhatsApp',
} as const;

export const FOOTER = {
  description:
    'Taller de enderezado, pintura, mecánica, polarizado y tapicería en Tegucigalpa. Trabajo con garantía por escrito.',
  servicesTitle: 'Servicios',
  contactTitle: 'Contacto',
  followTitle: 'Síganos',
  /** TODO: replace with the shop's real profile URLs. */
  social: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
  rights: 'Todos los derechos reservados.',
} as const;

export const A11Y = {
  skipToContent: 'Saltar al contenido',
  homeLink: 'Wahlung Garage — ir al inicio',
  /** Read before each process step title, so the sequence is clear out of context. */
  stepPrefix: 'Paso',
  openMenu: 'Abrir el menú',
  closeMenu: 'Cerrar el menú',
  mainNav: 'Navegación principal',
  mobileNav: 'Menú',
  servicesSubmenu: 'Ver los servicios',
  /** Announced when the header CTA is read out of context. */
  whatsappCta: 'Cotizar por WhatsApp, abre WhatsApp en una ventana nueva',
} as const;

export const META = {
  title: 'Wahlung Garage | Enderezado, Pintura y Mecánica en Tegucigalpa',
  description:
    'Taller de enderezado y pintura, mecánica general, polarizado y tapicería en Aldea Germania, Tegucigalpa. Igualación de color por código de fábrica, garantía por escrito y presupuesto gratis por WhatsApp.',
} as const;

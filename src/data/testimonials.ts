export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  vehicle: string;
  service: string;
}

/**
 * TODO: replace with real testimonials.
 * These are placeholders written to be plausible and modest. Do not publish them
 * as real customer quotes — collect actual ones (a WhatsApp screenshot with the
 * customer's permission is enough) and swap them in here.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'testimonio-1',
    quote:
      'Le pegaron por atrás y me lo dejaron sin que se note dónde fue el golpe. El color del bumper quedó igual al resto del carro.',
    name: 'Marlon Discua',
    vehicle: 'Toyota Corolla 2018',
    service: 'Enderezado y pintura',
  },
  {
    id: 'testimonio-2',
    quote:
      'Me mostraron en el escáner qué tenía la camioneta antes de cobrarme nada. No me inventaron trabajos que no necesitaba.',
    name: 'Jessica Zelaya',
    vehicle: 'Nissan Frontier 2020',
    service: 'Mecánica general',
  },
  {
    id: 'testimonio-3',
    quote:
      'Fui solo por el polarizado y terminé dejándoles también la tapicería. Cumplieron con la fecha que me dieron.',
    name: 'Óscar Banegas',
    vehicle: 'Honda CR-V 2016',
    service: 'Polarizado y tapicería',
  },
] as const;

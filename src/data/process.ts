export interface ProcessStep {
  /** Displayed as the step numeral. This is a real sequence, so numbering is earned. */
  number: string;
  title: string;
  body: string;
}

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Cotiza por WhatsApp',
    body: 'Mándenos fotos del daño y el año y modelo del vehículo. Le damos un rango de precio el mismo día, sin que tenga que mover el carro.',
  },
  {
    number: '02',
    title: 'Diagnóstico y presupuesto',
    body: 'Traiga el vehículo al taller. Lo revisamos a fondo y le entregamos el presupuesto detallado por escrito, con la fecha de entrega estimada. La revisión no tiene costo.',
  },
  {
    number: '03',
    title: 'Reparación',
    body: 'Cuando usted autoriza, entramos a trabajar. Le avisamos por WhatsApp cada vez que el vehículo cambia de etapa, para que sepa en qué va sin tener que llamar.',
  },
  {
    number: '04',
    title: 'Entrega con garantía',
    body: 'Le entregamos el vehículo lavado, con su factura y la garantía del trabajo por escrito. Revisamos juntos el resultado antes de que se lo lleve.',
  },
] as const;

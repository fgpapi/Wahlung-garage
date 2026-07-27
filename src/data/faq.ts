export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'garantia',
    question: '¿Cuánto tiempo de garantía dan?',
    answer:
      'La pintura y el enderezado llevan seis meses de garantía por escrito. En mecánica el plazo depende del repuesto instalado, y se lo indicamos en el presupuesto antes de que autorice el trabajo. La garantía se entrega impresa junto con la factura.',
  },
  {
    id: 'aseguradoras',
    question: '¿Trabajan con aseguradoras?',
    answer:
      'Sí. Atendemos siniestros y preparamos el presupuesto en el formato que la aseguradora solicita. También somos taller de confianza de Hertz y Blintec. Tráiganos el número de reclamo y nosotros damos seguimiento al trámite.',
  },
  {
    id: 'tiempos',
    question: '¿Cuánto se tarda una reparación?',
    answer:
      'Un panel con pintura toma de tres a cinco días hábiles. Un choque que requiere enderezado de estructura puede llevar de una a tres semanas, según la llegada de los repuestos. La fecha estimada va por escrito en el presupuesto.',
  },
  {
    id: 'costo-cotizacion',
    question: '¿El presupuesto tiene algún costo?',
    answer:
      'No. La revisión y el presupuesto son gratis, tanto en el taller como por WhatsApp si nos manda fotos. Solo se cobra si usted autoriza la reparación.',
  },
  {
    id: 'carro-cortesia',
    question: '¿Prestan carro mientras reparan el mío?',
    answer:
      'No manejamos flota de cortesía. Si la reparación pasa de una semana, le ayudamos a coordinar un alquiler con tarifa preferencial a través de Hertz, que es cliente nuestro.',
  },
  {
    id: 'polarizado-legal',
    question: '¿Qué polarizado es legal y cuánto dura?',
    answer:
      'Le instalamos el porcentaje permitido para su tipo de vehículo y se lo explicamos antes de cortar la película, para que no tenga inconvenientes en un retén. La película que usamos lleva garantía contra burbujas, despegue y decoloración.',
  },
] as const;

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ServicesOverview, ServiceSections } from './components/Services';
import { Benefits } from './components/Benefits';
import { Process } from './components/Process';
import { Gallery } from './components/Gallery';
import { BeforeAfter } from './components/BeforeAfter';
import { BeforeAfterSet } from './components/BeforeAfterSet';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { A11Y } from './data/copy';

export function App() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        {A11Y.skipToContent}
      </a>

      <Header />

      <main id="contenido">
        <Hero />
        <TrustBar />
        <ServicesOverview />
        <ServiceSections />
        <Benefits />
        <Process />
        <Gallery />
        <BeforeAfter />
        <BeforeAfterSet />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

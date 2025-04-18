import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero'
import Features from '@/components/layout/Features'
import Architecture from '@/components/layout/Architecture';
import Pricing from '@/components/layout/Pricing';
import Contact from '@/components/layout/Contact';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Architecture />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

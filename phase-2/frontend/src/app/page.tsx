import Link from 'next/link';
import Hero from '@/app/components/Hero'
import StatsSection from '@/app/components/StatsSection'
import HowItWorks from '@/app/components/HowItWorks'
import Testimonials from '@/app/components/Testimonials'
import FAQ from '@/app/components/FAQ'

export default function Home() {
  return (
    <div className='h-full bg-gradient-to-br from-slate-950 relative overflow-hidden'>
      <Hero/>
      <StatsSection/>
      <HowItWorks/>
      <Testimonials/>
      <FAQ/>
    </div>
  );
}

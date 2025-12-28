import Link from 'next/link';
import Hero from '@/app/components/Hero'
import FeatureCards from '@/app/components/FeatureCards'

export default function Home() {
  return (
    <div className='h-full bg-gradient-to-br from-slate-950 relative overflow-hidden'>
    <Hero/>
    <FeatureCards/>
    </div>
  );
}
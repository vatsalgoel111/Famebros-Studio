'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomBar from '@/components/MobileBottomBar';
import LocalBusinessJsonLd from '@/components/LocalBusinessJsonLd';
import StyleGuide from '@/sections/StyleGuide';
import HeroSection from '@/sections/Hero';
import WallSection from '@/sections/Wall';
import BreakdownSection from '@/sections/Breakdown';
import OneMonthSection from '@/sections/OneMonth';
import ManagedBySection from '@/sections/ManagedBy';
import CrewSection from '@/sections/Crew';
import ProofSection from '@/sections/Proof';
import YourTileSection from '@/sections/YourTile';
import { SHOW_STYLEGUIDE } from '@/data/site';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <LocalBusinessJsonLd />
      <Header />

      <main className="flex flex-1 flex-col">
        {SHOW_STYLEGUIDE && <StyleGuide />}

        <HeroSection />
        <WallSection />
        <BreakdownSection />
        <OneMonthSection />
        <ManagedBySection />
        <CrewSection />
        <ProofSection />
        <YourTileSection />
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}

import React from 'react';
import HeroSection from '../components/Introduction/HeroSection';
import ManifestationsSection from '../components/Introduction/ProgramsSection';

const Introduction = () => {
  const scrollToNextSection = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full mt-4 overflow-hidden">
      <HeroSection scrollToNextSection={scrollToNextSection} />
      <ManifestationsSection />
    </div>
  );
};

export default Introduction;
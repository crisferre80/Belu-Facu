import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import Story from '@/components/Story';
import Details from '@/components/Details';
import Location from '@/components/Location';
import Gallery from '@/components/Gallery';
import RsvpForm from '@/components/RsvpForm';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';

export default function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <Intro onEnter={() => setEntered(true)} />;
  }

  return (
    <div id="top" className="relative min-h-screen bg-[#faf6ef] animate-fade-in-up">
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dhvrrxejo/image/upload/v1790459052/pngwing.com_4_z0rhv0.png"
          alt=""
          className="absolute -left-3 -top-3 w-[26vw] max-w-[150px] min-w-[88px] opacity-70 drop-shadow-[0_0_18px_rgba(255,255,255,0.9)] saturate-125 sm:w-[22vw] sm:max-w-[160px] md:w-[18vw] md:max-w-[180px]"
        />
        <img
          src="https://res.cloudinary.com/dhvrrxejo/image/upload/v1790459052/pngwing.com_4_z0rhv0.png"
          alt=""
          className="absolute -bottom-3 -right-3 w-[26vw] max-w-[150px] min-w-[88px] rotate-180 opacity-70 drop-shadow-[0_0_18px_rgba(255,255,255,0.9)] saturate-125 sm:w-[22vw] sm:max-w-[160px] md:w-[18vw] md:max-w-[180px]"
        />
      </div>

      <div className="relative z-0">
        <Navbar />
        <Hero />
        <Countdown />
        <Story />
        <Details />
        <Location />
        <Gallery />
        <RsvpForm />
        <Footer />
      </div>
    </div>
  );
}

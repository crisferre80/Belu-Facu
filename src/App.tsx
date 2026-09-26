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
    <div id="top" className="min-h-screen bg-[#faf6ef] animate-fade-in-up">
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
  );
}

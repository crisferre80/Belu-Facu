import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import Story from '@/components/Story';
import Details from '@/components/Details';
import Gallery from '@/components/Gallery';
import RsvpForm from '@/components/RsvpForm';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';

const getGuestLabel = () => {
  if (typeof window === 'undefined') return { guestLabel: '', familyName: '', familyMembers: [] as string[] };

  const params = new URLSearchParams(window.location.search);
  const familyName = params.get('familia') ?? params.get('grupo') ?? '';
  const rawMembers = params.get('integrantes') ?? params.get('miembros') ?? '';
  const familyMembers = rawMembers
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const rawValue =
    params.get('invitado') ??
    params.get('nombre') ??
    params.get('name') ??
    params.get('guest') ??
    familyName ??
    params.get('names') ??
    '';

  return {
    guestLabel: rawValue
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .join(', '),
    familyName,
    familyMembers,
  };
};

export default function App() {
  const [entered, setEntered] = useState(false);
  const [guestLabel, setGuestLabel] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [isAdminPage, setIsAdminPage] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#/admin';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const result = getGuestLabel();
    setGuestLabel(result.guestLabel);
    setFamilyName(result.familyName);
    setFamilyMembers(result.familyMembers);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminPage(window.location.hash === '#/admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!entered || !audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0.35;
    audio.loop = false;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // El navegador puede bloquear la reproducción automática hasta la interacción del usuario.
    });
  }, [entered]);

  if (isAdminPage) {
    return <Footer adminOnly />;
  }

  if (!entered) {
    return <Intro guestLabel={guestLabel} onEnter={() => setEntered(true)} />;
  }

  return (
    <div id="top" className="relative min-h-screen bg-[#faf6ef] animate-fade-in-up">
      <audio ref={audioRef} preload="auto">
        <source src="/Justin Bieber - Peaches .mp3" type="audio/mpeg" />
      </audio>
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
        <Hero guestLabel={guestLabel} familyName={familyName} familyMembers={familyMembers} />
        <Countdown />
        <Story />
        <Details />
        <Gallery />
        <RsvpForm />
        <Footer />
      </div>
    </div>
  );
}

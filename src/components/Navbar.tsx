import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#historia', label: 'Historia' },
  { href: '#detalles', label: 'Detalles' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#galeria', label: 'Galería' },
  { href: '#confirmar', label: 'Confirmar' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-[#faf6ef]/95 shadow-md backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo / nombres */}
        <a
          href="#top"
          className={`font-['Cormorant_Garamond'] text-xl italic transition-colors ${
            scrolled ? 'text-[#3a3022]' : 'text-[#faf6ef]'
          }`}
        >
          B <span className="text-[#d4b483]">&amp;</span> F
        </a>

        {/* Links desktop */}
        <div className="hidden gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-widest transition-colors hover:text-[#d4b483] ${
                scrolled ? 'text-[#7c5e3c]' : 'text-[#faf6ef]/90'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Botón mobile */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
            scrolled
              ? 'border-[#d4b483]/60 bg-[#faf6ef]/90 text-[#3a3022] shadow-md'
              : 'border-white/25 bg-[#2a2418]/30 text-[#faf6ef] shadow-lg shadow-[#2a2418]/20'
          }`}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {open && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 rounded-2xl border border-[#d4b483]/30 bg-[#faf6ef]/95 px-5 pb-4 pt-3 shadow-[0_18px_40px_rgba(42,36,24,0.18)] backdrop-blur-md">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#e6d5b8]/70 py-3 text-sm uppercase tracking-[0.2em] text-[#5e4630] transition-colors last:border-b-0 hover:text-[#d4b483]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

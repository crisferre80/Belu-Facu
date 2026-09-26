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
          className={`md:hidden ${scrolled ? 'text-[#3a3022]' : 'text-[#faf6ef]'}`}
          aria-label="Menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {open && (
        <div className="md:hidden">
          <div className="flex flex-col gap-1 bg-[#faf6ef]/98 px-6 pb-6 pt-2 shadow-lg backdrop-blur-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#e6d5b8]/50 py-3 text-sm uppercase tracking-wider text-[#7c5e3c] transition-colors hover:text-[#d4b483]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

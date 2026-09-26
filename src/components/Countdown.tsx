import { useEffect, useState } from 'react';
import { weddingConfig } from '@/lib/config';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(weddingConfig.weddingDate)
  );

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft(calculateTimeLeft(weddingConfig.weddingDate)),
      1_000
    );
    return () => clearInterval(timer);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ];

  return (
    <section className="bg-[#faf6ef] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-[\'Cormorant_Garamond\'] text-sm uppercase tracking-[0.4em] text-[#b08968] mb-4">
          Faltan
        </p>
        <h2 className="font-[\'Cormorant_Garamond\'] text-3xl sm:text-4xl font-light text-[#3a3022] mb-12">
          Para nuestro gran día
        </h2>

        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center rounded-lg border border-[#e6d5b8] bg-white/60 px-2 py-6 shadow-sm"
            >
              <span className="font-[\'Cormorant_Garamond\'] text-3xl sm:text-5xl font-light text-[#7c5e3c] tabular-nums">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="mt-2 text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] text-[#b08968]">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client'

import { useEffect, useState } from 'react'

const Banner = () => {
  const [dayLeft, setDayLeft] = useState<number | null>(null);

  useEffect(() => {
    const targetDate = new Date('2027-01-29T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      const days = Math.max(Math.ceil(difference / (1000 * 60 * 60 * 24)), 0);
      setDayLeft(days);
    };

    updateCountdown(); // Initial calculation
    const timer = setInterval(updateCountdown, 86400000); // Update every 24 hours

    return () => clearInterval(timer); // Cleanup
  }, []);

  return (
    <section 
      className="
        relative w-full h-[65vh] 
        flex items-center justify-center 
        bg-cover bg-center mt-[80px]
      "
      style={{
        backgroundImage: "url('/images/angkor_wat.png')" 
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="relative text-center text-white px-6 max-w-5xl">
        
        <h1 className="text-3xl md:text-5xl font-bold leading-snug">
          33RD INTERNATIONAL CONFERENCE ON<br/> MULTIMEDIA MODELING
        </h1>

        <div className="flex items-center justify-center mt-8 text-[30px] gap-4 font-semibold">
          <span>STARTS IN</span>

          <span className="bg-[#2A0845] text-white px-6 py-3 rounded-xl text-3xl font-bold">
            {dayLeft !== null ? dayLeft : "--"}
          </span>

          <span>DAYS</span>
        </div>

        <div className="mt-7 text-[24px]  font-normal">
          JANUARY 29-31, 2027
          <br />
          SIEM REAP, CAMBODIA
        </div>
      </div>
    </section>
  )
}

export default Banner

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
        relative w-full 
        h-[50vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] 
        flex items-center justify-center 
        bg-cover bg-center mt-[80px] 
        px-4
      "
      style={{
        backgroundImage: "url('/images/angkor_wat.png')" 
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="relative text-center text-white max-w-5xl w-full">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug">
          33RD INTERNATIONAL CONFERENCE ON<br />MULTIMEDIA MODELING
        </h1>

        {/* COUNTDOWN */}
        <div className="flex flex-col sm:flex-row items-center justify-center mt-6 sm:mt-8 gap-4 text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-semibold">
          <span>STARTS IN</span>

          <span className="bg-[#2A0845] text-white px-6 py-3 rounded-xl text-2xl sm:text-3xl md:text-4xl font-bold">
            {dayLeft !== null ? dayLeft : "--"}
          </span>

          <span>DAYS</span>
        </div>

        {/* DATE & LOCATION */}
        <div className="mt-5 sm:mt-7 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-normal">
          JANUARY 29-31, 2027
          <br />
          SIEM REAP, CAMBODIA
        </div>
      </div>
    </section>
  )
}

export default Banner

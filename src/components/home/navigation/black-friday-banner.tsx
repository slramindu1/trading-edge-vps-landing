import Link from "next/link";
import { BadgePercent, ChevronRight } from "lucide-react";

const BlackFridayBanner = () => {
  return (
    <div
      className="w-full py-2.5 sm:py-3 px-4 border-b border-[#eaab26]/20 z-50 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #090704 0%, #261906 50%, #090704 100%)",
      }}
    >
      <Link
        href="/checkout"
        className="group flex items-center justify-center gap-2.5 text-xs sm:text-sm mx-auto max-w-screen-xl"
      >
        <BadgePercent className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-[#eaab26] text-[#1c1305] shrink-0" />
        <span className="text-[#eaab26] tracking-wide">
          <strong className="font-bold">Black Friday:</strong>{" "}
          <span className="font-semibold">Up to 30% Off</span>
        </span>
        <span className="text-white font-bold inline-flex items-center gap-0.5 ml-1 group-hover:underline">
          Claim Now
          <ChevronRight className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
};

export default BlackFridayBanner;

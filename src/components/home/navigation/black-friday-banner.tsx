import Link from "next/link";
import { BadgePercent, ChevronRight } from "lucide-react";

const BlackFridayBanner = () => {
  return (
    <div className="w-full bg-[#1c1305] border-b border-[#eaab26]/20 py-2 px-4 z-50">
      <Link
        href="/checkout"
        className="group flex items-center justify-center gap-2 text-xs sm:text-sm mx-auto max-w-screen-xl"
      >
        <BadgePercent className="w-4 h-4 fill-[#eaab26] text-[#1c1305] shrink-0" />
        <span className="text-[#eaab26] font-medium">
          Black Friday: Up to 30% Off
        </span>
        <span className="text-white font-semibold inline-flex items-center gap-0.5 group-hover:underline">
          Claim Now
          <ChevronRight className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
};

export default BlackFridayBanner;

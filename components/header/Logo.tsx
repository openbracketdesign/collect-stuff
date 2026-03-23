import Link from "next/link";
import { space_grotesk } from "@/app/fonts";

export default function Logo() {
  return (
    <Link
      href='/collections'
      className={`hover:text-theme-700 text-xl font-bold text-primary ${space_grotesk.className}`}
    >
      <span className='text-gray-700'>Collect</span>Stuff
    </Link>
  );
}

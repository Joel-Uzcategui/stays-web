import Link from "next/link";

export const Brand = () => (
  <Link href="/" className="flex items-center gap-2.5">
    <span className="grid size-7 flex-none place-items-center border border-accent">
      <span className="size-2.5 bg-accent" />
    </span>
    <span className="font-heading text-lg leading-none tracking-wide">
      UZCATEGUI <span className="text-accent">STAYS</span>
    </span>
  </Link>
);

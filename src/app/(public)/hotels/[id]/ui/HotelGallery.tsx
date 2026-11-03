import Image from "next/image";

import { photoUrl } from "@/lib/photos";

interface Props {
  ids: string[];
  name: string;
}

export const HotelGallery = ({ ids, name }: Props) => {
  if (!ids.length) {
    return null;
  }

  const [cover, ...rest] = ids;

  return (
    <section className="mt-6 grid gap-2 sm:h-80 sm:grid-cols-4 sm:grid-rows-2">
      <div className="relative aspect-[16/10] overflow-hidden rounded bg-accent-tint sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full">
        <Image
          src={photoUrl(cover)}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {rest.slice(0, 4).map((id) => (
        <div
          key={id}
          className="relative hidden overflow-hidden rounded bg-accent-tint sm:block sm:h-full"
        >
          <Image
            src={photoUrl(id)}
            alt=""
            fill
            sizes="25vw"
            className="object-cover"
          />
        </div>
      ))}
    </section>
  );
};

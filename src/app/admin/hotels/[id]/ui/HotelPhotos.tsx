'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';

import {
  deleteHotelPhoto,
  reorderHotelPhotos,
  uploadHotelPhoto,
} from '@/actions';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

export interface HotelPhoto {
  id: string;
  src: string;
}

interface Props {
  hotelId: string;
  photos: HotelPhoto[];
}

export const HotelPhotos = ({ hotelId, photos }: Props) => {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<{ message?: string }>) => {
    setError(null);

    startTransition(async () => {
      const { message } = await action();

      if (message) {
        setError(message);

        return;
      }

      router.refresh();
    });
  };

  const upload = (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('The image is too large: 10 MB maximum');

      return;
    }

    const body = new FormData();
    body.append('photo', file);

    run(() => uploadHotelPhoto(hotelId, body));
  };

  // The cover is the first photo, so promoting one is a reorder of the run.
  const makeCover = (id: string) =>
    run(() =>
      reorderHotelPhotos(hotelId, [
        id,
        ...photos.filter((photo) => photo.id !== id).map((photo) => photo.id),
      ]),
    );

  return (
    <div className="max-w-2xl">
      <div className="flex items-baseline justify-between border-b border-line pb-2">
        <h2 className="font-heading text-lg">Photos</h2>
        <span className="text-xs text-faint">
          {photos.length ? `${photos.length} uploaded` : 'None yet'}
        </span>
      </div>

      <p className="mt-2 text-sm text-muted">
        The first one is the cover: it is the image shown on the search results.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <figure
            key={photo.id}
            className="overflow-hidden rounded border border-line"
          >
            <div className="relative aspect-[4/3] bg-accent-tint">
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 200px"
                className="object-cover"
              />

              {index === 0 && (
                <span className="kicker absolute top-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-accent-ink">
                  Cover
                </span>
              )}
            </div>

            <figcaption className="flex items-center justify-between border-t border-line px-2 py-1.5">
              <button
                type="button"
                disabled={pending || index === 0}
                onClick={() => makeCover(photo.id)}
                className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent disabled:opacity-35 disabled:hover:text-muted"
              >
                <Star size={12} strokeWidth={1.5} />
                Cover
              </button>

              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => deleteHotelPhoto(photo.id))}
                className="text-muted transition-colors hover:text-danger disabled:opacity-35"
                aria-label="Delete photo"
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            </figcaption>
          </figure>
        ))}

        <button
          type="button"
          disabled={pending}
          onClick={() => fileInput.current?.click()}
          className="grid aspect-[4/3] place-items-center gap-1 rounded border border-dashed border-line text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-45"
        >
          <span className="flex flex-col items-center gap-1">
            <ImagePlus size={20} strokeWidth={1.5} />
            <span className="text-xs">{pending ? 'Working…' : 'Add photo'}</span>
          </span>
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];

          // Cleared so picking the same file twice still fires a change.
          event.target.value = '';

          if (file) {
            upload(file);
          }
        }}
      />

      {error && (
        <p className="mt-3 rounded border border-danger/25 bg-danger-tint px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

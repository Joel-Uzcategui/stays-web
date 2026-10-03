'use client';

import { Minus, Plus } from 'lucide-react';

interface Props {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const button =
  'grid size-7 flex-none place-items-center rounded border border-line text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-muted';

export const Stepper = ({
  label,
  hint,
  value,
  min = 1,
  max = 10,
  onChange,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm">{label}</p>
        {hint && <p className="text-xs text-faint">{hint}</p>}
      </div>

      <div className="flex flex-none items-center gap-2">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className={button}
        >
          <Minus size={13} strokeWidth={2} />
        </button>

        <span className="w-5 text-center text-sm tabular-nums">{value}</span>

        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className={button}
        >
          <Plus size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

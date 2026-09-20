interface Props {
  tone?: 'accent' | 'neutral';
  children: React.ReactNode;
}

const tones = {
  accent: 'bg-accent-tint text-accent-ink',
  neutral: 'bg-surface text-muted',
};

export const Tag = ({ tone = 'neutral', children }: Props) => {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

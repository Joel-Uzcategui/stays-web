interface Props {
  label: string;
  value: number | string;
  note?: string;
}

export const StatCard = ({ label, value, note }: Props) => {
  return (
    <div className="rounded border border-line bg-white/40 p-4">
      <p className="kicker text-accent">{label}</p>
      <p className="mt-2 font-heading text-4xl leading-none tabular-nums">
        {value}
      </p>
      {note && <p className="mt-1.5 text-xs text-muted">{note}</p>}
    </div>
  );
};

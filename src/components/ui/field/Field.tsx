export const fieldClass = (invalid?: boolean) =>
  `rounded border bg-white/50 px-3 py-2 text-sm placeholder:text-faint ${
    invalid ? "border-danger" : "border-line"
  }`;

export const FieldError = ({ message }: { message?: string }) =>
  message ? <span className="text-xs text-danger">{message}</span> : null;

interface Props {
  label: string;
  hint?: string;
  error?: string;
  span?: boolean;
  children: React.ReactNode;
}

export const Field = ({ label, hint, error, span, children }: Props) => (
  <label className={`flex flex-col gap-1 ${span ? "sm:col-span-2" : ""}`}>
    <span className="kicker text-muted">{label}</span>
    {children}
    {!error && hint && <span className="text-xs text-faint">{hint}</span>}
    <FieldError message={error} />
  </label>
);

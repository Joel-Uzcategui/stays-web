interface Props {
  kicker: string;
  title: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ kicker, title, children }: Props) => {
  return (
    <header className="flex flex-wrap items-end gap-4 border-b border-line px-7 py-4">
      <div className="min-w-0">
        <p className="kicker text-muted">{kicker}</p>
        <h1 className="mt-0.5 text-2xl">{title}</h1>
      </div>

      {children && (
        <div className="ml-auto flex items-center gap-2">{children}</div>
      )}
    </header>
  );
};

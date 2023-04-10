interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between px-2">
      <div className="grid gap-1">
        <h1>{heading}</h1>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}

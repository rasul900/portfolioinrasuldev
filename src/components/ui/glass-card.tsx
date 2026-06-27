import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({ className, glow, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        glow && "hover:glow-blue",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

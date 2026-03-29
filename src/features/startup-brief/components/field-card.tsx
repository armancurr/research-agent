import type { ReactNode } from "react";
export function FieldCard({
  label,
  hint,
  stepNumber,
  isFilled,
  required,
  children,
  id,
  animationDelay,
}: {
  label: string;
  hint: string;
  stepNumber: number;
  isFilled: boolean;
  required: boolean;
  children: ReactNode;
  id: string;
  animationDelay: number;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24"
      style={{
        animation: `field-enter 0.28s ease-out ${animationDelay}ms both`,
      }}
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[11px] font-medium tabular-nums text-muted-foreground/80">
          {String(stepNumber).padStart(2, "0")}
        </span>
        <span
          className={
            isFilled
              ? "text-sm font-medium text-muted-foreground"
              : "text-sm font-medium text-foreground"
          }
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive/70">*</span>
          ) : null}
        </span>
      </div>

      <p className="mb-3 max-w-prose text-xs leading-relaxed text-muted-foreground">
        {hint}
      </p>

      {children}
    </div>
  );
}

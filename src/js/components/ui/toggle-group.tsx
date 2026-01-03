import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type ToggleGroupContextValue = {
  value?: string;
  onValueChange?: (val: string) => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  value: undefined,
  onValueChange: undefined,
});

type ToggleGroupProps = {
  value?: string;
  onValueChange?: (val: string) => void;
  type?: "single";
  className?: string;
  children: React.ReactNode;
};

export const ToggleGroup = ({
  value,
  onValueChange,
  className,
  children,
}: ToggleGroupProps) => {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("flex items-center gap-1", className)} role="group">
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
};

type ToggleGroupItemProps = {
  value: string;
  "aria-label"?: string;
  children: React.ReactNode;
  className?: string;
};

export const ToggleGroupItem = ({
  value,
  children,
  className,
  ...props
}: ToggleGroupItemProps) => {
  const ctx = useContext(ToggleGroupContext);
  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      data-state={isActive ? "on" : "off"}
      aria-pressed={isActive}
      onClick={() => ctx.onValueChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

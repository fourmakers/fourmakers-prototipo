import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  onSelect: () => void;
  name: string;
  value: string;
}

export function OptionCard({
  selected,
  title,
  subtitle,
  subtitleClassName,
  onSelect,
  name,
  value,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      name={name}
      value={value}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-md border-[1.5px] p-3.5 text-left transition-colors",
        "border-borderDefault bg-secondaryBackground hover:border-accent hover:bg-accentSoft",
        selected && "border-accent bg-accentSoft",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-borderDefault bg-secondaryBackground transition-colors",
          selected && "border-accent bg-accent",
        )}
        aria-hidden
      >
        {selected && <span className="size-2 rounded-full bg-inverseText" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold leading-snug text-primaryText">{title}</span>
        {subtitle ? (
          <span
            className={cn(
              "mt-0.5 block text-[11px] leading-snug text-secondaryText",
              subtitleClassName,
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </button>
  );
}

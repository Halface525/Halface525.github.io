import { MagButton } from "./MagButton";

export function FilterButtons({ options, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <MagButton
          key={opt.value}
          active={active === opt.value}
          onClick={() => onChange(opt.value)}
          className="text-xs"
        >
          {opt.label}
        </MagButton>
      ))}
    </div>
  );
}

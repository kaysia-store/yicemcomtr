"use client";

type Props = {
  isLight: boolean;
  label: string;
  onChange: (isLight: boolean) => void;
};

export default function ThemeToggle({ isLight, label, onChange }: Props) {
  return (
    <div className="theme-switch" title={label}>
      <label className="switch">
        <input
          type="checkbox"
          checked={isLight}
          onChange={(event) => onChange(event.target.checked)}
          aria-label={label}
          suppressHydrationWarning
        />
        <span className="slider" />
      </label>
    </div>
  );
}

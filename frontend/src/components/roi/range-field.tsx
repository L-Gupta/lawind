"use client";

interface RangeFieldProps {
  label: React.ReactNode;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function RangeField({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: RangeFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="field">
      <div className="field-top">
        <span className="field-label">{label}</span>
        <span className="field-value">{displayValue}</span>
      </div>
      <input
        type="range"
        className="roi-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

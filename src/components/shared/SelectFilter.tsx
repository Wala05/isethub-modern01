type SelectFilterProps = { value: string; setValue: (value: string) => void; options: string[]; label?: string };

export function SelectFilter({ value, setValue, options, label }: SelectFilterProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="h-11 w-full border border-[var(--line)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
    >
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

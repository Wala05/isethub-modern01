type SelectFilterProps = { value: string; setValue: (value: string) => void; options: string[]; label?: string };

export function SelectFilter({ value, setValue, options, label }: SelectFilterProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 outline-none transition focus:border-[#126cb1] focus:ring-4 focus:ring-[#126cb1]/10"
    >
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

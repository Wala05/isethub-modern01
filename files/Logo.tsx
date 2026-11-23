export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img src="/assets/images/Gemini_Generated_Image_8e91l88e91l88e91-removebg-preview.png" alt="ISET Djerba" className="h-10 w-[64px] object-contain sm:h-12 sm:w-[78px]" />
      <span className={`border-l pl-3 text-lg font-extrabold leading-none tracking-tight ${light ? 'border-white/20 text-white' : 'border-slate-200 text-[#021d33]'}`}>
        Iset<span className={light ? 'text-[#fba831]' : 'text-[#126cb1]'}>Hub</span>
      </span>
    </span>
  );
}

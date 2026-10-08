import React from 'react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenCalculator: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCalculator,
}) => {
  return (
    <footer className="border-t border-stone-200 bg-white pt-16 pb-12 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 block">
              Aura &amp; Iron
            </span>
            <p className="text-stone-500 leading-relaxed max-w-sm">
              An evidence-based editorial journal investigating human performance, biomechanics, cellular nutrition, and longevity medicine. Peer-reviewed literature translated into sustainable physical practice.
            </p>
            <div className="pt-2 text-stone-400 text-[11px] font-mono">
              Published continuously in open access since 2026.
            </div>
          </div>

          {/* Core Categories */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Core Departments
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <a
                  href="/strength"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Strength & Training');
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer block"
                >
                  Strength &amp; Hypertrophy
                </a>
              </li>
              <li>
                <a
                  href="/cardio"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Cardio & Endurance');
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer block"
                >
                  Cardiorespiratory &amp; Zone 2
                </a>
              </li>
              <li>
                <a
                  href="/recovery"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Recovery & Sleep');
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer block"
                >
                  Circadian Biology &amp; Sleep
                </a>
              </li>
              <li>
                <a
                  href="/nutrition"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Nutrition & Fuel');
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer block"
                >
                  Metabolic Fueling &amp; Protein
                </a>
              </li>
              <li>
                <a
                  href="/longevity"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Longevity & Science');
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer block"
                >
                  Longevity &amp; Aging Science
                </a>
              </li>
            </ul>
          </div>

          {/* Interactive tools & Editorial guidelines */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Reader Utilities
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <a
                  href="/calculators"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenCalculator();
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Interactive Bio-Calculators (Zone 2 &amp; Protein)</span>
                </a>
              </li>
              <li>
                <span className="text-stone-500">
                  Peer-Review Standard: All articles cite primary indexed randomized trials.
                </span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <span className="text-[11px] text-stone-400 block font-medium uppercase tracking-wider mb-1">
                Medical &amp; Physical Disclaimer
              </span>
              <p className="text-[11px] text-stone-500 leading-normal">
                Articles published on Aura &amp; Iron are for educational and scholarly inquiry only and do not constitute individual medical diagnosis or prescriptive clinical advice. Consult your healthcare provider prior to undertaking intensive athletic or dietary interventions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Aura &amp; Iron Journal. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Independent Science Publication</span>
            <span aria-hidden="true">·</span>
            <span>ISSN 2894-1029</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

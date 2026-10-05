import React, { useState } from 'react';
import { X, Heart, Activity, Flame, ShieldAlert } from 'lucide-react';

interface FitnessCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitnessCalculatorModal: React.FC<FitnessCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'zone2' | 'protein'>('zone2');

  // Zone 2 State
  const [age, setAge] = useState<number>(32);
  const [restingHr, setRestingHr] = useState<number>(58);

  // Protein / TDEE State
  const [weightKg, setWeightKg] = useState<number>(75);
  const [activityTier, setActivityTier] = useState<number>(1.55); // Moderate exercise 3-5 days
  const [goal, setGoal] = useState<'hypertrophy' | 'maintenance' | 'fatloss'>('hypertrophy');

  if (!isOpen) return null;

  // Zone 2 calculation via Karvonen Formula
  // Max HR = 208 - (0.7 * age) (Tanaka formula)
  const maxHr = Math.round(208 - 0.7 * age);
  const hrr = maxHr - restingHr;
  const zone2Low = Math.round(restingHr + hrr * 0.60);
  const zone2High = Math.round(restingHr + hrr * 0.70);

  // Protein targets based on 1.6 - 2.2 g/kg
  const proteinLow = Math.round(weightKg * 1.6);
  const proteinHigh = Math.round(weightKg * 2.2);
  const leucinePerMeal = 2.8;
  const recommendedMeals = 4;
  const proteinPerMeal = Math.round(proteinHigh / recommendedMeals);

  // Approximate TDEE calculation (Mifflin-St Jeor estimate baseline)
  const bmrEstimate = Math.round(10 * weightKg + 6.25 * 175 - 5 * age + 5);
  const tdeeEstimate = Math.round(bmrEstimate * activityTier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Physiological Biomarker Calculators
            </h3>
            <p className="text-xs text-stone-500">
              Evidence-based metabolic formulas referenced in our articles
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('zone2')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'zone2'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Zone 2 Heart Rate</span>
          </button>
          <button
            onClick={() => setActiveTab('protein')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'protein'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Protein &amp; Leucine Pacing</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'zone2' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={95}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 font-mono tabular-nums focus:outline-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Resting Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    min={35}
                    max={110}
                    value={restingHr}
                    onChange={(e) => setRestingHr(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 font-mono tabular-nums focus:outline-stone-900"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
                    Your Target Aerobic Training Floor
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-900 my-1 tabular-nums">
                    {zone2Low} – {zone2High} <span className="text-sm font-sans font-normal text-stone-600">BPM</span>
                  </div>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Tanaka / Karvonen reserve calibrated for 60%–70% aerobic lipid oxidation threshold.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400">Estimated Max HR:</span>{' '}
                    <strong className="text-stone-800 font-mono">{maxHr} bpm</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Heart Rate Reserve:</span>{' '}
                    <strong className="text-stone-800 font-mono">{hrr} bpm</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-stone-600 bg-amber-50/70 border border-amber-200/70 rounded-lg p-3">
                <Activity className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <p>
                  Validate this range with the <strong>conversational test</strong>: you should be able to speak in complete sentences throughout your 45-minute training block without gasping.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Body Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={180}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 font-mono tabular-nums focus:outline-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Primary Objective
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-stone-900"
                  >
                    <option value="hypertrophy">Muscle Hypertrophy (2.0-2.2g/kg)</option>
                    <option value="fatloss">Fat Loss &amp; Deficit (2.2g/kg+)</option>
                    <option value="maintenance">Health Maintenance (1.6g/kg)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-medium text-stone-500 uppercase">
                      Total Daily Protein Target
                    </span>
                    <p className="text-[11px] text-stone-400">Optimal 1.6 to 2.2 g/kg tier</p>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 font-mono tabular-nums">
                    {proteinLow} – {proteinHigh}g
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stone-500 uppercase">
                      Per-Meal Distribution (4 Meals)
                    </span>
                    <p className="text-[11px] text-stone-400">Clears ~{leucinePerMeal}g leucine threshold</p>
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-amber-800 font-mono tabular-nums">
                    ~{proteinPerMeal}g <span className="text-xs font-sans font-normal text-stone-500">/ meal</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-stone-600 bg-stone-100 rounded-lg p-3">
                <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <p>
                  Spacing complete protein boluses every 3.5 to 5 hours prevents the muscle refractoriness phenomenon while maintaining peak ribosomal translation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-100/80 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

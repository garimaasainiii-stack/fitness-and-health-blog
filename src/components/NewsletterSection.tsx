import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="my-16 lg:my-20 bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-12 lg:p-14 relative overflow-hidden border border-stone-800">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-400 block mb-3">
          Weekly Evidence Dispatch
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4" style={{ textWrap: 'balance' }}>
          Deconstruct Human Physiology Straight to Your Inbox
        </h2>
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
          Every Thursday morning, we translate landmark randomized trials into actionable protocols covering cellular bioenergetics, progressive resistance, and circadian hygiene.
        </p>

        {subscribed ? (
          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 flex items-center justify-center gap-3 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              You are enrolled in the Weekly Dispatch. Check your inbox for the welcome issue.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@institution.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-hidden focus:border-stone-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-stone-100 hover:bg-white rounded-lg transition-colors cursor-pointer shrink-0 inline-flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-4 text-[11px] text-stone-400">
          Strict scientific rigor · No sponsored product placements · Unsubscribe with one click.
        </div>
      </div>
    </section>
  );
};

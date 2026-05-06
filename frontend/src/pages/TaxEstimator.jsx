import React, { useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

function formatINR(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function TaxEstimator() {
  const [income, setIncome] = useState("");
  const [language, setLanguage] = useState("hinglish");
  const [userType, setUserType] = useState("salaried");
  const [eligibility, setEligibility] = useState({
    is_director: false,
    has_unlisted_shares: false,
    has_foreign_assets_or_income: false,
    has_capital_gains: false,
    has_brought_forward_loss: false,
    has_business_income: false,
    is_presumptive_income: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!income) return alert("Please enter your annual income.");

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/tax/estimate", {
        income: parseFloat(income),
        language,
        user_type: userType,
        ...eligibility,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch tax estimate right now.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const calculation = result?.calculation || {};
  const suggestions = result?.investment_suggestions || result?.suggestions || [];
  const savingRules = result?.money_saving_rules || [];
  const claimChecklist = result?.claim_checklist || [];
  const slabPlaybook = result?.slab_playbook || null;
  const filingGuidance = result?.filing_guidance || null;
  const itrRecommendation = result?.itr_recommendation || null;

  const headline = useMemo(() => {
    if (!result) return "Plan tax smarter, invest with intent.";
    return `${result?.regime || "Tax Regime"} | ${result?.law_reference || "Latest law"}`;
  }, [result]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#d9f4f8_0%,#f3f8ff_38%,#eef2f7_100%)] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-3xl border border-[#cfe4f0] bg-white/90 p-6 shadow-[0_12px_40px_rgba(7,33,70,0.10)] backdrop-blur xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1b7ea0]">Financial Planner</p>
            <h1 className="text-3xl font-bold leading-tight text-[#072146]">Tax & Investment Estimator</h1>
            <p className="mt-3 text-sm text-slate-600">{headline}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Annual Income (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#1FA2B6] focus:ring-2 focus:ring-[#1FA2B6]/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#1FA2B6] focus:ring-2 focus:ring-[#1FA2B6]/30"
                >
                  <option value="hinglish">Hinglish</option>
                  <option value="english">English</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#1FA2B6] focus:ring-2 focus:ring-[#1FA2B6]/30"
                >
                  <option value="salaried">Salaried</option>
                  <option value="senior_citizen">Senior Citizen</option>
                  <option value="business_professional">Business / Professional</option>
                  <option value="investor_foreign_income">Investor / Foreign Income</option>
                </select>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Eligibility Wizard</p>
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700">
                  {[
                    ["is_director", "Director in company"],
                    ["has_unlisted_shares", "Held unlisted equity shares"],
                    ["has_foreign_assets_or_income", "Foreign asset / income / signing authority"],
                    ["has_capital_gains", "Any capital gains"],
                    ["has_brought_forward_loss", "Brought-forward loss / carry forward loss"],
                    ["has_business_income", "Business or professional income"],
                    ["is_presumptive_income", "Presumptive income (44AD/44ADA/44AE)"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={eligibility[key]}
                        onChange={(e) => setEligibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition ${
                  loading ? "cursor-not-allowed bg-slate-400" : "bg-[#0f9db2] hover:bg-[#0a8597]"
                }`}
              >
                {loading ? "Calculating..." : "Calculate & Suggest"}
              </button>
            </form>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          </div>
        </aside>

        <main className="space-y-6">
          {!result ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
              <p className="text-lg font-semibold text-slate-700">Enter your income to generate your tax playbook.</p>
              <p className="mt-2 text-sm">You will get slab details, saving rules, and claim checklist in one view.</p>
            </div>
          ) : (
            <>
              <motion.section {...cardMotion} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated Annual Tax</p>
                  <p className="mt-2 text-4xl font-bold text-[#072146]">INR {formatINR(calculation.total_estimated_tax)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Marginal Slab</p>
                  <p className="mt-2 text-3xl font-bold text-[#0f9db2]">{calculation.marginal_tax_slab || "N/A"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Taxable Income</p>
                  <p className="mt-2 text-3xl font-bold text-[#072146]">INR {formatINR(calculation.taxable_income)}</p>
                </div>
              </motion.section>

              {itrRecommendation ? (
                <motion.section {...cardMotion} className="rounded-2xl border border-[#cae6ed] bg-white p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Exact ITR Recommendation</p>
                  <h2 className="mt-1 text-2xl font-bold text-[#0f9db2]">{itrRecommendation.recommended_itr}</h2>
                  <p className="mt-2 text-sm text-slate-700">{itrRecommendation.reason}</p>
                </motion.section>
              ) : null}

              {slabPlaybook ? (
                <motion.section {...cardMotion} className="rounded-2xl border border-[#cae6ed] bg-gradient-to-r from-[#f2fcff] to-white p-6">
                  <h2 className="text-lg font-bold text-[#072146]">Slab Playbook</h2>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-semibold">Band:</span> {slabPlaybook.band}</p>
                    <p><span className="font-semibold">Invest Rule:</span> {slabPlaybook.invest_ratio_rule}</p>
                    <p className="md:col-span-2"><span className="font-semibold">Focus:</span> {slabPlaybook.focus}</p>
                    <p className="md:col-span-2"><span className="font-semibold">Suggested Split:</span> {slabPlaybook.suggested_split_rule}</p>
                  </div>
                </motion.section>
              ) : null}

              {filingGuidance ? (
                <motion.section {...cardMotion} className="rounded-2xl border border-[#cae6ed] bg-white p-6">
                  <h2 className="text-lg font-bold text-[#072146]">Filing Guidance by User Type</h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Reference: <a className="text-[#0f9db2] underline" href={filingGuidance.source_page} target="_blank" rel="noreferrer">{filingGuidance.source_page}</a>
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Recommended ITR</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{filingGuidance?.itr_guidance?.recommended}</p>
                      <p className="mt-2 text-sm text-slate-700">{filingGuidance?.itr_guidance?.note}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Important Forms</p>
                      <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
                        {(filingGuidance.important_forms || []).map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Key Conditions</p>
                    <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
                      {(filingGuidance.key_conditions || []).map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </motion.section>
              ) : null}

              <motion.section {...cardMotion} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold text-[#072146]">Investment Suggestions</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <article key={i} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                      <h3 className="text-base font-semibold text-[#0f9db2]">{s.title}</h3>
                      {s.tax_relevance ? <p className="mt-1 text-xs font-medium text-slate-500">{s.tax_relevance}</p> : null}
                      <p className="mt-2 text-sm text-slate-700">{s.description}</p>
                    </article>
                  ))}
                  {suggestions.length === 0 ? <p className="text-sm text-slate-500">No suggestions available.</p> : null}
                </div>
              </motion.section>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.section {...cardMotion} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-[#072146]">Money Saving Rules</h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    {savingRules.map((r, i) => (
                      <li key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <span className="font-semibold">{r.rule}</span>
                        <p className="mt-1">{r.how}</p>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <motion.section {...cardMotion} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-[#072146]">Claim Checklist</h2>
                  <ol className="mt-4 space-y-3 text-sm text-slate-700">
                    {claimChecklist.map((c, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#e6f6fa] text-xs font-bold text-[#0f9db2]">
                          {i + 1}
                        </span>
                        <p>
                          <span className="font-semibold">{c.step}:</span> {c.details}
                        </p>
                      </li>
                    ))}
                  </ol>
                </motion.section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

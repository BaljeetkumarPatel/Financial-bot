from typing import Any, Dict, List

AY_LABEL = "AY 2026-27 onward"
REGIME_LABEL = "New Regime (Section 115BAC)"
REBATE_INCOME_LIMIT = 1200000.0
MAX_REBATE_87A = 60000.0
STANDARD_DEDUCTION_NEW_REGIME = 75000.0
HEALTH_EDU_CESS_RATE = 0.04


def _compute_base_tax_new_regime(taxable_income: float) -> float:
    slabs = [
        (400000.0, 0.00),
        (800000.0, 0.05),
        (1200000.0, 0.10),
        (1600000.0, 0.15),
        (2000000.0, 0.20),
        (2400000.0, 0.25),
        (float("inf"), 0.30),
    ]
    tax = 0.0
    lower = 0.0
    for upper, rate in slabs:
        if taxable_income <= lower:
            break
        taxable_part = min(taxable_income, upper) - lower
        if taxable_part > 0:
            tax += taxable_part * rate
        lower = upper
    return tax


def _rebate_87a_with_marginal_relief(taxable_income: float, base_tax: float, resident: bool) -> float:
    if not resident:
        return 0.0
    if taxable_income <= REBATE_INCOME_LIMIT:
        return min(base_tax, MAX_REBATE_87A)
    # Marginal relief: tax payable should not exceed income above rebate threshold.
    marginal_limit = taxable_income - REBATE_INCOME_LIMIT
    marginal_rebate = max(0.0, base_tax - marginal_limit)
    return min(MAX_REBATE_87A, marginal_rebate)


def _marginal_rate_label(taxable_income: float) -> str:
    if taxable_income <= 400000:
        return "0%"
    if taxable_income <= 800000:
        return "5%"
    if taxable_income <= 1200000:
        return "10%"
    if taxable_income <= 1600000:
        return "15%"
    if taxable_income <= 2000000:
        return "20%"
    if taxable_income <= 2400000:
        return "25%"
    return "30%"


def _is_hinglish(language: str) -> bool:
    return (language or "english").strip().lower() == "hinglish"


def _filing_guidance(user_type: str, resident: bool, gross_income: float, language: str) -> Dict[str, Any]:
    h = _is_hinglish(language)
    is_within_50l = gross_income <= 5000000
    utype = (user_type or "salaried").strip().lower()

    base = {
        "source_page": "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
        "important_forms": [],
        "itr_guidance": {},
        "key_conditions": [],
    }

    if utype == "senior_citizen":
        base["important_forms"] = [
            "Form 16 / 16A",
            "Form 26AS and AIS",
            "Form 15H (for eligible 60+ resident individuals to avoid TDS on interest)",
            "Form 10E (if arrears/advance salary relief u/s 89(1) is claimed)",
        ]
        base["itr_guidance"] = {
            "recommended": "ITR-1 or ITR-2 (depends on income heads and eligibility)",
            "note": "Senior citizen status changes old-regime basic exemption, but return type depends on income nature and portal conditions.",
        }
    elif utype == "business_professional":
        base["important_forms"] = [
            "Form 10-IEA (for opting out/re-entering default new regime in business cases)",
            "Form 26AS and AIS",
            "Books/presumptive computation records",
        ]
        base["itr_guidance"] = {
            "recommended": "ITR-3 or ITR-4 (presumptive cases u/s 44AD/44ADA/44AE)",
            "note": "ITR-4 is optional simplified return and only for eligible presumptive income cases.",
        }
    elif utype == "investor_foreign_income":
        base["important_forms"] = [
            "Form 67 (for foreign income / foreign tax credit claims)",
            "Form 26AS and AIS",
            "Capital gains statements",
        ]
        base["itr_guidance"] = {
            "recommended": "Usually ITR-2/ITR-3 (depends on business income presence)",
            "note": "ITR-1/ITR-4 are generally not valid where foreign assets/income exist.",
        }
    else:
        base["important_forms"] = [
            "Form 12BB (employee deduction claims to employer)",
            "Form 16 / 16A",
            "Form 26AS and AIS",
            "Form 10E (if arrears/advance salary relief is claimed)",
        ]
        base["itr_guidance"] = {
            "recommended": "Likely ITR-1 (Sahaj), subject to eligibility checks",
            "note": "If not eligible for ITR-1, use ITR-2; if business/professional income exists, use ITR-3/ITR-4 as applicable.",
        }

    base["key_conditions"] = [
        "ITR-1 is for resident individuals (other than RNOR) with eligible income heads and total income up to Rs 50 lakh.",
        "ITR-1/ITR-4 disallow cases include director status, unlisted shares, foreign assets/income, specified capital gains, or brought-forward losses.",
        "In non-business cases, regime option can generally be changed each year while filing ITR within due date.",
    ]

    if not resident:
        base["itr_guidance"]["resident_warning"] = (
            "Resident condition not met. ITR-1/ITR-4 eligibility may not apply."
            if not h
            else "Resident condition meet nahi hoti, isliye ITR-1/ITR-4 eligibility apply nahi hogi."
        )

    if not is_within_50l:
        base["itr_guidance"]["income_warning"] = (
            "Total income above Rs 50 lakh generally makes ITR-1/ITR-4 inapplicable."
            if not h
            else "Total income Rs 50 lakh se upar hone par ITR-1/ITR-4 generally applicable nahi hota."
        )

    if h:
        base["key_conditions"] = [
            "ITR-1 sirf resident individual (RNOR ke alawa), eligible income heads aur Rs 50 lakh tak income ke liye hota hai.",
            "Director status, unlisted shares, foreign assets/income, certain capital gains ya carried-forward loss cases me ITR-1/ITR-4 allowed nahi hota.",
            "Non-business case me regime choice har saal ITR filing ke time change ki ja sakti hai (due date ke andar).",
        ]

    return base


def _exact_itr_recommendation(
    gross_income: float,
    resident: bool,
    has_business_income: bool,
    is_presumptive_income: bool,
    is_director: bool,
    has_unlisted_shares: bool,
    has_foreign_assets_or_income: bool,
    has_capital_gains: bool,
    has_brought_forward_loss: bool,
) -> Dict[str, str]:
    itr1_blockers = any(
        [
            not resident,
            gross_income > 5000000,
            has_business_income,
            is_director,
            has_unlisted_shares,
            has_foreign_assets_or_income,
            has_capital_gains,
            has_brought_forward_loss,
        ]
    )
    if not itr1_blockers:
        return {"recommended_itr": "ITR-1", "reason": "Resident individual, <= Rs 50 lakh, and no common ITR-1 disqualifiers flagged."}

    if has_business_income:
        if is_presumptive_income and resident and gross_income <= 5000000 and not any(
            [is_director, has_unlisted_shares, has_foreign_assets_or_income, has_brought_forward_loss]
        ):
            return {"recommended_itr": "ITR-4", "reason": "Business/professional presumptive income case appears eligible for ITR-4 (subject to final portal validation)."}
        return {"recommended_itr": "ITR-3", "reason": "Business/professional income present; ITR-3 is generally applicable when ITR-4 conditions are not fully met."}

    return {"recommended_itr": "ITR-2", "reason": "Non-business case not eligible for ITR-1 due to one or more disqualifying conditions."}


def _investment_suggestions(gross_income: float, language: str) -> List[Dict[str, Any]]:
    suggested_equity = round(max(2000.0, gross_income * 0.10), 0)
    suggested_debt = round(max(2000.0, gross_income * 0.08), 0)
    h = _is_hinglish(language)
    return [
        {
            "title": "Employer NPS (Section 80CCD(2))",
            "tax_relevance": "New regime me tax-efficient hai agar employer contribute kare." if h else "Tax-efficient in new regime if employer contributes.",
            "suggested_annual_amount": None,
            "description": "Employer se CTC ka ek part NPS employer contribution ke form me structure karvao. Ye new regime me allowed hai (limits ke saath)." if h else "Ask employer to structure part of CTC as employer NPS contribution. This remains allowed under new regime (subject to limits).",
        },
        {
            "title": "Equity Mutual Fund SIP",
            "tax_relevance": "Mainly wealth creation; new regime me 80C deduction nahi milta." if h else "Primarily wealth creation; no 80C deduction in new regime.",
            "suggested_annual_amount": suggested_equity,
            "description": "Long-term growth aur inflation beat karne ke liye diversified index/flexi-cap SIP use karo." if h else "Use diversified index/flexi-cap SIP for long-term growth and inflation-beating returns.",
        },
        {
            "title": "PPF / VPF / Debt Allocation",
            "tax_relevance": "Stability ke liye achha; deduction benefit regime/product pe depend karta hai." if h else "Primarily stability; deduction benefits vary by regime/product setup.",
            "suggested_annual_amount": suggested_debt,
            "description": "3-5 saal ke goals aur emergency backup ke liye low-risk debt bucket rakho." if h else "Maintain a low-risk debt bucket for goals within 3-5 years and emergency backup.",
        },
        {
            "title": "Term + Health Insurance Cover",
            "tax_relevance": "Pehle risk protection; sirf tax ke liye policy mat lo." if h else "Risk protection first; do not buy purely for tax reasons.",
            "suggested_annual_amount": None,
            "description": "Aggressive investment badhane se pehle adequate term aur health cover ensure karo." if h else "Ensure adequate term and health cover before increasing aggressive investments.",
        },
    ]


def _slab_playbook(taxable_income: float, language: str) -> Dict[str, Any]:
    h = _is_hinglish(language)
    if taxable_income <= 1200000:
        return {
            "band": "12L tak taxable income" if h else "Up to 12L taxable income",
            "focus": "Rebate-safe planning, emergency fund aur disciplined SIP start." if h else "Rebate-safe planning, emergency fund, and disciplined SIP start.",
            "invest_ratio_rule": "Net income ka kam se kam 20% save/invest karo." if h else "Save/invest at least 20% of net income.",
            "suggested_split_rule": "50/30/20 (Needs/Wants/Investments).",
        }
    if taxable_income <= 1600000:
        return {
            "band": "12L to 16L taxable income",
            "focus": "Control lifestyle inflation and optimize employer NPS structure.",
            "invest_ratio_rule": "Save/invest 20-25% of net income.",
            "suggested_split_rule": "50/25/25 (Needs/Wants/Investments).",
        }
    if taxable_income <= 2400000:
        return {
            "band": "16L to 24L taxable income",
            "focus": "Tax-efficient compounding through long-term equity + debt balance.",
            "invest_ratio_rule": "Save/invest 25-35% of net income.",
            "suggested_split_rule": "45/20/35 (Needs/Wants/Investments).",
        }
    return {
        "band": "Above 24L taxable income",
        "focus": "Advanced allocation, annual tax review, and goal-based buckets.",
        "invest_ratio_rule": "Save/invest 35%+ of net income.",
        "suggested_split_rule": "45/15/40 (Needs/Wants/Investments).",
    }


def _money_saving_rules(language: str) -> List[Dict[str, str]]:
    h = _is_hinglish(language)
    if not h:
        return [
            {"rule": "Auto-save first", "how": "Set fixed auto-transfer to SIP and emergency fund on salary day."},
            {"rule": "30-day purchase rule", "how": "Wait 30 days before non-essential purchases to reduce impulse spend."},
            {"rule": "High-interest debt first", "how": "Close loans/cards with 12%+ interest on priority."},
            {"rule": "Increment investing rule", "how": "Invest at least 50% of every salary increment."},
            {"rule": "Annual expense audit", "how": "Review subscriptions, food delivery and EMI stack quarterly."},
        ]
    return [
        {"rule": "Auto-save first", "how": "Salary day par fixed auto-transfer SIP + emergency fund me."},
        {"rule": "30-day purchase rule", "how": "Non-essential kharche par 30 din wait, impulse spending reduce."},
        {"rule": "High-interest debt first", "how": "12%+ interest loans/cards ko priority se close karo."},
        {"rule": "Increment investing rule", "how": "Har increment ka kam se kam 50% invest karo."},
        {"rule": "Annual expense audit", "how": "Subscriptions, food delivery, EMI stack quarter-wise review karo."},
    ]


def _claim_checklist_new_regime(is_salaried: bool, resident: bool, language: str) -> List[Dict[str, str]]:
    h = _is_hinglish(language)
    checklist = [
        {"step": "Documents collect karo" if h else "Collect documents", "details": "Form 16, AIS/TIS, bank/interest/capital-gain statements."},
        {"step": "Regime select karo" if h else "Select regime", "details": "ITR filing me New Regime select/confirm karo." if h else "Select/confirm New Regime in ITR filing."},
    ]
    if is_salaried:
        checklist.append(
            {"step": "Claim standard deduction", "details": "Salary income par up to Rs 75,000 standard deduction verify karo."}
        )
    if resident:
        checklist.append(
            {"step": "Verify rebate 87A", "details": "Eligible ho to rebate auto-calc check karo (special-rate income excluded)."}
        )
    checklist.extend(
        [
            {"step": "Check employer NPS", "details": "Agar employer NPS contribution hai to 80CCD(2) eligibility verify karo."},
            {"step": "Validate tax and cess", "details": "Final tax + 4% cess compute cross-check karo before submit."},
            {"step": "File and e-verify", "details": "ITR submit karke Aadhaar OTP/net banking se e-verify complete karo."},
        ]
    )
    return checklist


async def generate_tax_insights(
    income: float,
    resident: bool = True,
    is_salaried: bool = True,
    language: str = "english",
    user_type: str = "salaried",
    is_director: bool = False,
    has_unlisted_shares: bool = False,
    has_foreign_assets_or_income: bool = False,
    has_capital_gains: bool = False,
    has_brought_forward_loss: bool = False,
    has_business_income: bool = False,
    is_presumptive_income: bool = False,
):
    gross_income = max(0.0, float(income))
    std_deduction = min(STANDARD_DEDUCTION_NEW_REGIME, gross_income) if is_salaried else 0.0
    taxable_income = max(0.0, gross_income - std_deduction)

    base_tax = _compute_base_tax_new_regime(taxable_income)
    rebate_87a = _rebate_87a_with_marginal_relief(taxable_income, base_tax, resident)
    tax_after_rebate = max(0.0, base_tax - rebate_87a)
    cess = tax_after_rebate * HEALTH_EDU_CESS_RATE
    total_tax_payable = tax_after_rebate + cess
    itr_exact = _exact_itr_recommendation(
        gross_income=gross_income,
        resident=resident,
        has_business_income=has_business_income,
        is_presumptive_income=is_presumptive_income,
        is_director=is_director,
        has_unlisted_shares=has_unlisted_shares,
        has_foreign_assets_or_income=has_foreign_assets_or_income,
        has_capital_gains=has_capital_gains,
        has_brought_forward_loss=has_brought_forward_loss,
    )

    return {
        "law_reference": AY_LABEL,
        "regime": REGIME_LABEL,
        "inputs": {
            "gross_income": round(gross_income, 2),
            "resident": resident,
            "is_salaried": is_salaried,
            "language": "hinglish" if _is_hinglish(language) else "english",
            "user_type": user_type,
            "is_director": is_director,
            "has_unlisted_shares": has_unlisted_shares,
            "has_foreign_assets_or_income": has_foreign_assets_or_income,
            "has_capital_gains": has_capital_gains,
            "has_brought_forward_loss": has_brought_forward_loss,
            "has_business_income": has_business_income,
            "is_presumptive_income": is_presumptive_income,
        },
        "calculation": {
            "standard_deduction": round(std_deduction, 2),
            "taxable_income": round(taxable_income, 2),
            "marginal_tax_slab": _marginal_rate_label(taxable_income),
            "tax_before_rebate": round(base_tax, 2),
            "rebate_87a": round(rebate_87a, 2),
            "tax_after_rebate": round(tax_after_rebate, 2),
            "health_education_cess_4_percent": round(cess, 2),
            "total_estimated_tax": round(total_tax_payable, 2),
        },
        "investment_suggestions": _investment_suggestions(gross_income, language),
        "slab_playbook": _slab_playbook(taxable_income, language),
        "money_saving_rules": _money_saving_rules(language),
        "claim_checklist": _claim_checklist_new_regime(is_salaried, resident, language),
        "filing_guidance": _filing_guidance(user_type, resident, gross_income, language),
        "itr_recommendation": itr_exact,
        "notes": [
            "Estimate assumes normal slab income only; special-rate income (for example certain capital gains) is excluded.",
            "Rebate under section 87A applies to resident individuals and is not available against special-rate income.",
            "Under new regime, most Chapter VI-A deductions are not available except specified items such as employer NPS contribution under section 80CCD(2).",
        ],
    }

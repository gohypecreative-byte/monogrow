"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Package, Ship, SlidersHorizontal, Download, MessageCircle } from "lucide-react";
import { calculateTradeEstimate } from "./tradeEstimate";
import styles from "./WholesaleCalculator.module.css";
import EstimateShowcase from "./EstimateShowcase";

const PRODUCTS = [
  {
    label: "Rice",
    image: "rice",
    rate: 1050,
    varieties: [
      "Premium Basmati Steam Rice",
      "Classic Basmati Steam Rice",
      "Rozana Basmati Steam Rice",
      "Premium Basmati Sella Rice",
      "Classic Basmati Sella Rice",
      "Rozana Basmati Sella Rice",
      "Premium Sona Masoori Rice",
      "Rozana Sona Masoori Rice",
    ],
    processes: ["Steam", "Golden Sella", "White / Creamy Sella", "Parboiled"],
    grades: ["Premium Category (8.35mm)", "Classic Category (8.40mm)", "Rozana Category (7.65mm)", "Export Grade 100% Sortex"],
  },
  {
    label: "Dry Fruits",
    image: "dryfruit",
    rate: 6500,
    varieties: [
      "Royal Mixed Dry Fruits (4-in-1)",
      "Royal King Cashews W240",
      "California Select Royal Almonds",
      "Kashmiri Snow White Walnuts",
      "Roasted Salted Jumbo Pistachios",
      "Golden Long Seedless Raisins",
    ],
    processes: ["Raw / Natural", "Roasted & Lightly Salted", "Slow Sun-Dried", "Hand-Sorted / Shelled"],
    grades: ["Royal Select Grade", "W240 Whole Jumbo", "California Nonpareil Extra No. 1", "Snow White Halves (100% Light)"],
  },
  {
    label: "Sugar",
    image: "sugar",
    rate: 550,
    varieties: [
      "Pure Refined Sugar (ICUMSA 45)",
      "Natural Brown Cane Sugar",
    ],
    processes: ["Crystalline Refined", "Centrifuged Natural", "Dry Granulated", "Direct Cane Extraction"],
    grades: ["ICUMSA 45 (Ultra Purity)", "ICUMSA 100 (Commercial Refined)", "ICUMSA 600-1200 (Brown Cane)", "VHP Export Grade"],
  },
  {
    label: "Coffee",
    image: "coffee",
    rate: 4200,
    varieties: [
      "Specialty Estate Dark Arabica",
      "Monagrow Premium Roasted Coffee Beans",
      "Highland Monsooned Malabar AA",
      "Himalayan Peaberry Reserve Arabica",
    ],
    processes: ["Whole bean", "Ground (Espresso / Filter)", "Green bean (Unroasted)", "Monsooned Cured", "Washed / Sun-Dried"],
    grades: ["Estate selection", "Screen 18/19 AA Grade", "Specialty Micro-Lot (85+ Cup)", "Commercial Export Grade"],
  },
];

export const CURRENCIES = [
  { code: "NPR", label: "NPR · Nepalese Rupee", country: "Nepal", name: "Nepalese Rupee", rate: 135 },
  { code: "INR", label: "INR · Indian Rupee", country: "India", name: "Indian Rupee", rate: 84 },
  { code: "USD", label: "USD · US Dollar", country: "United States / Global", name: "US Dollar", rate: 1 },
  { code: "AED", label: "AED · UAE Dirham", country: "United Arab Emirates", name: "UAE Dirham", rate: 3.6725 },
  { code: "SAR", label: "SAR · Saudi Riyal", country: "Saudi Arabia", name: "Saudi Riyal", rate: 3.75 },
  { code: "EUR", label: "EUR · Euro", country: "European Union", name: "Euro", rate: 0.92 },
  { code: "GBP", label: "GBP · British Pound", country: "United Kingdom", name: "British Pound", rate: 0.79 },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

const CURRENCY_RATES: Record<CurrencyCode, number> = {
  NPR: 135,
  INR: 84,
  USD: 1,
  AED: 3.6725,
  SAR: 3.75,
  EUR: 0.92,
  GBP: 0.79,
};

const DESTINATIONS = [
  { country: "Nepal", port: "Birgunj Dry Port", currency: "NPR" as CurrencyCode },
  { country: "India", port: "Mundra", currency: "INR" as CurrencyCode },
  { country: "United States", port: "New York / Newark", currency: "USD" as CurrencyCode },
  { country: "United Arab Emirates", port: "Jebel Ali", currency: "AED" as CurrencyCode },
  { country: "Saudi Arabia", port: "Jeddah", currency: "SAR" as CurrencyCode },
  { country: "Netherlands", port: "Rotterdam", currency: "EUR" as CurrencyCode },
  { country: "United Kingdom", port: "Felixstowe", currency: "GBP" as CurrencyCode },
];

const PACKS = [
  { kg: 5, label: "Retail pouch", cost: 0.3 },
  { kg: 10, label: "Laminated bag", cost: 0.35 },
  { kg: 20, label: "PP woven bag", cost: 0.45 },
  { kg: 50, label: "Bulk woven bag", cost: 0.7 },
];

const QUOTE_NAMES = [
  "Premium Basmati Steam Rice",
  "Royal Mixed Dry Fruits",
  "Refined Sugar (ICUMSA 45)",
  "Specialty Estate Coffee",
];

const money = (n: number, curr: CurrencyCode) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: curr,
    currencyDisplay: "code",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

const number = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

export default function WholesaleCalculator({ onOpenQuoteModal }: { onOpenQuoteModal: (details?: string) => void }) {
  const [retail, setRetail] = useState(false);
  const [step, setStep] = useState(0);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const steps = retail ? [0, 1, 3, 4] : [0, 1, 2, 3, 4];
  const stepNames = ["Product", "Quantity", "Delivery", "Rates", "Estimate"];
  const stepTitles = ["Start with your product", "How much do you need?", "Where is your order going?", "Review your planning rates", "Your estimate is ready"];
  const stepIndex = steps.indexOf(step);
  const [productIndex, setProductIndex] = useState(0);
  const [productChosen, setProductChosen] = useState(false);
  const product = PRODUCTS[productIndex];
  const [variety, setVariety] = useState(PRODUCTS[0].varieties[0]);
  const [processing, setProcessing] = useState(PRODUCTS[0].processes[0]);
  const [grade, setGrade] = useState(PRODUCTS[0].grades[0]);
  const [origin, setOrigin] = useState("India");
  const [quantity, setQuantity] = useState("25");
  const [unit, setUnit] = useState("mt");
  const [packIndex, setPackIndex] = useState(2);
  const pack = PACKS[packIndex];

  const defaultDestIndex = DESTINATIONS.findIndex((d) => d.country === "United States");
  const [destination, setDestination] = useState(defaultDestIndex >= 0 ? defaultDestIndex : 0);
  const [port, setPort] = useState(DESTINATIONS[defaultDestIndex >= 0 ? defaultDestIndex : 0].port);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [shipping, setShipping] = useState<"sea" | "air">("sea");
  const [incoterm, setIncoterm] = useState("CIF");
  const [rates, setRates] = useState({
    rate: "1050",
    freight: "1600",
    inland: "20",
    handling: "30",
    insurance: "0.3",
    duty: "0",
    tax: "0",
    other: "0",
  });
  const [exportError, setExportError] = useState("");

  const currentCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[2];
  const packCost = pack.cost * CURRENCY_RATES[currency];

  const amount = Number(quantity);
  const maxQuantity = unit === "mt" ? 200 : unit === "bags" ? 200000 / pack.kg : 200000;
  const validQuantity = quantity !== "" && Number.isFinite(amount) && amount > 0 && amount <= maxQuantity && (unit !== "bags" || Number.isInteger(amount));
  const validRates = Object.entries(rates).filter(([key]) => !retail || ["rate", "freight", "tax", "other"].includes(key)).every(([key, value]) => {
    const num = Number(value);
    return value !== "" && Number.isFinite(num) && num >= 0 && num <= (["insurance", "duty", "tax"].includes(key) ? 100 : 100000000);
  });
  const valid = validQuantity && validRates;
  const kg = validQuantity ? amount * (unit === "mt" ? 1000 : unit === "bags" ? pack.kg : 1) : 0;
  const estimate = calculateTradeEstimate({
    kg,
    bagKg: pack.kg,
    bagCost: packCost,
    shipping,
    retail,
    rate: Number(rates.rate),
    inland: Number(rates.inland),
    handling: Number(rates.handling),
    freight: Number(rates.freight),
    insurance: Number(rates.insurance),
    duty: Number(rates.duty),
    tax: Number(rates.tax),
    other: Number(rates.other),
  });
  const basis = incoterm === "EXW" ? estimate.exw : incoterm === "FOB" ? estimate.fob : incoterm === "CFR" ? estimate.cfr : estimate.cif;
  const rows: [string, number][] = [["Commodity", estimate.commodity], ["Packaging", estimate.packaging]];
  if (!retail) rows.push(["Inland transport", estimate.inland], ["Origin handling", estimate.handling]);
  rows.push([retail ? "Local delivery" : shipping === "sea" ? "Sea freight" : "Air freight", estimate.freight]);
  if (!retail) rows.push(["Cargo insurance", estimate.insurance], ["Import duty (assumed)", estimate.duty]);
  rows.push(["Tax (assumed)", estimate.tax], ["Other charges", estimate.other]);

  const rateFields: [keyof typeof rates, string][] = [
    ["rate", `Commodity / MT (${currency})`],
    ["freight", retail ? `Delivery / order (${currency})` : shipping === "sea" ? `Freight / 20ft container (${currency})` : `Air freight / kg (${currency})`],
  ];
  if (!retail) {
    rateFields.push(
      ["inland", `Inland transport / MT (${currency})`],
      ["handling", `Origin handling / MT (${currency})`],
      ["insurance", "Insurance %"],
      ["duty", "Import duty %"]
    );
  }
  rateFields.push(
    ["tax", retail ? "Sales tax %" : "Import tax %"],
    ["other", `Other charges (${currency})`]
  );

  const summary = [
    "MONAGROW — ILLUSTRATIVE TRADE ESTIMATE",
    `All amounts in ${currency} (${currentCurrencyObj.name} · ${currentCurrencyObj.country}). Not an official quotation.`,
    "",
    `${product.label} / ${variety} / ${processing} / ${grade}`,
    `Origin preference: ${origin}`,
    `Quantity: ${number(kg)} kg · ${number(estimate.bags)} × ${pack.kg} kg bags`,
    `Packaging: ${pack.label} (${money(packCost, currency)} / bag)`,
    retail ? "Retail planning / local delivery" : `Destination: ${DESTINATIONS[destination].country}, ${port} · ${shipping} freight · ${incoterm}`,
    "ASSUMPTIONS",
    ...rateFields.map(([key, label]) => `${label}: ${rates[key]}`),
    "",
    "COST BREAKDOWN",
    ...rows.map(([label, value]) => `${label}: ${money(value, currency)}`),
    ...(!retail ? [`${incoterm} planning subtotal: ${money(basis, currency)}`] : []),
    "",
    `Estimated ${retail ? "delivered" : "landed"} total: ${money(estimate.total, currency)}`,
    `Per MT: ${money(estimate.perMt, currency)} / MT · Per kg: ${money(estimate.perKg, currency)} / kg`,
    "",
    "Sample assumptions only. Specifications, origin and destination do not automatically update rates. Confirm prices, taxes, freight and availability with the trade desk.",
  ].join("\n");

  function handleCurrencyChange(nextCurrency: CurrencyCode) {
    if (nextCurrency === currency) return;
    const ratio = CURRENCY_RATES[nextCurrency] / CURRENCY_RATES[currency];
    setCurrency(nextCurrency);
    setRates((previous) => {
      const convertVal = (val: string) => {
        const num = Number(val);
        if (!Number.isFinite(num) || num <= 0) return val;
        const converted = num * ratio;
        return converted >= 100 ? String(Math.round(converted)) : String(Number(converted.toFixed(2)));
      };
      return {
        rate: convertVal(previous.rate),
        freight: convertVal(previous.freight),
        inland: convertVal(previous.inland),
        handling: convertVal(previous.handling),
        insurance: previous.insurance,
        duty: previous.duty,
        tax: previous.tax,
        other: convertVal(previous.other),
      };
    });
  }

  function handleDestinationChange(index: number) {
    setDestination(index);
    setPort(DESTINATIONS[index].port);
    const destCurr = DESTINATIONS[index].currency;
    if (destCurr && destCurr !== currency) {
      handleCurrencyChange(destCurr);
    }
  }

  function changeProduct(index: number) {
    setProductChosen(true);
    const next = PRODUCTS[index];
    setProductIndex(index);
    setVariety(next.varieties[0]);
    setProcessing(next.processes[0]);
    setGrade(next.grades[0]);
    const productRateInCurrency = Math.round(next.rate * CURRENCY_RATES[currency]);
    setRates((previous) => ({ ...previous, rate: String(productRateInCurrency) }));
  }

  function goToStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      stepHeading.current?.focus({ preventScroll: true });
      stepHeading.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
  }

  const canContinue = step === 1 ? validQuantity : step === 2 ? port.trim().length > 0 : step === 3 ? valid : true;

  function changeUnit(next: string) {
    setQuantity(String(next === "mt" ? kg / 1000 : next === "bags" ? Math.ceil(kg / pack.kg) : kg));
    setUnit(next);
  }

  function printEstimate() {
    const popup = window.open("", "_blank", "width=850,height=900");
    if (!popup) {
      setExportError("Allow pop-ups to open the printable estimate, then choose Save as PDF.");
      return;
    }
    setExportError("");
    popup.opener = null;
    popup.document.title = `Monagrow trade estimate (${currency})`;
    const style = popup.document.createElement("style");
    style.textContent =
      "body{padding:40px;color:#30241e;font-family:Arial,sans-serif}h1{color:#740707;font-size:26px}pre{white-space:pre-wrap;font:14px/1.7 Arial,sans-serif}button{padding:12px 20px;margin-bottom:24px;cursor:pointer}@media print{button{display:none}body{padding:0}}";
    popup.document.head.append(style);
    const title = popup.document.createElement("h1");
    title.textContent = `Your trade estimate (${currency})`;
    const content = popup.document.createElement("pre");
    content.textContent = summary;
    const button = popup.document.createElement("button");
    button.textContent = "Print / Save as PDF";
    button.onclick = () => popup.print();
    popup.document.body.append(title, button, content);
    popup.focus();
    popup.print();
  }

  return (
    <section id="calculator" className={styles.section} aria-labelledby="estimate-heading">
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <EstimateShowcase selectedProduct={productChosen ? product.image : null} />
          <div className={styles.layout}>
            <nav className={styles.stepper} aria-label="Estimator progress">
              <ol>
                {steps.map((value, index) => (
                  <li key={value}>
                    <button
                      type="button"
                      disabled={index > stepIndex}
                      aria-current={step === value ? "step" : undefined}
                      onClick={() => goToStep(value)}
                    >
                      <span>{index < stepIndex ? <Check size={14} /> : index + 1}</span>
                      {stepNames[value]}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={styles.stepIntro}>
              <p className={styles.kicker}>
                Step {stepIndex + 1} of {steps.length} · {retail ? "Retail" : "Wholesale"}
              </p>
              <h3 ref={stepHeading} tabIndex={-1}>
                {stepTitles[step]}
              </h3>
            </div>
            <div id="estimate-inputs" className={styles.inputs}>
              <fieldset hidden={step !== 0} className={styles.group}>
                <legend>Choose your commodity</legend>
                <div className={styles.products}>
                  {PRODUCTS.map((item, index) => (
                    <button
                      key={item.image}
                      type="button"
                      aria-pressed={productIndex === index}
                      onClick={() => changeProduct(index)}
                    >
                      <Image src={`/assets/hero-center-${item.image}.png`} alt="" width={90} height={90} sizes="90px" />
                      <span>{item.label}</span>
                      {productIndex === index && <Check size={14} className={styles.check} />}
                    </button>
                  ))}
                </div>
                <div className={styles.fields}>
                  <label>
                    Variety
                    <select value={variety} onChange={(event) => setVariety(event.target.value)}>
                      {product.varieties.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Processing
                    <select value={processing} onChange={(event) => setProcessing(event.target.value)}>
                      {product.processes.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Origin preference
                    <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
                      {["India", "Pakistan", "Nepal", "Other / discuss with us"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Grade
                    <select value={grade} onChange={(event) => setGrade(event.target.value)}>
                      {product.grades.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className={styles.hint}>Specifications are preferences for your enquiry, subject to availability.</p>
              </fieldset>

              <fieldset hidden={step !== 1} className={styles.group}>
                <legend>Quantity & packaging</legend>
                <div className={styles.fields}>
                  <label>
                    Order quantity
                    <input
                      type="number"
                      min={unit === "bags" ? 1 : 0.001}
                      max={maxQuantity}
                      step={unit === "bags" ? 1 : "any"}
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      aria-invalid={!validQuantity}
                      aria-describedby={!validQuantity ? "quantity-error" : undefined}
                    />
                  </label>
                  <label>
                    Measure in
                    <select value={unit} onChange={(event) => changeUnit(event.target.value)}>
                      <option value="mt">Metric tonnes (MT)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="bags">Number of bags</option>
                    </select>
                  </label>
                </div>
                {!validQuantity && (
                  <p id="quantity-error" className={styles.error}>
                    Enter a positive quantity up to 200 MT. Bag quantities must be whole numbers.
                  </p>
                )}
                {!retail && (
                  <label className={styles.rangeLabel}>
                    Adjust quantity <span>{number(kg / 1000)} MT</span>
                    <input
                      aria-label="Quantity in metric tonnes"
                      type="range"
                      min="1"
                      max="200"
                      step="1"
                      value={Math.max(1, kg / 1000)}
                      onChange={(event) => {
                        setUnit("mt");
                        setQuantity(event.target.value);
                      }}
                    />
                  </label>
                )}
                <div className={styles.packages} role="group" aria-label="Bag size">
                  {PACKS.map((item, index) => (
                    <button
                      key={item.kg}
                      type="button"
                      aria-pressed={packIndex === index}
                      onClick={() => setPackIndex(index)}
                    >
                      <Package size={19} />
                      <strong>{item.kg} kg</strong>
                      <small>{item.label}</small>
                    </button>
                  ))}
                </div>
                <p className={styles.hint}>
                  {number(estimate.bags)} bags at {pack.kg} kg each.{" "}
                  {kg % pack.kg !== 0
                    ? "The final bag is partially filled; packaging is rounded up."
                    : "Packaging is included in the estimate."}
                </p>
              </fieldset>

              {!retail && (
                <fieldset hidden={step !== 2} className={styles.group}>
                  <legend>Destination & delivery</legend>
                  <div className={styles.fields}>
                    <label>
                      Destination country
                      <select
                        value={destination}
                        onChange={(event) => handleDestinationChange(Number(event.target.value))}
                      >
                        {DESTINATIONS.map((item, index) => (
                          <option key={item.country} value={index}>
                            {item.country} ({item.currency})
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {shipping === "sea" ? "Destination port" : "Delivery location"}
                      <input
                        required
                        aria-invalid={!port.trim()}
                        value={port}
                        onChange={(event) => setPort(event.target.value)}
                        placeholder="Port or delivery location"
                      />
                    </label>
                    <label>
                      Shipping mode
                      <select
                        value={shipping}
                        onChange={(event) => {
                          const value = event.target.value as "sea" | "air";
                          setShipping(value);
                          const baseFreight = value === "sea" ? 1600 : 4;
                          const freightInCurr =
                            value === "sea"
                              ? String(Math.round(baseFreight * CURRENCY_RATES[currency]))
                              : String(Number((baseFreight * CURRENCY_RATES[currency]).toFixed(2)));
                          setRates((previous) => ({ ...previous, freight: freightInCurr }));
                          if (value === "air") setIncoterm("EXW");
                        }}
                      >
                        <option value="sea">Sea freight</option>
                        <option value="air">Air freight</option>
                      </select>
                    </label>
                    <label>
                      Quotation basis
                      <select value={incoterm} onChange={(event) => setIncoterm(event.target.value)}>
                        <option value="EXW">EXW · Ex works</option>
                        {shipping === "sea" && (
                          <>
                            <option value="FOB">FOB · Free on board</option>
                            <option value="CFR">CFR · Cost & freight</option>
                            <option value="CIF">CIF · Cost, insurance & freight</option>
                          </>
                        )}
                      </select>
                    </label>
                  </div>
                  {!port.trim() && <p className={styles.error}>Enter a destination port or delivery location to continue.</p>}
                  <p className={styles.hint}>
                    Changing the destination configures default regional routing and currency. Review planning rates in the next step.
                  </p>
                </fieldset>
              )}

              <div hidden={step !== 3} className={styles.assumptions}>
                <div className={styles.assumptionsHead}>
                  <div className={styles.assumptionsTitle}>
                    <SlidersHorizontal size={17} />
                    <h4>Rate assumptions</h4>
                    <span className={styles.currencyInfoTag}>{currency}</span>
                  </div>
                  <div className={styles.currencySelector}>
                    <span className={styles.currencyLabel}>Currency:</span>
                    <div className={styles.currencyPills} role="radiogroup" aria-label="Quotation currency">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          role="radio"
                          aria-checked={currency === c.code}
                          className={`${styles.currencyBtn} ${currency === c.code ? styles.currencyBtnActive : ""}`}
                          onClick={() => handleCurrencyChange(c.code)}
                          title={`${c.code} · ${c.country} (${c.name})`}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p>
                  Sample inputs for planning in <strong>{currency}</strong> ({currentCurrencyObj.country} · {currentCurrencyObj.name}). Edit with your supplier or freight partner&apos;s rates. Duty and tax start at 0% and need confirmation.
                </p>
                <div className={styles.fields}>
                  {rateFields.map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <input
                        type="number"
                        min="0"
                        max={["insurance", "duty", "tax"].includes(key) ? 100 : 100000000}
                        step="any"
                        value={rates[key]}
                        onChange={(event) => setRates((previous) => ({ ...previous, [key]: event.target.value }))}
                      />
                    </label>
                  ))}
                </div>
                {!validRates && (
                  <p className={styles.error}>
                    Enter non-negative rates up to 100,000,000. Percentages must be between 0 and 100.
                  </p>
                )}
                <p>
                  Packaging: {money(packCost, currency)} / bag.{" "}
                  {retail
                    ? "Retail uses the same sample commodity rate; retail margins are not included."
                    : "Insurance applies to goods plus freight. Tax applies to CIF plus duty. Actual assessment rules may differ."}
                </p>
              </div>
            </div>

            {step === 4 && (
              <aside className={styles.result} aria-labelledby="estimate-result-heading">
                <div className={styles.resultTop}>
                  <span className={styles.kicker}>Your planning estimate</span>
                  <span className={styles.badge}>Illustrative · {currency}</span>
                </div>
                <h3 id="estimate-result-heading">
                  {product.label}
                  <span>
                    {variety} · {grade}
                  </span>
                </h3>
                <div className={styles.metrics}>
                  <div>
                    <small>Total quantity</small>
                    <strong>
                      {number(estimate.mt)} <span>MT</span>
                    </strong>
                    <small>{number(kg)} kg</small>
                  </div>
                  <div>
                    <small>{pack.kg} kg bags</small>
                    <strong>{number(estimate.bags)}</strong>
                    <small>{pack.label}</small>
                  </div>
                </div>
                <div className={styles.route}>
                  <Ship size={19} />
                  <div>
                    {retail
                      ? "Local delivery estimate"
                      : shipping === "sea"
                        ? `${estimate.containers} × 20ft container${estimate.containers === 1 ? "" : "s"} (approx.)`
                        : "Air cargo estimate"}
                    <small>
                      {retail
                        ? "Delivery and tax assumptions shown below"
                        : `${origin} → ${DESTINATIONS[destination].country} · ${port || "Location to confirm"}`}
                    </small>
                  </div>
                </div>
                <div className={styles.breakdown}>
                  <div className={styles.breakdownHead}>
                    <h4>
                      Cost breakdown <span>{currency}</span>
                    </h4>
                    <div className={styles.currencyPillsSmall} role="radiogroup" aria-label="Toggle quotation currency">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          role="radio"
                          aria-checked={currency === c.code}
                          className={`${styles.currencyBtnSmall} ${currency === c.code ? styles.currencyBtnSmallActive : ""}`}
                          onClick={() => handleCurrencyChange(c.code)}
                          title={`${c.code} · ${c.country}`}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                  <dl>
                    {rows.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{money(value, currency)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {!retail && (
                  <p className={styles.basis}>
                    {incoterm} planning subtotal <strong>{money(basis, currency)}</strong>
                    <small>The landed total also includes costs beyond this delivery term.</small>
                  </p>
                )}
                <div className={styles.total} aria-live="polite" aria-atomic="true">
                  <span>Estimated {retail ? "delivered" : "landed"} total</span>
                  <strong>{valid ? money(estimate.total, currency) : "—"}</strong>
                  <div>
                    <span>{money(estimate.perMt, currency)} / MT</span>
                    <span>{money(estimate.perKg, currency)} / kg</span>
                  </div>
                </div>
                <p className={styles.disclaimer}>
                  A planning guide in {currency}, not an official offer. Sample rates exclude unlisted charges and are not live market prices. Container capacity assumes 25 MT and must be checked against cargo dimensions and route limits.
                </p>
                <button
                  className={styles.primary}
                  type="button"
                  disabled={!valid}
                  onClick={() => onOpenQuoteModal(`${variety || QUOTE_NAMES[productIndex]} (${currency} Quotation)`)}
                >
                  Request an official quote <ArrowUpRight size={18} />
                </button>
                <div className={styles.actions}>
                  <button type="button" disabled={!valid} onClick={printEstimate}>
                    <Download size={16} /> Save as PDF ({currency})
                  </button>
                  <button
                    type="button"
                    disabled={!valid}
                    onClick={() =>
                      window.open(
                        `https://wa.me/9779801234567?text=${encodeURIComponent(summary)}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <MessageCircle size={16} /> WhatsApp enquiry
                  </button>
                </div>
                {exportError && <p role="alert" className={styles.error}>{exportError}</p>}
              </aside>
            )}

            <div className={styles.navigation}>
              <button
                type="button"
                className={styles.back}
                disabled={stepIndex === 0}
                onClick={() => goToStep(steps[stepIndex - 1])}
              >
                Back
              </button>
              {step !== 4 ? (
                <button
                  type="button"
                  className={styles.continue}
                  disabled={!canContinue}
                  onClick={() => goToStep(steps[stepIndex + 1])}
                >
                  {step === 3 ? "See my estimate" : `Continue to ${stepNames[steps[stepIndex + 1]].toLowerCase()}`}{" "}
                  <ArrowUpRight size={17} />
                </button>
              ) : (
                <button type="button" className={styles.back} onClick={() => goToStep(0)}>
                  Edit product details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

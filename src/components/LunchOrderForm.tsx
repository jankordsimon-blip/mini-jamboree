import React, { useMemo, useState } from "react";

type Props = {
  endpointUrl: string;
  paypalUrl: string;
};

type LunchOption = {
  id: string;
  label: string;
  category: string;
  price: string;
};

const lunchOptions: LunchOption[] = [
  // Veggie Rolls
  {
    id: "roll-veggie-hausmeisterin",
    label: "Roll · Vegetarian/Vegan · Hausmeisterin (Caretaker)",
    category: "Roll · Vegetarian/Vegan",
    price: "10.50 €",
  },
  {
    id: "roll-veggie-feuerwehrfrau",
    label: "Roll · Vegetarian/Vegan · Feuerwehrfrau (Firefighter)",
    category: "Roll · Vegetarian/Vegan",
    price: "10.50 €",
  },
  {
    id: "roll-veggie-langzeitstudent",
    label: "Roll · Vegetarian/Vegan · Langzeitstudent (Long-term student)",
    category: "Roll · Vegetarian/Vegan",
    price: "10.50 €",
  },
  {
    id: "roll-veggie-pilot",
    label: "Roll · Vegetarian/Vegan · Pilot (Pilot)",
    category: "Roll · Vegetarian/Vegan",
    price: "10.50 €",
  },

  // Meat Rolls
  {
    id: "roll-meat-hausmeisterin",
    label: "Roll · Meat · Hausmeisterin (Caretaker)",
    category: "Roll · Meat",
    price: "11.50 €",
  },
  {
    id: "roll-meat-feuerwehrfrau",
    label: "Roll · Meat · Feuerwehrfrau (Firefighter)",
    category: "Roll · Meat",
    price: "11.50 €",
  },
  {
    id: "roll-meat-langzeitstudent",
    label: "Roll · Meat · Langzeitstudent (Long-term student)",
    category: "Roll · Meat",
    price: "11.50 €",
  },
  {
    id: "roll-meat-pilot",
    label: "Roll · Meat · Pilot (Pilot)",
    category: "Roll · Meat",
    price: "11.50 €",
  },

  // Veggie Bowls
  {
    id: "bowl-veggie-gaertner",
    label: "Bowl · Vegetarian/Vegan · Gärtner (Gardener)",
    category: "Bowl · Vegetarian/Vegan",
    price: "13.50 €",
  },
  {
    id: "bowl-veggie-bademeisterin",
    label: "Bowl · Vegetarian/Vegan · Bademeisterin (Lifeguard)",
    category: "Bowl · Vegetarian/Vegan",
    price: "13.50 €",
  },
  {
    id: "bowl-veggie-matrose",
    label: "Bowl · Vegetarian/Vegan · Matrose (Sailor)",
    category: "Bowl · Vegetarian/Vegan",
    price: "13.50 €",
  },
  {
    id: "bowl-veggie-polizist",
    label: "Bowl · Vegetarian/Vegan · Polizist (Police officer)",
    category: "Bowl · Vegetarian/Vegan",
    price: "13.50 €",
  },
  {
    id: "bowl-veggie-influencer",
    label: "Bowl · Vegetarian/Vegan · Influencer (Influencer)",
    category: "Bowl · Vegetarian/Vegan",
    price: "13.50 €",
  },
  {
    id: "bowl-veggie-schreinerin",
    label: "Bowl · Vegetarian/Vegan · Schreinerin (Carpenter)",
    category: "Bowl · Vegetarian/Vegan",
    price: "13.50 €",
  },

  // Meat Bowls
  {
    id: "bowl-meat-bademeisterin",
    label: "Bowl · Meat · Bademeisterin (Lifeguard)",
    category: "Bowl · Meat",
    price: "14.50 €",
  },
  {
    id: "bowl-meat-lehrer",
    label: "Bowl · Meat · Lehrer (Teacher)",
    category: "Bowl · Meat",
    price: "14.50 €",
  },
  {
    id: "bowl-meat-polizist",
    label: "Bowl · Meat · Polizist (Police officer)",
    category: "Bowl · Meat",
    price: "14.50 €",
  },
  {
    id: "bowl-meat-schreinerin",
    label: "Bowl · Meat · Schreinerin (Carpenter)",
    category: "Bowl · Meat",
    price: "14.50 €",
  },
];

export default function LunchOrderForm({ endpointUrl, paypalUrl }: Props) {
  const [name, setName] = useState("");
  const [optionId, setOptionId] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedOption = useMemo(
    () => lunchOptions.find((option) => option.id === optionId),
    [optionId]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          optionId,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || `HTTP ${res.status}`);
      }

      let ok = true;

      try {
        const json = JSON.parse(text);
        ok = Boolean(json?.ok);
      } catch {
        ok = true;
      }

      if (!ok) {
        throw new Error(text);
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? String(err));
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/40">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
          Lunch order submitted
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
          Thanks! Your lunch order has been saved.
        </p>

        {selectedOption && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            <p className="font-semibold">Your selection</p>
            <p className="mt-1">{selectedOption.label}</p>
            <p className="mt-1 font-semibold">{selectedOption.price}</p>
          </div>
        )}

        <p className="mt-5 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
          Please transfer the corresponding amount via PayPal and use your full name as
          the payment note.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            className="btn btn-primary w-full !py-2.5 text-center sm:w-auto sm:!py-3"
            href={paypalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Pay via PayPal
          </a>

          <button
            className="btn btn-secondary w-full !py-2.5 text-center sm:w-auto sm:!py-3"
            type="button"
            onClick={() => {
              setName("");
              setOptionId("");
              setStatus("idle");
            }}
          >
            Submit another order
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
        Lunch order
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
        Please enter your full name and select one lunch option. Lunch orders are possible
        until July 7.
      </p>

      <div className="mt-6 grid gap-5">
        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Full name *
          </label>

          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:text-base dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Lunch option *
          </label>

          <select
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:text-base dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
            value={optionId}
            onChange={(e) => setOptionId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select your lunch option…
            </option>

            {lunchOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} · {option.price}
              </option>
            ))}
          </select>
        </div>

        {selectedOption && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            <p className="font-semibold">Selected option</p>
            <p className="mt-1">{selectedOption.label}</p>
            <p className="mt-1 font-semibold">Price: {selectedOption.price}</p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white">
            Payment
          </p>

          <p className="mt-1">
            After submitting your order, please transfer the corresponding amount via PayPal.
            Use your full name as the payment note.
          </p>

          <a
            className="mt-3 inline-flex text-sm font-semibold underline hover:text-slate-900 dark:hover:text-white"
            href={paypalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open PayPal pool
          </a>
        </div>

        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
            <div className="font-medium">Submission failed</div>
            <div className="mt-1 break-words">{errorMsg}</div>
          </div>
        )}

        <button
          className="btn btn-primary w-full !py-2.5 text-center disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:!py-3"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit lunch order"}
        </button>
      </div>
    </form>
  );
}
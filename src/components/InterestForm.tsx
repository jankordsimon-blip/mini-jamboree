import React, { useMemo, useState } from "react";

type Props = {
  endpointUrl: string;
  teams: string[];
};

export default function InterestForm({ endpointUrl, teams }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [teamNotListed, setTeamNotListed] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isNotListed = team === "Not listed";

  const teamOptions = useMemo(() => {
    const cleaned = teams.map((t) => t.trim()).filter(Boolean);
    const withoutNotListed = cleaned.filter((t) => t !== "Not listed");
    return [...withoutNotListed.sort((a, b) => a.localeCompare(b)), "Not listed"];
  }, [teams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const payload = {
        name,
        email,
        team,
        team_not_listed: isNotListed ? teamNotListed : "",
      };

      const res = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      let ok = false;

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
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">
          You're on the list!
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
          Thanks for your interest. We’ll notify you as soon as official registration opens.
        </p>

        <p className="mt-3 text-sm font-semibold leading-6 text-slate-900 sm:text-base dark:text-white">
          Important: Your participation is only confirmed after official registration via Indico.
          You will receive an email once registration opens.
        </p>

        <button
          className="btn btn-secondary mt-6 w-full text-center sm:w-auto"
          onClick={() => {
            setName("");
            setEmail("");
            setTeam("");
            setTeamNotListed("");
            setStatus("idle");
          }}
          type="button"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="grid gap-6">
        <div className="min-w-0">
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

        <div className="min-w-0">
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Email *
          </label>

          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:text-base dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="min-w-0">
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            iGEM Team *
          </label>

          <select
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:text-base dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a team…
            </option>

            {teamOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {isNotListed && (
          <div className="min-w-0">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              Your team/university, if not listed *
            </label>

            <input
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:text-base dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400"
              value={teamNotListed}
              onChange={(e) => setTeamNotListed(e.target.value)}
              required
            />
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
            <div className="font-medium">Submission failed</div>
            <div className="mt-1 break-words">{errorMsg}</div>
          </div>
        )}

        <button
          className="btn btn-primary w-full text-center disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit interest"}
        </button>

        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          By submitting, you agree that we store your details to contact you about this event.
        </p>
      </div>
    </form>
  );
}
import React, { useState } from "react";

type NewsItem = {
  date: string;
  title: string;
  text: string;
  image?: string;
  credit?: string;
};

type Props = {
  items: NewsItem[];
};

export default function NewsFeed({ items }: Props) {
  const [index, setIndex] = useState(0);

  if (!items.length) return null;

  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Latest updates
          </p>

          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            News & announcements
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
            Stay up to date with the latest information on registration, program,
            travel, and event logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => hasPrev && setIndex(index - 1)}
            disabled={!hasPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11 sm:text-xl dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            aria-label="Previous update"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => hasNext && setIndex(index + 1)}
            disabled={!hasNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11 sm:text-xl dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            aria-label="Next update"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900/40">
        {item.image && (
          <div className="relative h-52 w-full overflow-hidden sm:h-72 md:h-96">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />

            {item.credit && (
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/30 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
                Photo: {item.credit}
              </div>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6 md:p-8">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {item.date}
          </p>

          <h3 className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
            {item.title}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base sm:leading-7 dark:text-slate-300">
            {item.text}
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update {index + 1} of {items.length}
            </p>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === index
                      ? "bg-emerald-500"
                      : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                  aria-label={`Go to update ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
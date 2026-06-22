type LunchOption = {
  id: string;
  label: string;
  category: string;
  price: string;
};

const lunchOptions: LunchOption[] = [
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

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const data = await request.json();

    const name = String(data?.name ?? "").trim();
    const optionId = String(data?.optionId ?? "").trim();

    if (!name || !optionId) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing required fields.",
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const selectedOption = lunchOptions.find((option) => option.id === optionId);

    if (!selectedOption) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Invalid lunch option.",
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyIIR4ngWTdMgg_HVBTgSxDJ2TZxj8ap7bRHWPpM7cnw2bHE2RDwJ6uDMNvC6rW3waFPA/exec";

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        option_id: selectedOption.id,
        option_label: selectedOption.label,
        category: selectedOption.category,
        price: selectedOption.price,
      }),
      redirect: "follow",
    });

    const text = await res.text();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Apps Script request failed.",
          upstreamStatus: res.status,
          upstreamStatusText: res.statusText,
          upstreamBody: text.slice(0, 1000),
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    let json: any;

    try {
      json = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Apps Script did not return JSON.",
          upstreamBody: text.slice(0, 1000),
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    if (!json?.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Apps Script returned ok:false.",
          upstreamBody: json,
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(err),
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
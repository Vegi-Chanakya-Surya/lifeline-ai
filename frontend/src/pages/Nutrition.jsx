import TopNav from "../components/TopNav";

export default function Nutrition() {
  let risk = null;
  try {
    risk = JSON.parse(localStorage.getItem("riskResult") || "null");
  } catch {}

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a,#020617)] text-white">
      <TopNav rightText="Update Form" onRightClick={() => (window.location.href = "/form")} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Nutrition Plans</h1>
        <p className="text-white/70 mt-2">
          {risk
            ? "Next: Gemini will generate 30-day diet + recipe YouTube links."
            : "Fill the health form first to generate nutrition plan."}
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MealCard title="Breakfast 🌅" name="Oats + Banana + Nuts" meta="~350 kcal" />
          <MealCard title="Lunch ☀️" name="Roti + Paneer + Mixed Veg" meta="~450 kcal" />
          <MealCard title="Dinner 🌙" name="Grilled Protein + Rice + Salad" meta="~400 kcal" />
          <MealCard title="Snack 🍎" name="Roasted Makhana / Fruit" meta="~150 kcal" />
        </div>
      </div>
    </div>
  );
}

function MealCard({ title, name, meta }) {
  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-xs text-white/60">{meta}</div>
      </div>
      <div className="mt-3 text-white/80 font-medium">{name}</div>
      <div className="mt-4 text-white/60 text-sm">
        (Next phase: show ingredients + macros + “Watch recipe” video.)
      </div>
    </div>
  );
}

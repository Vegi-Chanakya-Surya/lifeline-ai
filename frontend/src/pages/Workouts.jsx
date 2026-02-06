import TopNav from "../components/TopNav";

export default function Workouts() {
  let risk = null;
  try {
    risk = JSON.parse(localStorage.getItem("riskResult") || "null");
  } catch {}

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a,#020617)] text-white">
      <TopNav rightText="Update Form" onRightClick={() => (window.location.href = "/form")} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Workout Plans</h1>
        <p className="text-white/70 mt-2">
          {risk
            ? "Here’s your personalized training track (next: Gemini will generate full 30-day plan + YouTube videos)."
            : "Fill the health form first to generate workouts."}
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card title="Today’s Workout 💪" subtitle="Upper Body + Cardio • 45 mins">
            <WorkoutItem name="Warm-up" meta="5 min" text="Jogging in place or jumping jacks" />
            <WorkoutItem name="Push-ups" meta="3 sets • 12-15 reps" text="Keep core tight, controlled pace." />
            <WorkoutItem name="Mountain Climbers" meta="3 sets • 30-40 sec" text="Maintain steady rhythm." />
          </Card>

          <Card title="This Week 📅" subtitle="Simple consistency schedule">
            <ul className="space-y-3 text-white/75">
              <li>Mon: Upper Body + Cardio</li>
              <li>Tue: Lower Body + Core</li>
              <li>Wed: Rest / Walk 20 mins</li>
              <li>Thu: Full Body</li>
              <li>Fri: Cardio + Mobility</li>
              <li>Sat: Core + Stretch</li>
              <li>Sun: Rest</li>
            </ul>
          </Card>

          <Card title="Goal Focus 🎯" subtitle="Based on risk + lifestyle">
            <ul className="space-y-2 text-white/75">
              <li>✅ Improve daily movement</li>
              <li>✅ Reduce stress (breathing + walk)</li>
              <li>✅ Strength 3 days/week</li>
              <li>✅ Cardio 2 days/week</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-white/60 text-sm mt-1">{subtitle}</div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function WorkoutItem({ name, meta, text }) {
  return (
    <div className="rounded-xl p-4 bg-white/5 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-white/60">{meta}</div>
      </div>
      <div className="text-white/70 text-sm mt-2">{text}</div>
    </div>
  );
}

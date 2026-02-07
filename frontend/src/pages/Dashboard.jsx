// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [loadingData, setLoadingData] = useState(false);
  const [records, setRecords] = useState([]);
  const [err, setErr] = useState("");
  const handleWorkoutClick = async () => {
  console.log("Workout button clicked");

  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/workouts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: "general fitness",
        location: "home",
        time_per_day: 30,
        fitness_level: "beginner",
        equipment: "none",
      }),
    });

    const text = await res.text();
    const plan = JSON.parse(text);

    // 🔒 VALIDATION
    if (!plan.plan || !Array.isArray(plan.plan)) {
      throw new Error("Invalid workout plan format");
    }

    // ✅ SAVE TO FIRESTORE (USER-SPECIFIC)
    await addDoc(
      collection(db, "users", user.uid, "workoutPlans"),
      {
        createdAt: serverTimestamp(),
        plan: plan.plan,
        source: "ai",
      }
    );

    // ✅ OPTIONAL CACHE
    localStorage.setItem("workoutPlan", JSON.stringify(plan));

    navigate("/workouts");
  } catch (err) {
    console.error(err);
    alert("Failed to generate workout plan");
  }
};

  const handleNutritionClick = async () => {
  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/nutrition/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: "general health",
        diet: "vegetarian",
        activity: "moderate",
        allergies: "none",
      }),
    });

    const plan = await res.json();

    if (!plan.plan) throw new Error("Invalid nutrition plan");

    // 🔥 Save to Firestore
    await addDoc(
      collection(db, "users", user.uid, "nutritionPlans"),
      {
        createdAt: serverTimestamp(),
        plan: plan.plan,
        source: "ai",
      }
    );

    // Optional cache
    localStorage.setItem("nutritionPlan", JSON.stringify(plan));

    navigate("/nutrition");

  } catch (err) {
    console.error(err);
    alert("Failed to generate nutrition plan");
  }
};


  // 1) Always know if user is logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  // 2) Fetch latest health record from Firestore
  useEffect(() => {
    const load = async () => {
      setErr("");
      setRecords([]);

      if (!user) return;

      try {
        setLoadingData(true);
        const q = query(
          collection(db, "users", user.uid, "healthRecords"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRecords(items);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load records");
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [user]);

  const latest = records[0] || null;

  const riskResult = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("riskResult") || "null");
    } catch {
      return null;
    }
  }, []);

  // ✅ This guarantees something visible always
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-green-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center font-bold text-green-300">
              LA
            </div>
            <div>
              <div className="text-xl font-bold">LifeLine AI</div>
              <div className="text-sm text-gray-400">Dashboard</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/form")}
              className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-600"
            >
              Update Form
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"
            >
              Home
            </button>
          </div>
        </div>

        {/* DEBUG CARD (TEMP — don’t delete yet) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="font-semibold text-green-300">User Details</div>
          <div className="text-sm text-gray-300 mt-2 space-y-1">
            <div>User: <b>{user ? user.email : "NOT LOGGED IN"}</b></div>
            <div>Records count: <b>{records.length}</b></div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        {loadingAuth ? (
          <div className="text-center text-gray-300">Checking login...</div>
        ) : !user ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-bold">You are not logged in</h2>
            <p className="text-gray-400 mt-2">
              Please go to Landing and login with Google first.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 px-5 py-3 rounded-xl bg-green-500 text-black font-bold hover:bg-green-600"
            >
              Go to Landing
            </button>
          </div>
        ) : err ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <div className="font-bold text-red-200">Firestore error</div>
            <div className="text-sm text-red-100 mt-2">{err}</div>
            <div className="text-sm text-gray-300 mt-4">
              This is usually Firestore Rules. Fix rules then refresh.
            </div>
          </div>
        ) : !latest ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-bold">No health records yet.</h2>
            <p className="text-gray-400 mt-2">
              Fill the Health Form once — then your dashboard will show data.
            </p>
            <button
              onClick={() => navigate("/form")}
              className="mt-5 px-5 py-3 rounded-xl bg-green-500 text-black font-bold hover:bg-green-600"
            >
              Fill Health Form
            </button>
          </div>
        ) : (
          <>
            {/* WELCOME CARD */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-2xl font-bold">Welcome back 👋</div>
              <div className="text-gray-300 mt-2">
                Latest record: Age <b>{latest.age}</b>, BMI <b>{latest.bmi}</b>, Sleep <b>{latest.sleep}</b> hrs
              </div>
              {riskResult && (
                <div className="text-gray-300 mt-2">
                  Risk Level: <b className="text-green-300">{riskResult.risk_level}</b> | Score:{" "}
                  <b className="text-green-300">{riskResult.risk_score}</b>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="grid md:grid-cols-3 gap-5">
              <ActionCard
                title="Workout Plan"
                desc="Weekly workout plan"
                button="Start"
                onClick={handleWorkoutClick}
              />

                            <ActionCard
                title="Nutrition Plan"
                desc="Diet plan "
                button="View"
                onClick={handleNutritionClick}
              />

              <ActionCard
                title="AI Coach"
                desc="Ask anything about your diet & workouts"
                button="Open"
                onClick={() => navigate("/coach")}
              />

            </div>
          </>
        )}
      </div>
    </div>
  );
}
function ActionCard({ title, desc, button, onClick }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:translate-y-[-4px] transition">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-gray-400 mt-2">{desc}</div>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-600"
      >
        {button}
      </button>
    </div>
  );
}

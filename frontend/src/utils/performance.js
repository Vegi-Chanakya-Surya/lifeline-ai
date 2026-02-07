// performanceLogic.js
function calculateStreak(records, maxGapDays = 1) {
  if (!records || records.length === 0) return 0;

  // sort by timestamp (oldest → newest)
  const sorted = [...records].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  let streak = 1;

  for (let i = sorted.length - 1; i > 0; i--) {
    const curr = sorted[i];
    const prev = sorted[i - 1];

    const diffMs = curr.timestamp - prev.timestamp;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays <= maxGapDays) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function computePerformance(records) {
  if (!records || records.length < 2) {
    return {
      summary: "Not enough data to calculate performance",
      weight: null,
      bmi: null,
      consistency: records?.length || 0,
      streak: records?.length || 0
    };
  }

  // ensure chronological order
  const sorted = [...records].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const weightDiff = first.weight - last.weight;
  const bmiTrend = last.bmi < first.bmi ? "Improving" : "Needs Attention";
  const streak = calculateStreak(sorted);

  return {
    summary:
      streak >= 3
        ? "🔥 You're on a great consistency streak!"
        : weightDiff > 0
        ? "You are making steady progress 💪"
        : "Progress needs attention",
    weight: weightDiff,
    bmi: bmiTrend,
    consistency: sorted.length,
    streak
  };
}

// LocalStorage Persistence Service for Progress Tracking
const STORAGE_KEY = "placement_predictor_progress_v1";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTodayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function generateInitialHistory() {
  const history = [];
  const today = new Date();

  // Create 6 past days + today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = i === 0 ? "Today" : DAYS[d.getDay()];

    // Seed realistic past data
    const totalGoals = i === 0 ? 4 : (i % 2 === 0 ? 4 : 5);
    const completedGoals = i === 0 ? 0 : (i === 1 ? 4 : i === 2 ? 3 : i === 3 ? 5 : i === 4 ? 4 : 3);
    const studyHours = i === 0 ? 3.5 : (i === 1 ? 4.0 : i === 2 ? 3.0 : i === 3 ? 4.5 : i === 4 ? 3.5 : 2.5);
    const completionPct = Math.round((completedGoals / totalGoals) * 100);

    history.push({
      date: dateStr,
      day: dayLabel,
      totalGoals,
      completedGoals,
      completionPct,
      studyHours,
    });
  }

  return history;
}

export function getProgressData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = {
        streak: 5,
        lastActiveDate: getTodayString(),
        history: generateInitialHistory(),
        skillScores: [
          { skill: "Coding", score: 70, baseline: 55 },
          { skill: "Aptitude", score: 65, baseline: 50 },
          { skill: "Communication", score: 68, baseline: 58 },
          { skill: "Logical", score: 66, baseline: 52 },
          { skill: "Mock Interview", score: 70, baseline: 54 },
        ],
        totalGoalsCompletedEver: 21,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }

    const data = JSON.parse(raw);
    const todayStr = getTodayString();

    // Check if today exists in history, if not append today and keep last 7 days
    const hasToday = data.history.some((h) => h.date === todayStr);
    if (!hasToday) {
      const today = new Date();
      data.history.push({
        date: todayStr,
        day: "Today",
        totalGoals: 4,
        completedGoals: 0,
        completionPct: 0,
        studyHours: 3.5,
      });
      // Keep last 7 days
      if (data.history.length > 7) {
        data.history = data.history.slice(data.history.length - 7);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return data;
  } catch (e) {
    console.error("Failed to load progress data from localStorage:", e);
    return {
      streak: 5,
      lastActiveDate: getTodayString(),
      history: generateInitialHistory(),
      skillScores: [
        { skill: "Coding", score: 70, baseline: 55 },
        { skill: "Aptitude", score: 65, baseline: 50 },
        { skill: "Communication", score: 68, baseline: 58 },
        { skill: "Logical", score: 66, baseline: 52 },
        { skill: "Mock Interview", score: 70, baseline: 54 },
      ],
      totalGoalsCompletedEver: 21,
    };
  }
}

export function updateTodayProgress(completedGoals, totalGoals, studyHours = 3.5) {
  try {
    const data = getProgressData();
    const todayStr = getTodayString();

    let todayEntry = data.history.find((h) => h.date === todayStr);
    if (!todayEntry) {
      todayEntry = {
        date: todayStr,
        day: "Today",
        totalGoals,
        completedGoals,
        completionPct: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
        studyHours,
      };
      data.history.push(todayEntry);
    } else {
      todayEntry.totalGoals = totalGoals;
      todayEntry.completedGoals = completedGoals;
      todayEntry.completionPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
      if (studyHours) todayEntry.studyHours = parseFloat(studyHours);
    }

    if (data.history.length > 7) {
      data.history = data.history.slice(data.history.length - 7);
    }

    // Update streak: if completed at least 1 goal today, ensure streak is active
    if (completedGoals > 0) {
      data.streak = Math.max(data.streak, 5);
      data.lastActiveDate = todayStr;
    }

    // Calculate total goals completed ever
    data.totalGoalsCompletedEver = data.history.reduce((sum, h) => sum + (h.completedGoals || 0), 0);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error("Failed to update progress in localStorage:", e);
    return null;
  }
}

export function syncSkillScores(formData) {
  try {
    const data = getProgressData();
    data.skillScores = [
      { skill: "Coding", score: parseFloat(formData.coding_skill_score || 70), baseline: 55 },
      { skill: "Aptitude", score: parseFloat(formData.aptitude_score || 65), baseline: 50 },
      { skill: "Communication", score: parseFloat(formData.communication_skill_score || 68), baseline: 58 },
      { skill: "Logical", score: parseFloat(formData.logical_reasoning_score || 66), baseline: 52 },
      { skill: "Mock Interview", score: parseFloat(formData.mock_interview_score || 70), baseline: 54 },
    ];
    if (formData.study_hours_per_day) {
      const todayStr = getTodayString();
      const todayEntry = data.history.find((h) => h.date === todayStr);
      if (todayEntry) {
        todayEntry.studyHours = parseFloat(formData.study_hours_per_day);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error("Failed to sync skill scores:", e);
    return null;
  }
}
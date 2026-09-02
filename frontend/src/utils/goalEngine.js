export function generateDailyGoals(userData, progressData = null) {
  const studyHours = parseFloat(userData.study_hours_per_day || 3.5);
  const availableMinutes = Math.max(Math.floor(studyHours * 60), 30);

  // Analyze progressData if provided (from localStorage)
  let completionRate = null;
  let improvedSkill = null;
  let improvedPct = null;

  if (progressData && progressData.history && progressData.history.length > 0) {
    const history = progressData.history;
    const prevDay = history.length > 1 ? history[history.length - 2] : history[0];
    completionRate = prevDay ? prevDay.completionPct : 75;

    // Check if any skill improved over baseline
    if (progressData.skillScores) {
      for (const s of progressData.skillScores) {
        const diff = s.score - s.baseline;
        if (diff >= 10) {
          improvedSkill = s.skill;
          improvedPct = diff;
          break;
        }
      }
    }
  }

  // Determine Adaptive Mode & Message
  let adaptiveMode = "Balanced Pace";
  let adaptiveMsg = "Consistent habit pace. Maintaining steady daily preparation workload.";

  if (completionRate !== null && completionRate >= 80) {
    adaptiveMode = "Increased Difficulty";
    if (improvedSkill && improvedPct) {
      adaptiveMsg = `Your ${improvedSkill.toLowerCase()} progress improved by ${improvedPct.toFixed(0)}%. Today's workload has been slightly increased, and focus shifted to your next weakest competency.`;
    } else {
      adaptiveMsg = `High achievement (${completionRate.toFixed(0)}% completion). Today's goal depth and challenge have been slightly increased.`;
    }
  } else if (completionRate !== null && completionRate < 50) {
    adaptiveMode = "Reduced Workload";
    adaptiveMsg = `You completed only ${completionRate.toFixed(0)}% of recent goals. Today's workload has been reduced to make goals more achievable and rebuild momentum.`;
  } else if (improvedSkill && improvedPct && improvedPct >= 10) {
    adaptiveMode = "Balanced Pace";
    adaptiveMsg = `Your ${improvedSkill.toLowerCase()} progress improved by ${improvedPct.toFixed(0)}%. Today's ${improvedSkill.toLowerCase()} workload has been adjusted.`;
  }

  const coding = parseFloat(userData.coding_skill_score || 0);
  const apt = parseFloat(userData.aptitude_score || 0);
  const comm = parseFloat(userData.communication_skill_score || 0);
  const mock = parseFloat(userData.mock_interview_score || 0);
  const logic = parseFloat(userData.logical_reasoning_score || 0);
  const proj = parseInt(userData.projects_count || 0, 10);
  const intern = parseInt(userData.internships_count || 0, 10);
  const backlogs = parseInt(userData.backlogs || 0, 10);
  const cgpa = parseFloat(userData.cgpa || 0);

  const weaknesses = [];
  if (backlogs > 0) weaknesses.push({ key: "backlogs", weight: 120 + backlogs * 10 });
  if (coding < 80) {
    const w = (85 - coding) * (improvedSkill && improvedSkill.toLowerCase().includes("coding") ? 0.6 : 1.0);
    weaknesses.push({ key: "coding", weight: w });
  }
  if (apt < 80) {
    const w = (85 - apt) * (improvedSkill && improvedSkill.toLowerCase().includes("aptitude") ? 0.6 : 1.0);
    weaknesses.push({ key: "aptitude", weight: w });
  }
  if (mock < 80) weaknesses.push({ key: "mock", weight: 85 - mock });
  if (proj < 4) weaknesses.push({ key: "projects", weight: (4 - proj) * 20 });
  if (comm < 80) weaknesses.push({ key: "communication", weight: 85 - comm });
  if (logic < 80) weaknesses.push({ key: "logic", weight: 85 - logic });
  if (intern < 2) weaknesses.push({ key: "internships", weight: (2 - intern) * 25 });
  if (cgpa < 8.0) weaknesses.push({ key: "cgpa", weight: (8.0 - cgpa) * 12 });

  weaknesses.sort((a, b) => b.weight - a.weight);

  let GOAL_TEMPLATES = {};

  if (adaptiveMode === "Reduced Workload") {
    GOAL_TEMPLATES = {
      backlogs: { title: "Review 1 Backlog Syllabus Topic", description: "Quick focused 25-minute review of fundamental formulas and definitions.", category: "Academics", base_min: 25, priority: "High", adaptive_note: "Lightened workload" },
      coding: { title: "Solve 2 Core Easy/Medium Problems", description: "Solve 2 accessible problems on Arrays/Strings to build confidence.", category: "Coding", base_min: 30, priority: "High", adaptive_note: "Achievable goal" },
      aptitude: { title: "Solve 10 Aptitude Questions", description: "Practice 10 high-frequency quantitative questions with immediate review.", category: "Aptitude", base_min: 20, priority: "High", adaptive_note: "Achievable goal" },
      projects: { title: "Document 1 Project Feature", description: "Spend 25 minutes writing clean README docs or small UI tweak.", category: "Projects", base_min: 25, priority: "Medium", adaptive_note: "Lightened workload" },
      mock: { title: "Practice 3 Common HR Questions", description: "Rehearse answers out loud to 3 standard placement interview questions.", category: "Interview Prep", base_min: 20, priority: "High", adaptive_note: "Achievable goal" },
      communication: { title: "Practice 1-Minute Self-Introduction", description: "Brief spoken practice focusing on clear articulation.", category: "Communication", base_min: 15, priority: "Medium", adaptive_note: "Achievable goal" },
      logic: { title: "Solve 5 Logical Puzzles", description: "Quick logical deduction and pattern recognition questions.", category: "Aptitude", base_min: 15, priority: "Medium", adaptive_note: "Achievable goal" },
      internships: { title: "Review Resume & 1 Application", description: "Check resume formatting and apply to 1 relevant posting.", category: "Career", base_min: 20, priority: "Medium", adaptive_note: "Lightened workload" },
      cgpa: { title: "Quick Academic Chapter Summary", description: "Review summary notes from current semester coursework.", category: "Academics", base_min: 20, priority: "Medium", adaptive_note: "Achievable goal" },
      maintenance_coding: { title: "Solve 1 Easy/Medium Coding Problem", description: "Maintain problem-solving rhythm.", category: "Coding", base_min: 25, priority: "Low", adaptive_note: "Achievable goal" },
      maintenance_system: { title: "Read Short Tech Concept Article", description: "15-minute read on basic caching or database indexes.", category: "Projects", base_min: 20, priority: "Low", adaptive_note: "Achievable goal" },
    };
  } else if (adaptiveMode === "Increased Difficulty") {
    GOAL_TEMPLATES = {
      backlogs: { title: "Intensive Backlog Problem Solving", description: "Solve previous 3 years examination papers under timed conditions.", category: "Academics", base_min: 45, priority: "High", adaptive_note: "Increased depth" },
      coding: { title: "Solve 4 Algorithmic Problems (Medium/Hard)", description: "Deep-dive into dynamic programming, graphs, and two-pointer challenges.", category: "Coding", base_min: 50, priority: "High", adaptive_note: "Increased depth" },
      aptitude: { title: "Solve 25 Advanced Aptitude Questions", description: "Timed sectional practice with rapid shortcut deduction techniques.", category: "Aptitude", base_min: 35, priority: "High", adaptive_note: "Increased depth" },
      projects: { title: "Architect Core Feature & Write Unit Tests", description: "Develop full-stack feature, write tests, and create PR on GitHub.", category: "Projects", base_min: 50, priority: "Medium", adaptive_note: "Increased depth" },
      mock: { title: "Full Technical & HR Simulation", description: "Simulate 45-minute end-to-end placement technical and behavioral round.", category: "Interview Prep", base_min: 40, priority: "High", adaptive_note: "Increased depth" },
      communication: { title: "Leadership Pitch & STAR Story Recording", description: "Record and critically analyze 2 leadership behavioral situational prompts.", category: "Communication", base_min: 25, priority: "Medium", adaptive_note: "Increased depth" },
      logic: { title: "Solve 15 Complex Analytical Puzzles", description: "Complex seating arrangement, circular tables, and syllogism drills.", category: "Aptitude", base_min: 30, priority: "Medium", adaptive_note: "Increased depth" },
      internships: { title: "Targeted Outreach to 3 Recruiters/Alumni", description: "Draft tailored cold emails and portfolio links to alumni at target firms.", category: "Career", base_min: 30, priority: "Medium", adaptive_note: "Increased depth" },
      cgpa: { title: "In-Depth Coursework Problem Sets", description: "Complete challenging numericals and theory proofs from syllabus.", category: "Academics", base_min: 35, priority: "Medium", adaptive_note: "Increased depth" },
      maintenance_coding: { title: "Solve 1 Hard LeetCode Challenge", description: "Advance competitive algorithmic limits with advanced graph/DP topics.", category: "Coding", base_min: 45, priority: "Low", adaptive_note: "Increased depth" },
      maintenance_system: { title: "System Design Architecture Drill", description: "Design a scalable URL shortener or rate limiter with architecture diagrams.", category: "Projects", base_min: 35, priority: "Low", adaptive_note: "Increased depth" },
    };
  } else {
    GOAL_TEMPLATES = {
      backlogs: { title: "Clear Backlog Syllabus Unit", description: "Revise core high-weightage topics and past exam papers for pending subject.", category: "Academics", base_min: 40, priority: "High", adaptive_note: "Balanced pace" },
      coding: { title: "Solve 3 Coding Problems", description: "Practice Arrays, Strings, and HashMaps on LeetCode/HackerRank.", category: "Coding", base_min: 45, priority: "High", adaptive_note: "Balanced pace" },
      aptitude: { title: "Solve 20 Aptitude Questions", description: "Practice quantitative speed math, percentages, and time-and-work shortcuts.", category: "Aptitude", base_min: 30, priority: "High", adaptive_note: "Balanced pace" },
      projects: { title: "Work on Project Feature", description: "Implement and test a core feature in your capstone/portfolio project.", category: "Projects", base_min: 45, priority: "Medium", adaptive_note: "Balanced pace" },
      mock: { title: "Practice 5 Interview Questions", description: "Rehearse technical and situational HR responses out loud.", category: "Interview Prep", base_min: 30, priority: "High", adaptive_note: "Balanced pace" },
      communication: { title: "Record 2-Minute Self-Introduction", description: "Practice spoken articulation, pacing, and professional body language.", category: "Communication", base_min: 20, priority: "Medium", adaptive_note: "Balanced pace" },
      logic: { title: "Solve 10 Logical Puzzles", description: "Practice seating arrangements, syllogisms, and series patterns.", category: "Aptitude", base_min: 25, priority: "Medium", adaptive_note: "Balanced pace" },
      internships: { title: "Internship Outreach & Applications", description: "Review resume and submit 2 tailored applications for student roles.", category: "Career", base_min: 25, priority: "Medium", adaptive_note: "Balanced pace" },
      cgpa: { title: "Academic Coursework Review", description: "Revise semester subject lecture notes and practice assignment questions.", category: "Academics", base_min: 30, priority: "Medium", adaptive_note: "Balanced pace" },
      maintenance_coding: { title: "Solve 1 Hard/Medium LeetCode Problem", description: "Maintain competitive algorithmic problem solving edge.", category: "Coding", base_min: 35, priority: "Low", adaptive_note: "Balanced pace" },
      maintenance_system: { title: "Read System Design Case Study", description: "Study modern scalable architectures (microservices, caching, indexing).", category: "Projects", base_min: 30, priority: "Low", adaptive_note: "Balanced pace" },
    };
  }

  const targetCount = adaptiveMode === "Reduced Workload" ? 3 : (availableMinutes <= 90 ? 3 : (availableMinutes <= 180 ? 4 : 5));
  const selectedKeys = weaknesses.slice(0, targetCount).map((w) => w.key);

  const fallbacks = ["maintenance_coding", "projects", "communication", "maintenance_system", "aptitude"];
  for (const fb of fallbacks) {
    if (selectedKeys.length >= targetCount) break;
    if (!selectedKeys.includes(fb)) selectedKeys.push(fb);
  }

  const selectedGoals = selectedKeys.map((k, i) => ({
    ...GOAL_TEMPLATES[k],
    id: `goal-${i + 1}`,
    completed: false,
  }));

  const totalBase = selectedGoals.reduce((sum, g) => sum + g.base_min, 0);
  const scaleFactor = Math.min(availableMinutes / totalBase, 1.0);

  selectedGoals.forEach((g) => {
    const scaled = Math.max(Math.round((g.base_min * scaleFactor) / 5) * 5, 10);
    g.estimated_minutes = scaled;
    delete g.base_min;
  });

  while (selectedGoals.reduce((sum, g) => sum + g.estimated_minutes, 0) > availableMinutes) {
    let maxGoal = selectedGoals[0];
    for (const g of selectedGoals) {
      if (g.estimated_minutes > maxGoal.estimated_minutes) maxGoal = g;
    }
    if (maxGoal.estimated_minutes > 10) {
      maxGoal.estimated_minutes -= 5;
    } else {
      break;
    }
  }

  const totalAllocated = selectedGoals.reduce((sum, g) => sum + g.estimated_minutes, 0);

  return {
    daily_goals: selectedGoals,
    total_goal_minutes: totalAllocated,
    available_study_minutes: availableMinutes,
    adaptive_mode: adaptiveMode,
    adaptive_recommendation_message: adaptiveMsg,
  };
}
export function evaluateSkillGap(data) {
  const items = [];

  // 1. CGPA
  const cgpa = parseFloat(data.cgpa || 0);
  let c_status, c_priority, c_rec;
  if (cgpa >= 8.0) {
    c_status = "Strong"; c_priority = "Low"; c_rec = "Excellent academic standing; maintain current performance.";
  } else if (cgpa >= 7.0) {
    c_status = "Moderate"; c_priority = "Medium"; c_rec = "Target elevating CGPA above 8.0 to pass competitive shortlists.";
  } else {
    c_status = "Needs Improvement"; c_priority = "High"; c_rec = "Critical: Focus on upcoming semester exams to raise CGPA above 7.0 cutoff.";
  }
  items.push({
    skill: "CGPA",
    score_display: `${cgpa.toFixed(1)}/10.0`,
    raw_score: cgpa,
    status: c_status,
    priority: c_priority,
    recommendation: c_rec,
    benchmark: ">= 8.0 (Strong), 7.0-7.99 (Moderate)",
  });

  // 2. Coding Skill Score
  const coding = parseFloat(data.coding_skill_score || 0);
  let cod_status, cod_priority, cod_rec;
  if (coding >= 80.0) {
    cod_status = "Strong"; cod_priority = "Low"; cod_rec = "Advanced problem-solving skill; practice system design and complex algorithmic problems.";
  } else if (coding >= 60.0) {
    cod_status = "Moderate"; cod_priority = "Medium"; cod_rec = "Solve 2-3 medium LeetCode/HackerRank DSA problems daily to reach the 80+ benchmark.";
  } else {
    cod_status = "Needs Improvement"; cod_priority = "High"; cod_rec = "Urgent: Strengthen core data structures (Arrays, Trees, Graphs, DP) and daily coding drills.";
  }
  items.push({
    skill: "Coding Skill",
    score_display: `${coding.toFixed(0)}/100`,
    raw_score: coding,
    status: cod_status,
    priority: cod_priority,
    recommendation: cod_rec,
    benchmark: ">= 80 (Strong), 60-79 (Moderate)",
  });

  // 3. Aptitude Score
  const apt = parseFloat(data.aptitude_score || 0);
  let apt_status, apt_priority, apt_rec;
  if (apt >= 80.0) {
    apt_status = "Strong"; apt_priority = "Low"; apt_rec = "High quantitative mastery; maintain speed through timed weekly sectionals.";
  } else if (apt >= 60.0) {
    apt_status = "Moderate"; apt_priority = "Medium"; apt_rec = "Improve quantitative speed and shortcut techniques in time-and-work, probability, and percentages.";
  } else {
    apt_status = "Needs Improvement"; apt_priority = "High"; apt_rec = "High Priority: Practice standard quantitative aptitude tests to clear preliminary company filters.";
  }
  items.push({
    skill: "Aptitude",
    score_display: `${apt.toFixed(0)}/100`,
    raw_score: apt,
    status: apt_status,
    priority: apt_priority,
    recommendation: apt_rec,
    benchmark: ">= 80 (Strong), 60-79 (Moderate)",
  });

  // 4. Communication Skill Score
  const comm = parseFloat(data.communication_skill_score || 0);
  let comm_status, comm_priority, comm_rec;
  if (comm >= 80.0) {
    comm_status = "Strong"; comm_priority = "Low"; comm_rec = "Articulate and confident; ready for leadership and managerial rounds.";
  } else if (comm >= 60.0) {
    comm_status = "Moderate"; comm_priority = "Medium"; comm_rec = "Participate in group discussions and structured STAR-method storytelling sessions.";
  } else {
    comm_status = "Needs Improvement"; comm_priority = "High"; comm_rec = "Essential: Practice spoken English, technical articulation, and concise conversational pacing.";
  }
  items.push({
    skill: "Communication",
    score_display: `${comm.toFixed(0)}/100`,
    raw_score: comm,
    status: comm_status,
    priority: comm_priority,
    recommendation: comm_rec,
    benchmark: ">= 80 (Strong), 60-79 (Moderate)",
  });

  // 5. Logical Reasoning Score
  const logic = parseFloat(data.logical_reasoning_score || 0);
  let log_status, log_priority, log_rec;
  if (logic >= 80.0) {
    log_status = "Strong"; log_priority = "Low"; log_rec = "Sharp critical thinking; consistent performance across puzzle tests.";
  } else if (logic >= 60.0) {
    log_status = "Moderate"; log_priority = "Medium"; log_rec = "Sharpen analytical puzzles, seating arrangements, syllogisms, and pattern series.";
  } else {
    log_status = "Needs Improvement"; log_priority = "High"; log_rec = "Needs Focus: Dedicate focused time to logical deductions, data sufficiency, and analytical reasoning.";
  }
  items.push({
    skill: "Logical Reasoning",
    score_display: `${logic.toFixed(0)}/100`,
    raw_score: logic,
    status: log_status,
    priority: log_priority,
    recommendation: log_rec,
    benchmark: ">= 80 (Strong), 60-79 (Moderate)",
  });

  // 6. Mock Interview Score
  const mock = parseFloat(data.mock_interview_score || 0);
  let mock_status, mock_priority, mock_rec;
  if (mock >= 80.0) {
    mock_status = "Strong"; mock_priority = "Low"; mock_rec = "Excellent interview presence, technical depth, and professional composure.";
  } else if (mock >= 60.0) {
    mock_status = "Moderate"; mock_priority = "Medium"; mock_rec = "Conduct 2-3 peer mock interviews focusing on handling unexpected questions under pressure.";
  } else {
    mock_status = "Needs Improvement"; mock_priority = "High"; mock_rec = "Crucial: Schedule realistic technical and HR mock sessions with mentors to build confidence.";
  }
  items.push({
    skill: "Mock Interview",
    score_display: `${mock.toFixed(0)}/100`,
    raw_score: mock,
    status: mock_status,
    priority: mock_priority,
    recommendation: mock_rec,
    benchmark: ">= 80 (Strong), 60-79 (Moderate)",
  });

  // 7. Internships
  const intern = parseInt(data.internships_count || 0, 10);
  let int_status, int_priority, int_rec;
  if (intern >= 2) {
    int_status = "Strong"; int_priority = "Low"; int_rec = "Robust industry exposure; highlight measurable project achievements on resume.";
  } else if (intern === 1) {
    int_status = "Moderate"; int_priority = "Medium"; int_rec = "Consider a second internship, freelance contract, or active open-source contribution.";
  } else {
    int_status = "Needs Improvement"; int_priority = "High"; int_rec = "High Impact: Prioritize securing at least 1 verified internship or production contribution.";
  }
  items.push({
    skill: "Internships",
    score_display: `${intern}`,
    raw_score: intern,
    status: int_status,
    priority: int_priority,
    recommendation: int_rec,
    benchmark: ">= 2 (Strong), 1 (Moderate), 0 (Needs Improvement)",
  });

  // 8. Projects
  const proj = parseInt(data.projects_count || 0, 10);
  let proj_status, proj_priority, proj_rec;
  if (proj >= 4) {
    proj_status = "Strong"; proj_priority = "Low"; proj_rec = "Broad project portfolio; ensure live deployments and clean GitHub documentation.";
  } else if (proj >= 2) {
    proj_status = "Moderate"; proj_priority = "Medium"; proj_rec = "Build and deploy 1-2 end-to-end full-stack or ML systems with production architecture.";
  } else {
    proj_status = "Needs Improvement"; proj_priority = "High"; proj_rec = "Critical: Build at least 2 deployable capstone projects showcasing real-world problem solving.";
  }
  items.push({
    skill: "Projects",
    score_display: `${proj}`,
    raw_score: proj,
    status: proj_status,
    priority: proj_priority,
    recommendation: proj_rec,
    benchmark: ">= 4 (Strong), 2-3 (Moderate), 0-1 (Needs Improvement)",
  });

  // 9. Backlogs
  const backlogs = parseInt(data.backlogs || 0, 10);
  let back_status, back_priority, back_rec;
  if (backlogs === 0) {
    back_status = "Strong"; back_priority = "Low"; back_rec = "Clean academic record with zero backlogs clears all tier-1 company eligibility rules.";
  } else if (backlogs === 1) {
    back_status = "Moderate"; back_priority = "Medium"; back_rec = "Ensure your single pending subject is cleared in the immediate remedial attempt.";
  } else {
    back_status = "Needs Improvement"; back_priority = "High"; back_rec = "Critical Red Flag: Clear multiple backlogs immediately as most campus drives enforce zero backlogs.";
  }
  items.push({
    skill: "Backlogs",
    score_display: `${backlogs}`,
    raw_score: backlogs,
    status: back_status,
    priority: back_priority,
    recommendation: back_rec,
    benchmark: "0 (Strong), 1 (Moderate), >1 (Needs Improvement)",
  });

  // 10. Study Hours Per Day
  const study = parseFloat(data.study_hours_per_day || 0);
  let std_status, std_priority, std_rec;
  if (study >= 4.0) {
    std_status = "Strong"; std_priority = "Low"; std_rec = "Diligent study discipline; keep a balanced schedule to prevent fatigue.";
  } else if (study >= 2.0) {
    std_status = "Moderate"; std_priority = "Medium"; std_rec = "Increase daily focused preparation to 4+ hours, prioritizing high-yield topics.";
  } else {
    std_status = "Needs Improvement"; std_priority = "High"; std_rec = "High Priority: Allocate at least 3-4 structured study hours daily leading into placement season.";
  }
  items.push({
    skill: "Study Hours",
    score_display: `${study.toFixed(1)} hrs/day`,
    raw_score: study,
    status: std_status,
    priority: std_priority,
    recommendation: std_rec,
    benchmark: ">= 4.0 (Strong), 2.0-3.99 (Moderate), < 2.0 (Needs Improvement)",
  });

  const priorityOrder = { "Needs Improvement": 0, "Moderate": 1, "Strong": 2 };
  const sortedItems = [...items].sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status]);

  const topPriorities = sortedItems
    .filter((i) => i.status === "Needs Improvement" || i.status === "Moderate")
    .map((i) => i.skill)
    .slice(0, 3);

  return {
    skillData: sortedItems,
    topPriorities: topPriorities.length > 0 ? topPriorities : [sortedItems[0].skill],
  };
}
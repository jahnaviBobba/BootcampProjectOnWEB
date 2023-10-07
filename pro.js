const inputForm = document.getElementById("form");
inputForm.addEventListener("submit", handleSubmit);
let username = "";
const api_url = "https://codeforces.com/api/";


const loader = document.getElementById("loader")


let verdict = {};
let language = {};
let ratings = {};
let heatmap = {};


let tried = new Set();
let solved = new Set();
let attempts = {};
let max_attempts = 0;
let max_attempted_problem = "";
let problem_solved_count = {};
let max_ac = 0;
let max_ac_problem_name = "";
let years = 0;


async function handleSubmit(e) {
try {


loader.style.display = "block"


e.preventDefault();
const inputBox = document.getElementById("input-box");
username = inputBox.value;
/*
1st api => `${api_url}user.status?handle=${username}`
2nd api => `${api_url}user.rating?handle=${username}`
*/
let response = await fetch(`${api_url}user.status?handle=${username}`);
response = await response.json();


console.log(response);


// LOOPING OVER THE SUBMISSIONS
for (let i = 0; i < response.result.length; i++) {
// TAKING ONE SUBMISSION INTO A VARIABLE
const submission = response.result[i];
// ADDING VERDICT KEYS TO THE GLOBAL VERDICT OBJECT
if (verdict[submission.verdict] === undefined) {
verdict[submission.verdict] = 1;
} else {
verdict[submission.verdict] += 1;
}


// CALCULATE LANGUAGE


if (language[submission.programmingLanguage] === undefined) {
language[submission.programmingLanguage] = 1;
} else {
language[submission.programmingLanguage] += 1;
}


if (ratings[submission.problem.rating] === undefined) {
ratings[submission.problem.rating] = 1;
} else {
ratings[submission.problem.rating] += 1;
}


let contestId = submission.problem.contestId;
let level = submission.problem.index;
let name = submission.problem.name;


let key = `${contestId}-${name}-${level}`;


// STORING TRIED PROBLEM COUNT
tried.add(key);
// STORING ACCEPTED PROBLEM COUNT
if (submission.verdict === "OK") {
solved.add(key);
}


// AVERAGE ATTEMPS


if (attempts[key] === undefined) {
attempts[key] = 1;
} else {
attempts[key] += 1;
}


// max attempted problem
if (attempts[key] > max_attempts) {
max_attempted_problem = `${contestId}-${level}`;
max_attempts = attempts[key];
}


// problem with solved count map
if (submission.verdict === "OK") {
if (problem_solved_count[key] === undefined) {
problem_solved_count[key] = 1;
} else {
problem_solved_count[key] += 1;
}
}


// max number of solved count for a problem
if (problem_solved_count[key] > max_ac) {
max_ac = problem_solved_count[key];
max_ac_problem_name = `${contestId}-${level}`;
}


// HEATMAP CALCULATION
const submissionTimeMs = submission.creationTimeSeconds * 1000;
const submissionDate = new Date(submissionTimeMs);
submissionDate.setHours(0, 0, 0, 0);


// console.log("submissionDate => ", submissionDate.valueOf())


if (heatmap[submissionDate.valueOf()] === undefined) {
heatmap[submissionDate.valueOf()] = 1;
} else {
heatmap[submissionDate.valueOf()] += 1;
}
}


years =
new Date(response.result[0].creationTimeSeconds * 1000).getYear() -
new Date(response.result.at(-1).creationTimeSeconds * 1000).getYear();
years = Math.abs(years) + 1;


console.log(verdict);
console.log(language);
// console.log("heatmap => ", heatmap)


loader.style.display = "none"


drawVerdictChart();
drawLanguageChart();
drawRatingChart();
drawContestStatsTable();
drawHeatMap();
} catch (err) {
loader.style.display = "none"
console.log(err);
}
}


function drawContestStatsTable() {
let contest_stats_div = document.getElementById("contest-stats");
const usernameTh = document.getElementById("username");
usernameTh.innerHTML = username;
contest_stats_div.style.display = "flex";


console.log("contest_stats_div", contest_stats_div);
console.log("contest_stats_div.classList", contest_stats_div.classList);


let contest_stats_tbody = document.getElementById("contest-stats-table-body");


let total_attempts = 0;
for (let i in attempts) {
total_attempts += attempts[i];
}


let average_attempt = total_attempts / tried.size;


let problems_with_one_submission = 0;
let all_accepted_submission_count = 0;


for (let i in problem_solved_count) {
if (problem_solved_count[i] > 0 && attempts[i] === 1) {
problems_with_one_submission += 1;
}


all_accepted_submission_count += problem_solved_count[i];
}
// const ans = Object.values(problem_solved_count).reduce(
// (currentsum, value) => (currentsum += value)
// );


const problem_with_one_ac_sub_per =
problems_with_one_submission / solved.size;


contest_stats_tbody.innerHTML = `
<tr>
<td>Tried</td>
<td class='value-td'>${tried.size}</td>
</tr>
<tr>
<td>Solved</td>
<td class='value-td'>${solved.size}</td>
</tr>
<tr>
<td>Average Attempts</td>
<td class='value-td'>${average_attempt.toFixed(2)}</td>
</tr>
<tr>
<td>Max Attempts</td>
<td class='value-td'>${max_attempts} (${max_attempted_problem})</td>
</tr>
<tr>
<td>Solved With One Submission</td>
<td class='value-td'>${problems_with_one_submission} (${problem_with_one_ac_sub_per.toFixed(
2
)}%)</td>
</tr>
<tr>
<td>Max AC(s)</td>
<td class='value-td'>${max_ac} (${max_ac_problem_name})</td>
</tr>
`;
}


function drawVerdictChart() {
const verdictDiv = document.getElementById("verdict-chart");


var verTable = [["Verdict", "Count"]];


var verSliceColors = [];
// beautiful names for the verdicts + colors


for (var ver in verdict) {
// console.log(ver);


if (ver == "OK") {
verTable.push(["AC", verdict[ver]]);


verSliceColors.push({ color: "#FFC3A0" });
} else if (ver == "WRONG_ANSWER") {
verTable.push(["WA", verdict[ver]]);


verSliceColors.push({ color: "#FF677D" });
} else if (ver == "TIME_LIMIT_EXCEEDED") {
verTable.push(["TLE", verdict[ver]]);
verSliceColors.push({ color: "#D4A5A5" });
} else if (ver == "MEMORY_LIMIT_EXCEEDED") {
verTable.push(["MLE", verdict[ver]]);
verSliceColors.push({ color: "#392F5A" });
} else if (ver == "RUNTIME_ERROR") {
verTable.push(["RTE", verdict[ver]]);
verSliceColors.push({ color: "#31A2AC" });
} else if (ver == "COMPILATION_ERROR") {
verTable.push(["CPE", verdict[ver]]);
verSliceColors.push({ color: "#61C0BF" });
} else if (ver == "SKIPPED") {
verTable.push(["SKIPPED", verdict[ver]]);
verSliceColors.push({ color: "#6B4226" });
} else if (ver == "CLALLENGED") {
verTable.push(["CLALLENGED", verdict[ver]]);
verSliceColors.push({ color: "#D9BF77" });
} else {
verTable.push([ver, verdict[ver]]);
verSliceColors.push({});
}
}


// console.log(verTable);
verdict = new google.visualization.arrayToDataTable(verTable);


var verOptions = {
height: 300,
title: "Verdict of " + username,
legend: "none",
pieSliceText: "label",
slices: verSliceColors,
fontName: "monospace",
backgroundColor: "white",
titleTextStyle: { color: "#212529", fontSize: "16" },
legend: {
textStyle: {
color: "#212529",
},
},
is3D: true,
};


var verChart = new google.visualization.PieChart(verdictDiv);
verChart.draw(verdict, verOptions);
}


function drawLanguageChart() {
const langDiv = document.getElementById("language-chart");
const langData = [["Language", "Count"]];


for (let lang in language) {
langData.push([lang, language[lang]]);
}


console.log("LANG DATA ARRAY", langData);


language = new google.visualization.arrayToDataTable(langData);


const languageChartOptions = {
height: 300,
title: `Languages of ${username}`,
pieSliceText: "label",
fontName: "monospace",
backgroundColor: "white",
is3D: true,
};


const langChart = new google.visualization.PieChart(langDiv);
langChart.draw(language, languageChartOptions);
}


function drawRatingChart() {
const ratingDiv = document.getElementById("ratings-chart");
const ratingTable = [];


for (let rating in ratings) {
ratingTable.push([rating, ratings[rating]]);
}


ratings = new google.visualization.DataTable();
ratings.addColumn("string", "Rating");
ratings.addColumn("number", "solved");
ratings.addRows(ratingTable);


const ratingChartOptions = {
width: ratingDiv.getBoundingClientRect().width,
height: 300,
title: `Problem ratings of ${username}`,
fontName: "monospace",
};


const ratingChart = new google.visualization.ColumnChart(ratingDiv);
ratingChart.draw(ratings, ratingChartOptions);
}


function drawHeatMap() {
const heatMapDiv = document.getElementById("heatmap");
const heatMapContainerDiv = document.getElementById("heatmap-div");
heatMapContainerDiv.style.display = "flex"
const heatmapTable = [];


for (const d in heatmap) {
heatmapTable.push([new Date(parseInt(d)), heatmap[d]]);
}


heatmapData = new google.visualization.DataTable();
heatmapData.addColumn({ type: "date", id: "Date" });
heatmapData.addColumn({ type: "number", id: "Submissions" });


heatmapData.addRows(heatmapTable);


heatmap = new google.visualization.Calendar(heatMapDiv);
var heatmapOptions = {
height: years * 140,
width: heatMapContainerDiv.getBoundingClientRect().width,
fontName: "Monospace",
titleTextStyle: { color: "#212529", fontSize: "16" },
legend: {
textStyle: {
color: "#212529",
},
},
colorAxis: {
minValue: 0,
colors: ["#9be9a8", "#30a14e", "#216e39"],
},
calendar: {
cellSize: 13,
},
};


heatmap.draw(heatmapData, heatmapOptions);
}

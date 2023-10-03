const inputForm = document.getElementById("form");
inputForm.addEventListener("submit", handleSubmit);
let username = "";
const api_url = "https://codeforces.com/api/";

let verdict = {};
let language = {};
let ratings = {};

async function handleSubmit(e) {
  try {
    e.preventDefault();
    const inputBox = document.getElementById("input-box");
    username = inputBox.value;
    let response = await fetch(`${api_url}user.status?handle=${username}`);
    response = await response.json();

    // console.log(response);

    // verdict['OK'] = 0
    // verdict['WRONG ANSwer'] = 0

    //looping over the submission
    for (let i = 0; i < response.result.length; i++) {
      // console.log("OBJ"+ i+1  );

      //taking one submission int a variable.
      const submission = response.result[i];

    //   console.log(submission);

      //adding verdict keys to the global verdict object
      if (verdict[submission.verdict] === undefined) {
        verdict[submission.verdict] = 1;
      } else {
        verdict[submission.verdict] += 1;
      }

      if(language[submission.programmingLanguage] === undefined){
        language[submission.programmingLanguage] = 1;
      } else {
        language[submission.programmingLanguage] += 1;
      }

      if(ratings[submission.problem.rating] === undefined){
        ratings[submission.problem.rating] = 1;
      } else {
        ratings[submission.problem.rating] += 1;
      }

    

    }
    // console.log(verdict);
    // console.log(language);   
    drawVerdictChart();
    drawLanguageChart();
    drawRatingChart();

  } catch (err) {
    console.log(err);
  }
}



function drawVerdictChart() {
    const verdictDiv = document.getElementById("verdict-chart");
    verdictDiv.classList.remove("d-none");
    verdictDiv.classList.add("card");
    var verTable = [["Verdict", "Count"]];
    var verSliceColors = [];
    // beautiful names for the verdicts + colors
    
    
    for (var ver in verdict) {

        console.log(ver);
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
    fontName: "Menospace",
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
 
    function drawLanguageChart(){
        const langDiv = document.getElementById("langauge-chart")

        const langData = [["Laguage","Count"]]

        for(let lang in language){
            langData.push([lang, language[lang]])
        }

        // console.log("Lang data Array",langData);
        language = new google.visualization.arrayToDataTable(langData)

        const languageChartOptions = {
            height:300,
            title: `Languages of ${username}`,
            pileSliceTrxt: "label",
            fontName:"monospace",
            backgroundColor:"white",
            is3D:true,
        };
        const languageChart = new google.visualization.PieChart(langDiv);
        languageChart.draw(language,languageChartOptions);
    }

    function drawRatingChart(){
        const ratingDiv = document.getElementById("ratings-chart")
        const ratingTable = []

        for(let rating in ratings){
            ratingTable.push([rating,ratings[rating]])

            ratings = new google.visualization.DataTable()
            ratings.addColumn("string","Rating");
            ratings.addColumn("number","solved");
            ratings.addRows(ratingTable);

            const ratingChartOptions={
                width:500,
                height:300,
                title: ` Problem rating of ${username}`,
                fontName: "monospace",
            };

            const ratingChart = new google.visualization.ColumnChart(ratingDiv);
            ratingChart.draw(ratings,ratingChartOptions);
        }
    }
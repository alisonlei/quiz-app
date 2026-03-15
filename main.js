import Timer from "easytimer.js";
const url = {
  general: "https://opentdb.com/api.php?amount=10",
  music: "https://opentdb.com/api.php?amount=10&category=12",
  history: "https://opentdb.com/api.php?amount=10&category=23",
  mythology: "https://opentdb.com/api.php?amount=10&category=20",
};

const subjectQuery = window.location.search; //get the query string from the url
const subjectParam = new URLSearchParams(subjectQuery);
const subject = subjectParam.get("subject");
const questionSet = document.querySelector("#questionSet");
let results;
let selectedAns;
function getQuestions(subject) {
  fetch(url[subject])
    .then((response) => {
      if (!response.ok) {
        throw new Error(`response status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      results = json["results"];
      selectedAns = new Array(results.length);
      console.log("successful retrieval");
      showQuestions(results);
    })
    .catch((err) => console.log(err.message));
}

function shuffle(options) {
  for (let i = options.length - 1; i > -1; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
}
// browser method to parse html encoded entities
function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function fillInQuestionContent(questionNo) {}
function showQuestions(results) {
  results.forEach((question, questionIndex) => {
    const questionText = decodeHtmlEntities(question["question"]);
    console.log(questionText);
    const options = [
      question["correct_answer"],
      ...question["incorrect_answers"],
    ];
    if (question["type"] === "multiple") {
      const mcTemplate = document.querySelector("#multiple");
      const content = mcTemplate.content.cloneNode(true);
      content.querySelector("legend").textContent = questionText;
      shuffle(options);

      const mcOptionLabels = content.querySelectorAll("label");
      mcOptionLabels.forEach((opt, i) => {
        opt.appendChild(document.createTextNode(options[i]));
      });
      const mcOptions = content.querySelectorAll("input");
      mcOptions.forEach((opt) => {
        opt.setAttribute("name", questionIndex);
      });
      questionSet.appendChild(content);
    } else {
      const booTemplate = document.querySelector("#boolean");
      const content = booTemplate.content.cloneNode(true);
      content.querySelector("legend").textContent = questionText;
      const booOptions = content.querySelectorAll("input");
      booOptions.forEach((opt) => {
        opt.setAttribute("name", questionIndex);
      });
      questionSet.appendChild(content);
    }
  });
}
function checkAnswers() {
  let score = 0;
  const answers = document.querySelectorAll("input[name]:checked");
  answers.forEach((ans, i) => {
    const selectedAns = ans.parentElement.textContent.trim();
    const correctAns = results[i]["correct_answer"];
    if (correctAns === selectedAns) {
      score += 1;
    } else {
      console.log(`wrong ans:${selectedAns} ${typeof selectedAns}`);

      console.log(`correct ans:${correctAns} ${typeof correctAns}`);
    }
  });
  console.log(score);
  return;
}
const timer = new Timer();

// Start a 30‑second countdown
timer.start({ countdown: true, startValues: { seconds: 600 } });

// Update DOM every second
timer.addEventListener("secondsUpdated", () => {
  document.querySelector("time").textContent = timer.getTimeValues().toString();
});

// Handle when time runs out
timer.addEventListener("targetAchieved", () => {
  const popUpWindow = document.querySelector("#time-up-modal");
  popUpWindow.style.display = "block";
});
const submitBtn = document.querySelector("button");
submitBtn.addEventListener("click", checkAnswers);
getQuestions(subject);

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
let prevQuesIdx = -1;
let prevQuesType = "";
let results;
let selectedAns;
let prevQuesOptSeq;

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
function eraseDisplayContent() {
  if (prevQuesType === "multiple") {
    //erase options
    document.querySelector("#multiple legend").textContent = "";
    const options = document.querySelectorAll("#multiple label input");
    options.forEach((opt) => {
      opt.parentNode.removeChild(opt.nextSibling);
    });
  } else {
    document.querySelector(`#boolean legend`).textContent = "";
  }
  const options = document.querySelectorAll(`#${prevQuesType} input`);
  options.forEach((opt) => {
    if (opt.checked) {
      opt.checked = false;
    }
  });
}
function handleDisplay(questionIdx) {
  console.log("at handle display" + results);
  if (prevQuesType == "") {
    document
      .querySelector(`#${results[questionIdx]["type"]}`)
      .classList.remove("hide");
  } else {
    eraseDisplayContent();
    // change question template to display
    if (prevQuesType != results[questionIdx]["type"]) {
      document.querySelector(`#${prevQuesType}`).classList.add("hide");
      document
        .querySelector(`#${results[questionIdx]["type"]}`)
        .classList.remove("hide");
    }
  }

  fillInQuestionContent(questionIdx);
  prevQuesIdx = questionIdx;
  prevQuesType = results[questionIdx]["type"];
}
function fillInQuestion(question) {
  const questionText = decodeHtmlEntities(question["question"]);
  console.log(document.querySelector(`#${question["type"]} legend`));
  document.querySelector(`#${question["type"]} legend`).textContent =
    questionText;
}
function displayOptions(question, questionIdx) {
  let options;
  if (prevQuesOptSeq[questionIdx] === undefined) {
    options = [question["correct_answer"], ...question["incorrect_answers"]];
    options = options.map((opt) => decodeHtmlEntities(opt));
    shuffle(options);
    prevQuesOptSeq[questionIdx] = [...options];
  }
  options = prevQuesOptSeq[questionIdx];
  console.log("at displayoptions" + question["type"]);
  let optLabels = document.querySelectorAll(`#${question["type"]} label`);
  optLabels.forEach((label, i) => {
    label.appendChild(document.createTextNode(options[i]));
  });
}
function displayPrevChoice(question, questionIdx) {
  const options = document.querySelectorAll(`#${question["type"]} input`);
  options.forEach((opt) => {
    if (opt.nextSibling.nodeValue === selectedAns[questionIdx]) {
      opt.checked = true;
    }
  });
}
function fillInQuestionContent(questionIdx) {
  const question = results[questionIdx];

  fillInQuestion(question);
  if (question["type"] === "multiple") {
    displayOptions(question, questionIdx);
  }
  console.log(`selected ans${selectedAns[questionIdx]}`);
  console.log(`question idx${questionIdx}`);
  if (selectedAns[questionIdx]) {
    displayPrevChoice(question, questionIdx);
  }
}

function checkAnswers() {
  let score = 0;
  selectedAns.forEach((ans, i) => {
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
const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", checkAnswers);

const nextBtn = document.querySelector("#next");

nextBtn.addEventListener("click", () => {
  let nextIdx = (prevQuesIdx + 1) % results.length;
  handleDisplay(nextIdx);
});
const radios = document.querySelectorAll("input");
radios.forEach((radio) => {
  radio.addEventListener("click", (e) => {
    selectedAns[prevQuesIdx] = e.currentTarget.nextSibling.nodeValue;
    console.log(selectedAns);
  });
});
async function getQuestions(subject) {
  try {
    const response = await fetch(url[subject]);
    if (!response.ok) {
      throw new Error(`response status:${response.status}`);
    }

    let json = await response.json();
    results = json["results"];
    console.log(results);
    selectedAns = new Array(results.length);
    prevQuesOptSeq = new Array(results.length);
    handleDisplay(0);
  } catch (err) {
    console.log(err);
  }
}
let fetched = false;
if (!fetched) {
  getQuestions(subject);
}

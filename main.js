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
function getQuestions(subject) {
  // const testutl = "https://opentdb.com/api.php?amount=10&type=boolean";
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
      handleDisplay(0);
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
}
function handleDisplay(questionIdx) {
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
function fillInQuestionContent(questionIdx) {
  const question = results[questionIdx];
  const questionText = decodeHtmlEntities(question["question"]);

  console.log(questionText);
  document.querySelector(`#${question["type"]} legend`).textContent =
    questionText;

  // handle option display for multiple choice
  if (question["type"] === "multiple") {
    const options = [
      question["correct_answer"],
      ...question["incorrect_answers"],
    ];
    options.forEach((opt) => decodeHtmlEntities(opt));
    shuffle(options);
    const mcOptionLabels = document.querySelectorAll("#multiple label");
    mcOptionLabels.forEach((opt, i) => {
      opt.appendChild(document.createTextNode(options[i]));
      // opt.innerText = options[i];
    });
    console.log(`options:${options}`);
  }
}
// function showQuestions(results) {
//   results.forEach((question, questionIndex) => {
//     const questionText = decodeHtmlEntities(question["question"]);
//     console.log(questionText);
//     const options = [
//       question["correct_answer"],
//       ...question["incorrect_answers"],
//     ];
//     if (question["type"] === "multiple") {
//       const mcTemplate = document.querySelector("#multiple");
//       const content = mcTemplate.content.cloneNode(true);
//       content.querySelector("legend").textContent = questionText;
//       shuffle(options);

//       const mcOptionLabels = content.querySelectorAll("label");
//       mcOptionLabels.forEach((opt, i) => {
//         opt.appendChild(document.createTextNode(options[i]));
//       });
//       const mcOptions = content.querySelectorAll("input");
//       mcOptions.forEach((opt) => {
//         opt.setAttribute("name", questionIndex);
//       });
//       questionSet.appendChild(content);
//     } else {
//       const booTemplate = document.querySelector("#boolean");
//       const content = booTemplate.content.cloneNode(true);
//       content.querySelector("legend").textContent = questionText;
//       const booOptions = content.querySelectorAll("input");
//       booOptions.forEach((opt) => {
//         opt.setAttribute("name", questionIndex);
//       });
//       questionSet.appendChild(content);
//     }
//   });
// }
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
const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", checkAnswers);
const nextBtn = document.querySelector("#next");

nextBtn.addEventListener("click", () => {
  let nextIdx = (prevQuesIdx + 1) % results.length;
  handleDisplay(nextIdx);
});
getQuestions(subject);

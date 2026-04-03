import Timer from "easytimer.js";
import initQuizStates from "./initQuizStates";
import render from "./render.js";
import checkAnswers from "./checkAns.js";

const url = {
  general: "https://opentdb.com/api.php?amount=10",
  music: "https://opentdb.com/api.php?amount=10&category=12",
  history: "https://opentdb.com/api.php?amount=10&category=23",
  mythology: "https://opentdb.com/api.php?amount=10&category=20",
};

const subjectParam = new URLSearchParams(window.location.search); //get the query string from the url
const subject = subjectParam.get("subject");

async function main() {
  let prevQues = { idx: -1, type: "" };

  try {
    setTimeout(console.log("fetch questions"), 2000);
    const response = await fetch(url[subject]);
    if (!response.ok) {
      throw new Error(`response status: ${response.status}`);
    }
    const data = await response.json();
    console.log("successful retrieval" + data.results);
    const [allQuestions, allSelectedAns, mcOptSeq] = initQuizStates(data);
    prevQues = render(0, allQuestions[0], prevQues, mcOptSeq, allSelectedAns);

    //timer
    const timer = new Timer();
    // Start a 30‑second countdown
    timer.start({ countdown: true, startValues: { seconds: 600 } });
    // Update DOM every second
    timer.addEventListener("secondsUpdated", () => {
      document.querySelector("time").textContent = timer
        .getTimeValues()
        .toString();
    });
    // Handle when time runs out
    timer.addEventListener("targetAchieved", () => {
      const popUpWindow = document.querySelector("#time-up-modal");
      popUpWindow.style.display = "block";
      checkAnswers(allSelectedAns, allQuestions);
      window.location.replace("score.html");
    });

    //button event listeners
    const questionBtns = document.querySelectorAll("#question-panel button");
    questionBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        (render(i, allQuestions[i], prevQues, mcOptSeq, allSelectedAns),
          console.log("i am question button"));
      });
    });
    const nextBtn = document.querySelector("#next");
    nextBtn.addEventListener("click", () => {
      let nextIdx = (prevQues["idx"] + 1) % allQuestions.length;
      prevQues = render(
        nextIdx,
        allQuestions[nextIdx],
        prevQues,
        mcOptSeq,
        allSelectedAns,
      );
    });

    const radios = document.querySelectorAll("input");
    radios.forEach((radio) => {
      radio.addEventListener("click", (e) => {
        allSelectedAns[prevQues["idx"]] = e.currentTarget.nextSibling.nodeValue;
      });
    });
    const submitBtn = document.querySelector("#submit");
    submitBtn.addEventListener("click", () => {
      let confirmed = true;
      if (allSelectedAns.some((ans) => ans === "")) {
        confirmed = confirm(
          "You still have unanswered questions. Do you still wish to submit?",
        );
      }
      if (confirmed) {
        timer.stop();
        checkAnswers(allSelectedAns, allQuestions);
        window.location.replace("score.html");
      }
    });
  } catch (err) {
    console.log(err);
  }
}
main();

// navigation bar
const exitBtn = document.querySelector("#exit");
exitBtn.addEventListener("click", () => {
  const confirmed = confirm(
    "The quiz is still going, do you wish to leave the quiz?",
  );
  if (confirmed) {
    window.location.replace("index.html");
  }
});
//

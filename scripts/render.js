function eraseDisplayContent(prevQuesType) {
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
/**
 * Displays the appropriate question type.
 * @param{number}questionIdx - the current question index
 * @param{string}prevQuesType - previous question type("boolean" or "multiple")
 * @param{string}currQuesType - current question type("boolean" or "multiple")
 * @returns {{questionIdx:questionIdx,questionType:currQuesType}} - the displayed question index and type
 */
function handleDisplayType(currQuesType, prevQuesType) {
  if (prevQuesType == "") {
    document.querySelector(`#${currQuesType}`).classList.remove("hide");
  } else {
    eraseDisplayContent(prevQuesType);
    // change question template to display
    if (prevQuesType != currQuesType) {
      document.querySelector(`#${prevQuesType}`).classList.add("hide");
      document.querySelector(`#${currQuesType}`).classList.remove("hide");
    }
  }
}

/**
 * display question text
 * @param {string} -question text
 */
function fillInQuestion(type, question) {
  //   console.log(document.querySelector(`#${question["type"]} legend`));
  document.querySelector(`#${type} legend`).textContent = question;
}
/**
 * display options
 * @param {string[][]} prevQuesOptSeq- previously displayed options for all questions, recording the display order of each option.
 * @param {number}questionIdx - current question index
 * @param {string[]} allOptions- options
 * description: display the current question's options. If the question is mc and it is the first time to display, shuffle options; else just display the previous order.
 */
function displayMcOptions(options, type) {
  let optLabels = document.querySelectorAll(`#${type} label`);
  optLabels.forEach((label, i) => {
    label.appendChild(document.createTextNode(options[i]));
  });
}
function displayPrevChoice(selectedOpt, type) {
  const options = document.querySelectorAll(`#${type} input`);
  options.forEach((opt) => {
    if (opt.nextSibling.nodeValue === selectedOpt) {
      opt.checked = true;
    }
  });
}

// browser method to parse html encoded entities

/**
 * display a question
 * @param {number} questionIdx
 * @param {object} questionData
 * @param {object} prevQues
 * @param {string[]} mcOptSeq
 * @param {string[]}selectedAns
 */
export default function render(
  questionIdx,
  questionData,
  prevQues,
  mcOptSeq,
  allSelectedAns,
) {
  const { type, question, correct_answer, incorrect_answers } = questionData;
  handleDisplayType(type, prevQues["type"]);
  fillInQuestion(type, question);
  if (type == "multiple") {
    displayMcOptions(mcOptSeq[questionIdx], type);
  }
  if (questionIdx in allSelectedAns) {
    displayPrevChoice(allSelectedAns[questionIdx], type);
  }
  prevQues.idx = questionIdx;
  prevQues.type = type;
  return prevQues;
}

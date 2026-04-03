/**
 * @param {string} - text containing html entities to be decoded
 * @returns {string} - decoded text
 */
function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
function shuffle(options) {
  for (let i = options.length - 1; i > -1; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
}
/**
 *the function does the followings:
 * initilze variable to store all questions
 * decode html entities in question text and options text
 * shuffle mc options and store sequence
 * initialize array for storing users' answers
 * @param {object[]} data - fetched data from trivial api
 *
 */
export default function initQuizStates(data) {
  const allQuestions = data["results"];
  const allSelectedAns = new Array(allQuestions.length).fill("");
  const mcOptSeq = {};

  allQuestions.forEach((item, i) => {
    allQuestions[i]["question"] = decodeHtmlEntities(
      allQuestions[i]["question"],
    );
    if (item["type"] == "multiple") {
      let options = [item["correct_answer"], ...item["incorrect_answers"]];
      let decodedOptions = options.map((opt) => decodeHtmlEntities(opt));
      shuffle(decodedOptions);
      mcOptSeq[i] = decodedOptions;
    }
  });
  return [allQuestions, allSelectedAns, mcOptSeq];
}

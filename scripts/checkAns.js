export default function checkAnswers(allSelectedAns, allQuestions) {
  let score = 0;
  allSelectedAns.forEach((ans, i) => {
    const correctAns = allQuestions[i]["correct_answer"];
    if (correctAns === ans) {
      score += 1;
    } else {
      if (ans === "") {
        ans = "unanswered";
      }
      sessionStorage.setItem(
        i,
        JSON.stringify([allQuestions[i]["question"], correctAns, ans]),
      );
    }
  });
  console.log(score);
  sessionStorage.setItem("score", score);
}

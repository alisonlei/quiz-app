export default function renderScore() {
  console.log("redirected from quiz pagae ");
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i); // get the key name
    const value = sessionStorage.getItem(key); // get the value
    console.log(key, value);
  }
  const score = sessionStorage.getItem("score");
  const h = document.querySelector("h1");
  h.textContent = score;
  if (score == "10") {
    const p = document.createElement("p");
    p.textContent = "Congradulations! You answered all questions correctly!";
  } else {
    const ul = document.createElement("ul");
    for (let i = 0; i < sessionStorage.length - 1; i++) {
      const key = sessionStorage.key(i); // get the key name
      const values = JSON.parse(sessionStorage.getItem(key)); // get the value
      const quesItem = document.createElement("li");
      const quesText = document.createElement("p");
      quesText.textContent = key;
      const ans = document.createElement("p");

      ans.textContent = `Correct answer: ${values[0]}\tYour answer: ${values[1]}`;
      quesItem.appendChild(quesText);
      quesItem.appendChild(ans);
      ul.appendChild(quesItem);
    }
    const main = document.querySelector("main");
    main.appendChild(ul);
  }
}
renderScore();

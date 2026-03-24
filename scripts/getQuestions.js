/**
 *
 * @param {string}subject - subject
 * @returns {object[]} - questions
 */
export default async function fetchTriviaQuizAPI(subject) {
  try {
    const response = await fetch(url[subject]);
    if (!response.ok) {
      throw new Error(`response status: ${response.status}`);
    }
    const data = response.json();
    console.log("sunceesful retrieval" + data.results);
    return data["results"];
  } catch (err) {
    console.log(err);
  }
}

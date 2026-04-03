function test() {
  const person = { fname: "alison", lname: "lei" };
  const fruits = ["apple", "banana", "pear"];
  const s = JSON.stringify(fruits);
  console.log(typeof s);
  console.log(typeof fruits);
  const parsedS = JSON.parse(s);
  console.log(parsedS);
  console.log(typeof parsedS);
}
function trySort() {
  const lt1 = [9, 4, 2, 5];
  lt1.sort((a, b) => a - b);
  console.log(lt1);
  const lt2 = new Array(5).fill("");
  console.log(lt2);
}
trySort();

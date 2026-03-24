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
test();

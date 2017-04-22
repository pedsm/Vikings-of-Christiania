var Person = (function () {
    function Person() {
    }
    return Person;
}());
function greeter(person) {
    return "Hello, " + person;
}
var pedro = new Person();
pedro.name = "Pedro";
var user = "Jane change this";
document.body.innerHTML = greeter(user);

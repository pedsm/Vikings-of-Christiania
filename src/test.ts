class Person{
	name:string;
	age:number;
}
function greeter(person) {
    return "Hello, " + person;
}

var pedro = new Person();
pedro.name = "Pedro";
var user = "Jane change this";

document.body.innerHTML = greeter(user);
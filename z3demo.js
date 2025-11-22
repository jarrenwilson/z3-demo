import { init } from 'z3-solver';

const { Context } = await init();
const { Solver, Int, And, Or, Distinct, Not } = new Context("main");

const solver = new Solver();

const b = Int.const('b');  // bob is a Z3 integer variable
const m = Int.const('m');  //  mary is a Z3 integer variable
const c = Int.const('c');  // cathy is a Z3 integer variable
const s = Int.const('s');  // sue is a Z3 integer variab;e

let cat = 1;
let dog = 2;
let bird = 3;
let fish = 4;

solver.add(And(b.ge(1), b.le(4) )); // b has either cat, dog, bird, fish
solver.add(And(m.ge(1), m.le(4) )); // m has either cat, dog, bird, fish
solver.add(And(c.ge(1), c.le(4) )); // c has either cat, dog, bird, fish
solver.add(And(s.ge(1), s.le(4) )); // s has either cat, dog, bird, fish

solver.add(Distinct(b,m,c,s)); // all people have distinct pets

solver.add(And(b.eq(dog), s.eq(bird), m.neq(fish))); // bob has dog, sue has bird, mary doesn't have fish

// Run Z3 solver, find solution and sat/unsat

if (await solver.check() === "sat") {
    let model = solver.model();
    const pet_names = {1: "Cat", 2: "Dog", 3: "Bird", 4: "Fish"};
    
    let b_pet = Number(model.eval(b).toString());
    let m_pet = Number(model.eval(m).toString());
    let c_pet = Number(model.eval(c).toString());
    let s_pet = Number(model.eval(s).toString());
    console.log(`Bob: ${pet_names[b_pet]}`);
    console.log(`Mary: ${pet_names[m_pet]}`);
    console.log(`Cathy: ${pet_names[c_pet]}`);
    console.log(`Sue: ${pet_names[s_pet]}`);
} else {

    console.log("unsat. Could not find a valid value for x.");

}

solver.reset()

const x = Int.const('x');
const y = Int.const('y');
solver.add(x.ge(5), x.le(10));
solver.add(y.ge(15), y.le(25));
solver.add(x.neq(5), x.neq(10), y.neq(15), y.neq(25));

if (await solver.check() == "sat"){
    let model = solver.model();
    const x_coordinate = Number(model.eval(x).toString());
    const y_coordinate = Number(model.eval(y).toString());
    console.log(`Inside fence coordinates: ${x_coordinate}, ${y_coordinate}`)
} else {
    console.log("unsat. Could not find a valid value for x.");
}

solver.reset();

const x_1 = Int.const('x');
const y_1 = Int.const('y');

let left_side = And(x_1.eq(5), y_1.ge(15), y_1.le(25));
let top = And(y_1.eq(15), x_1.ge(5), x_1.le(10));
solver.add(Or(left_side, top));

if (await solver.check() == "sat"){
    let model = solver.model();
    const x_coordinate = Number(model.eval(x_1).toString());
    const y_coordinate = Number(model.eval(y_1).toString());
    console.log(`On fence coordinates: ${x_coordinate}, ${y_coordinate}`)
} else {
    console.log("unsat. Could not find a valid value for x.");
}
solver.reset();

const x_2 = Int.const('x');
const y_2 = Int.const('y');

const main_constraint  = And(x_2.ge(8), y_2.ge(20));
solver.add(main_constraint);
const inside_constraint = And(x_2.ge(5), x_2.le(10), y_2.ge(15), y_2.le(25));
solver.add(Not(inside_constraint));
if (await solver.check() == "sat"){
    let model = solver.model();
    const x_coordinate = Number(model.eval(x_2).toString());
    const y_coordinate = Number(model.eval(y_2).toString());
    console.log(`Tree Coordinates: ${x_coordinate}, ${y_coordinate}`);
    
} else {
    console.log("unsat. Could not find a valid value for x.");
}

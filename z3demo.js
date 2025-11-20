import { init } from 'z3-solver';

const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");

const solver = new Solver();

const b = Int.const('b');  // bob is a Z3 integer variable
const m = Int.const('m');  //  mary is a Z3 integer variable
const c = Int.const('c');  // cathy is a Z3 integer variable
const s = Int.const('s');  // sue is a Z3 integer variab;e

let cat = 1
let dog = 2
let bird = 3
let fish = 4

solver.add(And(b.ge(1), b.le(4) )) // b has either cat, dog, bird, fish
solver.add(And(m.ge(1), m.le(4) )) // m has either cat, dog, bird, fish
solver.add(And(c.ge(1), c.le(4) )) // c has either cat, dog, bird, fish
solver.add(And(s.ge(1), s.le(4) )) // s has either cat, dog, bird, fish

solver.add(Distinct(b,m,c,s)) // all people have distinct pets

solver.add(And(b.eq(dog), s.eq(bird), m.neq(fish))); // bob has dog, sue has bird, mary doesn't have fish

// Run Z3 solver, find solution and sat/unsat

if (await solver.check() === "sat") {
    let model = solver.model();
    const pet_names = {1: "Cat", 2: "Dog", 3: "Bird", 4: "Fish"}
    
    let b_pet = Number(model.eval(b).toString())
    let m_pet = Number(model.eval(m).toString())
    let c_pet = Number(model.eval(c).toString())
    let s_pet = Number(model.eval(s).toString())
    console.log(pet_names[b_pet])
    console.log(pet_names[m_pet])
    console.log(pet_names[c_pet])
    console.log(pet_names[s_pet])
} else {

    console.log("unsat. Could not find a valid value for x.");

}
solver.reset()
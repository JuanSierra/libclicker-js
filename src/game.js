const World = require('./world');
const Currency = require('./currency');
const Generator = require('./generator');
const Automator = require('./automator');
const Modifier = require('./modifier');

let world = new World();
let c = new Currency.Builder(world)
      .build();
let g = new Generator.Builder(world)
      .generate(c)
      .build();
g.upgrade();

let a = new Automator.Builder(world)
      .automate(g)
      .every(1.0)
      .build();
a.upgrade();
console.log(g.getTimesProcessed())
world.update(1.0);
//console.log(g.getTimesProcessed())
//expect(g.getTimesProcessed()).toBe(1);

//world.update(9.0);
//expect(g.getTimesProcessed()).toBe(10);

/*
var world = new World();
world.update(1.0 / 60.0);

// Creates a new currency called "Gold"
var gold = new Currency.Builder(world)
    .name("Gold")
    .build();

var goldMine = new Generator.Builder(world)
    .generate(gold)   // Generate gold
    .baseAmount(10)   // Defaults to 10 gold per tick
    .multiplier(1.15) // Increase amount by 15 % per level
    .price(100)       // Price of level 1 gold mine
    .priceMultiplier(1.25) // Increase price by 25 % per level
    .build();

var goldDigger = new Automator.Builder(world)
      .automate(goldMine)
      .every(3.0) // Tick every three seconds
      .build();
      
// Advance the world by 30 seconds to make the automator work
world.update(30.0);


// Modifier Test

var w = new World();
var m = new Modifier.Builder()
      .modify(w)
      .speedBy(2.0)
      .build();

m.enable();

w.update(10.0);

m.disable();

w.update(10.0);
*/
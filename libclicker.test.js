const World = require('./world');
const Currency = require('./currency');
const Generator = require('./generator');
const Automator = require('./automator');
const Modifier = require('./modifier');

test('Testing automator', () => {
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

    world.update(1.0);
    expect(g.getTimesProcessed()).toBe(1);

    world.update(9.0);
    expect(g.getTimesProcessed()).toBe(10);
});

test('Test Generation', () => {
    const w = new World();
    const c = new Currency.Builder(w).name("Gold").build();
    //const cf = new Formatter.ForCurrency(c)
    //    .showHighestThousand()
    //    .showDecimals()
    //    .build();

    const g = new Generator.Builder(w)
        .baseAmount(100)
        .multiplier(1.2)
        .generate(c)
        .build();
    
    expect(g.getGeneratedAmount()).toBe(0);
    g.process();
    expect(c.value).toBe(0);

    g.upgrade();
    expect(g.getGeneratedAmount()).toBe(100);
    g.process();
    expect(c.value, 100);

    var amount = g.getGeneratedAmount();
    g.upgrade();
    g.process();
    amount = amount.add(g.getGeneratedAmount());
    // assertEquals(amount, c.getValue());
    expect(c.value).toBe(amount);
});

test('Test remainder usage', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .build();
    const g = new Generator.Builder(w)
        .baseAmount(1)
        .multiplier(1.2)
        .useRemainder()
        .generate(c)
        .build();
    
    // Set to level 2
    g.setItemLevel(2);
    expect(c.value).toBe(0);

    g.process();
    expect(c.value).toBe(1);
    
    g.process();
    expect(c.value).toBe(2);
    
    g.process();
    expect(c.value).toBe(4);
    
    g.process();
    expect(c.value).toBe(5);
    
    g.process();
    expect(c.value).toBe(6);
});
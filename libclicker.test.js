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
    //console.log('value ' + c.value);
    expect(c.value).toBe(100);

    var amount = g.getGeneratedAmount();
    g.upgrade();
    g.process();
    amount = amount + g.getGeneratedAmount();
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
    expect(c.value).toBe(3);
    
    g.process();
    expect(c.value).toBe(4);
    
    g.process();
    expect(c.value).toBe(6);
});

test('Currency Testing getName', () => {
    let world = new World();
    let instance = new Currency.Builder(world)
        .name("TestCurrency")
        .build();
    let result = instance.name;

    expect(result).toBe("TestCurrency");
});

test('Currency Test Arithmetic', () => {
    let world = new World();
    let c = new Currency.Builder(world)
        .build();

    c.add(1);
    expect(c.value).toBe(1);

    c.add(12344);
    expect(c.value).toBe(12345);

    c.sub(300);
    expect(c.value).toBe(12045);

    c.set(100);
    expect(c.value).toBe(100);

    c.multiply(2.0);
    expect(c.value).toBe(200);

    c.multiply(1.145);
    let targetVal = parseInt(1.145 * 200);
    expect(c.value).toBe(targetVal);
});

test('Modifier Test SingleWorldSpeed', () => {
    let world = new World();
    let m = new Modifier.Builder()
        .modify(world)
        .speedBy(2.0)
        .build();

    m.enable();
    expect(world.getSpeedMultiplier()).toBeCloseTo(1.0 * 2.0);

    m.disable();
    expect(world.getSpeedMultiplier()).toBeCloseTo(1.0);
});
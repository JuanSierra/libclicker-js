const World = require('../src/world');
const Currency = require('../src/currency');
const Generator = require('../src/generator');
const Automator = require('../src/automator');
const { Modifier } = require('../src/modifier');
const Item = require('../src/item');
const PurchaseResult = require('../src/PurchaseResult');
const BigIntUtils = require('../src/bigint-utils');

class ItemImpl extends Item {
    constructor() {
        super(null);
    }
}

test('Currency with BigInt preserves values beyond MAX_SAFE_INTEGER', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const bigValue = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1000);
    c.set(bigValue);
    expect(c.value).toBe(bigValue);
    expect(typeof c.value).toBe('bigint');

    c.add(500n);
    expect(c.value).toBe(bigValue + 500n);

    c.sub(200n);
    expect(c.value).toBe(bigValue + 300n);
});

test('Generator produces exact amounts beyond MAX_SAFE_INTEGER', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(1000000000000000) // 10^15, close to MAX_SAFE_INTEGER
        .multiplier(2)
        .useBigInt()
        .generate(c)
        .build();

    g.upgrade();
    g.process();
    expect(c.value).toBe(BigInt(1000000000000000));

    g.upgrade();
    g.process();
    expect(c.value).toBe(BigInt(2000000000000000) + BigInt(1000000000000000));

    g.upgrade();
    g.process();
    expect(c.value).toBe(BigInt(4000000000000000) + BigInt(2000000000000000) + BigInt(1000000000000000));
});

test('Generator remainder carry-over works with BigInt', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(1)
        .multiplier(1.2)
        .useRemainder()
        .useBigInt()
        .generate(c)
        .build();

    g.setItemLevel(2);
    expect(c.value).toBe(BigInt(0));

    g.process();
    expect(c.value).toBe(BigInt(1));

    g.process();
    expect(c.value).toBe(BigInt(2));

    g.process();
    expect(c.value).toBe(BigInt(3));

    g.process();
    expect(c.value).toBe(BigInt(4));

    g.process();
    expect(c.value).toBe(BigInt(6));
});

test('Modifier multiplier applied to BigInt production', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(1000000000000000)
        .multiplier(2)
        .useBigInt()
        .generate(c)
        .build();

    g.upgrade();
    g.process();
    expect(c.value).toBe(BigInt(1000000000000000));

    const m = new Modifier.Builder()
        .modify(g)
        .multiplier(2)
        .build();
    m.enable();

    g.upgrade();
    g.process();
    expect(c.value).toBe(BigInt(1000000000000000) + BigInt(4000000000000000));

    m.disable();
    g.upgrade();
    g.process();
    expect(c.value).toBe(BigInt(5000000000000000) + BigInt(4000000000000000));
});

test('Automator accumulates large production over many ticks with BigInt', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(100000000000000)
        .multiplier(3)
        .useBigInt()
        .generate(c)
        .build();

    g.upgrade();

    const a = new Automator.Builder(w)
        .automate(g)
        .every(1.0)
        .useBigInt()
        .build();
    a.upgrade();

    w.update(10.0);
    expect(g.getTimesProcessed()).toBe(10);
    expect(c.value).toBe(BigInt(1000000000000000));

    w.update(100.0);
    expect(g.getTimesProcessed()).toBe(110);
    expect(c.value).toBe(BigInt(11000000000000000));
});

test('Item price calculation with BigInt basePrice', () => {
    const item = new ItemImpl();
    item._useBigInt = true;
    item.basePrice = BigIntUtils.from(1000000000000000);
    item.priceMultiplier = 1.5;

    expect(item.getPrice()).toBe(BigInt(1000000000000000));

    item.upgrade();
    expect(item.getPrice()).toBe(BigInt(1500000000000000));

    item.upgrade();
    expect(item.getPrice()).toBe(BigInt(2250000000000000));
});

test('Purchase with large currency and prices using BigInt', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(1000)
        .price(500000000000000)
        .useBigInt()
        .generate(c)
        .build();

    c.set(BigInt(1000000000000000));

    expect(c.value).toBe(BigInt(1000000000000000));

    const pr = g.buyWith(c);
    expect(pr).toBe(PurchaseResult.OK);
    expect(g.getItemLevel()).toBe(1);
    expect(c.value).toBe(BigInt(500000000000000));
});

test('Non-BigInt mode still works identical to before', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(100)
        .multiplier(1.2)
        .generate(c)
        .build();

    expect(c.value).toBe(0);
    expect(g.getGeneratedAmount()).toBe(0);

    g.upgrade();
    expect(g.getGeneratedAmount()).toBe(100);
    g.process();
    expect(c.value).toBe(100);

    g.upgrade();
    g.process();
    expect(c.value).toBe(220);

    expect(typeof c.value).toBe('number');
});

test('Currency getAmountAsString returns correct string for large values', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    c.set(BigInt("9999999999999999999"));
    expect(c.getAmountAsString()).toBe("9999999999999999999");

    c.add(BigInt("1"));
    expect(c.getAmountAsString()).toBe("10000000000000000000");
});

test('Generator with fractional multiplier and BigInt uses scaled arithmetic', () => {
    const w = new World();
    const c = new Currency.Builder(w)
        .name("Gold")
        .useBigInt()
        .build();

    const g = new Generator.Builder(w)
        .baseAmount(7)
        .multiplier(1.25)
        .discardRemainder()
        .useBigInt()
        .generate(c)
        .build();

    g.upgrade();
    expect(g.getGeneratedAmount()).toBe(BigInt(7));

    g.upgrade();
    expect(g.getGeneratedAmount()).toBe(BigInt(8));

    g.upgrade();
    expect(g.getGeneratedAmount()).toBe(BigInt(10));

    g.upgrade();
    expect(g.getGeneratedAmount()).toBe(BigInt(13));
});

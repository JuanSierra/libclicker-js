const World = require('../src/world');
const Currency = require('../src/currency');
const Generator = require('../src/generator');
const PurchaseResult = require('../src/PurchaseResult');
const Item = require('../src/item');

class ItemImpl extends Item
{
    constructor()
    {
        super(null);
    }
}

test('Testing name', () => {
    let item = new ItemImpl();
    item.setName("Test");
    expect(item.getName()).toBe("Test");
});

test('Testing description', () => {
    let item = new ItemImpl();
    item.setDescription("Description text here.");
    expect(item.getDescription()).toBe("Description text here.");
});

test('Testing base price', () => {
    let item = new ItemImpl();
    item.setBasePrice(10);
    expect(item.getBasePrice()).toBe(10);
});

test('Testing price', () => {
    let item = new ItemImpl();

    item.setBasePrice(10);
    item.setPriceMultiplier(1.5);
    
    expect(item.getPrice()).toBe(10);

    item.upgrade();
    expect(item.getPrice()).toBe(15);
});

test('Testing purchase', () => {
    let world = new World();
    let c = new Currency.Builder(world)
            .name("Gold")
            .build();

    let g = new Generator.Builder(world)
            .baseAmount(1000)
            .price(500)
            .generate(c)
            .build();
    
    expect(c.value).toBe(0);

    let pr = g.buyWith(c);
    expect(pr).toBe(PurchaseResult.INSUFFICIENT_FUNDS);

    g.upgrade();
    g.process();
    
    expect(g.getItemLevel()).toBe(1);

    pr = g.buyWith(c);
    expect(pr).toBe(PurchaseResult.OK);
    expect(g.getItemLevel()).toBe(2);
    
    g.setMaxItemLevel(2);
    
    g.process();
    pr = g.buyWith(c);
    expect(pr).toBe(PurchaseResult.MAX_LEVEL_REACHED);
    expect(g.getItemLevel()).toBe(2);
});

   /**
     * Test of setBasePrice method, of class Item.
     */


    /**
     * Test of setBasePrice method, of class Item.
     */
    /**
     * Test of setBasePrice method, of class Item.
    */

test('Testing SetBasePrice', () => {
    let item = new ItemImpl();
    item.setBasePrice(1234);
    expect(item.getBasePrice()).toBe(1234);
});

test('Testing PriceMultiplier', () => {
    let item = new ItemImpl();
    item.setPriceMultiplier(1.23);
    expect(item.getPriceMultiplier()).toBeCloseTo(1.23);
});

test('Testing MaxItemLevel', () => {
    let item = new ItemImpl();
    item.setMaxItemLevel(12);

    item.setItemLevel(14);
    expect(item.getItemLevel()).toBe(12);

    item.setItemLevel(5);
    expect(item.getItemLevel()).toBe(5);

    item.setItemLevel(12);
    expect(item.getItemLevel()).toBe(12);

    item.upgrade();
    expect(item.getItemLevel()).toBe(12);

    item.setMaxItemLevel(13);
    expect(item.getItemLevel()).toBe(12);

    item.upgrade();
    expect(item.getItemLevel()).toBe(13);
});

test('Testing UpgradeDowngradeMaximize', () => {
    let item = new ItemImpl();
    expect(item.getItemLevel()).toBe(0);

    item.upgrade();
    expect(item.getItemLevel()).toBe(1);

    item.upgrade();
    expect(item.getItemLevel()).toBe(2);

    item.downgrade();
    expect(item.getItemLevel()).toBe(1);

    item.downgrade();
    expect(item.getItemLevel()).toBe(0);

    item.downgrade();
    expect(item.getItemLevel()).toBe(0);
    
    item.setMaxItemLevel(10);
    item.maximize();
    expect(item.getItemLevel()).toBe(item.getMaxItemLevel());
});

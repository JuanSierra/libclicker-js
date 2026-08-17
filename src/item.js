const PurchaseResult = require('./PurchaseResult');
const BigIntUtils = require('./bigint-utils');

/**
 * Base class for all purchasable items.
 * Items have a level, price, and can be upgraded/downgraded.
 * Supports optional BigInt arithmetic via the basePrice property.
 *
 * @author Harri Pellikka
 * @class
 */
class Item {
    /**
     * Constructs a new item.
     * @param {World} world - World this item belongs to
     * @param {string} [name="Nameless Item"] - Name of this item
     */
    constructor (world, name = "Nameless Item") {
        /**
         * World this item belongs to
         * @type {World}
         */
        this.world = world;

        /**
         * Modifiers applied to this item
         * @type {Array}
         */
        this.modifiers = [];

        /**
         * The base price of the item (i.e. the price of the first level).
         * When using BigInt mode, this is stored as a bigint.
         * @type {number|bigint}
         */
        this.basePrice = 1;

        /**
         * Name of this item
         * @type {string}
         */
        this.name = name;

        /**
         * Description text for this item
         * @type {string}
         */
        this.description = "No description.";

        /**
         * Current level of this item
         * @type {number}
         */
        this.itemLevel = 0;

        /**
         * Maximum item level
         * @type {number}
         */
        this.maxItemLevel = 99999999;

        /**
         * Price multiplier per level. Used in the formula:
         * price = basePrice * (priceMultiplier ^ itemLevel)
         * @type {number}
         */
        this.priceMultiplier = 1.145;
    }

    /**
     * Retrieves the name of this item.
     * @returns {string} Name of this item
     */
    getName() {
        return this.name;
    }

    /**
     * Sets the name of this item.
     * @param {string} name - New name for this item
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Retrieves the description of this item.
     * @returns {string} Description text
     */
    getDescription() {
        return this.description;
    }

    /**
     * Sets the description of this item.
     * @param {string} description - New description text
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * Retrieves the base price of this item.
     * @returns {number|bigint} Base price (number or bigint depending on configuration)
     */
    getBasePrice() {
        return this.basePrice;
    }

    /**
     * Sets the base price of this item.
     * @param {number} basePrice - New base price (must not be null or zero)
     * @throws {string} If basePrice is null or zero
     */
    setBasePrice(basePrice) {
        if (basePrice == null) throw "Base price cannot be null";
        if (basePrice == 0)
            throw "Base price cannot be zero";

        this.basePrice = basePrice;
    }

    /**
     * Retrieves the price multiplier.
     * @returns {number} Price multiplier
     */
    getPriceMultiplier() {
        return this.priceMultiplier;
    }

    /**
     * Sets the price multiplier of this item.
     * @param {number} multiplier - Price multiplier value
     */
    setPriceMultiplier(multiplier) {
        this.priceMultiplier = multiplier;
    }

    /**
     * Retrieves the maximum item level.
     * @returns {number} Maximum item level
     */
    getMaxItemLevel() {
        return this.maxItemLevel;
    }

    /**
     * Sets the maximum item level.
     * @param {number} maxLvl - Maximum level (must be positive)
     * @throws {string} If maxLvl is zero or negative
     */
    setMaxItemLevel(maxLvl) {
        if (maxLvl <= 0) throw "Max item level cannot be zero or negative";
        this.maxItemLevel = maxLvl;
    }

    /**
     * Retrieves the current item level.
     * @returns {number} Current item level
     */
    getItemLevel() {
        return this.itemLevel;
    }

    /**
     * Sets the item level, clamping between 0 and maxItemLevel.
     * @param {number} lvl - Desired level
     */
    setItemLevel(lvl) {
        this.itemLevel = lvl < 0 ? 0 : lvl > this.maxItemLevel ? this.maxItemLevel : lvl;
    }

    /**
     * Upgrades this item by one level, if not at maximum level.
     */
    upgrade() {
        if (this.itemLevel < this.maxItemLevel) {
            this.itemLevel++;
        }
    }

    /**
     * Downgrades this item by one level, if above level 0.
     */
    downgrade() {
        if (this.itemLevel > 0) {
            this.itemLevel--;
        }
    }

    /**
     * Sets this item's level to its maximum.
     */
    maximize() {
        this.itemLevel = this.maxItemLevel;
    }

    /**
     * Calculates the current price of this item based on its level.
     * Formula: price = basePrice * (priceMultiplier ^ itemLevel)
     * @returns {number|bigint} Current price (bigint if basePrice is bigint)
     */
    getPrice() {
        var tmp;
        if (typeof this.basePrice === 'bigint') {
            var priceMultiplierFloat = Number(this.basePrice) * Math.pow(this.priceMultiplier, this.itemLevel);
            return BigInt(Math.floor(priceMultiplierFloat));
        }
        tmp = this.basePrice;
        tmp = tmp * Math.pow(this.priceMultiplier, this.itemLevel);
        return tmp;
    }

    /**
     * Attempts to purchase this item using the given currency.
     * If successful, upgrades the item and deducts the price from the currency.
     * @param {Currency} currency - Currency to pay with
     * @returns {string} PurchaseResult indicating outcome (OK, INSUFFICIENT_FUNDS, MAX_LEVEL_REACHED)
     */
    buyWith(currency) {
        if (this.itemLevel >= this.maxItemLevel)
            return PurchaseResult.MAX_LEVEL_REACHED;

        var price = this.getPrice();
        var result;
        
        if (typeof currency.value === 'bigint') {
            result = currency.value - BigIntUtils.from(price);
        } else {
            result = currency.value - price;
        }
		
        if (result < 0) {
            return PurchaseResult.INSUFFICIENT_FUNDS;
        }
        
        if (typeof currency.value === 'bigint') {
            currency.value = currency.value - BigIntUtils.from(price);
        } else {
            currency.value -= price;
        }
        
        this.upgrade();
        return PurchaseResult.OK;
    }
}

module.exports = Item;

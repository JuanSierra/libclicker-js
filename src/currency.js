const BigIntUtils = require('./bigint-utils');

/**
 * Base class for all currencies.
 * Stores the current value which can be either a number or BigInt depending on configuration.
 *
 * @author Harri Pellikka
 * @class
 */
class Currency
{
    /**
     * Constructs a new currency from a builder.
     * @param {Object} build - The builder object containing configuration
     * @param {string} build.mName - Name of the currency
     * @param {World} build.world - The world this currency belongs to
     * @param {boolean} build._useBigInt - Whether to use BigInt for value storage
     */
    constructor (build){
        this.name = build.mName;
        this.world = build.world;
        this._useBigInt = build._useBigInt || false;
        
        if (this._useBigInt) {
            /** @type {bigint} */
            this.value = BigInt(0);
        } else {
            /** @type {number} */
            this.value = 0;
        }
    }

    /**
     * Builder class for creating new currencies.
     * @class
     */
    static get Builder() {
        class Builder {
            /**
             * Constructs a new currency builder.
             * @param {World} world - The world the currency belongs to
             */
            constructor(world) {
                this.mName = "Gold";
                this.world = world;
                this._useBigInt = false;
            }

            /**
             * Sets the name for this currency.
             * @param {string} name - Currency name
             * @returns {Builder} This builder for chaining
             */
            name(name) {
                this.mName = name;
                return this;
            }

            /**
             * Enables BigInt mode for this currency.
             * When enabled, the currency value is stored as JavaScript BigInt,
             * allowing exact arithmetic for values beyond Number.MAX_SAFE_INTEGER (~9×10^15).
             * @returns {Builder} This builder for chaining
             */
            useBigInt() {
                this._useBigInt = true;
                return this;
            }

            /**
             * Builds and returns a new Currency instance.
             * @returns {Currency} The constructed currency
             */
            build() {
                return new Currency(this);
            }
        }

        return Builder;
    }
	
    /**
     * Returns the currency value as a string representation.
     * Useful for display purposes since BigInt cannot be directly interpolated in strings.
     * @returns {string} String representation of the currency value
     */
    getAmountAsString() {
        return this.value.toString();
    }

    /**
     * Adds an amount to the currency value.
     * @param {number|string|bigint} amount - Amount to add
     */
    add(amount) {
        if (this._useBigInt) {
            this.value = BigIntUtils.add(this.value, amount);
        } else {
            this.value = this.value + amount;
        }
    }

    /**
     * Subtracts an amount from the currency value.
     * @param {number|string|bigint} amount - Amount to subtract
     */
    sub(amount) {
        if (this._useBigInt) {
            this.value = BigIntUtils.sub(this.value, amount);
        } else {
            this.value = this.value - amount;
        }
    }

    /**
     * Multiplies the currency value by a multiplier.
     * @param {number|string|bigint} multiplier - Multiplier value
     */
    multiply(multiplier) {
        if (this._useBigInt) {
            this.value = BigIntUtils.mul(this.value, multiplier);
        } else {
            this.value = this.value * multiplier;
        }
    }

    /**
     * Sets the currency value to a new value.
     * @param {number|string|bigint} newValue - New value to set
     */
    set(newValue) {
        if (this._useBigInt) {
            this.value = BigIntUtils.from(newValue);
        } else {
            this.value = newValue;
        }
    }

	/**
     * Compares two objects for deep equality via JSON serialization.
     * @param {*} a - First object
     * @param {*} b - Second object
     * @returns {boolean} true if both objects have identical JSON representations
     */
	equals(a,b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
}

module.exports = Currency

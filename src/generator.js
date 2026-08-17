const Item = require('./item');
const BigIntUtils = require('./bigint-utils');

/**
 * A base class for all generators.
 * Generators produce resources (currencies) and can be controlled
 * manually or automatically via Automators.
 * Supports optional BigInt arithmetic for high-precision production at high levels.
 *
 * @author Harri Pellikka
 * @extends Item
 * @class
 */
class Generator extends Item {
    /**
     * Constructs a new generator from a builder.
     * @param {Object} build - The builder object containing configuration
     */
    constructor(build){
        super(build.mWorld, build.mName);

        this._useBigInt = build._useBigInt || false;
        this.maxItemLevel = build.mMaxLevel;
        this.amountMultiplier = build.mAmountMultiplier;
        this.useRemainder = build.mUseRemainder;
        this.timesProcessed = build.mTimesProcessed;
        this.currency = build.mCurrency;
        
        if (build.basePrice != null) {
            if (this._useBigInt) {
                this.basePrice = BigIntUtils.from(build.basePrice);
            } else {
                this.basePrice = build.basePrice;
            }
        }
        
        if (build.priceMultiplier != null) {
            this.priceMultiplier = build.priceMultiplier;
        }

        if (this._useBigInt) {
            /**
             * Base amount of resources generated per cycle at level 1.
             * Stored as bigint when BigInt mode is enabled.
             * @type {bigint}
             */
            this.baseAmount = BigIntUtils.from(build.mBaseAmount);
            /**
             * Accumulated fractional remainder for overflow-based generation.
             * Only used when useRemainder is true and BigInt mode is enabled.
             * @type {bigint}
             */
            this.remainder = BigInt(0);
            /**
             * Floating-point helper for tracking fractional remainders in BigInt mode.
             * @type {number}
             */
            this._remainderFloat = 0;
        } else {
            /**
             * Base amount of resources generated per cycle at level 1.
             * @type {number}
             */
            this.baseAmount = build.mBaseAmount;
            /**
             * Accumulated fractional remainder for overflow-based generation.
             * @type {number}
             */
            this.remainder = 0;
            this._remainderFloat = 0;
        }

        this.modifiers = [];
    }

    /**
     * Builder class for creating new generators.
     * @class
     */
	static get Builder() {
        class Builder {
            /**
             * Constructs a new generator builder.
             * @param {World} world - The world the generator belongs to
             */
            constructor(world) {
                this.mWorld = world;
                this.mName = "Nameless generator";
                this.mOnProcessed = null;
                this.mCurrency = null;
                this.mBaseAmount = 1;
                this.mAmountMultiplier = 1.1;
                this.mMaxLevel = 999999999;
                this.mBasePrice = 999999999;
                this.mPriceMultiplier = 1.1;
                this.mProbability = 1.0;
                this.mProbabilitySet = false;
                this.mUseRemainder = true;
                this.mCooldown = 0.0;
                this.mTimesProcessed = 0;
                this._useBigInt = false;
            }

            /**
             * Sets the cooldown of this generator (in seconds).
             * This is the minimum time between processing this generator.
             * @param {number} cooldown - Cooldown duration in seconds
             * @returns {Builder} This builder for chaining
             */
            cooldown(cooldown) {
                this.mCooldown = cooldown;
                return this;
            }

            /**
             * Enables remainder storage: fractional parts of generated amounts
             * are accumulated and trigger an extra unit when they overflow to 1.0.
             * @returns {Builder} This builder for chaining
             */
            useRemainder() {
                this.mUseRemainder = true;
                return this;
            }

            /**
             * Disables remainder storage: fractional parts are discarded each cycle.
             * @returns {Builder} This builder for chaining
             */
            discardRemainder() {
                this.mUseRemainder = false;
                return this;
            }

            /**
             * Sets the name for the generator.
             * @param {string} name - Name for the generator
             * @returns {Builder} This builder for chaining
             */
            name(name) {
                this.mName = name;
                return this;
            }

            /**
             * Sets the multiplier for resource generation per level.
             * Formula: amount = baseAmount * (multiplier ^ (level - 1))
             * @param {number} multiplier - Amount generation multiplier per level
             * @returns {Builder} This builder for chaining
             */
            multiplier(multiplier) {
                this.mAmountMultiplier = multiplier;
                return this;
            }

            /**
             * Sets the base amount of resources generated by this generator at level 1.
             * @param {number} amount - Base amount of resources
             * @returns {Builder} This builder for chaining
             * @throws {string} If amount is null
             */
            baseAmount(amount) {
                if (amount == null) throw "Base amount cannot be null";
                this.mBaseAmount = amount;
                return this;
            }

            /**
             * Sets the currency that this generator produces.
             * @param {Currency} resource - Currency to generate
             * @returns {Builder} This builder for chaining
             * @throws {string} If resource is null
             */
            generate(resource) {
                if (resource == null) throw "Currency cannot be null";
                this.mCurrency = resource;
                return this;
            }

            /**
             * Sets a callback invoked after each processing cycle.
             * @param {Function} callback - Callback function
             * @returns {Builder} This builder for chaining
             */
            callback(callback) {
                this.onProcessed = callback;
                return this;
            }

            /**
             * Sets the base price of this generator.
             * @param {number} price - Base price
             * @returns {Builder} This builder for chaining
             */
            price(price) {
                this.basePrice = price;
                return this;
            }

            /**
             * Sets the price multiplier per level.
             * @param {number} multiplier - Price multiplier
             * @returns {Builder} This builder for chaining
             */
            priceMultiplier(multiplier) {
                this.priceMultiplier = multiplier;
                return this;
            }

            /**
             * Sets a probability for this generator to work when processed.
             * @param {number} probability - Probability between 0.0 and 1.0
             * @returns {Builder} This builder for chaining
             * @throws {string} If probability is outside [0.0, 1.0]
             */
            probability(probability) {
                if (probability < 0 || probability > 1.0)
                    throw "Probability should be between 0.0 and 1.0";

                this.probability = probability;
                this.probabilitySet = true;
                
                return this;
            }

            /**
             * Enables BigInt mode for this generator.
             * When enabled, baseAmount, remainder, and generated amounts are stored as JavaScript BigInt,
             * providing exact arithmetic for values beyond Number.MAX_SAFE_INTEGER (~9×10^15).
             * Uses scaled integer arithmetic internally to handle fractional multipliers (e.g., 1.25).
             * @returns {Builder} This builder for chaining
             */
            useBigInt() {
                this._useBigInt = true;
                return this;
            }

            /**
             * Builds and returns a new Generator instance.
             * @returns {Generator} The constructed generator
             */
            build() {
                return new Generator(this);
            }
        }

        return Builder;
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
	
	/**
     * Upgrades this generator by one level, if not at maximum level.
     */
	upgrade() {
		if (this.itemLevel < this.maxItemLevel) {
            this.itemLevel++;
        }
	}

    /**
     * Downgrades this generator by one level.
     */
    downgrade() {
        if (this.itemLevel > 0) {
            this.itemLevel--;
        }
    }

    /**
     * Retrieves the amount this generator produces per processing cycle.
     * Formula: baseAmount * (amountMultiplier ^ (level - 1)), with optional remainder carry-over.
     * In BigInt mode, uses scaled integer arithmetic for fractional multipliers.
     * @returns {number|bigint} Generated amount (bigint if BigInt mode is enabled)
     */
    getGeneratedAmount() {
        if (this.itemLevel == 0) return 0;

        var tmp;
        
        if (this._useBigInt) {
            tmp = this.baseAmount;
            
            var mult = this.amountMultiplier;
            var scale = 1;
            var decimalPlaces = 0;
            
            while (mult !== Math.floor(mult)) {
                mult *= 10;
                scale *= 10;
                decimalPlaces++;
            }
            
            var scaledMult = BigInt(Math.floor(mult));
            var scaledScale = BigInt(scale);
            
            var powResult = BigIntUtils.pow(scaledMult, this.itemLevel - 1);
            var divisor = BigIntUtils.pow(scaledScale, this.itemLevel - 1);
            
            tmp = BigIntUtils.mul(tmp, powResult);
            tmp = BigIntUtils.div(tmp, divisor);
            
            if (this.useRemainder) {
                var floatBase = typeof this.baseAmount === 'bigint' ? Number(this.baseAmount) : this.baseAmount;
                var floatAmount = floatBase * Math.pow(this.amountMultiplier, this.itemLevel - 1);
                var tmpRem = floatAmount % 1;
                this._remainderFloat += tmpRem;
                if (this._remainderFloat >= 0.999) {
                    this._remainderFloat -= 1.0;
                    this.remainder += BigInt(1);
                }
            }
            
            if (this.remainder > 0n) {
                tmp = BigIntUtils.add(tmp, this.remainder);
                this.remainder = BigInt(0);
            }
        } else {
            tmp = this.baseAmount;
            tmp = tmp * Math.pow(this.amountMultiplier, this.itemLevel - 1);

            if (this.useRemainder) {
                var tmpRem = tmp % 1;
                this.remainder += tmpRem;
                if (this.remainder >= 0.999) {
                    this.remainder -= 1.0;
                    tmp = tmp + 1;
                }
            }
        }
        
        tmp = this.processModifiers(tmp);

        if (this._useBigInt) {
            return tmp;
        }
        return parseInt(tmp);
    }

    /**
     * Applies all attached modifiers to a value.
     * Each modifier's multiplier is applied multiplicatively.
     * @param {number|bigint} val - Value to modify
     * @returns {number|bigint} Modified value
     */
    processModifiers(val) {
        if (this.modifiers.length == 0) return val;

        for(var i = 0; i<this.modifiers.length; i++){
            var d = this.modifiers[i].getMultiplier();

            if (d != 1.0) {
                if (this._useBigInt && BigIntUtils.isBig(val)) {
                    var scaledD = d * 1000;
                    val = BigIntUtils.mul(val, BigInt(Math.round(scaledD)));
                    val = BigIntUtils.div(val, BigInt(1000));
                } else {
                    val = val * d;
                }
            }
        }

        return val;
    }

    /**
     * Determines if this generator should produce resources based on its level and probability.
     * @returns {boolean} true if the generator should work this cycle
     */
    isWorking() {
        if (this.itemLevel > 0) {
            if (!this.useProbability || Math.random() < this.probability) return true;
        }
		
        return false;
    }

    /**
     * Processes this generator, adding produced resources to its currency.
     */
    process() {
        if (this.isWorking()) {
            this.currency.add(this.getGeneratedAmount());
            this.timesProcessed++;
        }
    }

    /**
     * Retrieves the number of times this generator has been processed.
     * @returns {number} Times processed count
     */
    getTimesProcessed() {
        return this.timesProcessed;
    }

    /**
     * Attaches a modifier to this generator.
     * @param {Modifier} modifier - Modifier to attach
     */
    attachModifier(modifier) {
        if (modifier && !this.modifiers.contains(modifier)) {
            this.modifiers.push(modifier);
        }
    }

    /**
     * Detaches a modifier from this generator.
     * @param {Modifier} modifier - Modifier to detach
     */
    detachModifier(modifier) {
        if (modifier) {
            var idx = this.modifiers.indexOf(modifier);
            if (idx !== -1) {
                this.modifiers.splice(idx, 1);
            }
        }
    }
}

module.exports = Generator;

var libclicker = (function (exports) {
    'use strict';

    const PurchaseResult = {
        OK : 'OK',
        INSUFFICIENT_FUNDS : 'INSUFFICIENT_FUNDS',
        MAX_LEVEL_REACHED : 'MAX_LEVEL_REACHED'
    };

    var PurchaseResult_1 = PurchaseResult;

    /**
     * Utility module for BigInt arithmetic operations.
     * Provides safe conversions and mathematical operations that work with JavaScript's native BigInt type.
     *
     * @module bigint-utils
     */
    const BigIntUtils = {
        /**
         * Converts a number or string to BigInt.
         * @param {number|string|bigint} val - Value to convert
         * @returns {bigint} The converted BigInt value
         * @throws {Error} If the input is a non-integer number or an unsupported type
         */
        from(val) {
            if (typeof val === 'bigint') return val;
            if (typeof val === 'number') {
                if (!Number.isInteger(val)) {
                    throw new Error('Cannot convert non-integer number to BigInt');
                }
                return BigInt(val);
            }
            if (typeof val === 'string') {
                return BigInt(val);
            }
            throw new Error(`Cannot convert ${typeof val} to BigInt`);
        },

        /**
         * Converts a BigInt back to a regular number.
         * @param {bigint|*} bi - BigInt value to convert
         * @returns {number|*} The converted number, or original value if not BigInt
         */
        toNumber(bi) {
            if (typeof bi !== 'bigint') return bi;
            return Number(bi);
        },

        /**
         * Adds two values, converting them to BigInt if needed.
         * @param {number|string|bigint} a - First operand
         * @param {number|string|bigint} b - Second operand
         * @returns {bigint} Sum of a and b
         */
        add(a, b) {
            return this.from(a) + this.from(b);
        },

        /**
         * Subtracts b from a, using BigInt arithmetic.
         * @param {number|string|bigint} a - Minuend
         * @param {number|string|bigint} b - Subtrahend
         * @returns {bigint} Difference of a and b
         */
        sub(a, b) {
            return this.from(a) - this.from(b);
        },

        /**
         * Multiplies two values, using BigInt arithmetic.
         * @param {number|string|bigint} a - First factor
         * @param {number|string|bigint} b - Second factor
         * @returns {bigint} Product of a and b
         */
        mul(a, b) {
            return this.from(a) * this.from(b);
        },

        /**
         * Divides a by b using integer division, using BigInt arithmetic.
         * @param {number|string|bigint} a - Dividend
         * @param {number|string|bigint} b - Divisor
         * @returns {bigint} Quotient of a divided by b (truncated toward zero)
         */
        div(a, b) {
            return this.from(a) / this.from(b);
        },

        /**
         * Computes the remainder of a divided by b, using BigInt arithmetic.
         * @param {number|string|bigint} a - Dividend
         * @param {number|string|bigint} b - Divisor
         * @returns {bigint} Remainder of a divided by b
         */
        mod(a, b) {
            return this.from(a) % this.from(b);
        },

        /**
         * Raises base to the power of exp using integer exponentiation.
         * Only supports non-negative integer exponents.
         * @param {number|string|bigint} base - The base value
         * @param {number|string|bigint} exp - The exponent (must be non-negative integer)
         * @returns {bigint} base raised to the power of exp
         * @throws {Error} If the exponent is negative
         */
        pow(base, exp) {
            let result = BigInt(1);
            let b = this.from(base);
            let e = this.from(exp);

            if (e < 0n) {
                throw new Error('BigInt.pow does not support negative exponents');
            }

            while (e > 0n) {
                if (e % 2n === 1n) {
                    result = result * b;
                }
                b = b * b;
                e = e / 2n;
            }

            return result;
        },

        /**
         * Checks if a is strictly greater than b.
         * @param {number|string|bigint} a - First value
         * @param {number|string|bigint} b - Second value
         * @returns {boolean} true if a > b
         */
        gt(a, b) {
            return this.from(a) > this.from(b);
        },

        /**
         * Checks if a is greater than or equal to b.
         * @param {number|string|bigint} a - First value
         * @param {number|string|bigint} b - Second value
         * @returns {boolean} true if a >= b
         */
        gte(a, b) {
            return this.from(a) >= this.from(b);
        },

        /**
         * Checks if a is strictly less than b.
         * @param {number|string|bigint} a - First value
         * @param {number|string|bigint} b - Second value
         * @returns {boolean} true if a < b
         */
        lt(a, b) {
            return this.from(a) < this.from(b);
        },

        /**
         * Checks if a is less than or equal to b.
         * @param {number|string|bigint} a - First value
         * @param {number|string|bigint} b - Second value
         * @returns {boolean} true if a <= b
         */
        lte(a, b) {
            return this.from(a) <= this.from(b);
        },

        /**
         * Checks if a is strictly equal to b.
         * @param {number|string|bigint} a - First value
         * @param {number|string|bigint} b - Second value
         * @returns {boolean} true if a === b
         */
        eq(a, b) {
            return this.from(a) === this.from(b);
        },

        /**
         * Checks whether a value is a BigInt.
         * @param {*} val - Value to check
         * @returns {boolean} true if val is a BigInt
         */
        isBig(val) {
            return typeof val === 'bigint';
        }
    };

    var bigintUtils = BigIntUtils;

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
                return PurchaseResult_1.MAX_LEVEL_REACHED;

            var price = this.getPrice();
            var result;
            
            if (typeof currency.value === 'bigint') {
                result = currency.value - bigintUtils.from(price);
            } else {
                result = currency.value - price;
            }
    		
            if (result < 0) {
                return PurchaseResult_1.INSUFFICIENT_FUNDS;
            }
            
            if (typeof currency.value === 'bigint') {
                currency.value = currency.value - bigintUtils.from(price);
            } else {
                currency.value -= price;
            }
            
            this.upgrade();
            return PurchaseResult_1.OK;
        }
    }

    var item = Item;

    /**
     * Automator class for automating generators.
     * Normally generators are manually controlled (they generate resources only when explicitly told to).
     * Automators trigger generators during world update cycles based on a tick rate.
     *
     * @author Harri Pellikka
     * @extends Item
     * @public
     * @class
     */
    class Automator extends item
    {
    	/**
         * Constructs a new automator.
         * @param {World} world - World this automator belongs to
         * @param {string} name - Name of this automator
         */
        constructor(world, name){
            super(world, name);
            /**
             * Whether this automator uses BigInt arithmetic.
             * @type {boolean}
             * @private
             */
            this._useBigInt = false;
        }

        /**
         * Builder class for creating new automators.
         * @class
         */
        static get Builder() {
            class Builder {
                /**
                 * Constructs a new automator builder.
                 * @param {World} world - The world the automator belongs to
                 */
                constructor(world){
                    this.mWorld = world;
                    this.mGenerator;
                    this.mTickRate = 1.0;
                    this.mTickTimer = 0.0;
                    this.mName = "Nameless automator";
                    this.mEnabled = true;
                    this.mBasePrice = 999999999;
                    this.mPriceMultiplier = 1.1;
                    this.mTickRateMultiplier = 1.08;
                    this._useBigInt = false;
                }

                /**
                 * Sets the base price of this automator.
                 * @param {number} price - Base price
                 * @returns {Builder} This builder for chaining
                 */
                basePrice(price) {
                    this.mBasePrice = price;
                    
                    return this;
                }
                
                /**
                 * Sets the price multiplier per level.
                 * @param {number} multiplier - Price multiplier
                 * @returns {Builder} This builder for chaining
                 */
                priceMultiplier(multiplier) {
                    this._priceMultiplier = multiplier;

                    return this;
                }
                
                /**
                 * Sets the tick rate multiplier per level.
                 * Higher levels reduce the actual tick rate (faster automation).
                 * @param {number} multiplier - Tick rate multiplier
                 * @returns {Builder} This builder for chaining
                 */
                tickRateMultiplier(multiplier) {
                    this._tickRateMultiplier  = multiplier;

                    return this;
                }
                
                /**
                 * Sets the target generator this automator should automate.
                 * @param {Generator} generator - Generator to automate
                 * @returns {Builder} This builder for chaining
                 */
                automate(generator) {
                    this.mGenerator = generator;

                    return this;
                }

                /**
                 * Sets the name for this automator.
                 * @param {string} name - Automator name
                 * @returns {Builder} This builder for chaining
                 */
                name(name) {
                    this.mName = name;

                    return this;
                }
                 
                /**
                 * Sets the tick rate of this automator (how often it triggers the generator).
                 * @param {number} seconds - Tick rate in seconds
                 * @returns {Builder} This builder for chaining
                 */
                every(seconds) {
                    this.mTickRate = seconds;

                    return this;
                }
                
                /**
                 * Enables BigInt mode for this automator.
                 * When enabled, internal state uses JavaScript BigInt for precision with large values.
                 * @returns {Builder} This builder for chaining
                 */
                useBigInt() {
                    this._useBigInt = true;
                    return this;
                }
                
                /**
                 * Builds and returns a new Automator instance.
                 * @returns {Automator} The constructed automator
                 */
                build() {
                    var a = new Automator(this.mWorld, this.mName);
                    a.generator = this.mGenerator;
                    a.enabled = this.mEnabled;
                    a.basePrice = this.mBasePrice;
                    a._priceMultiplier = this._priceMultiplier;
                    a.multiplier = this._tickRateMultiplier;
                    a.tickRate = this.mTickRate;
                    a.tickTimer = this.mTickTimer;
                    a.actualTickRate = this.mTickRate;
                    a._useBigInt = this._useBigInt;
                    
                    this.mWorld.addAutomator(a);
                    
                    return a;
                }
            }

            return Builder;
        }

        /**
         * Enables this automator. Automators are enabled by default when created.
         */
        enable() {
            if (!this.enabled) {
                this.world.addAutomator(this);
                this.enabled = true;
            }
        }

        /**
         * Disables this automator, effectively turning off automation.
         */
        disable() {
            if (this.enabled) {
                this.world.removeAutomator(this);
                this.enabled = false;
            }
        }

        /**
         * Upgrades this automator and recalculates its effective tick rate.
         */
        upgrade() {
            super.upgrade();
            this.actualTickRate = this.getFinalTickRate();
        }

        /**
         * Calculates the final tick rate after applying level-based speedup.
         * Formula: tickRate / (multiplier ^ (level - 1))
         * @returns {number} Final tick rate in seconds
         */
        getFinalTickRate() {
            if (this.itemLevel == 0) return 0.0;
            var r = this.tickRate;
            var m = Math.pow(this.multiplier, this.itemLevel - 1);

            return r / m;
        }

        /**
         * Updates this automator's tick timer and triggers the generator when ready.
         * Called by World.update() each frame/tick.
         * @param {number} delta - Time elapsed since last update (in seconds)
         */
        update(delta){
            if (!this.enabled || this.itemLevel == 0) return;

            this.tickTimer += delta;
            while (this.tickTimer >= this.actualTickRate) {
                this.tickTimer -= this.actualTickRate;
                this.generator.process();    
            }
        }

        /**
         * Retrieves the configured tick rate of this automator.
         * @returns {number} Tick rate in seconds
         */
        getTickRate() {
            return this.tickRate;
        }

        /**
         * Sets the tick rate of this automator.
         * @param {number} tickRate - Tick rate in seconds (must be non-negative)
         */
        setTickRate(tickRate) {
            this.tickRate = tickRate;
            if (this.tickRate < 0.0) this.tickRate = 0.0;
        }

        /**
         * Retrieves the percentage of tick completion.
         * Useful for progress bars in UI.
         * @returns {number} Percentage of tick completion (0.0 to 1.0)
         */
        getTimerPercentage() {
            return this.tickRate != 0.0 ? this.tickTimer / this.tickRate : 1.0;
        }
    }

    var automator = Automator;

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
                this.value = bigintUtils.add(this.value, amount);
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
                this.value = bigintUtils.sub(this.value, amount);
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
                this.value = bigintUtils.mul(this.value, multiplier);
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
                this.value = bigintUtils.from(newValue);
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

    var currency = Currency;

    if (!Array.prototype.contains) {
      Array.prototype.contains = function(element) {
    	for(var i in this){
    		if (element === this[i]){
    			return true;
    		}
    	}
    	
    	return false;
      };
    }

    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(element) {
    	for(var i in this){
    		if (element === this[i]){
    			return i;
    		}
    	}
    	
    	return -1;
      };
    }

    if (!Array.prototype.remove) {
      Array.prototype.remove = function(element) {
        var i = this.indexOf(element);
        
    	if(i>=0){
            this.splice(i, 1);
    	}
      };
    }

    /**
     * A container for all the clicker objects
     *
     * @author Harri Pellikka
     */
    class World {
    	/**
         * Constructs a new world. All the other components require an existing
         * "world" to function. A world is a container for the whole system.
         */
        constructor () 
        {
            this.generators = [];
            this.automators = [];
            this.currencies = [];
            this.modifiers = [];
        
            this._speedMultiplier = 1.0;
            this._updateAutomators = true;
        }

    	equals(a,b) {
    		return JSON.stringify(a) === JSON.stringify(b);
    	}
    	
    	/**
         * Adds a new generator to this world
         * @param generator Generator to add
         */
        addGenerator(generator) {
            if ( generator && !this.generators.contains(generator) ) {
                this.generators.push(generator);
            }
        }

    	/**
         * Returns the number of generators in this world
         * @return The number of generators in this world
         */
        getGeneratorCount() {
            return this.generators.length;
        }

    	/**
         * Removes a generator
         * @param generator Generator to remove
         */
        removeGenerator(generator) {
            if (generator && this.generators.contains(generator)) {
                this.generators.remove(generator);
            }
        }

    	/**
         * Removes all the generators from this world
         */
        removeAllGenerators() {
            generators = [];
        }

        /**
         * Registers a new currency in the world, making
         * the currency usable.
         */
        addCurrency(c) {
            if (c && !this.currencies.contains(c) ) {
                this.currencies.push(c);
            }
        }
    	
        /**
         * Removes a currency from the world.
         */
        removeCurrency(c) {
            if (c) {
                this.currencies.remove(c);
            }
        }

        /**
         * Retrieves a currency at the given index.
         * The index is based on the order in which
         * the currencies were added to the world.
         *
         * @param index of the currency
         * @return the currency at the given index, or null if not found
         */
        getCurrency(index) {
            return this.currencies[index];
        }

        /**
         * Retrieves a list of all the currencies currently
         * registered in the world.
         *
         * @return list of currencies
         */
        getCurrencies() {
            return this.currencies;
        }

        /**
         * Removes all currencies registered in the world.
         */
        removeAllCurrencies() {
            this.currencies = [];
        }

        /**
         * Advances the world state by the given amount of seconds.
         * Useful when calculating away-from-keyboard income etc.
         *
         * @param seconds Seconds to advance
         */
        update(seconds) {
            seconds *= this._speedMultiplier;

            if (this._updateAutomators) {
                this.automators.forEach(function(a){
                    a.update(seconds);
                });
            }
        }

        /**
         * Registers a new automator to the world.
         *
         * @param automator to register
         */
        addAutomator(automator) {
            if (automator && !this.automators.contains(automator)) {
                this.automators.push(automator);
            }
        }

        /**
         * Registers a new modifier
         *
         * @param modifier to register
         */
        addModifier(modifier) {
            if (modifier && !this.modifiers.contains(modifier)) {
                this.modifiers.push(modifier);
            }
        }

        /**
         * Retrieves the global speed multiplier
         *
         * @return the speed multiplier
         */
        getSpeedMultiplier() {
            return this._speedMultiplier;
        }

        /**
         * Sets the global speed multiplier
         *
         * @param multiplier of the world update speed
         */
        setSpeedMultiplier (multiplier) {
            this._speedMultiplier = multiplier;
        }

        /**
         * Disables all automators
         */
        disableAutomators() {
            this._updateAutomators = false;
        }

        /**
         * Enables all automators
         */
        enableAutomators() {
            this._updateAutomators = true;
        }

        /**
         * Removes an automator from the world
         *
         * @param automator to remove
         */
        removeAutomator(automator) {
            if (automator != null) {
                this.automators.remove(automator);
            }
        }

        /**
         * Retrieves all the automators registered in the world
         *
         * @return list of automators
         */
        getAutomators() {
            return this.automators;
        }

        /**
         * Retrieves all the modifiers registered in the world
         *
         * @return list of modifiers
         */
        getModifiers() {
            return this.modifiers;
        }

        /**
         * Removes a modifier from the world
         *
         * @param modifier to remove
         */
        removeModifier(modifier) {
            if (modifier) {
                this.modifiers.remove(modifier);
            }
        }

        /**
         * Queries whether or not the automators are enabled.
         *
         * @return True if automation is enabled, false otherwise.
         */
        isAutomationEnabled() {
            return this._updateAutomators;
        }
    }

    var world = World;

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
    class Generator extends item {
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
                    this.basePrice = bigintUtils.from(build.basePrice);
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
                this.baseAmount = bigintUtils.from(build.mBaseAmount);
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
                
                while (mult !== Math.floor(mult)) {
                    mult *= 10;
                    scale *= 10;
                }
                
                var scaledMult = BigInt(Math.floor(mult));
                var scaledScale = BigInt(scale);
                
                var powResult = bigintUtils.pow(scaledMult, this.itemLevel - 1);
                var divisor = bigintUtils.pow(scaledScale, this.itemLevel - 1);
                
                tmp = bigintUtils.mul(tmp, powResult);
                tmp = bigintUtils.div(tmp, divisor);
                
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
                    tmp = bigintUtils.add(tmp, this.remainder);
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
                    if (this._useBigInt && bigintUtils.isBig(val)) {
                        var scaledD = d * 1000;
                        val = bigintUtils.mul(val, BigInt(Math.round(scaledD)));
                        val = bigintUtils.div(val, BigInt(1000));
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

    var generator = Generator;

    /*
     * The MIT License
     *
     * Copyright 2015 Harri Pellikka.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */





    /**
     * A base class for all the modifiers.
     * <p>
     * A modifier does "something" to a component (generator, automator, the
     * world etc), for example speeds up, slows down, increases production
     * or something similar.
     *
     * @author Harri Pellikka
     */
    class WorldTarget
    {
        constructor(world){
            this.mWorld = world;
            this.mSpeedMultiplier = 1.0;
            this.mDisableActivators = false;
        }

        /**
         * Speeds up all the processing by the given multiplier.
         * @param multiplier Multiplier for advancing the time
         * @return This target for chaining
         */
        speedBy(multiplier)
        {
            this.mSpeedMultiplier = multiplier;
            return this;
        }
        
        /**
         * Disables all the activators
         * @return This target for chaining
         */
        disableActivators()
        {
            this.mDisableActivators = true;
            return this;
        }
        
        /**
         * Creates the actual modifier based on the given settings
         * @return Modifier 
         */
        build()
        {
            var m = new WorldModifier(this.mWorld);
            m.mSpeedMultiplier = this.mSpeedMultiplier;
            m.mDisableActivators = this.mDisableActivators;
            
            return m;
        }
    }
        
    /**
     * A modifier settings class for generator modifiers.
     * Keeps track of all the parameters the modifier should
     * modify.
     */
    class GeneratorTarget
    {
        constructor(gen){
            this.mGenerator = gen;
            this.mMultiplier = 1.0;
        }
        
        /**
         * Multiplies the production of the generator.
         * 
         * @param multiplier Multiplier
         * @return This target for chaining
         */
        multiplier(multiplier)
        {
            this.mMultiplier = multiplier;
            return this;
        }
        
        /**
         * Constructs the actual modifier with the given settings
         * @return Modifier as per the given settings
         */
        build()
        {
            var m = new GeneratorModifier(this.mGenerator);
            m.mMultiplier = this.mMultiplier;
            return m;
        }
    }

    /**
     * A base class for all the modifiers.
     * 
     * A modifier does "something" to a component (generator, automator, the
     * world etc), for example speeds up, slows down, increases production
     * or something similar.
     *
     * @author Harri Pellikka
     */
     let Modifier$1 = class Modifier extends item
     {
        constructor(world, name){
            super(world, name);
            this.mEnable = false;
        }

        static get Builder() {
            class Builder
            {
                constructor(){}

                modify(obj){
                    if(obj instanceof world)
                        return new WorldTarget(obj);
                    
                    if(obj instanceof generator)
                        return new GeneratorTarget(obj);
                }
            }

            return Builder;
        }
     
        /**
         * Enables this modifier, i.e. makes it active
         */
        enable() {
            if(!this.mEnabled)
            {
                this.mEnabled = true;
                this.world.addModifier(this);
                this.onEnable();
            }
        }
        
        /**
         * Disables this modifier, i.e. makes it inactive
         */
        disable() {
            
            if(this.mEnabled)
            { 
                this.onDisable();
                this.world.removeModifier(this);
                this.mEnabled = false;
            }
        }
        
        /**
         * Checks whether or not this modifier is enabled
         * @return True if enabled, false otherwise
         */
        isEnabled() {
            return this.mEnabled;
        }
    };


    /**
     * Modifier for worlds
     */
    class WorldModifier extends Modifier$1{
        constructor(world) {
            super(world);
            /**
            * Modifier for worlds
            */
            this.mSpeedMultiplier;
            this.mDisableActivators;

            this.mSpeedMultiplierBefore;
            this.mSpeedMultiplierAfter;
        }

        onEnable() {
            if(this.mSpeedMultiplier != 1.0) {
                this.mSpeedMultiplierBefore = this.world.getSpeedMultiplier();
                this.mSpeedMultiplierAfter = this.mSpeedMultiplier * this.mSpeedMultiplierBefore;
                this.world.setSpeedMultiplier(this.mSpeedMultiplierAfter);
            }
            
            if(this.mDisableActivators) {
                this.world.disableAutomators();
            }
        }

        onDisable() {
            if(this.mSpeedMultiplier != 1.0) {
                
                var d = this.world.getSpeedMultiplier();
                d /= this.mSpeedMultiplier;
                this.world.setSpeedMultiplier(d);
            }

            if(this.mDisableActivators) {
                this.world.enableAutomators();
            }
        }

        modify(world) {
            return new WorldTarget(world);
        }
    }

    /**
    * Modifier for generators.
    */
    class GeneratorModifier extends Modifier$1
    {
        constructor (generator){
            super(generator.world);
            this.mGenerator = generator;
            this.mMultiplier = 1.0;
        }

        onEnable()
        {
            this.mGenerator.attachModifier(this);
        }

        onDisable()
        {
            this.mGenerator.detachModifier(this);
        }

        getMultiplier()
        {
            return this.mMultiplier;
        }
    }


    var modifier = { Modifier: Modifier$1};

    const { Modifier } = modifier;
    // TODO: change name to Generator again when solving the name collision on rollup


    var libclicker = {
        Item: item,
        Creator: generator,
        Automator: automator,
        Currency: currency,
        World: world,
        Modifier
    };
    var libclicker_1 = libclicker.Item;
    var libclicker_2 = libclicker.Creator;
    var libclicker_3 = libclicker.Automator;
    var libclicker_4 = libclicker.Currency;
    var libclicker_5 = libclicker.World;
    var libclicker_6 = libclicker.Modifier;

    exports.Automator = libclicker_3;
    exports.Creator = libclicker_2;
    exports.Currency = libclicker_4;
    exports.Item = libclicker_1;
    exports.Modifier = libclicker_6;
    exports.World = libclicker_5;
    exports.default = libclicker;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});

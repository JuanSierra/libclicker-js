var libclicker = (function (exports) {
    'use strict';

    const PurchaseResult = {
        OK : 'OK',
        INSUFFICIENT_FUNDS : 'INSUFFICIENT_FUNDS',
        MAX_LEVEL_REACHED : 'MAX_LEVEL_REACHED'
    };

    var PurchaseResult_1 = PurchaseResult;

    /**
     * Base class for all the purchasable "items".
     * 
     * @author Harri Pellikka
     */
    class Item {
        /**
         * Constructs a new item
         * @param world World this item belongs to
         */
        constructor (world, name = "Nameless Item") {
            /**
             * World this item belongs to
             */
            this.world = world;

            /**
             * Modifiers applied to this item
             */
            this.modifiers = [];

            /**
             * The base price of the item (i.e. the price of the first level of this item)
             */
            this.basePrice = 1;//BigInteger.ONE;

            /**
             * Name of this item
             */
            this.name = name;

            /**
             * Description text for this item
             */
            this.description = "No description.";

            /**
             * Current level of this item
             */
            this.itemLevel = 0;

            /**
             * Max. item level
             */
            this.maxItemLevel = 99999999;//Long.MAX_VALUE;

            /**
             * Price multiplier per level. This is used in the price formula
             * like this: price = (base price) * (price multiplier) ^ (item level)
             */
            this.priceMultiplier = 1.145;
        }

        /**
         * Retrieves the name of this item
         *
         * @return {string} Name of this item
         */
        getName() {
            return this.name;
        }

        /**
         * Sets the name of this item
         *
         * @param name New name for this item
         */
        setName(name) {
            //if (name == null || name.length() == 0)
                //throw new RuntimeException("Item name cannot be null or empty");
            this.name = name;
        }

        /**
         * This method logs the given message to the browser console.
         *
         * @public
         * @method
         */
        getDescription() {
            return this.description;
        }

        setDescription(description) {
            this.description = description;
        }

        /**
         * Retrieves the base price of this item
         *
         * @return Base price of this item
         */
        getBasePrice() {
            return this.basePrice;
        }

        setBasePrice(basePrice) {
            this.basePrice = basePrice;
        }

        getPrice() {
            var tmp = this.basePrice;
            tmp = tmp * Math.pow(this.priceMultiplier, this.itemLevel);
            return tmp;
        }

        buyWith(currency) {
            //if (currency == null) throw new IllegalArgumentException("Currency cannot be null");
            if (this.itemLevel >= this.maxItemLevel)
                return PurchaseResult_1.MAX_LEVEL_REACHED;

            var price = this.getPrice();
            var result = currency.value - price;
    		
            if (result < 0) {
                return PurchaseResult_1.INSUFFICIENT_FUNDS;
            }
            currency -= price;//currency.sub(price);
            this.upgrade();
            return PurchaseResult_1.OK;
        }

        /**
         * Sets the base price of this item
         *
         * @param basePrice New base price for this item
         */
        setBasePrice(basePrice) {
            if (basePrice == null) throw "Base price cannot be null";
            if (basePrice == 0)
                throw "Base price cannot be zero";

            this.basePrice = basePrice;
        }

        setBasePrice(basePrice) {
            this.basePrice = basePrice;//new BigInteger("" + basePrice);
        }

        /**
         * Retrieves the price multiplier
         *
         * @return Price multiplier
         */
        getPriceMultiplier() {
            return this.priceMultiplier;
        }

        /**
         * Sets the price multiplier of this item
         *
         * @param multiplier Price multiplier
         */
        setPriceMultiplier(multiplier) {
            this.priceMultiplier = multiplier;
        }

        getMaxItemLevel() {
            return this.maxItemLevel;
        }

        setMaxItemLevel(maxLvl) {
            if (maxLvl <= 0) throw "Max item level cannot be zero or negative";
            this.maxItemLevel = maxLvl;
        }

        getItemLevel() {
            return this.itemLevel;
        }

        setItemLevel(lvl) {
            this.itemLevel = lvl < 0 ? 0 : lvl > this.maxItemLevel ? this.maxItemLevel : lvl;
        }

        upgrade() {
            if (this.itemLevel < this.maxItemLevel) {
                this.itemLevel++;
            }
        }

        downgrade() {
            if (this.itemLevel > 0) {
                this.itemLevel--;
            }
        }

        maximize() {
            this.itemLevel = this.maxItemLevel;
        }
    }

    var item = Item;

    /**
     * Automator class for automating generators.
     * 
     * Normally generators are manually controlled, i.e. they generate resources
     * when explicitly told to. Automators are used to trigger generators
     * during the world's update cycles.
     * 
     * @public
     * @class
     * @author Harri Pellikka
     */
    class Automator extends item
    {
    	/**
         * Constructs a new item
         * @param world World this item belongs to
         */
        constructor(world, name){
            super(world, name);
        }

        static get Builder() {
            class Builder {
                /**
                 * Constructs a new automator builder
                 * @param world World the automator belongs to
                 */
                constructor(world){
                    this.mWorld = world;
                    this.mGenerator;
                    this.mTickRate = 1.0;
                    this.mTickTimer = 0.0;
                    this.mName = "Nameless automator";
                    this.mEnabled = true;
                    this.mBasePrice = 999999999;//BigInteger.ONE;
                    this.mPriceMultiplier = 1.1;
                    this.mTickRateMultiplier = 1.08;
                }

                basePrice(name) {
                    this.basePrice = name;
                    
                    return this;
                }
                
                priceMultiplier(multiplier) {
                    this._priceMultiplier = multiplier;

                    return this;
                }
                
                tickRateMultiplier(multiplier) {
                    this._tickRateMultiplier  = multiplier;

                    return this;
                }
                
                /**
                 * Sets the target generator this automator should automate.
                 * 
                 * @param generator Generator to automate
                 * @return This builder for chaining
                 */
                automate(generator) {
                    this.generator  = generator;

                    return this;
                }

                /**
                 * Sets the name for this automator.
                 * 
                 * @param name Name
                 * @return This builder for chaining
                 */
                name(name) {
                    this.name = name;

                    return this;
                }
                 
                /**
                 * Sets the tick rate of this automator, i.e. how often
                 * this automator should do its business.
                 * 
                 * @param seconds Tick rate in seconds
                 * @return This builder for chaining
                 */
                every(seconds) {
                    this.tickRate = seconds;

                    return this;
                }
                
                /**
                 * Constructs the automator based on the given properties.
                 * @return The automator
                 */
                build() {
                    //if (generator == null) throw new IllegalStateException("Generator cannot be null");
                    var a = new Automator(this.mWorld, this.name);
                    a.generator = this.generator;
                    a.enabled = this.mEnabled;
                    a.basePrice = this.basePrice;
                    a._priceMultiplier = this._priceMultiplier;
                    //console.log('mult '+ this._tickRateMultiplier)
                    a.multiplier = this._tickRateMultiplier;
                    a.tickRate = this.tickRate;
                    a.tickTimer = this.mTickTimer;
                    a.actualTickRate = this.actualTickRate;
                    
                    this.mWorld.addAutomator(a);
                    
                    return a;
                }
            }

            return Builder;
        }

        /**
         * Enables this automator. Automators are enabled by default when
         * they are created.
         */
        enable() {
            if (!this.enabled) {
                this.world.addAutomator(this);
                this.enabled = true;
            }
        }

        /**
         * Disables this automator, effectively turning the automation off.
         */
        disable() {
            if (this.enabled) {
                this.world.removeAutomator(this);
                this.enabled = false;
            }
        }

    	//this.super_upgrade = this.upgrade;
        upgrade() {
            super.upgrade(); //To change body of generated methods, choose Tools | Templates.
            this.actualTickRate = this.getFinalTickRate();
        }

        getFinalTickRate() {
            if (this.itemLevel == 0) return 0.0;
            var r = this.tickRate;
            var m = Math.pow(this.multiplier, this.itemLevel - 1);

            return r / m;
        }

        update(delta){
            if (!this.enabled || this.itemLevel == 0) return;

            this.tickTimer += delta;
            while (this.tickTimer >= this.actualTickRate) {
                this.tickTimer -= this.actualTickRate;
                this.generator.process();    
            }
        }

        /**
         * Retrieves the tick rate of this automator.
         * @return Tick rate in seconds
         */
        getTickRate() {
            return this.tickRate;
        }

        /**
         * Sets the tick rate of this automator.
         * 
         * @param tickRate Tick rate in seconds
         */
        setTickRate(tickRate) {
            this.tickRate = tickRate;
            if (this.tickRate < 0.0) this.tickRate = 0.0;
        }

        /**
         * Retrieves the percentage of the tick. Useful
         * when creating progress bars for generators.
         * 
         * @return Percentage of tick completion
         */
        getTimerPercentage() {
            return this.tickRate != 0.0 ? this.tickTimer / this.tickRate : 1.0;
        }
    }

    var automator = Automator;

    /**
     * Base class for all currencies.
     *
     * @author Harri Pellikka
     */
    class Currency
    {
        constructor (build){
            this.name = build.mName;
            this.world = build.world;
            this.value = 0;
        }

        static get Builder() {
            class Builder {
                constructor(world) {
                    this.mName = "Gold";
                    this.world = world;
                }

                name(name) {
                    this.mName = name;
                    return this;
                }

                build() {
                    return new Currency(this);
                }
            }

            return Builder;
        }
    	
        getAmountAsString() {
            return this.value.toString();
        }

        add(amount) {
            this.value = this.value + amount;
        }

        sub(amount) {
            this.value = this.value - amount;
        }

        multiply(multiplier) {
            this.value = this.value * multiplier;
        }

        set(newValue) {
            this.value = newValue;
        }

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
     * A base class for all the generators.
     * <p>
     * Generators are used to produce resources (e.g. currencies), and
     * can be controlled either manually or automatically by using
     * an Automator.
     */
    class Generator extends item {
        constructor(build){
            super(build.mWorld, build.mName);

            this.maxItemLevel = build.mMaxLevel;
            this.amountMultiplier = build.mAmountMultiplier;
            this.useRemainder = build.mUseRemainder;
            this.timesProcessed = build.mTimesProcessed;
            this.currency = build.mCurrency;
            this.baseAmount = build.mBaseAmount;
            

            this.remainder = 0;
            this.modifiers = [];
        }

        /**
         * Builder class for creating new generators
         */
    	static get Builder() {
            class Builder {
                constructor(world) {
                    this.mWorld = world;
                    this.mName = "Nameless generator";
                    this.mOnProcessed = null;
                    this.mCurrency = null;
                    this.mBaseAmount = 1;
                    this.mAmountMultiplier = 1.1;
                    this.mMaxLevel = 999999999;
                    this.mBasePrice = 999999999;//BigInteger.ONE;
                    this.mPriceMultiplier = 1.1;
                    this.mProbability = 1.0;
                    this.mProbabilitySet = false;
                    this.mUseRemainder = true;
                    this.mCooldown = 0.0;
                    this.mTimesProcessed = 0;
                }
                /**
                 * Sets the cooldown of this generator (in seconds).
                 * This is the minimum time between processing this
                 * generator.
                 *
                 * @param cooldown in seconds
                 * @return This builder for chaining
                 */
                cooldown(cooldown) {
                    this.cooldown = cooldown;
                    return this;
                }

                /**
                 * Store remainder of resources and generate an extra
                 * when the remainder "overflows"
                 *
                 * @return This builder for chaining
                 */
                useRemainder() {
                    this.useRemainder = true;
                    return this;
                }

                /**
                 * Discard remainder of resources when generating.
                 *
                 * @return This builder for chaining
                 */
                discardRemainder() {
                    this.useRemainder = false;
                    return this;
                }

                /**
                 * Sets the name for the generator
                 *
                 * @param name Name for the generator
                 * @return This builder for chaining
                 */
                name(name) {
                    this.name = name;
                    return this;
                }

                /**
                 * Sets the multiplier for resource generation. This multiplier
                 * is used in the formula (amount) = (base amount) * (multiplier) ^ (level)
                 *
                 * @param multiplier Amount generation multiplier per level
                 * @return This builder for chaining
                 */
                multiplier(multiplier) {
                    this.mAmountMultiplier = multiplier;
                    return this;
                }

                /**
                 * Sets the maximum allowed level for this generator. The max level must
                 * be greated than zero.
                 *
                 * @param maxLevel Maximum allowed level for this generator
                 * @return This builder for chaining
                 */
                /*this.maxLevel = function(maxLevel) {
                    //if (maxLevel <= 0)
                    //    throw new IllegalArgumentException("Max level must be greater than 0");
                    self.maxLevel = maxLevel;
                    return this;
                }*/

                /**
                 * Sets the base amount of resources generated by this generator.
                 * This is the amount the generator generates at level 1 and is used
                 * as the base for the higher levels.
                 *
                 * @param amount Base amount of resources generated at level 1
                 * @return This builder for chaining
                 */
                baseAmount(amount) {
                    if (amount == null) throw "Base amount cannot be null";
                    this.mBaseAmount = amount;
                    return this;
                }

                /**
                 * Sets the currency that should be generated by the generator.
                 *
                 * @param resource Resource to generate
                 * @return This builder for chaining
                 * @throws IllegalArgumentException Thrown if the currency is null
                 */
                generate(resource) { //throws IllegalArgumentException {
                    if (resource == null) throw "Currency cannot be null";
                    this.mCurrency = resource;
                    return this;
                }

                /**
                 * Sets a callback for the generator to be called when the generator
                 * has finished its processing cycle (i.e. has generated something).
                 *
                 * @param callback Callback to call after generating something
                 * @return This builder for chaining
                 */
                callback(callback) {
                    this.onProcessed = callback;
                    return this;
                }

                price(price) {
                    this.basePrice = price;
                    return this;
                }

                priceMultiplier(multiplier) {
                    this.priceMultiplier = multiplier;
                    return this;
                }

                /**
                 * Set a probability for this generator to "work" when it's processed
                 *
                 * @param probability Probability percentage (between 0.0 and 1.0)
                 * @return This builder for chaining
                 */
                probability(probability) {
                    if (probability < 0 || probability > 1.0)
                        throw "Probability should be between 0.0 and 1.0";

                    this.probability = probability;
                    this.probabilitySet = true;
                    
                    return this;
                }

                build() {
                    return new Generator(this);
                }
            }

            return Builder;
        }

    	equals(a,b) {
    		return JSON.stringify(a) === JSON.stringify(b);
    	}
    	
    	upgrade() {
    		if (this.itemLevel < this.maxItemLevel) {
                this.itemLevel++;
            }
    	}

        /**
         * Downgrades this generator by one level
         */
        downgrade() {
            if (this.itemLevel > 0) {
                this.itemLevel--;
            }
        }

        /**
         * Retrieves the amount this generator currently is generating per
         * processing cycle
         *
         * @return Amount of resources generated by this generator
         * BIG INTEGER
         */
        getGeneratedAmount() {
            if (this.itemLevel == 0) return 0;

            var tmp = this.baseAmount;
            tmp = tmp * Math.pow(this.amountMultiplier, this.itemLevel - 1);

            if (this.useRemainder) {
                var tmpRem = tmp % 1;
                this.remainder += tmpRem;
                if (this.remainder >= 0.999) {
                    this.remainder -= 1.0;
                    tmp = tmp + 1;
                }
            }
            tmp = this.processModifiers(tmp);

            return parseInt(tmp);
        }

        processModifiers(val) {
            if (this.modifiers.length == 0) return val;

            for(var i = 0; i<this.modifiers.length; i++){
                var d = this.modifiers[i].getMultiplier();

                if (d != 1.0) {
                    val = val * d;
                }
            }

            return val;
        }

        /**
         * Determines if this generator should generate anything based on its
         * properties such as item level and probability.
         *
         * @return True if should work, false otherwise
         */
        isWorking() {
            if (this.itemLevel > 0) {
                if (!this.useProbability || Math.Random() < this.probability) return true;
            }
    		
            return false;
        }

        /**
         * Processes this generator, generating resources as per the rules
         * of this generator.
         */
        process() {
            if (this.isWorking()) {
                this.currency.add(this.getGeneratedAmount());
                this.timesProcessed++;
                //if (callback != null) callback.onProcessed();
            }
        }

        /**
         * Retrieves the number of times this generator has done its processing
         *
         * @return Number of times processed
         */
        getTimesProcessed() {
            return this.timesProcessed;
        }

        attachModifier(modifier) {
            if (modifier && !this.modifiers.contains(modifier)) {
                this.modifiers.push(modifier);
            }
        }

        detachModifier(modifier) {
            if (modifier) {
                this.modifiers.remove(modifier);
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


    var modifier = { WorldTarget, GeneratorTarget, Modifier: Modifier$1, WorldModifier, GeneratorModifier };

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

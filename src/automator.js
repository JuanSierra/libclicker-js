const Item = require('./item');

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
class Automator extends Item
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

module.exports = Automator;

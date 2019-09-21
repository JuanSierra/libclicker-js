const Item = require('./item');

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
class Automator extends Item
{
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

module.exports = Automator;
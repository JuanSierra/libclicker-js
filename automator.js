const Item = require('./item');

class Automator extends Item
{
    constructor(world, name){
        super(world, name);
    }

    static get Builder() {
        class Builder {
            constructor(world){
                this.mWorld = world;
                this.mGenerator;
                this.mTickRate = 1.0;
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
            
            automate(generator) {
                this.generator  = generator;
                return this;
            }

            name(name) {
                this.name = name;
                return this;
            }
            
            every(seconds) {
                this.tickRate = seconds;
                return this;
            }
            
            build() {
                //if (generator == null) throw new IllegalStateException("Generator cannot be null");
                var a = new Automator(this.mWorld, this.name);
                a.generator = this.generator;
                a.enabled = this.enabled;
                a.basePrice = this.basePrice;
                a._priceMultiplier = this._priceMultiplier;
                //console.log('mult '+ this._tickRateMultiplier)
                a.multiplier = this._tickRateMultiplier;
                a.tickRate = this.tickRate;
                a.tickTimer = this.tickTimer;
                a.actualTickRate = this.actualTickRate;
                
                this.mWorld.addAutomator(a);
                
                return a;
            }
        }

        return Builder;
    }

    
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
        //super.upgrade(); //To change body of generated methods, choose Tools | Templates.
		//this.super_upgrade.call(this);
        this.actualTickRate = this.getFinalTickRate();
        console.log("Upgraded, final tick rate now: ");
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

    getTickRate() {
        return this.tickRate;
    }

    setTickRate(tickRate) {
        this.tickRate = tickRate;
        if (this.tickRate < 0.0) this.tickRate = 0.0;
    }

    getTimerPercentage() {
        return this.tickRate != 0.0 ? this.tickTimer / this.tickRate : 1.0;
    }
}

module.exports = Automator;
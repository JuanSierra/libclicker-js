
var automator =  function()
{
	Item.call(this);
	this.generator;
    this.tickRate;
    this.tickTimer;
    this.multiplier;
    this.enabled;
    this.actualTickRate;
	this.basePrice;
	this._priceMultiplier;
	this._tickRateMultiplier;
	this.name;
	
	this.Builder = function (world){
		self = this;
		self.world = world;
		self.tickRate = 1.0;
		self.tickTimer = 0.0;
		self.enabled = true;
		self.basePrice = 1;
		self._priceMultiplier = 1.1;
        self._tickRateMultiplier = 1.08;
		self.name = "Nameless automator";
		self.actualTickRate = 0.0;
		
		//this.generator;
		
		/*this.multiplier;
		this.enabled;
		this.actualTickRate;*/
	
        //private final World world;
        //private String name = "Gold";

        /*public Builder(World world) {
            this.world = world;
        }*/
		
        this.basePrice = function(name) {
            self.basePrice = name;
            return this;
        }
		
		this.priceMultiplier = function(multiplier) {
            self._priceMultiplier = multiplier;
            return this;
        }
		
		this.tickRateMultiplier = function(multiplier) {
            self._tickRateMultiplier  = multiplier;
            return this;
        }
		
		this.automate = function(generator) {
            self.generator  = generator;
            return this;
        }

		this.name = function(name) {
            self.name = name;
            return this;
        }
		
		this.every = function(seconds) {
            self.tickRate = seconds;
            return this;
        }
		
        this.build = function() {
			//if (generator == null) throw new IllegalStateException("Generator cannot be null");
            var a = new automator();

            //Automator a = new Automator(world, name);
			a.world = self.world;
			a.name = self.name;
            a.generator = self.generator;
            a.enabled = self.enabled;
            a.basePrice = self.basePrice;
            a._priceMultiplier = self._priceMultiplier;
			console.log('mult '+ self._tickRateMultiplier)
            a.multiplier = self._tickRateMultiplier;
			a.tickRate = self.tickRate;
			a.tickTimer = self.tickTimer;
			a.actualTickRate = self.actualTickRate;
			
            a.world.addAutomator(a);
			
            return a;
        }
    }

    
    this.enable = function(){
        if (!this.enabled) {
            this.world.addAutomator(this);
            this.enabled = true;
        }
    }

    /**
     * Disables this automator, effectively turning the automation off.
     */
    this.disable = function(){
        if (this.enabled) {
            this.world.removeAutomator(this);
            this.enabled = false;
        }
    }

	var super_upgrade = this.upgrade;
    this.upgrade = function() {
        //super.upgrade(); //To change body of generated methods, choose Tools | Templates.
		super_upgrade.call(this);
        this.actualTickRate = this.getFinalTickRate();
        console.log("Upgraded, final tick rate now: ");
    }

    this.getFinalTickRate = function() {
        if (this.itemLevel == 0) return 0.0;
        var r = this.tickRate;
        var m = Math.pow(this.multiplier, this.itemLevel - 1);
        return r / m;
    }

    this.update = function(delta){
        if (!this.enabled || this.itemLevel == 0) return;

        this.tickTimer += delta;
        while (this.tickTimer >= this.actualTickRate) {
            this.tickTimer -= this.actualTickRate;
            this.generator.process();
        }
    }

    this.getTickRate = function() {
        return this.tickRate;
    }

    this.setTickRate = function(tickRate) {
        this.tickRate = tickRate;
        if (this.tickRate < 0.0) this.tickRate = 0.0;
    }

    this.getTimerPercentage = function() {
        return this.tickRate != 0.0 ? this.tickTimer / this.tickRate : 1.0;
    }
}
automator.prototype = Object.create(Item.prototype);
automator.prototype.constructor = automator;

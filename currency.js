var currency =  function()
{

    this.name;//this.name;
    //private BigInteger value = BigInteger.ZERO;
	this.value;
	this.world;
	
	this.Builder = function (world){
		self = this;
		self.world = world;
		self.name = "Gold";
		self.value = 0;
        //private final World world;
        //private String name = "Gold";

        /*public Builder(World world) {
            this.world = world;
        }*/
		
        this.name = function(name) {
            self.name = name;
            return this;
        }

        this.build = function() {
            var c = new currency();
			c.name = self.name;
			c.value = self.value;
            c.world = self.world;
			c.world.addCurrency(c);
			
            return c;
        }
    }
	
    /**
     * Constructs a new currency with initial amount of 0
     *
     * @param name of the currency
     */
    /*private Currency(String name) {
        this.name = name;
    }*/

    /**
     * Retrieves the name of this currency
     *
     * @return name
     */
    
    this.getAmountAsString = function() {
        return this.value.toString();
    };

    /*@Override
    public String toString() {
        return name + ": " + getAmountAsString();
    }*/

    this.generate = function(amount) {
        this.value = this.value + amount;
    };

    this.sub = function(amount) {
        this.value = this.value - amount;
    };

    this.multiply =function(multiplier) {
        this.value = tmp * multiplier;
    };

    this.set  = function(newValue) {
        this.value = newValue;
    };

	this.equals = function(a,b) {
		return JSON.stringify(a) === JSON.stringify(b);
	};
}

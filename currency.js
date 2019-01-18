class Currency
{
    constructor (){
        this.name;
        //private BigInteger value = BigInteger.ZERO;
        this.value;
        this.world;
    }

    static get Builder(world) {
        class Builder {
            constructor(world) {
                /* 
                self.world = world;
                self.name = "Gold";
                self.value = 0;
                */
                this.world = world;
            }

            name (name) {
                this.name = name;
                return this;
            }
        }

        build() {
            var c = new Currency(this);
			
            return c;
        }
    }
	
    getAmountAsString() {
        return this.value.toString();
    }

    /*@Override
    public String toString() {
        return name + ": " + getAmountAsString();
    }*/

    generate(amount) {
        this.value = this.value + amount;
    }

    sub(amount) {
        this.value = this.value - amount;
    }

    multiply(multiplier) {
        this.value = tmp * multiplier;
    }

    set(newValue) {
        this.value = newValue;
    }

	equals(a,b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
}

export default Currency;
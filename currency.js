class Currency
{
    constructor (build){
        this.name = build.name;
        //private BigInteger value = BigInteger.ZERO;
        this.value = build.value;
        this.world = build.world;
    }

    static get Builder() {
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

            build() {
                return new Currency(this);
            }
        }

        return Builder;
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

module.exports = Currency
class Currency
{
    constructor (build){
        this.name = build.mName;
        this.world = build.world;
        
        // private BigInteger value = BigInteger.ZERO;
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
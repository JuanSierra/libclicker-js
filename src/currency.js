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

module.exports = Currency
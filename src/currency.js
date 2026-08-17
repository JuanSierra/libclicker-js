const BigIntUtils = require('./bigint-utils');

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
        this._useBigInt = build._useBigInt || false;
        
        if (this._useBigInt) {
            this.value = BigInt(0);
        } else {
            this.value = 0;
        }
    }

    static get Builder() {
        class Builder {
            constructor(world) {
                this.mName = "Gold";
                this.world = world;
                this._useBigInt = false;
            }

            name(name) {
                this.mName = name;
                return this;
            }

            useBigInt() {
                this._useBigInt = true;
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
        if (this._useBigInt) {
            this.value = BigIntUtils.add(this.value, amount);
        } else {
            this.value = this.value + amount;
        }
    }

    sub(amount) {
        if (this._useBigInt) {
            this.value = BigIntUtils.sub(this.value, amount);
        } else {
            this.value = this.value - amount;
        }
    }

    multiply(multiplier) {
        if (this._useBigInt) {
            this.value = BigIntUtils.mul(this.value, multiplier);
        } else {
            this.value = this.value * multiplier;
        }
    }

    set(newValue) {
        if (this._useBigInt) {
            this.value = BigIntUtils.from(newValue);
        } else {
            this.value = newValue;
        }
    }

	equals(a,b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
}

module.exports = Currency

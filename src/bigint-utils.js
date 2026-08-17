const BigIntUtils = {
    from(val) {
        if (typeof val === 'bigint') return val;
        if (typeof val === 'number') {
            if (!Number.isInteger(val)) {
                throw new Error('Cannot convert non-integer number to BigInt');
            }
            return BigInt(val);
        }
        if (typeof val === 'string') {
            return BigInt(val);
        }
        throw new Error(`Cannot convert ${typeof val} to BigInt`);
    },

    toNumber(bi) {
        if (typeof bi !== 'bigint') return bi;
        return Number(bi);
    },

    add(a, b) {
        return this.from(a) + this.from(b);
    },

    sub(a, b) {
        return this.from(a) - this.from(b);
    },

    mul(a, b) {
        return this.from(a) * this.from(b);
    },

    div(a, b) {
        return this.from(a) / this.from(b);
    },

    mod(a, b) {
        return this.from(a) % this.from(b);
    },

    pow(base, exp) {
        let result = BigInt(1);
        let b = this.from(base);
        let e = this.from(exp);

        if (e < 0n) {
            throw new Error('BigInt.pow does not support negative exponents');
        }

        while (e > 0n) {
            if (e % 2n === 1n) {
                result = result * b;
            }
            b = b * b;
            e = e / 2n;
        }

        return result;
    },

    gt(a, b) {
        return this.from(a) > this.from(b);
    },

    gte(a, b) {
        return this.from(a) >= this.from(b);
    },

    lt(a, b) {
        return this.from(a) < this.from(b);
    },

    lte(a, b) {
        return this.from(a) <= this.from(b);
    },

    eq(a, b) {
        return this.from(a) === this.from(b);
    },

    isBig(val) {
        return typeof val === 'bigint';
    }
};

module.exports = BigIntUtils;

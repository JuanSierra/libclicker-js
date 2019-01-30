if (!Array.prototype.contains) {
  Array.prototype.contains = function(element) {
	for(var i in this){
		if (element === this[i]){
			return true;
		}
	}
	
	return false;
  }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(element) {
	for(var i in this){
		if (element === this[i]){
			return i;
		}
	}
	
	return -1;
  }
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function(element) {
	var i = this.indexOf(this, element);
	
	if(i>=0){
		this.slice(i, 1);
	}
  }
}

class World {
    constructor () 
    {
        this.generators = [];
        this.automators = [];
        this.currencies = [];
        this.modifiers = [];
    
        this._speedMultiplier = 1.0;
        this._updateAutomators = true;
    }

	equals(a,b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
	
    addGenerator(generator) {
        if ( generator && !this.generators.contains(generator) ) {
            this.generators.push(generator);
        }
    }

    getGeneratorCount() {
        return this.generators.length;
    }

    removeGenerator(generator) {
        if (generator && this.generators.contains(generator)) {
            this.generators.remove(generator);
        }
    }

    removeAllGenerators() {
        generators = [];
    }

    /**
     * Registers a new currency in the world, making
     * the currency usable.
     */
    addCurrency(c) {
        if (c && !this.currencies.contains(c) ) {
            this.currencies.push(c);
        }
    }
	
    /**
     * Removes a currency from the world.
     */
    removeCurrency(c) {
        if (c) {
            this.currencies.remove(c);
        }
    }

    /**
     * Retrieves a currency at the given index.
     * The index is based on the order in which
     * the currencies were added to the world.
     *
     * @param index of the currency
     * @return the currency at the given index, or null if not found
     */
    getCurrency(index) {
        return this.currencies[index];
    }

    /**
     * Retrieves a list of all the currencies currently
     * registered in the world.
     *
     * @return list of currencies
     */
    getCurrencies() {
        return this.currencies;
    }

    /**
     * Removes all currencies registered in the world.
     */
    removeAllCurrencies() {
        this.currencies = [];
    }

    /**
     * Advances the world state by the given amount of seconds.
     * Useful when calculating away-from-keyboard income etc.
     *
     * @param seconds Seconds to advance
     */
    update(seconds) {
        seconds *= this._speedMultiplier;

        if (this._updateAutomators) {
            this.automators.forEach(function(a){
                a.update(seconds);
            });
        }
    }

    /**
     * Registers a new automator to the world.
     *
     * @param automator to register
     */
    addAutomator(automator) {
        if (automator && !this.automators.contains(automator)) {
            this.automators.push(automator);
        }
    }

    /**
     * Registers a new modifier
     *
     * @param modifier to register
     */
    addModifier(modifier) {
        if (modifier && !this.modifiers.contains(modifier)) {
            this.modifiers.push(modifier);
        }
    }

    /**
     * Retrieves the global speed multiplier
     *
     * @return the speed multiplier
     */
    getSpeedMultiplier() {
        return this._speedMultiplier;
    }

    /**
     * Sets the global speed multiplier
     *
     * @param multiplier of the world update speed
     */
    setSpeedMultiplier (multiplier) {
        this._speedMultiplier = multiplier;
    }

    /**
     * Disables all automators
     */
    disableAutomators() {
        this._updateAutomators = false;
    }

    /**
     * Enables all automators
     */
    enableAutomators() {
        this._updateAutomators = true;
    }

    /**
     * Removes an automator from the world
     *
     * @param automator to remove
     */
    removeAutomator(automator) {
        if (automator != null) {
            this.automators.remove(automator);
        }
    }

    /**
     * Retrieves all the automators registered in the world
     *
     * @return list of automators
     */
    getAutomators() {
        return this.automators;
    }

    /**
     * Retrieves all the modifiers registered in the world
     *
     * @return list of modifiers
     */
    getModifiers() {
        return this.modifiers;
    }

    /**
     * Removes a modifier from the world
     *
     * @param modifier to remove
     */
    removeModifier(modifier) {
        if (modifier) {
            this.modifiers.remove(modifier);
        }
    }

    /**
     * Queries whether or not the automators are enabled.
     *
     * @return True if automation is enabled, false otherwise.
     */
    isAutomationEnabled() {
        return this._updateAutomators;
    }
}

module.exports = World
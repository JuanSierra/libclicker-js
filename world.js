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

function World(){

    this.generators = [];
    this.automators = [];
    this.currencies = [];
    this.modifiers = [];

    this._speedMultiplier = 1.0;
    this._updateAutomators = true;

    /*this. World() {

    }*/
	
	this.equals = function(a,b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
	
    this.addGenerator = function(generator) {
        if ( generator && !this.generators.contains(generator) ) {
            this.generators.push(generator);
        }
    }

    this.getGeneratorCount = function() {
        return this.generators.length;
    }

    this.removeGenerator = function(generator) {
        if (generator && this.generators.contains(generator)) {
            this.generators.remove(generator);
        }
    }

    this.removeAllGenerators = function() {
        generators = [];
    }

    /**
     * Registers a new currency in the world, making
     * the currency usable.
     */
    this.addCurrency = function(c) {
        if (c && !this.currencies.contains(c) ) {
            this.currencies.push(c);
        }
    }
	
    /**
     * Removes a currency from the world.
     */
    this.removeCurrency = function(c) {
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
    this.getCurrency = function(index) {
        return this.currencies[index];
    }

    /**
     * Retrieves a list of all the currencies currently
     * registered in the world.
     *
     * @return list of currencies
     */
    this.getCurrencies = function() {
        return this.currencies;
    }

    /**
     * Removes all currencies registered in the world.
     */
    this.removeAllCurrencies = function() {
        this.currencies = [];
    }

    /**
     * Advances the world state by the given amount of seconds.
     * Useful when calculating away-from-keyboard income etc.
     *
     * @param seconds Seconds to advance
     */
    this.update = function(seconds) {
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
    this.addAutomator = function(automator) {
        if (automator && !this.automators.contains(automator)) {
            this.automators.push(automator);
        }
    }

    /**
     * Registers a new modifier
     *
     * @param modifier to register
     */
    this.addModifier = function(modifier) {
        if (modifier && !this.modifiers.contains(modifier)) {
            this.modifiers.push(modifier);
        }
    }

    /**
     * Retrieves the global speed multiplier
     *
     * @return the speed multiplier
     */
    this.getSpeedMultiplier = function() {
        return this._speedMultiplier;
    }

    /**
     * Sets the global speed multiplier
     *
     * @param multiplier of the world update speed
     */
    this.setSpeedMultiplier = function(multiplier) {
        this._speedMultiplier = multiplier;
    }

    /**
     * Disables all automators
     */
    this.disableAutomators = function() {
        this._updateAutomators = false;
    }

    /**
     * Enables all automators
     */
    this.enableAutomators = function() {
        this._updateAutomators = true;
    }

    /**
     * Removes an automator from the world
     *
     * @param automator to remove
     */
    this.removeAutomator = function(automator) {
        if (automator != null) {
            this.automators.remove(automator);
        }
    }

    /**
     * Retrieves all the automators registered in the world
     *
     * @return list of automators
     */
    this.getAutomators = function() {
        return this.automators;
    }

    /**
     * Retrieves all the modifiers registered in the world
     *
     * @return list of modifiers
     */
    this.getModifiers = function() {
        return this.modifiers;
    }

    /**
     * Removes a modifier from the world
     *
     * @param modifier to remove
     */
    this.removeModifier = function(modifier) {
        if (modifier) {
            this.modifiers.remove(modifier);
        }
    }

    /**
     * Queries whether or not the automators are enabled.
     *
     * @return True if automation is enabled, false otherwise.
     */
    this.isAutomationEnabled = function() {
        return this._updateAutomators;
    }
}
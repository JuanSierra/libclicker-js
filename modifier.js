/*
 * The MIT License
 *
 * Copyright 2015 Harri Pellikka.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
const Item = require('./item');
const World = require('./world');
const Generator = require('./generator');

class WorldTarget
{
    constructor(world){
        this.mWorld = world;
        this.mSpeedMultiplier = 1.0;
        this.mDisableActivators = false;
    }

    /**
     * Speeds up all the processing by the given multiplier.
     * @param multiplier Multiplier for advancing the time
     * @return This target for chaining
     */
    speedBy(multiplier)
    {
        this.mSpeedMultiplier = multiplier;
        return this;
    }
    
    /**
     * Disables all the activators
     * @return This target for chaining
     */
    disableActivators()
    {
        this.mDisableActivators = true;
        return this;
    }
    
    /**
     * Creates the actual modifier based on the given settings
     * @return Modifier 
     */
    build()
    {
        var m = new WorldModifier(this.mWorld);
        m.mSpeedMultiplier = this.mSpeedMultiplier;
        m.mDisableActivators = this.mDisableActivators;
        
        return m;
    }
}
    
/**
 * A modifier settings class for generator modifiers.
 * Keeps track of all the parameters the modifier should
 * modify.
 */
class GeneratorTarget
{
    constructor(gen){
        this.mGenerator = gen;
        this.mMultiplier = 1.0;
    }
    
    /**
     * Multiplies the production of the generator.
     * 
     * @param multiplier Multiplier
     * @return This target for chaining
     */
    multiplier(multiplier)
    {
        this.mMultiplier = multiplier;
        return this;
    }
    
    /**
     * Constructs the actual modifier with the given settings
     * @return Modifier as per the given settings
     */
    build()
    {
        var m = new GeneratorModifier(this.mGenerator);
        m.mMultiplier = this.mMultiplier;
        return m;
    }
}

/**
 * A base class for all the modifiers.
 * 
 * A modifier does "something" to a component (generator, automator, the
 * world etc), for example speeds up, slows down, increases production
 * or something similar.
 *
 * @author Harri Pellikka
 */
 class Modifier extends Item
 {
    constructor(world, name){
        super(world, name);
        this.mEnable = false;
    }

    static get Builder() {
        class Builder
        {
            constructor(){}

            modify(obj){
                if(obj instanceof World)
                    return new WorldTarget(obj);
                
                if(obj instanceof Generator)
                    return new GeneratorTarget(obj);
            }
        }

        return Builder;
    }
 
    /**
     * Enables this modifier, i.e. makes it active
     */
    enable() {
        if(!this.mEnabled)
        {
            this.mEnabled = true;
            this.world.addModifier(this);
            this.onEnable();
        }
    }
    
    /**
     * Disables this modifier, i.e. makes it inactive
     */
    disable() {
        if(this.mEnabled)
        { 
            this.onDisable();
            this.world.removeModifier(this);
            this.mEnabled = false;
        }
    }
    
    /**
     * Checks whether or not this modifier is enabled
     * @return True if enabled, false otherwise
     */
    isEnabled() {
        return this.mEnabled;
    }
}

class WorldModifier extends Modifier{
    constructor(world) {
        super(world);
        /**
        * Modifier for worlds
        */
        this.mSpeedMultiplier;
        this.mDisableActivators;

        this.mSpeedMultiplierBefore;
        this.mSpeedMultiplierAfter;
    }

    onEnable() {
        if(this.mSpeedMultiplier != 1.0) {
            this.mSpeedMultiplierBefore = this.world.getSpeedMultiplier();
            this.mSpeedMultiplierAfter = this.mSpeedMultiplier * this.mSpeedMultiplierBefore;
            this.world.setSpeedMultiplier(this.mSpeedMultiplierAfter);
        }
        
        if(this.mDisableActivators) {
            this.world.disableAutomators();
        }
    }

    onDisable() {
        if(this.mSpeedMultiplier != 1.0) {
            var d = this.world.getSpeedMultiplier();
            d /= this.mSpeedMultiplier;
            this.world.setSpeedMultiplier(d);
        }

        if(this.mDisableActivators) {
            this.world.enableAutomators();
        }
    }

    modify(world) {
        return new WorldTarget(world);
    }
}

/**
* Modifier for generators.
*/
class GeneratorModifier extends Modifier
{
    constructor (generator){
        super(generator.world);
        this.mGenerator = generator;
        this.mMultiplier = 1.0;
    }

    onEnable()
    {
        this.mGenerator.attachModifier(this);
    }

    onDisable()
    {
        this.mGenerator.detachModifier(this);
    }

    getMultiplier()
    {
        return this.mMultiplier;
    }
}


module.exports = Modifier;

/*
    static class WorldModifier extends Modifier
    {
        private double mSpeedMultiplier;
        private boolean mDisableActivators;
        
        private double mSpeedMultiplierBefore;
        private double mSpeedMultiplierAfter;
        
        WorldModifier(World world)
        {
            super(world);
        }

        @Override
        
    }
  */ 
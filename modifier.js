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
    constructor(world){
        this.world = world;
        this.mEnabled = false;
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
    isEnabled (){
        return this.mEnabled;
    }
}

class WorldTarget
{
    constructor(w){
        this.mWorld = w;
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
        var m = new generatorModifier(this.mGenerator);
        m.mMultiplier = this.mMultiplier;
        return m;
    }
 }

 class WorldModifier extends Modifier
 {
    constructor(world){
        /**
         * Modifier for worlds
         */
        this.mSpeedMultiplier;
        this.mDisableActivators;

        this.mSpeedMultiplierBefore;
        this.mSpeedMultiplierAfter;
    }

    this.Builder = function(){
        self = this;

        self.mSpeedMultiplier = 0;
        self.mDisableActivators = false;

        self.mSpeedMultiplierBefore = 0;
        self.mSpeedMultiplierAfter = 0;

        this.onEnable = function()
        {
            if(self.mSpeedMultiplier != 1.0)
            {
                self.mSpeedMultiplierBefore = self.world.getSpeedMultiplier();
                self.mSpeedMultiplierAfter = self.mSpeedMultiplier * self.mSpeedMultiplierBefore;
                self.world.setSpeedMultiplier(mSpeedMultiplierAfter);
            }
            
            if(mDisableActivators)
            {
                self.world.disableAutomators();
            }
        }
    
        this.onDisable = function()
        {
            if(self.mSpeedMultiplier != 1.0)
            {
                var d = self.world.getSpeedMultiplier();
                d /= mSpeedMultiplier;
                self.world.setSpeedMultiplier(d);
            }

            if(self.mDisableActivators)
            {
                self.world.enableAutomators();
            }
        }

        this.modify = function(world)
        {
            return new WorldTarget(world);
        }
    }
 }

 worldModifier.prototype = Object.create(Modifier.prototype);
 worldModifier.prototype.constructor = worldModifier;

/**
 * Modifier for generators.
 */
class GeneratorModifier extends Modifier
{
    constructor (generator){
        this.mGenerator;// = generator;
        this.mMultiplier = 1.0;
    }
    
    this.Builder = function(){
        self = this;

        this.onEnable = function()
        {
            self.mGenerator.attachModifier(self);
        }

        this.onDisable = function()
        {
            self.mGenerator.detachModifier(self);
        }

        this.getMultiplier = function()
        {
            return self.mMultiplier;
        }
        
        /**
         * Apply the modifier to a generator
         * @param gen Generator to modify
         * @return A generator target to set the modification details
         */
        this.modify = function(gen)
        {
            return new GeneratorTarget(gen);
        }
    }
}
















    




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
    



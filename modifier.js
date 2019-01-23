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
    var mEnable = false;

    static class WorldModifier extends Modifier
    {
        /**
            * Modifier for worlds
            */
        var mSpeedMultiplier;
        var mDisableActivators;

        var mSpeedMultiplierBefore;
        var mSpeedMultiplierAfter;

        constructor(world){
            super(world);
        }

        onEnable()
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
    
        onDisable()
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

        modify(world)
        {
            return new WorldTarget(world);
        }
    }

    /**
    * Modifier for generators.
    */
    static class GeneratorModifier extends Modifier
    {
        var mGenerator;
        var mMultiplier = 1.0;

        constructor (generator){
            super(generator.getWorld());
            mGenerator = generator;
        }

        onEnable()
        {
            mGenerator.attachModifier(this);
        }

        onDisable()
        {
            mGenerator.detachModifier(this);
        }

        getMultiplier()
        {
            return mMultiplier;
        }
    }


    static class Builder
    {
        static class WorldTarget
        {
            var mWorld;
            var mSpeedMultiplier = 1.0;
            var mDisableActivators = false;

            constructor(world){
                mWorld = world;
            }
        
            /**
             * Speeds up all the processing by the given multiplier.
             * @param multiplier Multiplier for advancing the time
             * @return This target for chaining
             */
            speedBy(multiplier)
            {
                mSpeedMultiplier = multiplier;
                return this;
            }
            
            /**
             * Disables all the activators
             * @return This target for chaining
             */
            disableActivators()
            {
                mDisableActivators = true;
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
         static class GeneratorTarget
         {
            var mGenerator;
            var mMultiplier = 1.0;

            constructor(gen){
                mGenerator = gen;
            }
            
            /**
             * Multiplies the production of the generator.
             * 
             * @param multiplier Multiplier
             * @return This target for chaining
             */
            multiplier(multiplier)
            {
                mMultiplier = multiplier;
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
    }

    constructor(world){
        super(world);
    }
 
    /**
     * Enables this modifier, i.e. makes it active
     */
    enable() {
        if(!mEnabled)
        {
            mEnabled = true;
            this.world.addModifier(this);
            this.onEnable();
        }
    }
    
    /**
     * Disables this modifier, i.e. makes it inactive
     */
    disable() {
        if(mEnabled)
        { 
            this.onDisable();
            this.world.removeModifier(this);
            mEnabled = false;
        }
    }
    
    /**
     * Checks whether or not this modifier is enabled
     * @return True if enabled, false otherwise
     */
    isEnabled (){
        return mEnabled;
    }
}

export default Modifier;

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
    



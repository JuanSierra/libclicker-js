# Libclicker

_JS library for clicker games_

This javascript library helps to build clicker/idle/incremental games providing a set of building pieces usually found on these kind of games. 
If you dont know the genre and want to try one, please visit [this complete list](https://www.reddit.com/r/incremental_games/wiki/list_of_incremental_games)
To support all the math and balance decisions in your development [this article](https://blog.kongregate.com/the-math-of-idle-games-part-i/) is pretty useful 

## Install

### CDN

Link directly to Masonry files on [unpkg](https://unpkg.com/).

``` html
<script src="https://unpkg.com/libclicker/dist/libclicker.js"></script>
<!-- or -->
<script src="https://unpkg.com/libclicker/dist/libclicker.min.js"></script>
```
## Initialize
## Usage

``` javascript
let world = new World();
world.update(1.0 / 60.0);

// Creates a new currency called "Gold"
let gold = new Currency.Builder(world)
    .name("Gold")
    .build();

let goldMine = new Creator.Builder(world)
    .generate(gold)   // Generate gold
    .baseAmount(10)   // Defaults to 10 gold per tick
    .multiplier(1.15) // Increase amount by 15 % per level
    .price(100)       // Price of level 1 gold mine
    .priceMultiplier(1.25) // Increase price by 25 % per level
    .build();

// Advance the world by 30 seconds to make the automator work
world.update(30.0);
``` 
## Roadmap
* Documentation [X]
* Example Game []   
* BigInt support []

## Credits
A javascript port based on the good [libclicker2](https://github.com/manabreak/libclicker2) by @manabreak
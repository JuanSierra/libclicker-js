# Libclicker
[![tests](https://github.com/JuanSierra/libclicker-js/actions/workflows/tests.yml/badge.svg)](https://github.com/JuanSierra/libclicker-js/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/libclicker.svg)](https://www.npmjs.com/package/libclicker)
[![Apache-2.0 License](https://img.shields.io/badge/License-Apache-2.svg)](https://choosealicense.com/licenses/apache-2.0/)

_JS library for clicker games_

This javascript library helps to build clicker/idle/incremental games providing a set of building pieces usually found on these kind of games.  
If you dont know the genre and want to try one, please visit [this complete list](https://www.reddit.com/r/incremental_games/wiki/list_of_incremental_games).  
To support all the math and balance decisions in your development [this article](https://kongregatedev.ghost.io/the-math-of-idle-games-part-i/) is pretty useful 

## Install

### CDN

Link directly to Libclicker files on [unpkg](https://unpkg.com/).

``` html
<script src="https://unpkg.com/libclicker/dist/libclicker.js"></script>
<!-- or -->
<script src="https://unpkg.com/libclicker/dist/libclicker.min.js"></script>
```
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

### BigInt Support

For games with very large numbers (levels beyond ~120), enable optional BigInt support to avoid precision loss:

``` javascript
let gold = new Currency.Builder(world)
    .name("Gold")
    .useBigInt()
    .build();

let goldMine = new Generator.Builder(world)
    .generate(gold)
    .baseAmount(1000000000000000)
    .multiplier(2)
    .useBigInt()
    .build();
```

When enabled, all numeric values are stored as JavaScript `bigint`, preserving exact precision for values exceeding `Number.MAX_SAFE_INTEGER`. The feature is opt-in — without `.useBigInt()`, behavior is identical to previous versions.

## Roadmap
* Documentation [X]
* Example Game []   
* BigInt support [X]

## Credits
A javascript port based on the good [libclicker2](https://github.com/manabreak/libclicker2) by @manabreak

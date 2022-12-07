const Item = require('./item');
const Automator = require('./automator');
const Currency = require('./currency');
const World = require('./world');
const { Modifier } = require('./modifier');
// TODO: change name to Generator again when solving the name collision on rollup
const Creator = require('./generator');

module.exports = {
    Item,
    Creator,
    Automator,
    Currency,
    World,
    Modifier
}
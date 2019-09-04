var fs = require('fs');

function getType(line) {
    if (line.indexOf('Creature') >= 0) {
        return 'Creature';
    } else if (line.indexOf('Instant') >= 0) {
        return 'Instant';
    } else if (line.indexOf('Sorcery') >= 0) {
        return 'Sorcery';
    } else if (line.indexOf('Artifact') >= 0) {
        return 'Artifact';
    } else if (line.indexOf('Enchantment') >= 0) {
        return 'Enchantment';
    } else if (line.indexOf('Planeswalker') >= 0) {
        return 'Planeswalker';
    } else if (line.indexOf('Land') >= 0) {
        return 'Land';
    };
    return '?';
}


function getColorName(color) {
    if (color === 'U') {
        return 'Blue';
    } else if (color === 'G') {
        return 'Green';
    } else if (color === 'B') {
        return 'Black';
    } else if (color === 'W') {
        return 'White';
    } else if (color === 'R') {
        return 'Red';
    };
    return '?';
}

function getColor(colors) {
    if (!colors) {
        return 'Colorless';
    }
    if (colors.length === 0) {
        return 'Colorless';
    } else if (colors.length === 1) {
        return getColorName(colors[0]);
    } else {
        return 'Gold';
    }
}

const dict = {};

function mapCard(card) {
    // return {
    //     name: card.name.replace(/,/g, ' '),
    //     release_year: card.released_at.substring(0, 4),
    //     image: card.image_uris ? card.image_uris.normal : '',
    //     cmc: card.cmc,
    //     mana_cost: card.mana_cost,
    //     color: getColor(card.colors),
    //     set_name: card.set_name,
    //     rarity: card.rarity,
    //     type_line: card.type_line,
    //     power: card.power || null,
    //     toughness: card.toughness || null,
    //     type: getType(card.type_line),
    //     oracle_text: card.oracle_text ? card.oracle_text.replace(/(\r\n|\n|\r)/gm," ").replace(/,/g, ' ') : '',
    // };
    return [
        card.name.replace(/,/g, ' '),
        card.released_at.substring(0, 4),
        card.image_uris ? card.image_uris.normal : '',
        card.cmc,
        card.mana_cost,
        getColor(card.colors),
        card.set_name,
        card.rarity,
        card.type_line,
        card.power || null,
        card.toughness || null,
        getType(card.type_line),
        card.oracle_text ? card.oracle_text.replace(/(\r\n|\n|\r)/gm," ").replace(/,/g, ' ') : '',
    ].join(',');
}

var content = require("./cards.json");
var mapped = content.reduce((agg, curr) => {
    if (!dict[curr.name] &&
        curr.promo === false &&
        curr.oversized === false &&
        curr.set_name.indexOf('201') < 0 &&
        curr.set_name.indexOf('Commander') < 0 &&
        curr.set_name.indexOf('Tokens') < 0 &&
        curr.set_name.indexOf('Experience') < 0 &&
        curr.set_name.indexOf('Battlebond') < 0 &&
        curr.set_name.indexOf('Conspiracy') < 0 &&
        curr.set_name.indexOf('Defeat a God') < 0 &&
        curr.set_name.indexOf('Born of the Gods') < 0 &&
        curr.set_name.indexOf('Archenemy') < 0 &&
        curr.set_name.indexOf('Game Night') < 0 &&
        curr.set_name.indexOf('s Path') < 0 &&
        curr.set_name.indexOf('Cards') < 0 &&
        curr.set_name.indexOf('Face the Hydra') < 0 &&
        curr.set_name.indexOf('Global Series') < 0 &&
        curr.set_name.indexOf('Holidays') < 0 &&
        curr.set_name.indexOf('Gift') < 0 &&
        curr.set_name.indexOf('Magic Origins') < 0 &&
        curr.set_name.indexOf('Modern') < 0 &&
        curr.set_name.indexOf('Decks') < 0 &&
        curr.set_name.indexOf('Starter') < 0 &&
        curr.set_name.indexOf('Portal') < 0 &&
        curr.set_name.indexOf('Magic ') < 0 &&
        curr.set_name.indexOf('Modern') < 0 &&
        curr.set_name.indexOf('Open the Helvault') < 0 &&
        curr.reprint === false) {
        agg.push(mapCard(curr));
        dict[curr.name] = true;
    }
    return agg;
}, [['Name', 'Release Date', 'Image', 'CMC', 'Mana Cost', 'Color', 'Set', 'Rarity', 'Type (full)', 'Power', 'Toughness', 'Type', 'Oracle Text']]);

console.log(mapped.length);

let csv = mapped.join('\n')

fs.writeFile('cards.csv', csv, 'utf8', function(err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else {
      console.log('It\'s saved!');
    }
});

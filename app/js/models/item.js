class Item {

    constructor(gear, rank, set, level, enhance, main, substats, name) {
        this.gear = gear;
        this.rank = rank;
        this.set = set;
        this.level = level;
        this.enhance = enhance;
        this.main = main;
        this.substats = substats;
        this.name = name;

        // Validator.isEnum(gear, Gears);
        // Validator.isEnum(rank, Ranks);
        // Validator.isEnum(set, Sets);
        // Validator.isArray(substats);
    }
}

module.exports = {
    Item
}

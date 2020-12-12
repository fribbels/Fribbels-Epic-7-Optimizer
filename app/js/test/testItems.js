const {Stat} = require('./models/stat');
const {Item} = require('./models/item');
const {Gears, Sets, Ranks, Stats} = require('./enums');

module.exports = {
    TestItems: [
        new Item(
            Gears.WEAPON, 
            Ranks.EPIC, 
            Sets.IMMUNITY, 
            67, 
            15, 
            new Stat(Stats.FLATATK, 306), 
            [
                new Stat(Stats.HP, 18), 
                new Stat(Stats.ATK, 12),
                new Stat(Stats.SPD, 4),
                new Stat(Stats.CR, 6),
            ]
        ),
        
        new Item(
            Gears.HELMET, 
            Ranks.RARE, 
            Sets.SPEED, 
            70, 
            9, 
            new Stat(Stats.FLATHP, 1321), 
            [
                new Stat(Stats.SPD, 3), 
                new Stat(Stats.HP, 14),
                new Stat(Stats.DEF, 6),
            ]
        ),

        new Item(
            Gears.ARMOR, 
            Ranks.EPIC, 
            Sets.SPEED, 
            70, 
            15, 
            new Stat(Stats.FLATDEF, 260), 
            [
                new Stat(Stats.FLATHP, 499), 
                new Stat(Stats.DEF, 18),
                new Stat(Stats.HP, 11),
                new Stat(Stats.SPD, 2),
            ]
        ),

        new Item(
            Gears.NECKLACE, 
            Ranks.EPIC, 
            Sets.SPEED, 
            78, 
            15, 
            new Stat(Stats.HP, 60), 
            [
                new Stat(Stats.EFF, 22), 
                new Stat(Stats.FLATDEF, 65),
                new Stat(Stats.DEF, 12),
                new Stat(Stats.CR, 8),
            ]
        ),

        new Item(
            Gears.RING, 
            Ranks.RARE, 
            Sets.SPEED, 
            85, 
            15, 
            new Stat(Stats.HP, 60), 
            [
                new Stat(Stats.DEF, 11), 
                new Stat(Stats.SPD, 8),
                new Stat(Stats.CD, 4),
                new Stat(Stats.EFF, 7),
            ]
        ),

        new Item(
            Gears.BOOTS, 
            Ranks.RARE, 
            Sets.CRIT, 
            85, 
            15, 
            new Stat(Stats.SPD, 24), 
            [
                new Stat(Stats.EFF, 5), 
                new Stat(Stats.HP, 17),
                new Stat(Stats.DEF, 6)
            ]
        ),

        new Item(
            Gears.WEAPON, 
            Ranks.EPIC, 
            Sets.SPEED, 
            88, 
            15, 
            new Stat(Stats.FLATATK, 515), 
            [
                new Stat(Stats.HP, 13), 
                new Stat(Stats.ATK, 13),
                new Stat(Stats.SPD, 11),
                new Stat(Stats.RES, 10),
            ]
        ),

        new Item(
            Gears.HELMET, 
            Ranks.EPIC, 
            Sets.SPEED, 
            88, 
            15, 
            new Stat(Stats.FLATHP, 2765), 
            [
                new Stat(Stats.HP, 17), 
                new Stat(Stats.DEF, 14),
                new Stat(Stats.SPD, 6),
                new Stat(Stats.EFF, 6),
            ]
        ),

        new Item(
            Gears.ARMOR, 
            Ranks.EPIC, 
            Sets.SPEED, 
            88, 
            15, 
            new Stat(Stats.FLATDEF, 310), 
            [
                new Stat(Stats.HP, 16), 
                new Stat(Stats.SPD, 10),
                new Stat(Stats.CR, 5),
                new Stat(Stats.RES, 10),
            ]
        ),

        new Item(
            Gears.NECKLACE, 
            Ranks.RARE, 
            Sets.SPEED, 
            85, 
            15, 
            new Stat(Stats.HP, 60), 
            [
                new Stat(Stats.DEF, 11), 
                new Stat(Stats.ATK, 9),
                new Stat(Stats.RES, 10),
                new Stat(Stats.FLATDEF, 30),
            ]
        ),

        new Item(
            Gears.RING, 
            Ranks.EPIC, 
            Sets.HEALTH, 
            67, 
            15, 
            new Stat(Stats.HP, 50), 
            [
                new Stat(Stats.FLATHP, 310), 
                new Stat(Stats.RES, 19),
                new Stat(Stats.DEF, 10),
                new Stat(Stats.CD, 10),
            ]
        ),

        new Item(
            Gears.BOOTS, 
            Ranks.RARE, 
            Sets.HEALTH, 
            85, 
            15, 
            new Stat(Stats.SPD, 40), 
            [
                new Stat(Stats.RES, 14), 
                new Stat(Stats.ATK, 10),
                new Stat(Stats.HP, 6),
                new Stat(Stats.CD, 4),
            ]
        ),
    ]
}
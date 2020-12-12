module.exports = {
    calculate: calculate,
    maxScore: maxScore,
    itemScore: itemScore
};

function itemScore(hero, item) {
    const diff = getDiff(hero);

    const score = ScoreCalculator.calculate(hero, diff, item);
    const diffRolls = {
        flatatk: ScoreCalculator.maxScore(Stats.FLATATK, diff.flatatk, hero).score,
        flathp: ScoreCalculator.maxScore(Stats.FLATHP, diff.flathp, hero).score,
        spd: ScoreCalculator.maxScore(Stats.SPD, diff.spd, hero).score,
        flatdef: ScoreCalculator.maxScore(Stats.FLATDEF, diff.flatdef, hero).score,
        cr: ScoreCalculator.maxScore(Stats.CR, diff.cr, hero).score,
        cd: ScoreCalculator.maxScore(Stats.CD, diff.cd, hero).score,
        eff: ScoreCalculator.maxScore(Stats.EFF, diff.eff, hero).score,
        res: ScoreCalculator.maxScore(Stats.RES, diff.res, hero).score,
    }
    const itemScore = scoreTotal(diffRolls, score.scores);

    // console.log("diff", diff)
    // console.log("diffrolls", diffRolls)
    // console.log("score.scores", score.scores)
    // console.log("itemscore", itemScore)

    return itemScore;
}

function getDiff(hero) {
    return {
        flatatk: hero.goals.atk - hero.baseStats.flatatk,
        flathp: hero.goals.hp - hero.baseStats.flathp,
        spd: hero.goals.spd - hero.baseStats.spd,
        flatdef: hero.goals.def - hero.baseStats.flatdef,
        cr: hero.goals.chc - hero.baseStats.cr,
        cd: hero.goals.chd - hero.baseStats.cd,
        eff: hero.goals.eff - hero.baseStats.eff,
        res: hero.goals.efr - hero.baseStats.res,
    }
}

function scoreTotal(diffRolls, scores) {
    return diffRolls.flatatk * (scores.flatatk || 0) +
           diffRolls.flathp  * (scores.flathp || 0) +
           diffRolls.spd     * (scores.spd || 0) +
           diffRolls.flatdef * (scores.flatdef || 0) +
           diffRolls.cr      * (scores.cr || 0) +
           diffRolls.cd      * (scores.cd || 0) +
           diffRolls.eff     * (scores.eff || 0) +
           diffRolls.res     * (scores.res || 0);
}

function calculate(hero, diff, item) {
    // console.log("item", item)
    const additional = {}
    const scores = {}
    addStat(hero, additional, scores, item.main);

    for(var substat of item.substats) {
        addStat(hero, additional, scores, substat);
    }

    // console.log("additional", additional);
    // console.log("scores", scores);

    return {
        additionalStats: additional,
        scores: scores
    }
}

function maxScore(statType, statValue, hero) {
    const type = toFlatStat(statType);
    var percentMaxRoll = 0.08 * hero.baseStats[type];
    if (isPercent(statType)) {
        const value = statValue * hero.baseStats[type];
        total = value
        score = value / percentMaxRoll;
        return {
            total,
            score
        };
    }
    var maxRoll = 0.08 * hero.baseStats[type];
    if (type == Stats.SPD)
        maxRoll = 4;
    if (type == Stats.EFF || type == Stats.RES)
        maxRoll = 0.08;
    if (type == Stats.CR)
        maxRoll = 0.05;
    if (type == Stats.CD)
        maxRoll = 0.07;

    total = statValue;  
    score = statValue / maxRoll;
    return {
        total,
        score
    };
}

function isPercent(type) {
    return type == Stats.ATK 
    ||  type == Stats.HP
    ||  type == Stats.DEF;
}

function toFlatStat(type) {
    if (isPercent(type)) {
        return type == Stats.ATK ? Stats.FLATATK : type == Stats.HP ? Stats.FLATHP : Stats.FLATDEF;
    }
    return type;
}

function addStat(hero, totals, scores, stat) {
    const x = maxScore(stat.type, stat.value, hero);
    const type = toFlatStat(stat.type);

    totals[type] = totals[type] ? totals[type] + x.total : x.total;  
    scores[type] = scores[type] ? scores[type] + x.score : x.score;
    return;
}

        // 1 max roll atk = 46.08 atk
        // 1 max roll spd = 4 spd
        // 46.08 / 576
        // 4 / 88


        // const score = Math.max(0, diff[Stats.flatatk] - additional[Stats.flatatk]);



        // want: 100 atk 40 spd
        // add: 50 atk 10 cr

        // 0.08 * 576 = 46.08

        // 10/88 = 0.11
        // 50/576 = 0.086

         
        // 10/50 = 0.2 

// ATK HP DEF EFF RES - 8%
// CR - 5%
// CD - 7%
// SPD - 4
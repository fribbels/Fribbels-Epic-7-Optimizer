

        // final int s1 = ((atk * s1AtkMod * s1Rate + s1FlatMod) * 1.871f + s1FlatMod2) * (s1Pow) * s1Multis;
        // final int s2 = ((atk * s2AtkMod * s2Rate + s2FlatMod) * 1.871f + s2FlatMod2) * (s2Pow) * s2Multis;
        // final int s3 = ((atk * s3AtkMod * s3Rate + s3FlatMod) * 1.871f + s3FlatMod2) * (s3Pow) * s3Multis;

        // (increase dmg) * [(atk + bonus atk) * (pow * multi) * (cdmg)] 

        // {[(ATK !!)(Atkmod)(Rate **)+(FlatMod)] * (1.871)+(Flat2Mod)} × (pow **)(a) + 

        // a = multis = (EnhanceMod)(HitTypeMod)(ElementMod)(DamageUpMod)(TargetDebuffMod)
        // rate -> scaling
        // flatmod -> max hp/def scaling
        // flat2mod -> ddj



function findSkill(skill, hero, heroData) {
    var skillData = heroData.skills[skill];

    // console.warn(skillData)
    // console.warn(hero)
    // console.warn(heroData)

    return skillData.options.find(x => x.name == hero.skillOptions[skill].skillEffect) || skillData.options[0]
}

// function calculateRate(skill, hero, heroData, skillOptions) {
//     return findSkill(skill, skillOptions, heroData).rate;
// }

// function calculateAtkMod(skill, hero, heroData, skillOptions) {
//     var atkMod = 1;

//     if (findSkill(skill, skillOptions, heroData).type == 0) {
//         return atkMod;
//     }

//     if (skillOptions[skill].greaterAttackBuffEnabled) {
//         atkMod += 0.75
//     } else if (skillOptions[skill].attackBuffEnabled) {
//         atkMod += 0.5
//     }

//     if (skillOptions[skill].vigorAttackBuffEnabled) {
//         atkMod += 0.3
//     }

//     if (skillOptions[skill].decreasedAttackBuffEnabled) {
//         atkMod -= 0.5
//     }

//     return atkMod;
// }

// function calculateSelfHpScaling(skill, hero, heroData, skillOptions) {
//     return findSkill(skill, skillOptions, heroData).selfHpScaling || 0;
// }

// function calculateType(skill, hero, heroData, skillOptions) {
//     return findSkill(skill, skillOptions, heroData).type || 0;
// }

function getHitTypeMulti(skill, hero, heroData) {
    if (!hero.skillOptions[skill].skillEffect) {
        return 0
    }
    if (hero.skillOptions[skill].skillEffect.includes("crit")) {
        return 0
    }
    if (hero.skillOptions[skill].skillEffect.includes("crushing")) {
        return 1.3 // 130%
    }
    if (hero.skillOptions[skill].skillEffect.includes("normal")) {
        return 1 // 130%
    }
    if (hero.skillOptions[skill].skillEffect.includes("miss")) {
        return 0.75; // 75%
    }
    return 0
}

// function calculateMultis(skill, hero, heroData, skillOptions) {
//     var multis = 1;

//     multis += findSkill(skill, skillOptions, heroData).type != 0 ? 0 : getHitTypeMulti(skill, hero, heroData, skillOptions)

//     if (skillOptions[skill].elementalAdvantageEnabled && findSkill(skill, skillOptions, heroData).type == 0) {
//         multis *= 1.1
//     }

//     if (skillOptions[skill].targetTargetBuffEnabled && findSkill(skill, skillOptions, heroData).type == 0) {
//         multis *= 1.15
//     }

//     // Enhance mod

//     // DamageUpMod

//     return multis
// }

module.exports = {
    getMultipliers: (hero, skillOptions) => {
        var heroData = HeroData.getHeroExtraInfo(hero.name)
        fixSkillOptions(hero, heroData);

        var s1FlatMod = 0;
        var s2FlatMod = 0;
        var s3FlatMod = 0;

        var s1FlatMod2 = 0;
        var s2FlatMod2 = 0;
        var s3FlatMod2 = 0;

        // var s1Multis = calculateMultis("S1", hero, heroData, skillOptions)
        // var s2Multis = calculateMultis("S2", hero, heroData, skillOptions)
        // var s3Multis = calculateMultis("S3", hero, heroData, skillOptions)

        // var s1Pow = heroData.skills.S1.find(x => x.name == skillOptions.S1.skillEffect).pow || 1;
        // var s2Pow = heroData.skills.S2.find(x => x.name == skillOptions.S2.skillEffect).pow || 1;
        // var s3Pow = heroData.skills.S3.find(x => x.name == skillOptions.S3.skillEffect).pow || 1;

    // private Float[] selfHpScaling             = new Float[]{1f, 1f, 1f};
    // private Float[] selfAtkScaling            = new Float[]{1f, 1f, 1f};
    // private Float[] selfDefScaling            = new Float[]{1f, 1f, 1f};
    // private Float[] selfSpdScaling            = new Float[]{1f, 1f, 1f};
    // private Float[] constantValue             = new Float[]{1f, 1f, 1f};
    // private Float[] selfAtkConstantValue      = new Float[]{1f, 1f, 1f};
    // private Float[] conditionalIncreasedValue = new Float[]{1f, 1f, 1f};
    // private Float[] defDiffPen                = new Float[]{1f, 1f, 1f};
    // private Float[] defDiffPenMax             = new Float[]{1f, 1f, 1f};
    // private Float[] atkDiffPen                = new Float[]{1f, 1f, 1f};
    // private Float[] atkDiffPenMax             = new Float[]{1f, 1f, 1f};
    // private Float[] spdDiffPen                = new Float[]{1f, 1f, 1f};
    // private Float[] spdDiffPenMax             = new Float[]{1f, 1f, 1f};
    // private Float[] penetration               = new Float[]{1f, 1f, 1f};
    // private Float[] atkIncrease               = new Float[]{1f, 1f, 1f};
        var skillNames = ["S1", "S2", "S3"]
        var result = {
            selfSpdScaling:            skillNames.map(x => findSkill(x, hero, heroData).selfSpdScaling || 0),
            selfHpScaling:             skillNames.map(x => findSkill(x, hero, heroData).selfHpScaling || 0),
            selfAtkScaling:            skillNames.map(x => findSkill(x, hero, heroData).selfAtkScaling || 0),
            selfDefScaling:            skillNames.map(x => findSkill(x, hero, heroData).selfDefScaling || 0),
            extraSelfHpScaling:        skillNames.map(x => findSkill(x, hero, heroData).extraSelfHpScaling || 0),
            extraSelfAtkScaling:       skillNames.map(x => findSkill(x, hero, heroData).extraSelfAtkScaling || 0),
            extraSelfDefScaling:       skillNames.map(x => findSkill(x, hero, heroData).extraSelfDefScaling || 0),
            constantValue:             skillNames.map(x => findSkill(x, hero, heroData).constantValue || 0),
            selfAtkConstantValue:      skillNames.map(x => findSkill(x, hero, heroData).selfAtkConstantValue || 0),
            increasedValue:            skillNames.map(x => findSkill(x, hero, heroData).increasedValue || 0),
            defDiffPen:                skillNames.map(x => findSkill(x, hero, heroData).defDiffPen || 0),
            defDiffPenMax:             skillNames.map(x => findSkill(x, hero, heroData).defDiffPenMax || 0),
            atkDiffPen:                skillNames.map(x => findSkill(x, hero, heroData).atkDiffPen || 0),
            atkDiffPenMax:             skillNames.map(x => findSkill(x, hero, heroData).atkDiffPenMax || 0),
            spdDiffPen:                skillNames.map(x => findSkill(x, hero, heroData).spdDiffPen || 0),
            spdDiffPenMax:             skillNames.map(x => findSkill(x, hero, heroData).spdDiffPenMax || 0),
            penetration:               skillNames.map(x => findSkill(x, hero, heroData).penetration || 0),
            atkIncrease:               skillNames.map(x => findSkill(x, hero, heroData).atkIncrease || 0),
            cdmgIncrease:              skillNames.map(x => findSkill(x, hero, heroData).cdmgIncrease || 0),
            rate:                      skillNames.map(x => findSkill(x, hero, heroData).rate || 0),
            pow:                       skillNames.map(x => findSkill(x, hero, heroData).pow || 0),
            targets:                   skillNames.map(x => findSkill(x, hero, heroData).targets || 0),
            crit:                      skillNames.map(x => findSkill(x, hero, heroData).name.includes("crit") ? 1 : 0),
            support:                   skillNames.map(x => (findSkill(x, hero, heroData).name.includes("heal") || findSkill(x, hero, heroData).name.includes("barrier")) ? 1 : 0),
            hitMulti:                  skillNames.map(x => getHitTypeMulti(x, hero, heroData) || 0),
        }

        console.warn("calc")
        console.warn(skillOptions)
        console.warn(result)

        return result
    },
}
function fixSkillOptions(hero, heroData) {
    if (!hero.skillOptions) {
        hero.skillOptions = {
            S1: {skillEffect: heroData.skills.S1.options[0].name},
            S2: {skillEffect: heroData.skills.S2.options[0].name},
            S3: {skillEffect: heroData.skills.S3.options[0].name},
        }
        return
    }

    if (!hero.skillOptions.S1) {
        hero.skillOptions.S1 = {skillEffect: heroData.skills.S1.options[0].name}
    }

    if (!hero.skillOptions.S2) {
        hero.skillOptions.S2 = {skillEffect: heroData.skills.S2.options[0].name}
    }

    if (!hero.skillOptions.S3) {
        hero.skillOptions.S3 = {skillEffect: heroData.skills.S3.options[0].name}
    }
}
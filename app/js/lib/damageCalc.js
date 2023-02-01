

        // final int s1 = ((atk * s1AtkMod * s1Rate + s1FlatMod) * 1.871f + s1FlatMod2) * (s1Pow) * s1Multis;
        // final int s2 = ((atk * s2AtkMod * s2Rate + s2FlatMod) * 1.871f + s2FlatMod2) * (s2Pow) * s2Multis;
        // final int s3 = ((atk * s3AtkMod * s3Rate + s3FlatMod) * 1.871f + s3FlatMod2) * (s3Pow) * s3Multis;

        // (increase dmg) * [(atk + bonus atk) * (pow * multi) * (cdmg)] 

        // {[(ATK !!)(Atkmod)(Rate **)+(FlatMod)] * (1.871)+(Flat2Mod)} × (pow **)(a) + 

        // a = multis = (EnhanceMod)(HitTypeMod)(ElementMod)(DamageUpMod)(TargetDebuffMod)
        // rate -> scaling
        // flatmod -> max hp/def scaling
        // flat2mod -> ddj



function findSkill(skill, skillOptions, heroData) {
    return heroData.skills[skill].find(x => x.name == skillOptions[skill].skillEffect) || heroData.skills[skill][0]
}

function calculateRate(skill, hero, heroData, skillOptions) {
    return findSkill(skill, skillOptions, heroData).rate;
}

function calculateAtkMod(skill, hero, heroData, skillOptions) {
    var atkMod = 1;

    if (findSkill(skill, skillOptions, heroData).type == 0) {
        return atkMod;
    }

    if (skillOptions[skill].greaterAttackBuffEnabled) {
        atkMod += 0.75
    } else if (skillOptions[skill].attackBuffEnabled) {
        atkMod += 0.5
    }

    if (skillOptions[skill].vigorAttackBuffEnabled) {
        atkMod += 0.3
    }

    if (skillOptions[skill].decreasedAttackBuffEnabled) {
        atkMod -= 0.5
    }

    return atkMod;
}

function calculateSelfHpScaling(skill, hero, heroData, skillOptions) {
    return findSkill(skill, skillOptions, heroData).selfHpScaling || 0;
}

function calculateType(skill, hero, heroData, skillOptions) {
    return findSkill(skill, skillOptions, heroData).type || 0;
}

function getHitTypeMulti(skill, hero, heroData, skillOptions) {
    if (!skillOptions[skill].skillEffect) {
        return 0
    }
    if (skillOptions[skill].skillEffect.includes("crit")) {
        return 0
    }
    if (skillOptions[skill].skillEffect.includes("crushing")) {
        return 0.3 // 130%
    }
    if (skillOptions[skill].skillEffect.includes("miss")) {
        return -0.25; // 75%
    }
    return 0
}

function calculateMultis(skill, hero, heroData, skillOptions) {
    var multis = 1;

    multis += findSkill(skill, skillOptions, heroData).type != 0 ? 0 : getHitTypeMulti(skill, hero, heroData, skillOptions)

    if (skillOptions[skill].elementalAdvantageEnabled && findSkill(skill, skillOptions, heroData).type == 0) {
        multis *= 1.1
    }

    if (skillOptions[skill].targetTargetBuffEnabled && findSkill(skill, skillOptions, heroData).type == 0) {
        multis *= 1.15
    }

    // Enhance mod

    // DamageUpMod

    return multis
}

module.exports = {
    getMultipliers: (hero, skillOptions) => {
        var heroData = HeroData.getHeroExtraInfo(hero.name)
        fixSkillOptions(skillOptions);

        var s1FlatMod = 0;
        var s2FlatMod = 0;
        var s3FlatMod = 0;

        var s1FlatMod2 = 0;
        var s2FlatMod2 = 0;
        var s3FlatMod2 = 0;

        var s1Multis = calculateMultis("s1", hero, heroData, skillOptions)
        var s2Multis = calculateMultis("s2", hero, heroData, skillOptions)
        var s3Multis = calculateMultis("s3", hero, heroData, skillOptions)

        var s1Pow = heroData.skills.s1.find(x => x.name == skillOptions.s1.skillEffect).pow || 1;
        var s2Pow = heroData.skills.s2.find(x => x.name == skillOptions.s2.skillEffect).pow || 1;
        var s3Pow = heroData.skills.s3.find(x => x.name == skillOptions.s3.skillEffect).pow || 1;

        var result = {
            types: [
                calculateType("s1", hero, heroData, skillOptions),
                calculateType("s2", hero, heroData, skillOptions),
                calculateType("s3", hero, heroData, skillOptions),
            ],
            atkMods: [ // done
                calculateAtkMod("s1", hero, heroData, skillOptions),
                calculateAtkMod("s2", hero, heroData, skillOptions),
                calculateAtkMod("s3", hero, heroData, skillOptions),
            ],
            rates: [ // done
                calculateRate("s1", hero, heroData, skillOptions),
                calculateRate("s2", hero, heroData, skillOptions),
                calculateRate("s3", hero, heroData, skillOptions),
            ],
            flatMods: [
                0,
                0,
                0,
            ],
            flatMods2: [
                0,
                0,
                0,
            ],
            multis: [
                s1Multis,
                s2Multis,
                s3Multis,
            ],
            pows: [
                s1Pow,
                s2Pow,
                s3Pow,
            ],
            selfHpScalings: [
                calculateSelfHpScaling("s1", hero, heroData, skillOptions),
                calculateSelfHpScaling("s2", hero, heroData, skillOptions),
                calculateSelfHpScaling("s3", hero, heroData, skillOptions),
            ],
            selfDefScalings: [
            ],
        };

        console.warn("calc")
        console.warn(skillOptions)
        console.warn(result)

        return result
    },
}
function fixSkillOptions(skillOptions) {
    if (!skillOptions) {
        skillOptions = {
            s1: {},
            s2: {},
            s3: {}
        }
        return
    }

    if (!skillOptions.s1) {
        skillOptions.s1 = {}
    }

    if (!skillOptions.s2) {
        skillOptions.s2 = {}
    }

    if (!skillOptions.s3) {
        skillOptions.s3 = {}
    }
}
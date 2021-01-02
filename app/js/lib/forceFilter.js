module.exports = {

    applyForceFilters: (params, items) => {
        const forceNumber = parseInt($('#forceNumberSelect').val());
        const passed = [];

        if (forceDisabled(params)) {
            console.log("Force not enabled")
            return items;
        }
        console.log("Force enabled")

        for (var item of items) {
            const passes = [
                passesGenericCheck(item, params.inputAtkMinForce, params.inputAtkMaxForce, "Attack", ["Weapon", "Armor"]),
                passesGenericCheck(item, params.inputAtkPercentMinForce, params.inputAtkPercentMaxForce, "AttackPercent", ["Armor"]),
                passesGenericCheck(item, params.inputCrMinForce, params.inputCrMaxForce, "CriticalHitChancePercent", []),
                passesGenericCheck(item, params.inputCdMinForce, params.inputCdMaxForce, "CriticalHitDamagePercent", []),
                passesGenericCheck(item, params.inputDefMinForce, params.inputDefMaxForce, "Defense", ["Weapon", "Armor"]),
                passesGenericCheck(item, params.inputDefPercentMinForce, params.inputDefPercentMaxForce, "DefensePercent", ["Weapon"]),
                passesGenericCheck(item, params.inputResMinForce, params.inputResMaxForce, "EffectResistancePercent", []),
                passesGenericCheck(item, params.inputEffMinForce, params.inputEffMaxForce, "EffectivenessPercent", []),
                passesGenericCheck(item, params.inputHpMinForce, params.inputHpMaxForce, "Health", []),
                passesGenericCheck(item, params.inputHpPercentMinForce, params.inputHpPercentMaxForce, "HealthPercent", []),
                passesGenericCheck(item, params.inputSpdMinForce, params.inputSpdMaxForce, "Speed", []),
            ]

            if (passes.filter(x => x == true).length >= forceNumber) {
                passed.push(item);
            }
        }

        return passed;
    },
}

function forceDisabled(params) {
    return params.inputAtkMinForce == null && params.inputAtkMinForce == null
    &&     params.inputAtkPercentMinForce == null && params.inputAtkPercentMaxForce == null
    &&     params.inputCrMinForce == null && params.inputCrMaxForce == null
    &&     params.inputCdMinForce == null &&  params.inputCdMaxForce == null
    &&     params.inputDefMinForce == null && params.inputDefMaxForce == null
    &&     params.inputDefPercentMinForce == null && params.inputDefPercentMaxForce == null
    &&     params.inputResMinForce == null && params.inputResMaxForce == null
    &&     params.inputEffMinForce == null && params.inputEffMaxForce == null
    &&     params.inputHpMinForce == null && params.inputHpMaxForce == null
    &&     params.inputHpPercentMinForce == null && params.inputHpPercentMaxForce == null
    &&     params.inputSpdMinForce == null && params.inputSpdMaxForce == null
}

function passesGenericCheck(item, min, max, allowedMain, allowedGear) {
    if (!min && !max)
        return false;

    const stat = item.augmentedStats[allowedMain];
    if (allowedGear.includes(item.gear)) {
        return false;
    }

    if ((item.gear == "Necklace" || item.gear == "Ring" || item.gear == "Boots") && allowedMain == item.main.type) {
        return true;
    }
    return passesNumberCheck(stat, min, max);
}

function passesNumberCheck(number, min, max) {
    var passes = true;
    if (min && number < min)
        passes = false;
    if (max && number > max)
        passes = false;
    return passes;
}
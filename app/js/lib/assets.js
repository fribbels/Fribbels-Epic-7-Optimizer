const assetsBySet = {
    "HealthSet": "./assets/sethealth.png",
    "DefenseSet": "./assets/setdefense.png",
    "AttackSet": "./assets/setattack.png",
    "SpeedSet": "./assets/setspeed.png",
    "CriticalSet": "./assets/setcritical.png",
    "HitSet": "./assets/sethit.png",
    "DestructionSet": "./assets/setdestruction.png",
    "LifestealSet": "./assets/setlifesteal.png",
    "CounterSet": "./assets/setcounter.png",
    "ResistSet": "./assets/setresist.png",
    "UnitySet": "./assets/setunity.png",
    "RageSet": "./assets/setrage.png",
    "ImmunitySet": "./assets/setimmunity.png",
    "RevengeSet": "./assets/setrevenge.png",
    "InjurySet": "./assets/setinjury.png",
    "PenetrationSet": "./assets/setpenetration.png",
}

const assetsByElement = {
    "dark": "./assets/elementdark.png",
    "wind": "./assets/elementearth.png",
    "fire": "./assets/elementfire.png",
    "ice": "./assets/elementice.png",
    "light": "./assets/elementlight.png",
}

const assetsByLevel = {
    "85below": "./assets/85down.png",
    "85at": "./assets/85.png",
    "85above": "./assets/85up.png",
}

const assetsByEnhance = {
    "plus0": "./assets/plus0.png",
    "plus3": "./assets/plus3.png",
    "plus6": "./assets/plus6.png",
    "plus9": "./assets/plus9.png",
    "plus12": "./assets/plus12.png",
    "plus15": "./assets/plus15.png"
}

const assetsByClass = {
    "ranger": "./assets/classranger.png",
    "knight": "./assets/classknight.png",
    "warrior": "./assets/classwarrior.png",
    "mage": "./assets/classmage.png",
    "manauser": "./assets/classmanauser.png",
    "assassin": "./assets/classassassin.png",
}

const assetsByGear = {
    "Weapon": "./assets/gearweapon.png",
    "Helmet": "./assets/gearhelmet.png",
    "Armor": "./assets/geararmor.png",
    "Necklace": "./assets/gearnecklace.png",
    "Ring": "./assets/gearring.png",
    "Boots": "./assets/gearboots.png",
}

const assetsByStat = {
    "Attack": "./assets/statatkdark.png",
    "AttackPercent": "./assets/statatkpercentdark.png",
    "Defense": "./assets/statdefdark.png",
    "DefensePercent": "./assets/statdefpercentdark.png",
    "Health": "./assets/stathpdark.png",
    "HealthPercent": "./assets/stathppercentdark.png",
    "Speed": "./assets/statspddark.png",
    "CriticalHitChancePercent": "./assets/statcrdark.png",
    "CriticalHitDamagePercent": "./assets/statcddark.png",
    "EffectivenessPercent": "./assets/stateffdark.png",
    "EffectResistancePercent": "./assets/statresdark.png",
}

module.exports = {

    getAssetsBySet: () => {
        return assetsBySet;
    },

    getAssetsByStat: () => {
        return assetsByStat;
    },

    getAssetsByGear: () => {
        return assetsByGear;
    },

    getAssetsByLevel: () => {
        return assetsByLevel;
    },

    getAssetsByEnhance: () => {
        return assetsByEnhance;
    },

    getSetAsset: (set) => {
        return assetsBySet[set];
    },

    getClassAsset: (clazz) => {
        return assetsByClass[clazz];
    },

    getElementAsset: (element) => {
        return assetsByElement[element];
    },

    getGearAsset: (gear) => {
        return assetsByGear[gear];
    },
    getBlank: () => {
        return './assets/blank.png';
    },
    getX: () => {
        return './assets/blackx.png';
    },
    getLock: () => {
        return './assets/lock.png';
    },
    getEdit: () => {
        return './assets/edit.png';
    },
    getReforge: () => {
        return './assets/reforge.png';
    },
    getStar: () => {
        return './assets/star.png';
    },
    getCopy: () => {
        return './assets/copy.png';
    },
}

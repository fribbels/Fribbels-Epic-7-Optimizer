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

module.exports = {

    initialize: () => {

    },

    getAssetsBySet: () => {
        return assetsBySet;
    },

    getAssetsByGear: () => {
        return assetsByGear;
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
}

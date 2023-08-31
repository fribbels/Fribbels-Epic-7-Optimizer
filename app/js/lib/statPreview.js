module.exports = {

    draw: (before, after) => {
        $('#atkStatBefore').text(before.atk)
        $('#defStatBefore').text(before.def)
        $('#hpStatBefore').text(before.hp)
        $('#spdStatBefore').text(before.spd)
        $('#crStatBefore').text(before.cr)
        $('#cdStatBefore').text(before.cd)
        $('#effStatBefore').text(before.eff)
        $('#resStatBefore').text(before.res)
        $('#gsStatBefore').text(before.score)


        $('#atkStatAfter').text(after.atk)
        $('#defStatAfter').text(after.def)
        $('#hpStatAfter').text(after.hp)
        $('#spdStatAfter').text(after.spd)
        $('#crStatAfter').text(after.cr)
        $('#cdStatAfter').text(after.cd)
        $('#effStatAfter').text(after.eff)
        $('#resStatAfter').text(after.res)
        $('#gsStatAfter').text(after.score)

        renderDiff(before, after, 'atk')
        renderDiff(before, after, 'def')
        renderDiff(before, after, 'hp')
        renderDiff(before, after, 'spd')
        renderDiff(before, after, 'cr')
        renderDiff(before, after, 'cd')
        renderDiff(before, after, 'eff')
        renderDiff(before, after, 'res')
        renderDiff(before, after, 'score')

        $('#setBefore').html(renderSets(before.equipment, 'previewSet', false));
        $('#setAfter').html(renderSets(after.sets, 'previewSet', true));
    },
}

const fourPieceSets = [
    "AttackSet",
    "SpeedSet",
    "DestructionSet",
    "LifestealSet",
    "ProtectionSet",
    "CounterSet",
    "RageSet",
    "RevengeSet",
    "InjurySet"
]

function renderSets(equipment, name, isAfter) {
    if (!equipment) return;

    var setCounters;

    if (isAfter) {
        setCounters = equipment;
    } else {
        const setNames = Object.values(equipment).map(x => x.set);
        setCounters = [
            Math.floor(setNames.filter(x => x == "HealthSet").length),
            Math.floor(setNames.filter(x => x == "DefenseSet").length),
            Math.floor(setNames.filter(x => x == "AttackSet").length),
            Math.floor(setNames.filter(x => x == "SpeedSet").length),
            Math.floor(setNames.filter(x => x == "CriticalSet").length),
            Math.floor(setNames.filter(x => x == "HitSet").length),
            Math.floor(setNames.filter(x => x == "DestructionSet").length),
            Math.floor(setNames.filter(x => x == "LifestealSet").length),
            Math.floor(setNames.filter(x => x == "CounterSet").length),
            Math.floor(setNames.filter(x => x == "ResistSet").length),
            Math.floor(setNames.filter(x => x == "UnitySet").length),
            Math.floor(setNames.filter(x => x == "RageSet").length),
            Math.floor(setNames.filter(x => x == "ImmunitySet").length),
            Math.floor(setNames.filter(x => x == "PenetrationSet").length),
            Math.floor(setNames.filter(x => x == "RevengeSet").length),
            Math.floor(setNames.filter(x => x == "InjurySet").length),
            Math.floor(setNames.filter(x => x == "ProtectionSet").length),
            Math.floor(setNames.filter(x => x == "TorrentSet").length)
        ]
    }

    const sets = [];
    for (var i = 0; i < setCounters.length; i++) {
        const setsFound = Math.floor(setCounters[i] / Constants.piecesBySetIndex[i]);
        for (var j = 0; j < setsFound; j++) {
            sets.push(Constants.setsByIndex[i]);
        }
    }

    sets.sort((a, b) => {
        if (fourPieceSets.includes(a)) {
            return -1;
        } else if (fourPieceSets.includes(b)) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    })

    const images = sets.map(x => '<img class="optimizerSetIcon" src=' + Assets.getSetAsset(x) + '></img>');
    // console.log("RenderSets images", images);
    return images.join("");
}

// 38821f

function renderDiff(before, after, field, id) {
    const value = after[field] - before[field];
    var text = Math.abs(value);
    var id = '#' + field + 'StatDiff';
    if (field == 'score') {
        id = '#gsStatDiff'
    }
    var elem = $(id);

    if (value > 0) {
        text += " ▲";
        elem.addClass('up');
        elem.removeClass('down');
    } else if (value < 0) {
        text += " ▼";
        elem.addClass('down');
        elem.removeClass('up');
    } else {
        text = ""
        elem.removeClass('up');
        elem.removeClass('down');
    }

    $(id).text(text);
}
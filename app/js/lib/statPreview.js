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


        $('#atkStatAfter').text(after.atk)
        $('#defStatAfter').text(after.def)
        $('#hpStatAfter').text(after.hp)
        $('#spdStatAfter').text(after.spd)
        $('#crStatAfter').text(after.cr)
        $('#cdStatAfter').text(after.cd)
        $('#effStatAfter').text(after.eff)
        $('#resStatAfter').text(after.res)

        renderDiff(before, after, 'atk')
        renderDiff(before, after, 'def')
        renderDiff(before, after, 'hp')
        renderDiff(before, after, 'spd')
        renderDiff(before, after, 'cr')
        renderDiff(before, after, 'cd')
        renderDiff(before, after, 'eff')
        renderDiff(before, after, 'res')

        $('#setBefore').html(GridRenderer.renderSets(before.sets, 'previewSet'));
        $('#setAfter').html(GridRenderer.renderSets(after.sets, 'previewSet'));
        console.log("DRAW", before);
    },
}

function renderDiff(before, after, field, id) {
    const value = after[field] - before[field];
    var text = Math.abs(value);
    var id = '#' + field + 'StatDiff';
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
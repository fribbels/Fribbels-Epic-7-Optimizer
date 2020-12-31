function makeUnit(speed, name) {
    return {
        name: name,
        speed: speed
    }
}

function log(units) {
    return JSON.parse(JSON.stringify(units))
}

var units = [
    makeUnit(50, "unit1"),
    makeUnit(100, "unit2"),
    makeUnit(1500, "unit3"),
    // makeUnit(200, "unit4"),
    // makeUnit(250, "unit5"),
    // makeUnit(300, "unit6")
]

units.sort((x, y) => y.speed - x.speed)

var maxSpeed = units[0].speed
units.forEach(x => x.cr = Math.random())
units[0].cr = 0;

for (var i = 0; i < 20; i++) {
    var current = units[0];
    console.log("TURN: " + current.name)
    current.cr = 0;
    units.forEach(x => {
        x.distanceRemaining = (1 - x.cr) * maxSpeed;
        x.timeRemaining = x.distanceRemaining / x.speed
    })

    units.sort((x, y) => x.timeRemaining - y.timeRemaining)
    console.log("Before CR change", log(units));

    var next = units[0];

    units.forEach(x => {
        x.cr = x.cr + next.timeRemaining * x.speed / maxSpeed
    })

    console.log("After CR change", log(units))
}
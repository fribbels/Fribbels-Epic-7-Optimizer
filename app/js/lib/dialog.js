/*

*/

const Swal = require('sweetalert2');
const Sortable = require('sortablejs');



var e7StatToOptimizerStat = {
}

var e7StatToDisplayStat = {
}

var optimizerStatToDisplayStat = {
}

function outsideClickDisable() {
    const popup = Swal.getPopup()
    popup.classList.remove('swal2-show')
    setTimeout(() => {
        popup.classList.add('animate__animated', 'animate__headShake')
    })
    setTimeout(() => {
        popup.classList.remove('animate__animated', 'animate__headShake')
    }, 500)
    return false
}

module.exports = {
    initialize: () => {

        e7StatToDisplayStat = {
            "att_rate": i18next.t("% Attack"),
            "max_hp_rate": i18next.t("% Health"),
            "def_rate": i18next.t("% Defense"),
            "att": i18next.t(" Attack"),
            "max_hp": i18next.t(" Health"),
            "def": i18next.t(" Defense"),
            "speed": i18next.t(" Speed"),
            "res": i18next.t("% Res"),
            "cri": i18next.t("% Crit rate"),
            "acc": i18next.t("% Eff"),
            "coop": i18next.t(" Dual Attack")
        }

        e7StatToOptimizerStat = {
            "att_rate": "AttackPercent",
            "max_hp_rate": "HealthPercent",
            "def_rate": "DefensePercent",
            "att": "Attack",
            "max_hp": "Health",
            "def": "Defense",
            "speed": "Speed",
            "res": "EffectResistancePercent",
            "cri": "CriticalHitChancePercent",
            "cri_dmg": "CriticalHitDamagePercent",
            "acc": "EffectivenessPercent",
            "coop": "DualAttackChancePercent"
        }

        optimizerStatToDisplayStat = {
            "AttackPercent": i18next.t("Attack %"),
            "HealthPercent": i18next.t("Health %"),
            "DefensePercent": i18next.t("Defense %"),
            "Attack": i18next.t("Attack"),
            "Health": i18next.t("Health"),
            "Defense": i18next.t("Defense"),
            "Speed": i18next.t("Speed"),
            "EffectResistancePercent": i18next.t("Effect Resistance"),
            "CriticalHitChancePercent": i18next.t("Crit Chance"),
            "CriticalHitDamagePercent": i18next.t("Crit Damage"),
            "EffectivenessPercent": i18next.t("Effectiveness"),
            "DualAttackChancePercent": i18next.t("DualAttackChancePercent")
        }
    },

    error: (text) => {
        Swal.fire({
          icon: 'error',
          text: i18next.t(text),
          confirmButtonText: i18next.t("OK"),
          allowOutsideClick: outsideClickDisable
          // cancelButtonText: i18next.t("Cancel")
        })
    },

    info: (text) => {
        Swal.fire({
          icon: 'info',
          text: i18next.t(text),
          confirmButtonText: i18next.t("OK"),
          // cancelButtonText: i18next.t("Cancel")
        })
    },

    success: (text) => {
        Swal.fire({
          icon: 'success',
          text: i18next.t(text),
          confirmButtonText: i18next.t("OK"),
          // cancelButtonText: i18next.t("Cancel")
        })
    },

    htmlSuccess: (html) => {
        Swal.fire({
          icon: 'success',
          html: html,
          confirmButtonText: i18next.t("OK")
          // cancelButtonText: i18next.t("Cancel")
        })
    },

    htmlSuccessDisableOutsideClick: (html) => {
        Swal.fire({
          icon: 'success',
          html: html,
          confirmButtonText: i18next.t("OK"),
          allowOutsideClick: outsideClickDisable
          // cancelButtonText: i18next.t("Cancel")
        })
    },

    htmlError: (html) => {
        Swal.fire({
            icon: 'error',
            html: html,
            confirmButtonText: i18next.t("OK"),
            allowOutsideClick: outsideClickDisable
          // cancelButtonText: i18next.t("Cancel")
        })
    },

    changeArtifact: (level) => {
        const name = $('#editArtifact').val();

        var html = ``;

//${level == i ? "selected" : ""}
        if (name == "None") {
            return;
        }

        for (var i = 30; i >= 0; i--) {
            var stats = Artifact.getStats(name, i)
            html += `<option value="${i}" >${i} - (${stats.attack.toFixed(1)} ${i18next.t("atk")}, ${stats.health.toFixed(1)} ${i18next.t("hp")})</option>`
        }

        $("select[id='editArtifactLevel']").find('option').remove().end().append(html);
    },

    editHeroDialog: async (hero) => {
        return new Promise(async (resolve, reject) => {
            const getAllHeroesResponse = await Api.getAllHeroes();
            const heroData = HeroData.getAllHeroData();
            const heroes = getAllHeroesResponse.heroes;

            const heroInfo = heroData[hero.name];
            const ee = heroInfo.ex_equip[0];

            const result = await Swal.fire({
                title: '',
                width: 900,
                html: `
                    <div class="editGearForm">
                        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                        <div class="editGearFormRow">
                            <div class="editGearFormHalf">

                                <p style="color: var(--font-color)" data-t>${i18next.t("Add Artifact/EE/Imprint bonus stats")}</p>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Artifact")}</div>
                                    <select id="editArtifact" class="editGearStatSelect" onchange="Dialog.changeArtifact()">
                                        ${getArtifactHtml(hero)}
                                    </select>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Level")}</div>
                                    <select id="editArtifactLevel" class="editGearStatSelect">
                                        ${getArtifactEnhanceHtml(hero)}
                                    </select>
                                </div>

                                <div class="horizontalLineWithMoreSpace"></div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Imprint")}</div>
                                    ${getImprintHtml(hero, heroInfo)}
                                </div>

                                <div class="horizontalLineWithMoreSpace"></div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("EE")}</div>

                                    <select id="editEe" class="editGearStatSelect">
                                        ${getEeEnhanceHtml(hero, ee)}
                                    </select>
                                </div>

                                <div class="horizontalLineWithMoreSpace"></div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Stars")}</div>

                                    <select id="editStars" class="editGearStatSelect">
                                        ${getStarsHtml(hero, heroInfo)}
                                    </select>
                                </div>
                            </div>

                            <div class="editGearFormVertical"></div>

                            <div class="editGearFormHalf">
                                <p style="color: var(--font-color)" data-t>${i18next.t("Add any other stats")}</p>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Attack")}</div>
                                    <div class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusAttack" value="${hero.bonusAtk || ""}">
                                    </div>
                                    <div class="blankFormSpace"></div>
                                    <span class="valuePadding input-holder-percent">
                                        <input type="number" class="bonusStatInputPercent" max="100" accuracy="1" min="0" id="editHeroBonusAttackPercent" value="${hero.bonusAtkPercent || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Defense")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusDefense" value="${hero.bonusDef || ""}">
                                    </span>
                                    <div class="blankFormSpace"></div>
                                    <span class="valuePadding input-holder-percent">
                                        <input type="number" class="bonusStatInputPercent" max="100" accuracy="1" min="0" id="editHeroBonusDefensePercent" value="${hero.bonusDefPercent || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Health")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusHealth" value="${hero.bonusHp || ""}">
                                    </span>
                                    <div class="blankFormSpace"></div>
                                    <span class="valuePadding input-holder-percent">
                                        <input type="number" class="bonusStatInputPercent" max="100" accuracy="1" min="0" id="editHeroBonusHealthPercent" value="${hero.bonusHpPercent || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Speed")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusSpeed" value="${hero.bonusSpeed || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Crit Rate")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusCritChance" value="${hero.bonusCr || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Crit Dmg")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusCritDamage" value="${hero.bonusCd || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Eff")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusEffectiveness" value="${hero.bonusEff || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Res")}</div>
                                    <span class="valuePadding input-holder">
                                        <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="editHeroBonusEffectResistance" value="${hero.bonusRes || ""}">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                didOpen: async () => {
                    const options = {
                        filter: true,
                        maxHeight: 400,
                        // customFilter: Utils.customFilter,
                        filterAcceptOnEnter: true
                    }
                    const statSelectOptions = {
                        maxHeight: 500,
                        // customFilter: Utils.customFilter,
                    }

                    $('#editArtifact').multipleSelect(options)
                    $('#editArtifact').change(module.exports.changeArtifact)
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const artifactName = $('#editArtifact').val();
                    const artifactLevel = $('#editArtifactLevel').val();
                    const imprintNumber = $('#editImprint').val();
                    const eeNumber = $('#editEe').val()
                    const stars = $('#editStars').val()

                    const editedHero = {
                        attack: parseInt(document.getElementById('editHeroBonusAttack').value),
                        defense: parseInt(document.getElementById('editHeroBonusDefense').value),
                        health: parseInt(document.getElementById('editHeroBonusHealth').value),
                        attackPercent: parseFloat(document.getElementById('editHeroBonusAttackPercent').value),
                        defensePercent: parseFloat(document.getElementById('editHeroBonusDefensePercent').value),
                        healthPercent: parseFloat(document.getElementById('editHeroBonusHealthPercent').value),
                        speed: parseInt(document.getElementById('editHeroBonusSpeed').value),
                        critChance: parseFloat(document.getElementById('editHeroBonusCritChance').value),
                        critDamage: parseFloat(document.getElementById('editHeroBonusCritDamage').value),
                        effectiveness: parseFloat(document.getElementById('editHeroBonusEffectiveness').value),
                        effectResistance: parseFloat(document.getElementById('editHeroBonusEffectResistance').value),

                        aeiAttack: 0,
                        aeiDefense: 0,
                        aeiHealth: 0,
                        aeiAttackPercent: 0,
                        aeiDefensePercent: 0,
                        aeiHealthPercent: 0,
                        aeiSpeed: 0,
                        aeiCritChance: 0,
                        aeiCritDamage: 0,
                        aeiEffectiveness: 0,
                        aeiEffectResistance: 0,

                        artifactName: artifactName,
                        artifactLevel: artifactLevel,
                        imprintNumber: imprintNumber,
                        eeNumber: eeNumber,
                        stars: stars,
                        ee: ee,
                        heroInfo: heroInfo
                    }

                    return editedHero;
                    // resolve(editedHero);
                }
            });

            resolve(result.value);
        });
    },

    confirmation: async (text) => {
        return new Promise(async (resolve, reject) => {
            const result = await Swal.fire({
                title: '',
                icon: 'question',
                text: text,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel")
            });

            resolve(result.value);
        });
    },

    editModStatsDialog: async (hero) => {
        return new Promise(async (resolve, reject) => {
            const getAllHeroesResponse = await Api.getAllHeroes();
            const heroData = HeroData.getAllHeroData();
            const heroes = getAllHeroesResponse.heroes;

            const heroInfo = heroData[hero.name];
            const ee = heroInfo.ex_equip[0];

            const { value: formValues } = await Swal.fire({
                title: '',
                width: 1000,
                html: `
                    <div class="editGearForm">
                        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                        <p style="color: var(--font-color)" data-t>${i18next.t("Substat modification priority")}</p>

                        <div class="editGearFormRow">

                            <div class="editGearFormHalf">
                                <p style="color: var(--font-color)" data-t>${i18next.t("Options")}</p>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Limit Rolls")}</div>
                                    <select id="limitRolls" class="gearPreviewButton">
                                        <option value=1 ${hero.limitRolls == 1 ? "selected" : ""}>1</option>
                                        <option value=2 ${(hero.limitRolls == 2 || !hero.limitRolls) ? "selected" : ""}>2</option>
                                        <option value=3 ${hero.limitRolls == 3 ? "selected" : ""}>3</option>
                                        <option value=4 ${hero.limitRolls == 4 ? "selected" : ""}>4</option>
                                        <option value=5 ${hero.limitRolls == 5 ? "selected" : ""}>5</option>
                                        <option value=6 ${hero.limitRolls == 6 ? "selected" : ""}>6</option>
                                    </select>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Mod grade")}</div>
                                    <select id="modGrade" class="gearPreviewButton">
                                        <option value="lesser" ${hero.modGrade == "lesser" ? "selected" : ""}>${i18next.t("Lesser")}</option>
                                        <option value="greater" ${(hero.modGrade == "greater" || !hero.modGrade) ? "selected" : ""}>${i18next.t("Greater")}</option>
                                    </select>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Roll Quality")}</div>
                                    <select id="rollQuality" class="gearPreviewButton">
                                        <option value=0 ${hero.rollQuality == 0 ? "selected" : ""}>Min</option>
                                        <option value=10 ${hero.rollQuality == 10 ? "selected" : ""}>10%</option>
                                        <option value=20 ${hero.rollQuality == 20 ? "selected" : ""}>20%</option>
                                        <option value=30 ${hero.rollQuality == 30 ? "selected" : ""}>30%</option>
                                        <option value=40 ${hero.rollQuality == 40 ? "selected" : ""}>40%</option>
                                        <option value=50 ${(hero.rollQuality == 50 || hero.rollQuality == undefined) ? "selected" : ""}>50%</option>
                                        <option value=60 ${hero.rollQuality == 60 ? "selected" : ""}>60%</option>
                                        <option value=70 ${hero.rollQuality == 70 ? "selected" : ""}>70%</option>
                                        <option value=80 ${hero.rollQuality == 80 ? "selected" : ""}>80%</option>
                                        <option value=90 ${hero.rollQuality == 90 ? "selected" : ""}>90%</option>
                                        <option value=100 ${hero.rollQuality == 100 ? "selected" : ""}>Max</option>
                                    </select>
                                </div>
                            </div>

                            <div class="editGearFormVertical"></div>

                            <div class="groupContainer editGearFormHalf">
                                <div class="groupColumn">
                                    <p style="color: var(--font-color)" data-t>${i18next.t("Keep")}</p>
                                    <div id="keepGroup" class="dragOrderList">
                                        ${generateStatList(hero, "keep")}
                                    </div>
                                </div>
                                <div class="groupColumn">
                                    <p style="color: var(--font-color)" data-t>${i18next.t("Ignore")}</p>
                                    <div id="ignoreGroup" class="dragOrderList">
                                        ${generateStatList(hero, "ignore")}
                                    </div>
                                </div>
                                <div class="groupColumn">
                                    <p style="color: var(--font-color)" data-t>${i18next.t("Discard")}</p>
                                    <div id="modifyGroup" class="dragOrderList">
                                        ${generateStatList(hero, "discard")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                didOpen: async () => {
                    const options = {
                        filter: true,
                        maxHeight: 400,
                        // customFilter: Utils.customFilter,
                        filterAcceptOnEnter: true
                    }
                    const statSelectOptions = {
                        maxHeight: 500,
                        // customFilter: Utils.customFilter,
                    }

                    global.keepGroup = Sortable.create(document.getElementById('keepGroup'), {
                        group: "nested",
                        animation: 100,
                        fallbackOnBody: true,
                    });
                    global.ignoreGroup = Sortable.create(document.getElementById('ignoreGroup'), {
                        group: "nested",
                        animation: 100,
                        fallbackOnBody: true,
                    });
                    global.modifyGroup = Sortable.create(document.getElementById('modifyGroup'), {
                        group: "nested",
                        animation: 100,
                        fallbackOnBody: true,
                    });
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const editedHero = {
                        discardStats: modifyGroup.toArray(),
                        ignoreStats: ignoreGroup.toArray(),
                        keepStats: keepGroup.toArray(),

                        modGrade: document.getElementById('modGrade').value,
                        rollQuality: parseFloat(document.getElementById('rollQuality').value),
                        limitRolls: parseInt(document.getElementById('limitRolls').value),
                        heroInfo: heroInfo
                    }

                    resolve(editedHero);
                }
            });
        });
    },

    editBuildDialog: async (name) => {
        return new Promise(async (resolve, reject) => {
            const { value: formValues } = await Swal.fire({
                title: '',
                html: `
                    <div class="editGearForm">
                        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                        <p style="color: var(--font-color)">${i18next.t("Build name")}</p>
                        <input type="text" class="bonusStatInput" id="editBuildName" value="${name ? name : ""}" autofocus="autofocus" onfocus="this.select()" style="width:200px !important">
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const buildInfo = {
                        buildName: document.getElementById('editBuildName').value,
                    }

                    resolve(buildInfo);
                }
            });
        });
    },

    changeEditGearMainStat: () => {
        const gear = $('#editGearType').val();

        if (gear == "Weapon") {
            $('#editGearMainStatType').val("Attack")
        }
        if (gear == "Helmet") {
            $('#editGearMainStatType').val("Health")
        }
        if (gear == "Armor") {
            $('#editGearMainStatType').val("Defense")
        }
    },

    editGearDialog: async (item, edit, useReforgedStats) => {
        console.log("Dialog editing item", item);
        console.log("Dialog use reforged", useReforgedStats);
        if (!item) {
            item = {
                main: {},
                substats: []
            };
        }
        ItemAugmenter.augment([item])
        if (useReforgedStats && Reforge.isReforgeableNow(item)) {
            item = JSON.parse(JSON.stringify(item));
            item.level = 90;
            item.main.value = item.main.reforgedValue;

            for (var substat of item.substats) {
                substat.value = substat.reforgedValue;
            }
        }

        return new Promise(async (resolve, reject) => {
            const getAllHeroesResponse = await Api.getAllHeroes();
            const heroes = getAllHeroesResponse.heroes;

            const { value: formValues } = await Swal.fire({
                title: '',
                html: `
                    <div class="editGearForm">
                        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Equipped")}</div>
                            <select id="editGearEquipped" class="editGearStatSelect">
                                ${getEquippedHtml(item, heroes)}
                            </select>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Type")}</div>
                            <select id="editGearType" class="editGearStatSelect" onchange="Dialog.changeEditGearMainStat()">
                                ${getGearTypeOptionsHtml(item)}
                            </select>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Set")}</div>
                            <select id="editGearSet" class="editGearStatSelect">
                                ${getGearSetOptionsHtml(item)}
                            </select>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Reforge")}</div>
                            <select id="editGearMaterial" class="editGearStatSelect">
                                ${getGearMaterialOptionsHtml(item)}
                            </select>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Rank")}</div>
                            <select id="editGearRank" class="editGearStatSelect">
                                ${getGearRankOptionsHtml(item)}
                            </select>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Level")}</div>
                            <input type="number" class="editGearStatNumber" id="editGearLevel" value="${item.level}">
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Enhance")}</div>
                            <input type="number" class="editGearStatNumber" id="editGearEnhance" value="${item.enhance}">
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Locked")}</div>
                            <input type="checkbox" id="editGearLocked" ${item.locked ? "checked" : ""}>
                        </div>

                        </br>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Main Stat")}</div>
                            <select id="editGearMainStatType" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.main)}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearMainStatValue" value="${item.main.value}">
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 1")}</div>
                            <select id="editGearStat1Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[0])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat1Value" value="${item.substats[0] ? item.substats[0].value : ""}">
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 2")}</div>
                            <select id="editGearStat2Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[1])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat2Value" value="${item.substats[1] ? item.substats[1].value : ""}">
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 3")}</div>
                            <select id="editGearStat3Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[2])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat3Value" value="${item.substats[2] ? item.substats[2].value : ""}">
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 4")}</div>
                            <select id="editGearStat4Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[3])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat4Value" value="${item.substats[3] ? item.substats[3].value : ""}">
                        </div>
                    </div>
                `,
                didOpen: async () => {
                    const options = {
                        filter: true,
                        filterAcceptOnEnter: true,
                        // customFilter: Utils.customFilter,
                        maxHeight: 250
                    }

                    $('#editGearEquipped').multipleSelect(options)
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const editedItem = {
                        rank: document.getElementById('editGearRank').value,
                        set: document.getElementById('editGearSet').value,
                        gear: document.getElementById('editGearType').value,
                        material: document.getElementById('editGearMaterial').value,
                        main: {
                            type: document.getElementById('editGearMainStatType').value,
                            value: parseInt(document.getElementById('editGearMainStatValue').value),
                        },
                        enhance: parseInt(document.getElementById('editGearEnhance').value) || 0,
                        level: parseInt(document.getElementById('editGearLevel').value) || 0,
                        locked: document.getElementById('editGearLocked').checked,
                    }

                    if (!editedItem.rank || editedItem.rank == "None" ||
                        !editedItem.set  || editedItem.set == "None"  ||
                        !editedItem.gear || editedItem.gear == "None" ||
                        !editedItem.main || !editedItem.main.type || editedItem.main.type == "None" || !editedItem.main.value) {
                        module.exports.error(i18next.t("Please make sure Type / Set / Rank / Level / Enhance / Main stat are not empty"));
                        console.error("FAIL", editedItem)
                        return false;
                    }

                    const substats = [];

                    const subStatType1 = document.getElementById('editGearStat1Type').value;
                    const subStatType2 = document.getElementById('editGearStat2Type').value;
                    const subStatType3 = document.getElementById('editGearStat3Type').value;
                    const subStatType4 = document.getElementById('editGearStat4Type').value;

                    if (subStatType1 !="None") substats.push({type: subStatType1, value: parseInt(document.getElementById('editGearStat1Value').value || 0)})
                    if (subStatType2 !="None") substats.push({type: subStatType2, value: parseInt(document.getElementById('editGearStat2Value').value || 0)})
                    if (subStatType3 !="None") substats.push({type: subStatType3, value: parseInt(document.getElementById('editGearStat3Value').value || 0)})
                    if (subStatType4 !="None") substats.push({type: subStatType4, value: parseInt(document.getElementById('editGearStat4Value').value || 0)})

                    editedItem.substats = substats;

                    if (editedItem.enhance == 15 && editedItem.substats.length != 4) {
                        module.exports.error(i18next.t("Please make sure +15 items have 4 substats"));
                        console.error("FAIL", editedItem)
                        return false;
                    }
                    if (editedItem.enhance < 0 ||  editedItem.enhance > 15) {
                        module.exports.error(i18next.t("Item enhance can only be 0 - 15"));
                        console.error("FAIL", editedItem)
                        return false;
                    }

                    ItemAugmenter.augment([editedItem]);
                    if (item.id && edit) {
                        editedItem.id = item.id;
                    }

                    var equippedById = document.getElementById('editGearEquipped').value;

                    if (edit) {
                        if (equippedById == "None") {
                            await Api.unequipItems([editedItem.id])
                        } else {
                            editedItem.equippedById = equippedById;
                            editedItem.equippedByName = heroes.filter(x => x.id == equippedById)[0].name
                            await Api.equipItemsOnHero(equippedById, [editedItem.id])
                        }
                    } else {
                        if (equippedById == "None") {
                            await Api.addItems([editedItem]);
                        } else {
                            editedItem.equippedById = equippedById;
                            editedItem.equippedByName = heroes.filter(x => x.id == equippedById)[0].name
                            await Api.addItems([editedItem]);
                            await Api.equipItemsOnHero(equippedById, [editedItem.id])
                        }
                    }

                    console.log(editedItem);
                    resolve(editedItem);
                }
            })
        })
    }
}



function getEeHtml(hero, ee) {
    const statType = ee ? ee.stat.type : "None";
    const statValue = ee ? ee.stat.value : 0;
    const percentValue = Math.round(statValue * 100);
    const initialValue = hero.eeStat || 0
    // const labelText = ee ?  + " (" + percentValue + " - " + percentValue * 2 + ")": "None";
    const labelText = ee ? `${e7StatToDisplayStat[statType]} (${percentValue} - ${percentValue*2})` : "None";

    return `
        <div class="valuePadding input-holder">
            <input type="number" class="bonusStatInput" id="editHeroBonusEeStat" value="${initialValue}">
        </div>
    `
        // <div class="smallBlankFormSpace"></div>
        // <div class="editEeStatLabel">${labelText}</div>
}

function getImprintHtml(hero, heroInfo) {
    const imprintType = heroInfo.self_devotion.type;
    const displayText = e7StatToDisplayStat[imprintType];
    const imprintValues = heroInfo.self_devotion.grades;
    const fixedImprintValues = [];

    const isFlat = imprintType == "max_hp" || imprintType == "speed" || imprintType == "att" || imprintType == "def";

    for (var grade of Object.keys(imprintValues)) {
        if (!isFlat) {
            fixedImprintValues[grade] = Utils.round10ths(imprintValues[grade] * 100);
        } else {
            fixedImprintValues[grade] = imprintValues[grade];
        }
    }

    var html = `<select class="editGearStatSelect" id="editImprint"><option value="None">${i18next.t("None")}</option>`;

    for (var grade of Object.keys(fixedImprintValues)) {
        html += `<option value="${fixedImprintValues[grade]}" ${hero.imprintNumber == fixedImprintValues[grade] ? "selected" : ""}>${fixedImprintValues[grade]}${displayText} - ${grade}</option>`
        // html += `<option value="${imprintValues[grade]}"}>${grade + " - " + imprintValues[grade]} ${displayText}</option>`
    }

    html += `</select>
            `
            // <div class="smallBlankFormSpace"></div>
            // <div class="editEeStatLabel">${displayText}</div>
    return html;
}

function getStarsHtml(hero, heroInfo) {
    var html = `<option value=6>6</option>
                <option value=5 ${hero.stars == 5 ? "selected" : ""}>5</option>`;

    return html;
}


function getEquippedHtml(item, heroes) {
    var html = `<option value="None">${i18next.t("Nobody")}</option>`;

    Utils.sortByAttribute(heroes, 'name');

    for (var hero of heroes) {
        html += `<option value="${hero.id}" ${hero.id == item.equippedById ? "selected" : ""}>${i18next.t(hero.name)}</option>`
    }

    return html;
}


function getArtifactHtml(hero) {
    var html = `<option value="None">${i18next.t("None")}</option>`;

    const artifactsJson = HeroData.getAllArtifactData();
    const artifacts = Object.values(artifactsJson);

    for (var artifact of artifacts) {
        // console.log(hero, artifact.name);
        html += `<option value="${artifact.name}" ${hero.artifactName == artifact.name ? "selected" : ""}>${i18next.t(artifact.name)}</option>`


    }

    return html;
}


function getArtifactEnhanceHtml(hero) {
    var html = `<option value="None">${i18next.t("None")}</option>`;

    const artifactName = hero.artifactName
    if (artifactName && artifactName !="None") {
        const artifactLevel = hero.artifactLevel;
        if (artifactLevel && artifactLevel !="None") {
            for (var i = 30; i >= 0; i--) {
                var stats = Artifact.getStats(artifactName, i)
                html += `<option value="${i}" ${artifactLevel == i ? "selected" : ""}>${i} - (${stats.attack.toFixed(1)} ${i18next.t("atk")}, ${stats.health.toFixed(1)} ${i18next.t("hp")})</option>`
            }

        }
    }

    return html;
}

function getEeEnhanceHtml(hero, ee) {
    var html = `<option value="None">${i18next.t("None")}</option>`;
    if (!ee) {
        return html;
    }
    const statType = ee.stat.type;
    const isFlat = statType == "max_hp" || statType == "speed" || statType == "att" || statType == "def";

    const baseValue = isFlat ? ee.stat.value : Math.round(ee.stat.value * 100);
    const maxValue = baseValue * 2;


    const displayText = e7StatToDisplayStat[statType];

    for (var i = baseValue; i <= maxValue; i++) {
        html += `<option value="${i}" ${(hero.eeNumber == i) ? "selected" : ""}>${i}${displayText}</option>`
    }

    return html;
}

function getStatOptionsHtml(stat) {
    const type = stat ? stat.type : null;
    return  `
<option value="None"></option>
<option value="AttackPercent" ${type == "AttackPercent" ? "selected" : ""}>${i18next.t("Attack %")}</option>
<option value="Attack" ${type == "Attack" ? "selected" : ""}>${i18next.t("Attack")}</option>
<option value="HealthPercent" ${type == "HealthPercent" ? "selected" : ""}>${i18next.t("Health %")}</option>
<option value="Health" ${type == "Health" ? "selected" : ""}>${i18next.t("Health")}</option>
<option value="DefensePercent" ${type == "DefensePercent" ? "selected" : ""}>${i18next.t("Defense %")}</option>
<option value="Defense" ${type == "Defense" ? "selected" : ""}>${i18next.t("Defense")}</option>
<option value="Speed" ${type == "Speed" ? "selected" : ""}>${i18next.t("Speed")}</option>
<option value="CriticalHitChancePercent" ${type == "CriticalHitChancePercent" ? "selected" : ""}>${i18next.t("Crit Chance")}</option>
<option value="CriticalHitDamagePercent" ${type == "CriticalHitDamagePercent" ? "selected" : ""}>${i18next.t("Crit Damage")}</option>
<option value="EffectivenessPercent" ${type == "EffectivenessPercent" ? "selected" : ""}>${i18next.t("Effectiveness")}</option>
<option value="EffectResistancePercent" ${type == "EffectResistancePercent" ? "selected" : ""}>${i18next.t("Effect Resistance")}</option>
`
}

function getGearTypeOptionsHtml(item) {
    const gear = item.gear;
    return  `
<option value="None"></option>
<option value="Weapon" ${gear == "Weapon" ? "selected" : ""}>${i18next.t("Weapon")}</option>
<option value="Helmet" ${gear == "Helmet" ? "selected" : ""}>${i18next.t("Helmet")}</option>
<option value="Armor" ${gear == "Armor" ? "selected" : ""}>${i18next.t("Armor")}</option>
<option value="Necklace" ${gear == "Necklace" ? "selected" : ""}>${i18next.t("Necklace")}</option>
<option value="Ring" ${gear == "Ring" ? "selected" : ""}>${i18next.t("Ring")}</option>
<option value="Boots" ${gear == "Boots" ? "selected" : ""}>${i18next.t("Boots")}</option>
`
}

function getGearSetOptionsHtml(item) {
    const set = item.set;
    return  `
<option value="None"></option>
<option value="SpeedSet" ${set == "SpeedSet" ? "selected" : ""}>${i18next.t("Speed")}</option>
<option value="AttackSet" ${set == "AttackSet" ? "selected" : ""}>${i18next.t("Attack")}</option>
<option value="DestructionSet" ${set == "DestructionSet" ? "selected" : ""}>${i18next.t("Destruction")}</option>
<option value="LifestealSet" ${set == "LifestealSet" ? "selected" : ""}>${i18next.t("Lifesteal")}</option>
<option value="CounterSet" ${set == "CounterSet" ? "selected" : ""}>${i18next.t("Counter")}</option>
<option value="RageSet" ${set == "RageSet" ? "selected" : ""}>${i18next.t("Rage")}</option>
<option value="HealthSet" ${set == "HealthSet" ? "selected" : ""}>${i18next.t("Health")}</option>
<option value="DefenseSet" ${set == "DefenseSet" ? "selected" : ""}>${i18next.t("Defense")}</option>
<option value="CriticalSet" ${set == "CriticalSet" ? "selected" : ""}>${i18next.t("Critical")}</option>
<option value="HitSet" ${set == "HitSet" ? "selected" : ""}>${i18next.t("Hit")}</option>
<option value="ResistSet" ${set == "ResistSet" ? "selected" : ""}>${i18next.t("Resist")}</option>
<option value="UnitySet" ${set == "UnitySet" ? "selected" : ""}>${i18next.t("Unity")}</option>
<option value="ImmunitySet" ${set == "ImmunitySet" ? "selected" : ""}>${i18next.t("Immunity")}</option>
<option value="PenetrationSet" ${set == "PenetrationSet" ? "selected" : ""}>${i18next.t("Penetration")}</option>
<option value="InjurySet" ${set == "InjurySet" ? "selected" : ""}>${i18next.t("Injury")}</option>
<option value="RevengeSet" ${set == "RevengeSet" ? "selected" : ""}>${i18next.t("Revenge")}</option>
`
}

function getGearRankOptionsHtml(item) {
    const rank = item.rank;
    return  `
<option value="None"></option>
<option value="Epic" ${rank == "Epic" ? "selected" : ""}>${i18next.t("Epic")}</option>
<option value="Heroic" ${rank == "Heroic" ? "selected" : ""}>${i18next.t("Heroic")}</option>
<option value="Rare" ${rank == "Rare" ? "selected" : ""}>${i18next.t("Rare")}</option>
<option value="Good" ${rank == "Good" ? "selected" : ""}>${i18next.t("Good")}</option>
<option value="Normal" ${rank == "Normal" ? "selected" : ""}>${i18next.t("Normal")}</option>
`
}

function getGearMaterialOptionsHtml(item) {
    const material = item.material;
    return  `
<option value="None">${i18next.t("None")}</option>
<option value="Hunt" ${material == "Hunt" ? "selected" : ""}>${i18next.t("Hunt")}</option>
<option value="Conversion" ${material == "Conversion" ? "selected" : ""}>${i18next.t("Conversion")}</option>
`
}

function generateStatList(hero, state) {
    const keepStats = hero.keepStats || [];
    const discardStats = hero.discardStats || [];
    var list;

    if (state == "keep") {
        list = keepStats
    } else if (state == "discard") {
        list = discardStats
    } else {
        const stats = [
            "Attack",
            "Health",
            "Defense",
            "CriticalHitDamagePercent",
            "CriticalHitChancePercent",
            "HealthPercent",
            "DefensePercent",
            "AttackPercent",
            "EffectivenessPercent",
            "EffectResistancePercent",
            "Speed"
        ]


        const ignoreList = stats.filter(x => !keepStats.includes(x) && !discardStats.includes(x))
        list = ignoreList;
    }

    var result = "";
    for (var i = 0; i < list.length; i++) {
        const stat = list[i];
        result += `<div class="list-group-item" data-id="${stat}">${optimizerStatToDisplayStat[stat]}</div>`
    }
    return result;
}

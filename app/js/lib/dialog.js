/*

*/

const Swal = require('sweetalert2');
const Sortable = require('sortablejs');
const tippy = require('tippy.js').default;

tippy.setDefaultProps({
    allowHTML: true,
    placement: 'auto',
    maxWidth: 550,
});

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
            "AttackPercent": "Attack %",
            "HealthPercent": "Health %",
            "DefensePercent": "Defense %",
            "Attack": "Attack",
            "Health": "Health",
            "Defense": "Defense",
            "Speed": "Speed",
            "EffectResistancePercent": "Effect Resistance",
            "CriticalHitChancePercent": "Crit Chance",
            "CriticalHitDamagePercent": "Crit Damage",
            "EffectivenessPercent": "Effectiveness",
            "DualAttackChancePercent": "DualAttackChancePercent"
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

    updatePrompt: (text) => {
        return new Promise((resolve, reject) => {
            Swal.fire({
              icon: 'success',
              text: i18next.t(text),
              showCancelButton: true,
              confirmButtonText: i18next.t("Yes"),
              cancelButtonText: i18next.t("Later"),
              confirmButtonColor: '#51A259',
              allowOutsideClick: outsideClickDisable
            }).then((result) => {
              if (result.isConfirmed) {
                resolve("restart");
              } else if (result.isDenied) {
                reject("skip");
              }
            })
        })
    },

    erasePrompt: (text) => {
        return new Promise((resolve, reject) => {
            Swal.fire({
              icon: 'info',
              text: i18next.t(text),
              showCancelButton: true,
              confirmButtonText: i18next.t("Yes"),
              cancelButtonText: i18next.t("No"),
              confirmButtonColor: '#51A259',
              allowOutsideClick: outsideClickDisable
            }).then((result) => {
              if (result.isConfirmed) {
                resolve("yes");
              } else if (result.isDenied) {
                reject("no");
              }
            })
        })
    },

    showNewFeatures: (html) => {
        Swal.fire({
            icon: 'success',
            html: html,
            width: 700,
            confirmButtonText: i18next.t("OK"),
            allowOutsideClick: outsideClickDisable
            // cancelButtonText: i18next.t("Cancel")
        })
    },

    multiOptimizerGuide: (html) => {
        Swal.fire({
            icon: 'info',
            html: html,
            width: 900,
            confirmButtonText: i18next.t("OK"),
            // allowOutsideClick: outsideClickDisable
            // cancelButtonText: i18next.t("Cancel")
        })
    },

    changeArtifact: (level) => {
        const name = $('#editArtifact').val();

        var html = ``;

        if (name == "None") {
            return;
        }

        for (var i = 30; i >= 0; i--) {
            var stats = Artifact.getStats(name, i)
            html += `<option value="${i}" >${i} - (${stats.attack.toFixed(1)} ${i18next.t("atk")}, ${stats.health.toFixed(1)} ${i18next.t("hp")})</option>`
        }

        $("select[id='editArtifactLevel']").find('option').remove().end().append(html);
    },


    changeSkillOptionsDialog: async (heroId) => {
        return new Promise(async (resolve, reject) => {
            const getAllHeroesResponse = await Api.getAllHeroes();
            const heroes = getAllHeroesResponse.heroes;


            hero = heroes.find(x => x.id == heroId)
            if (!hero) {
                return;
            }
            const heroData = HeroData.getHeroExtraInfo(hero.name)

            // console.warn(hero);
            // const heroInfo = heroData[hero.name];
            // const ee = heroInfo.ex_equip[0];

            const result = await Swal.fire({
                title: '',
                width: 600,
                html: `
                    <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                    <p style="color: var(--font-color)" data-t>${i18next.t("Skill options")}</p>
                    <div class="horizontalSpace"></div>
                    <div class="horizontalSpace"></div>

                    <div class="editGearForm tabsWrapperBody">
                        <div class="tabsWrapper">
                            <div class="tabsButtonWrapper">
                                <button class="tab-button active" style="border-top-left-radius: 10px;" data-id="a">S1</button>
                                <button class="tab-button" data-id="b">S2</button>
                                <button class="tab-button" style="border-top-right-radius: 10px;" data-id="c">S3</button>
                            </div>
                            <div class="tabsContentWrapper">
                                <div class="tabsContent active" id="a">
                                    ${generateSkillOptionsHtml("S1", hero, heroData)}
                                </div>
                                <div class="tabsContent" id="b">
                                    ${generateSkillOptionsHtml("S2", hero, heroData)}
                                </div>
                                <div class="tabsContent" id="c">
                                    ${generateSkillOptionsHtml("S3", hero, heroData)}
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                // Disabled damage
                // html: `
                //     <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                //     <p style="color: var(--font-color)" data-t>${i18next.t("Skill options")}</p>
                //     <div class="horizontalSpace"></div>
                //     <div class="horizontalSpace"></div>

                //     <div class="editGearForm tabsWrapperBody">
                //         <div class="tabsWrapper">
                //             <div class="tabsButtonWrapper">
                //                 <button class="tab-button active" style="border-top-left-radius: 10px;" data-id="home">S1</button>
                //                 <button class="tab-button" data-id="about">S2</button>
                //                 <button class="tab-button" style="border-top-right-radius: 10px;" data-id="contact">S3</button>
                //             </div>
                //             <div class="tabsContentWrapper">
                //                 <div class="tabsContent active" id="home">
                //                     ${generateSkillOptionsHtml("S1", hero, heroData)}
                //                 </div>
                //                 <div class="tabsContent" id="about">
                //                     ${generateSkillOptionsHtml("S2", hero, heroData)}
                //                 </div>
                //                 <div class="tabsContent" id="contact">
                //                     ${generateSkillOptionsHtml("S3", hero, heroData)}
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // `,
                didOpen: async () => {
                    // const options = {
                    //     filter: true,
                    //     maxHeight: 400,
                    //     // customFilter: Utils.customFilter,
                    //     filterAcceptOnEnter: true
                    // }
                    // const statSelectOptions = {
                    //     maxHeight: 500,
                    //     // customFilter: Utils.customFilter,
                    // }

                    // $('#editArtifact').multipleSelect(options)
                    // $('#editArtifact').change(module.exports.changeArtifact)
                    const tabs = document.querySelector(".tabsWrapper");
                    const tabButton = document.querySelectorAll(".tab-button");
                    const contents = document.querySelectorAll(".tabsContent");

                    tabs.onclick = e => {
                      const id = e.target.dataset.id;
                      if (id) {
                        tabButton.forEach(btn => {
                          btn.classList.remove("active");
                        });
                        e.target.classList.add("active");

                        contents.forEach(content => {
                          content.classList.remove("active");
                        });
                        const element = document.getElementById(id);
                        element.classList.add("active");
                      }
                    }
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    // const artifactName = $('#editArtifact').val();
                    // const artifactLevel = $('#editArtifactLevel').val();
                    // const imprintNumber = $('#editImprint').val();
                    // const eeNumber = $('#editEe').val()
                    // const stars = $('#editStars').val()

                    var skills = ["S1", "S2", "S3"]
                    const skillOptions = {}

                    for (var skill of skills) {
                        skillOptions[skill] = {
                            // attackImprintPercent: parseFloat(document.getElementById(`${skill}EditAttackPercentImprint`).value) || 0,
                            // attackIncreasePercent: parseFloat(document.getElementById(`${skill}EditAttackPercentIncrease`).value) || 0,
                            // damageIncreasePercent: parseFloat(document.getElementById(`${skill}EditDamageIncrease`).value) || 0,
                            // elementalAdvantageEnabled: (document.getElementById(`${skill}EditElementalAdvantageBox`).checked),
                            // decreasedAttackBuffEnabled: (document.getElementById(`${skill}EditDecreasedAttackBox`).checked),
                            // attackBuffEnabled: (document.getElementById(`${skill}EditAttackBuffBox`).checked),
                            // greaterAttackBuffEnabled: (document.getElementById(`${skill}EditGreaterAttackBuffBox`).checked),
                            // critDamageBuffEnabled: (document.getElementById(`${skill}EditCritDamageBuffBox`).checked),
                            // vigorAttackBuffEnabled: (document.getElementById(`${skill}EditVigorAttackBuffBox`).checked),

                            skillEffect: (document.getElementById(`${skill}SkillEffect`).value),
                            // applyToAllSkillsEnabled: (document.getElementById(`${skill}EditApplyToAllSkillsBox`).checked),

                            // targetDefense: parseInt(document.getElementById(`${skill}EditTargetDefense`).value),
                            // targetDefenseIncreasePercent: parseFloat(document.getElementById(`${skill}EditTargetDefenseIncrease`).value) || 0,
                            // targetDamageReductionPercent: parseFloat(document.getElementById(`${skill}EditTargetDamageReduction`).value) || 0,
                            // targetDamageTransferPercent: parseFloat(document.getElementById(`${skill}EditTargetDamageTransfer`).value) || 0,
                            // targetDefenseBuffEnabled: (document.getElementById(`${skill}EditTargetDefenseBuffBox`).checked),
                            // targetVigorDefenseBuffEnabled: (document.getElementById(`${skill}EditTargetVigorBuffBox`).checked),
                            // targetDefenseBreakBuffEnabled: (document.getElementById(`${skill}EditTargetDefenseBreakBox`).checked),
                            // targetTargetBuffEnabled: (document.getElementById(`${skill}EditTargetTargetBuffBox`).checked)
                        }
                    }

                    return skillOptions;
                }
            });

            resolve(result.value);
        });
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
                                <p style="color: var(--font-color)" data-t>${i18next.t("Add any other non item bonus stats")}</p>

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


                                <p style="color: var(--font-color)" data-t>${i18next.t("Final stat multipliers (e.g. Lethe artifact)")}</p>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Final Attack")}</div>
                                    <div class="blankFormSpace"></div>
                                    <span class="valuePadding input-holder-percent">
                                        <input type="number" class="bonusStatInputPercent" max="100" accuracy="1" min="0" id="editHeroFinalAtkMultiplier" value="${hero.finalAtkMultiplier || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Final Defense")}</div>
                                    <div class="blankFormSpace"></div>
                                    <span class="valuePadding input-holder-percent">
                                        <input type="number" class="bonusStatInputPercent" max="100" accuracy="1" min="0" id="editHeroFinalDefMultiplier" value="${hero.finalDefMultiplier || ""}">
                                    </span>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" data-t>${i18next.t("Final Health")}</div>
                                    <div class="blankFormSpace"></div>
                                    <span class="valuePadding input-holder-percent">
                                        <input type="number" class="bonusStatInputPercent" max="100" accuracy="1" min="0" id="editHeroFinalHpMultiplier" value="${hero.finalHpMultiplier || ""}">
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

                        finalAtkMultiplier: parseFloat(document.getElementById('editHeroFinalAtkMultiplier').value),
                        finalDefMultiplier: parseFloat(document.getElementById('editHeroFinalDefMultiplier').value),
                        finalHpMultiplier: parseFloat(document.getElementById('editHeroFinalHpMultiplier').value),

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

    editFiltersDialog: async (hero, index) => {
        return new Promise(async (resolve, reject) => {
            const result = await Swal.fire({
                title: '',
                width: 1100,
                html: `
                    <div class="editGearForm">
                        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                        <div class="editFiltersDialog">
                            <div id="options-panel" class="constraints-panel-col-small">
                              <div class="panelLabel">
                                <div class="panelLabelText" id="optionsLabel" data-t>${i18next.t("Options")}</div>
                              </div>
                              <div>
                                <input type="checkbox" id="inputPredictReforges${index}" class="optimizer-checkbox" checked>
                                <label for="inputPredictReforges${index}" data-t>${i18next.t("Use reforged stats")}</label>
                              </div>

                              <div>
                                <input type="checkbox" id="inputOrderedHeroPriority${index}" class="optimizer-checkbox">
                                <label for="inputOrderedHeroPriority${index}" data-t>${i18next.t("Use hero priority")}</label>
                              </div>

                              <div>
                                <input type="checkbox" id="inputSubstatMods${index}" class="optimizer-checkbox">
                                <label for="inputSubstatMods${index}" data-t>${i18next.t("Use substat mods")}</label>
                              </div>

                              <div style="display:none">
                                <input type="checkbox" id="inputOnlyMaxedGear${index}" class="optimizer-checkbox">
                                <label for="inputOnlyMaxedGear${index}" data-t>${i18next.t("Only maxed gear")}</label>
                              </div>

                              <div>
                                <input type="checkbox" id="inputAllowLockedItems${index}" class="optimizer-checkbox">
                                <label for="inputAllowLockedItems${index}" data-t>${i18next.t("Locked items")}</label>
                              </div>

                              <div>
                                <input type="checkbox" id="inputAllowEquippedItems${index}" class="optimizer-checkbox">
                                <label for="inputAllowEquippedItems${index}" data-t>${i18next.t("Equipped items")}</label>
                              </div>

                              <div>
                                <input type="checkbox" id="inputKeepCurrentItems${index}" class="optimizer-checkbox">
                                <label for="inputKeepCurrentItems${index}" data-t>${i18next.t("Keep current")}</label>
                              </div>
                              <div class="horizontalSpace"></div>

                              <select id="optionsEnhanceLimit${index}" class="optionsExcludeGearFrom">
                                <option value="0" data-t>${i18next.t("+0 and higher")}</option>
                                <option value="3" data-t>${i18next.t("+3 and higher")}</option>
                                <option value="6" data-t>${i18next.t("+6 and higher")}</option>
                                <option value="9" data-t>${i18next.t("+9 and higher")}</option>
                                <option value="12" data-t>${i18next.t("+12 and higher")}</option>
                                <option value="15" data-t>${i18next.t("+15 only")}</option>
                              </select><br>
                              <div class="horizontalSpace" ></div>

                              <select multiple="multiple" id="optionsExcludeGearFrom${index}" class="optionsExcludeGearFrom">
                              </select><br>
                            </div>


                            <div class="vertical"></div>

                            <div id="placeholder-panel" class="constraints-panel-col-small">
                              <div class="panelLabel">
                                <div class="panelLabelText" id="statsLabel${index}" data-t>${i18next.t("Stat filters")}</div>
                              </div>
                              <input type="number" id="inputMinAtkLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Atk")}</div>
                              <input type="number" id="inputMaxAtkLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinDefLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Def")}</div>
                              <input type="number" id="inputMaxDefLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinHpLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Hp")}</div>
                              <input type="number" id="inputMaxHpLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinSpdLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Spd")}</div>
                              <input type="number" id="inputMaxSpdLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinCrLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("CRate")}</div>
                              <input type="number" id="inputMaxCrLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinCdLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("CDmg")}</div>
                              <input type="number" id="inputMaxCdLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinEffLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Eff")}</div>
                              <input type="number" id="inputMaxEffLimit${index}" class="optimizer-number-input stat-number-input"><br>

                              <input type="number" id="inputMinResLimit${index}" class="optimizer-number-input stat-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Res")}</div>
                              <input type="number" id="inputMaxResLimit${index}" class="optimizer-number-input stat-number-input"><br>
                            </div>

                            <div id="placeholder-panel" class="constraints-panel-col-small">
                              <div class="panelLabel">
                                <div class="panelLabelText" id="ratingsLabel${index}" data-t>${i18next.t("Rating filters")}</div>
                              </div>
                              <input type="number" id="inputMinCpLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Cp")}</div>
                              <input type="number" id="inputMaxCpLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinHppsLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("HpS")}</div>
                              <input type="number" id="inputMaxHppsLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinEhpLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Ehp")}</div>
                              <input type="number" id="inputMaxEhpLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinEhppsLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("EhpS")}</div>
                              <input type="number" id="inputMaxEhppsLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinDmgLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Dmg")}</div>
                              <input type="number" id="inputMaxDmgLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinDmgpsLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("DmgS")}</div>
                              <input type="number" id="inputMaxDmgpsLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinMcdmgLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Mcd")}</div>
                              <input type="number" id="inputMaxMcdmgLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinMcdmgpsLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("McdS")}</div>
                              <input type="number" id="inputMaxMcdmgpsLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinDmgHLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("DmgH")}</div>
                              <input type="number" id="inputMaxDmgHLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinDmgDLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("DmgD")}</div>
                              <input type="number" id="inputMaxDmgDLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinScoreLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("GS")}</div>
                              <input type="number" id="inputMaxScoreLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinBSLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("BS")}</div>
                              <input type="number" id="inputMaxBSLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinPriorityLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Prio")}</div>
                              <input type="number" id="inputMaxPriorityLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinUpgradesLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Upg")}</div>
                              <input type="number" id="inputMaxUpgradesLimit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinConversionsLimit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("Conv")}</div>
                              <input type="number" id="inputMaxConversionsLimit${index}" class="optimizer-number-input rating-number-input"><br>


                              <input type="number" id="inputMinS1Limit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("S1")}</div>
                              <input type="number" id="inputMaxS1Limit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinS2Limit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("S2")}</div>
                              <input type="number" id="inputMaxS2Limit${index}" class="optimizer-number-input rating-number-input"><br>

                              <input type="number" id="inputMinS3Limit${index}" class="optimizer-number-input rating-number-input">
                              <div class="inputStatLabel" data-t>${i18next.t("S3")}</div>
                              <input type="number" id="inputMaxS3Limit${index}" class="optimizer-number-input rating-number-input"><br>

                            </div>

                            <div class="vertical"></div>

                            <div id="stat-priority-panel" class="constraints-panel-col">

                              <div class="panelLabel">
                                <div class="panelLabelText" id="substatPriorityLabel${index}" data-t>${i18next.t("Substat priority")}</div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Atk")}</div>
                                <input class="sliderInput" id="atkSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="atkSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Def")}</div>
                                <input class="sliderInput" id="defSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="defSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Hp")}</div>
                                <input class="sliderInput" id="hpSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="hpSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Spd")}</div>
                                <input class="sliderInput" id="spdSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="spdSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Cr")}</div>
                                <input class="sliderInput" id="crSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="crSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Cd")}</div>
                                <input class="sliderInput" id="cdSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="cdSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Eff")}</div>
                                <input class="sliderInput" id="effSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="effSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>


                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Res")}</div>
                                <input class="sliderInput" id="resSlider${index}Input" type="number" value="0" readonly>
                                <div class="sliderContainer"><input class="slider" id="resSlider${index}" type="range" min="-1" max="3" value="0" step="1"></div>
                              </div>

                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>
                              <div class="horizontalSpace" ></div>

                              <div class="sliderRow">
                                <div class="sliderLabel" data-t>${i18next.t("Top %")}</div>
                                <input class="sliderInput" id="filterSlider${index}Input" type="number" value="100" readonly>
                                <div class="sliderContainer"><input class="slider" id="filterSlider${index}" type="range" min="10" max="100" value="100" step="1"></div><!--
                                <div class="sliderContainer"><input class="slider" id="filterSlider${index}" type="range" min="0" max="100" value="100" step="5"></div> -->
                              </div>
                            </div>
                            <div class="vertical"></div>

                            <div id="constraints-focus-panel" class="constraints-panel-col">
                              <div class="panelLabel">
                                <div class="panelLabelText" id="accessorySetsLabel" data-t>${i18next.t("Accessory main stats")}</div>
                              </div>
                              <select multiple="multiple" id="inputNecklaceStat${index}" class="inputGearFilterSelect">
                                <option value="CriticalHitChancePercent" data-t>${i18next.t("Crit Chance")}</option>
                                <option value="CriticalHitDamagePercent" data-t>${i18next.t("Crit Damage")}</option>
                                <option value="AttackPercent" data-t>${i18next.t("Attack %")}</option>
                                <option value="Attack" data-t>${i18next.t("Attack")}</option>
                                <option value="HealthPercent" data-t>${i18next.t("Health %")}</option>
                                <option value="Health" data-t>${i18next.t("Health")}</option>
                                <option value="DefensePercent" data-t>${i18next.t("Defense %")}</option>
                                <option value="Defense" data-t>${i18next.t("Defense")}</option>
                              </select><br>

                              <select multiple="multiple" id="inputRingStat${index}" class="inputGearFilterSelect">
                                <option value="EffectivenessPercent" data-t>${i18next.t("Effectiveness")}</option>
                                <option value="EffectResistancePercent" data-t>${i18next.t("Effect Resistance")}</option>
                                <option value="AttackPercent" data-t>${i18next.t("Attack %")}</option>
                                <option value="Attack" data-t>${i18next.t("Attack")}</option>
                                <option value="HealthPercent" data-t>${i18next.t("Health %")}</option>
                                <option value="Health" data-t>${i18next.t("Health")}</option>
                                <option value="DefensePercent" data-t>${i18next.t("Defense %")}</option>
                                <option value="Defense" data-t>${i18next.t("Defense")}</option>
                              </select><br>

                              <select multiple="multiple" id="inputBootsStat${index}" class="inputGearFilterSelect">
                                <option value="Speed" data-t>${i18next.t("Speed")}</option>
                                <option value="AttackPercent" data-t>${i18next.t("Attack %")}</option>
                                <option value="Attack" data-t>${i18next.t("Attack")}</option>
                                <option value="HealthPercent" data-t>${i18next.t("Health %")}</option>
                                <option value="Health" data-t>${i18next.t("Health")}</option>
                                <option value="DefensePercent" data-t>${i18next.t("Defense %")}</option>
                                <option value="Defense" data-t>${i18next.t("Defense")}</option>
                              </select><br>

                              <div class="panelLabel">
                                <div class="panelLabelText" data-t>${i18next.t("Sets")}</div>
                              </div>
                              <select multiple="multiple" id="inputSet1${index}" class="inputSetFilterSelect">
                                <!-- <option value="None" data-t>None</option> -->
                                <optgroup label="4 Piece" data-t>
                                  <option value="Attack" data-t>${i18next.t("Attack")}</option>
                                  <option value="Counter" data-t>${i18next.t("Counter")}</option>
                                  <option value="Destruction" data-t>${i18next.t("Destruction")}</option>
                                  <option value="Injury" data-t>${i18next.t("Injury")}</option>
                                  <option value="Lifesteal" data-t>${i18next.t("Lifesteal")}</option>
                                  <option value="Protection" data-t>${i18next.t("Protection")}</option>
                                  <option value="Rage" data-t>${i18next.t("Rage")}</option>
                                  <option value="Revenge" data-t>${i18next.t("Revenge")}</option>
                                  <option value="Speed" data-t>${i18next.t("Speed")}</option>
                                </optgroup>
                                <optgroup label="2 Piece" data-t>
                                  <option value="Critical" data-t>${i18next.t("Critical")}</option>
                                  <option value="Defense" data-t>${i18next.t("Defense")}</option>
                                  <option value="Health" data-t>${i18next.t("Health")}</option>
                                  <option value="Hit" data-t>${i18next.t("Hit")}</option>
                                  <option value="Immunity" data-t>${i18next.t("Immunity")}</option>
                                  <option value="Penetration" data-t>${i18next.t("Penetration")}</option>
                                  <option value="Resist" data-t>${i18next.t("Resist")}</option>
                                  <option value="Torrent" data-t>${i18next.t("Torrent")}</option>
                                  <option value="Unity" data-t>${i18next.t("Unity")}</option>
                                </optgroup>
                              </select><br>

                              <select multiple="multiple" id="inputSet2${index}" class="inputSetFilterSelect">
                                <!-- <option value="None" data-t>None</option> -->
                                <optgroup label="2 Piece" data-t>
                                  <option value="Critical" data-t>${i18next.t("Critical")}</option>
                                  <option value="Defense" data-t>${i18next.t("Defense")}</option>
                                  <option value="Health" data-t>${i18next.t("Health")}</option>
                                  <option value="Hit" data-t>${i18next.t("Hit")}</option>
                                  <option value="Immunity" data-t>${i18next.t("Immunity")}</option>
                                  <option value="Penetration" data-t>${i18next.t("Penetration")}</option>
                                  <option value="Resist" data-t>${i18next.t("Resist")}</option>
                                  <option value="Torrent" data-t>${i18next.t("Torrent")}</option>
                                  <option value="Unity" data-t>${i18next.t("Unity")}</option>
                                </optgroup>
                              </select><br>

                              <select multiple="multiple" id="inputSet3${index}" class="inputSetFilterSelect">
                                <!-- <option value="None" data-t>None</option> -->
                                <optgroup label="2 Piece" data-t>
                                  <option value="Critical" data-t>${i18next.t("Critical")}</option>
                                  <option value="Defense" data-t>${i18next.t("Defense")}</option>
                                  <option value="Health" data-t>${i18next.t("Health")}</option>
                                  <option value="Hit" data-t>${i18next.t("Hit")}</option>
                                  <option value="Immunity" data-t>${i18next.t("Immunity")}</option>
                                  <option value="Penetration" data-t>${i18next.t("Penetration")}</option>
                                  <option value="Resist" data-t>${i18next.t("Resist")}</option>
                                  <option value="Torrent" data-t>${i18next.t("Torrent")}</option>
                                  <option value="Unity" data-t>${i18next.t("Unity")}</option>
                                </optgroup>
                              </select>

                              <div class="panelLabel">
                                <div class="panelLabelText" data-t>${i18next.t("Exclude")}</div>
                              </div>
                              <select multiple="multiple" id="inputExcludeSet${index}" class="inputSetFilterSelect">
                                <!-- <option value="None" data-t>None</option> -->
                                <optgroup label="4 Piece" data-t>
                                  <option value="Attack" data-t>${i18next.t("Attack")}</option>
                                  <option value="Counter" data-t>${i18next.t("Counter")}</option>
                                  <option value="Destruction" data-t>${i18next.t("Destruction")}</option>
                                  <option value="Injury" data-t>${i18next.t("Injury")}</option>
                                  <option value="Lifesteal" data-t>${i18next.t("Lifesteal")}</option>
                                  <option value="Protection" data-t>${i18next.t("Protection")}</option>
                                  <option value="Rage" data-t>${i18next.t("Rage")}</option>
                                  <option value="Revenge" data-t>${i18next.t("Revenge")}</option>
                                  <option value="Speed" data-t>${i18next.t("Speed")}</option>
                                </optgroup>
                                <optgroup label="2 Piece" data-t>
                                  <option value="Critical" data-t>${i18next.t("Critical")}</option>
                                  <option value="Defense" data-t>${i18next.t("Defense")}</option>
                                  <option value="Health" data-t>${i18next.t("Health")}</option>
                                  <option value="Hit" data-t>${i18next.t("Hit")}</option>
                                  <option value="Immunity" data-t>${i18next.t("Immunity")}</option>
                                  <option value="Penetration" data-t>${i18next.t("Penetration")}</option>
                                  <option value="Resist" data-t>${i18next.t("Resist")}</option>
                                  <option value="Torrent" data-t>${i18next.t("Torrent")}</option>
                                  <option value="Unity" data-t>${i18next.t("Unity")}</option>
                                </optgroup>
                              </select><br>
                            </div>
                        </div>
                    </div>
                `,
                didOpen: async () => {
                    OptimizerTab.buildSlider('#atkSlider' + index);
                    OptimizerTab.buildSlider('#hpSlider' + index);
                    OptimizerTab.buildSlider('#defSlider' + index);
                    OptimizerTab.buildSlider('#spdSlider' + index);
                    OptimizerTab.buildSlider('#crSlider' + index);
                    OptimizerTab.buildSlider('#cdSlider' + index);
                    OptimizerTab.buildSlider('#effSlider' + index);
                    OptimizerTab.buildSlider('#resSlider' + index);
                    OptimizerTab.buildTopSlider('#filterSlider' + index);

                    const assetsBySet = Assets.getAssetsBySet();

                    const groupSelectMultipleSelectOptions = {
                        maxHeight: 600,
                        showClear: true,
                        // hideOptgroupCheckboxes: true,
                        minimumCountSelected: 99,
                        displayTitle: true,
                        displayValues: true,
                        selectAll: false,
                        textTemplate: function (el) {
                            const assetKey = el[0].value + "Set";

                            if (Object.keys(assetsBySet).includes(assetKey)) {
                                const asset = assetsBySet[assetKey];
                                return `<div class="selectorSetContainer"><img class="selectorSetImage" src="${asset}"></img><div class="selectorSetText">${el.html()}</div></div>`
                            }

                            return el.html()
                        },
                        styler: function (row) {
                            return '';
                        }
                    };
                    const excludeEquippedSelectOptions = {
                        maxHeight: 450,
                        showClear: true,
                        hideOptgroupCheckboxes: true,
                        minimumCountSelected: 99,
                        displayTitle: true,
                        selectAll: false,
                        filter: true,
                    };
                    const selectAllMultipleSelectOptions = {
                        maxHeight: 450,
                        showClear: true,
                        hideOptgroupCheckboxes: true,
                        minimumCountSelected: 99,
                        displayTitle: true,
                        selectAll: true
                    };
                    const enhanceOptions = {
                        maxHeight: 500,
                        showClear: false,
                        minimumCountSelected: 99,
                        displayTitle: true,
                        selectAll: false,
                    };

                    $('#inputSet1' + index).multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("4 or 2 piece sets")}));
                    $('#inputSet2' + index).multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("2 piece sets")}));
                    $('#inputSet3' + index).multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("2 piece sets")}));
                    $('#inputNecklaceStat' + index).multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder: i18next.t("Necklace")},{formatSelectAll () {return i18next.t('[Select all]')}}));
                    $('#inputRingStat' + index).multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder: i18next.t("Ring")},{formatSelectAll () {return i18next.t('[Select all]')}}));
                    $('#inputBootsStat' + index).multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder: i18next.t("Boots")},{formatSelectAll () {return i18next.t('[Select all]')}}));
                    $('#inputExcludeSet' + index).multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("Exclude sets")}));

                    const getAllHeroesResponse = await Api.getAllHeroes();
                    const optimizerAllowGearFromSelector = document.getElementById('optionsExcludeGearFrom' + index)
                    const optimizerEnhanceLimit = document.getElementById('optionsEnhanceLimit' + index)
                    const heroes = getAllHeroesResponse.heroes;
                    Utils.sortByAttribute(heroes, "name");
                    console.log("getAllHeroesResponse", getAllHeroesResponse)
                    for (var optionHero of heroes) {
                        const option2 = document.createElement('option');
                        option2.innerHTML = i18next.t(optionHero.name);
                        option2.label = optionHero.name;
                        option2.value = optionHero.id;

                        optimizerAllowGearFromSelector.add(option2);
                    }
                    $('#optionsExcludeGearFrom' + index).multipleSelect(Object.assign({}, excludeEquippedSelectOptions, {placeholder: i18next.t("Exclude equipped"), selectAll: true},{formatSelectAll () {return i18next.t('[Select all]')}}));

                    Selectors.refreshAllowGearFrom(index);
                    $('#optionsExcludeGearFrom' + index).change(() => {
                        const selects = $('#optionsExcludeGearFrom' + index).multipleSelect('getSelects');
                        $('#optionsExcludeGearFrom').multipleSelect('setSelects', selects)
                        $('#optionsExcludeGearFrom').multipleSelect('refresh')
                        Settings.saveSettings();
                    })

                    $('#optionsEnhanceLimit' + index).change(() => {
                        const selects = $('#optionsEnhanceLimit' + index).multipleSelect('getSelects');
                        $('#optionsEnhanceLimit').multipleSelect('setSelects', selects)
                        $('#optionsEnhanceLimit').multipleSelect('refresh')
                        Settings.saveSettings();
                    })

                    $('#optionsEnhanceLimit' + index).multipleSelect(Object.assign({}, enhanceOptions, {placeholder: i18next.t("Minimum enhance"), selectAll: false}));
                    const selects = $('#optionsEnhanceLimit').multipleSelect('getSelects');
                    console.warn("index", index, $('#optionsEnhanceLimit' + index))
                    $('#optionsEnhanceLimit' + index).multipleSelect('setSelects', selects)
                    $('#optionsEnhanceLimit' + index).multipleSelect('refresh')

                    OptimizerTab.loadPreviousHeroFilters({hero: hero}, index, false, 'multiOptimizer');
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("Save"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const params = await OptimizerTab.getOptimizationRequestParams(true, index);
                    return params;
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
                                    <div class="editGearStatLabel" id="limitRollsLabel" data-t>${i18next.t("Limit Rolls")}</div>
                                    <select id="limitRolls" class="editGearStatSelect">
                                        <option value=1 ${hero.limitRolls == 1 ? "selected" : ""}>1</option>
                                        <option value=2 ${(hero.limitRolls == 2 || !hero.limitRolls) ? "selected" : ""}>2</option>
                                        <option value=3 ${hero.limitRolls == 3 ? "selected" : ""}>3</option>
                                        <option value=4 ${hero.limitRolls == 4 ? "selected" : ""}>4</option>
                                        <option value=5 ${hero.limitRolls == 5 ? "selected" : ""}>5</option>
                                        <option value=6 ${hero.limitRolls == 6 ? "selected" : ""}>6</option>
                                    </select>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" id="modGradeLabel"  data-t>${i18next.t("Mod Grade")}</div>
                                    <select id="modGrade" class="editGearStatSelect">
                                        <option value="lesser" ${hero.modGrade == "lesser" ? "selected" : ""}>${i18next.t("Lesser")}</option>
                                        <option value="greater" ${(hero.modGrade == "greater" || !hero.modGrade) ? "selected" : ""}>${i18next.t("Greater")}</option>
                                    </select>
                                </div>

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" id="rollQualityLabel"  data-t>${i18next.t("Roll Quality")}</div>
                                    <select id="rollQuality" class="editGearStatSelect">
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

                                <div class="editGearFormRow">
                                    <div class="editGearStatLabel" id="keepStatsLabel" data-t>${i18next.t("Wanted Stats")}</div>
                                    <select id="keepStatOptions" class="editGearStatSelect">
                                        <option value="neverReplace" ${(hero.keepStatOptions == "noReplace" || !hero.keepStatOptions) ? "selected" : ""}>${i18next.t("Never replace wanted stats")}</option>
                                        <option value="replace" ${hero.keepStatOptions == "replace" ? "selected" : ""}>${i18next.t("Allow replacing wanted with wanted")}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="editGearFormVertical"></div>

                            <div class="editGearFormHalf">
                                <div>
                                    <p style="color: var(--font-color)" data-t>${i18next.t("Substat selections")}</p>
                                </div>

                                <div class="groupContainer editGearFormHalf">
                                    <div class="groupColumn">
                                        <div id="keepGroup" class="dragOrderList">
                                            <div class="draggableColumnLabel" style="color: var(--font-color)" id="keepColumnLabel" data-t>${i18next.t("Wanted substats")}</div>
                                            <div id="keepContainer" class="draggableMovableContainer">
                                                ${generateStatList(hero, "keep")}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="groupColumn">
                                        <div id="ignoreGroup" class="dragOrderList">
                                            <div class="draggableColumnLabel" style="color: var(--font-color)" id="ignoreColumnLabel" data-t>${i18next.t("Don't change")}</div>
                                            <div id="ignoreContainer" class="draggableMovableContainer">
                                                ${generateStatList(hero, "ignore")}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="groupColumn">
                                        <div id="modifyGroup" class="dragOrderList">
                                            <div class="draggableColumnLabel" style="color: var(--font-color)" id="discardColumnLabel" data-t>${i18next.t("Unwanted substats")}</div>
                                            <div id="modifyContainer" class="draggableMovableContainer">
                                                ${generateStatList(hero, "discard")}
                                            </div>
                                        </div>
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

                    global.keepGroup = Sortable.create(document.getElementById('keepContainer'), {
                        group: "nested",
                        filter: ".draggableColumnLabel",
                        animation: 100,
                        fallbackOnBody: true,
                    });
                    global.ignoreGroup = Sortable.create(document.getElementById('ignoreContainer'), {
                        group: "nested",
                        filter: ".draggableColumnLabel",
                        animation: 100,
                        fallbackOnBody: true,
                    });
                    global.modifyGroup = Sortable.create(document.getElementById('modifyContainer'), {
                        group: "nested",
                        filter: ".draggableColumnLabel",
                        animation: 100,
                        fallbackOnBody: true,
                    });

                    tippy('#limitRollsLabel', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose the maximum number of rolls to replace. For example, limit rolls = 1 would only replace base stats that didn't get enhanced. It is generally not a good idea to replace more than 2 rolls, and the higher this number is, the more permutations will be generated.")+'</p>'
                    })
                    tippy('#limitRolls', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose the maximum number of rolls to replace. For example, limit rolls = 1 would only replace base stats that didn't get enhanced. It is generally not a good idea to replace more than 2 rolls, and the higher this number is, the more permutations will be generated.")+'</p>'
                    })

                    tippy('#modGradeLabel', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose whether to use Greater or Lesser gem stats.")+'</p>'
                    })
                    tippy('#modGrade', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose whether to use Greater or Lesser gem stats.")+'</p>'
                    })

                    tippy('#rollQualityLabel', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose the modified substat's roll value, from min roll to max roll. The actual value ingame will be random. Values will be rounded to the nearest whole number.")+'</p>'
                    })
                    tippy('#rollQuality', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose the modified substat's roll value, from min roll to max roll. The actual value ingame will be random. Values will be rounded to the nearest whole number.")+'</p>'
                    })

                    tippy('#keepStatsLabel', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose whether wanted stats should be allowed to be replaced with wanted stats when optimizing. For example, when allowed, a min speed roll could be replaced by a max speed roll. When not allowed, the speed will be left unmodified.")+'</p>'
                    })
                    tippy('#keepStatOptions', {
                        placement: 'top',
                        content: '<p>'+i18next.t("Choose whether wanted stats should be allowed to be replaced with wanted stats when optimizing. For example, when allowed, a min speed roll could be replaced by a max speed roll. When not allowed, the speed will be left unmodified.")+'</p>'
                    })

                    tippy('#keepGroup', {
                        placement: 'top',
                        delay: [500, null],
                        content: '<p>'+i18next.t("Choose the substats that you want to modify for. Substats in the unwanted column will be replaced by substats in wanted column.")+'</p>'
                    })

                    tippy('#ignoreGroup', {
                        placement: 'top',
                        delay: [500, null],
                        content: '<p>'+i18next.t("Choose the substats to not modify. Substats in this column will not get replaced, and will also not be selected for.")+'</p>'
                    })

                    tippy('#modifyGroup', {
                        placement: 'top',
                        delay: [500, null],
                        content: '<p>'+i18next.t("Choose the substats that you want to discard when modifying. Substats in the unwanted column will be replaced by substats in wanted column.")+'</p>'
                    })
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const editedHero = {
                        discardStats: modifyGroup.toArray().filter(x => stats.includes(x)),
                        ignoreStats: ignoreGroup.toArray().filter(x => stats.includes(x)),
                        keepStats: keepGroup.toArray().filter(x => stats.includes(x)),

                        modGrade: document.getElementById('modGrade').value,
                        keepStatOptions: document.getElementById('keepStatOptions').value,
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

    editRankDialog: async (startRank) => {
        return new Promise(async (resolve, reject) => {
            const { value: formValues } = await Swal.fire({
                title: '',
                html: `
                    <div class="editGearForm">
                        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@4.0.1/minimal/minimal.min.css" rel="stylesheet">

                        <p style="color: var(--font-color)">${i18next.t("Rank #")}</p>
                        <input type="number" class="bonusStatInput" id="editRank" value="${""}" autofocus="autofocus" onfocus="this.select()" style="width:100px !important">
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: i18next.t("OK"),
                cancelButtonText: i18next.t("Cancel"),
                preConfirm: async () => {
                    const rankInfo = {
                        rank: document.getElementById('editRank').value,
                    }

                    resolve(rankInfo);
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
                width: 550,
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

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Disable mods")}</div>
                            <input type="checkbox" id="editGearDisableMods" ${item.disableMods ? "checked" : ""}>
                        </div>

                        </br>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Main Stat")}</div>
                            <select id="editGearMainStatType" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.main)}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearMainStatValue" value="${item.main.value}">
                            <img class="editGearCycle" src=${Assets.getCycle()}></img>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 1")}</div>
                            <select id="editGearStat1Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[0])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat1Value" value="${item.substats[0] ? item.substats[0].value : ""}">
                            <input type="checkbox" class="subModCheckbox" id="subMod1" ${item.substats[0]?.modified ? "checked" : ""}>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 2")}</div>
                            <select id="editGearStat2Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[1])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat2Value" value="${item.substats[1] ? item.substats[1].value : ""}">
                            <input type="checkbox" class="subModCheckbox" id="subMod2" ${item.substats[1]?.modified ? "checked" : ""}>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 3")}</div>
                            <select id="editGearStat3Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[2])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat3Value" value="${item.substats[2] ? item.substats[2].value : ""}">
                            <input type="checkbox" class="subModCheckbox" id="subMod3" ${item.substats[2]?.modified ? "checked" : ""}>
                        </div>

                        <div class="editGearFormRow">
                            <div class="editGearStatLabel" data-t>${i18next.t("Substat 4")}</div>
                            <select id="editGearStat4Type" class="editGearStatSelect">
                                ${getStatOptionsHtml(item.substats[3])}
                            </select>
                            <input type="number" class="editGearStatNumber" id="editGearStat4Value" value="${item.substats[3] ? item.substats[3].value : ""}">
                            <input type="checkbox" class="subModCheckbox" id="subMod4" ${item.substats[3]?.modified ? "checked" : ""}>
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

                    const checkboxes = ["#subMod1", "#subMod2", "#subMod3", "#subMod4"]

                    for (var checkbox of checkboxes) {
                        $(checkbox).change(function() {
                            for (var toUncheck of checkboxes) {
                                console.log(this);
                                if (!toUncheck.includes(this.id)) {
                                    $(toUncheck).prop('checked', false);
                                }
                            }
                        });
                    }
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
                        name: item.name,
                        enhance: parseInt(document.getElementById('editGearEnhance').value) || 0,
                        level: parseInt(document.getElementById('editGearLevel').value) || 0,
                        locked: document.getElementById('editGearLocked').checked,
                        disableMods: document.getElementById('editGearDisableMods').checked,
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

                    if (subStatType1 !="None") substats.push({type: subStatType1, value: parseInt(document.getElementById('editGearStat1Value').value || 0), modified: $('#subMod1').prop('checked')})
                    if (subStatType2 !="None") substats.push({type: subStatType2, value: parseInt(document.getElementById('editGearStat2Value').value || 0), modified: $('#subMod2').prop('checked')})
                    if (subStatType3 !="None") substats.push({type: subStatType3, value: parseInt(document.getElementById('editGearStat3Value').value || 0), modified: $('#subMod3').prop('checked')})
                    if (subStatType4 !="None") substats.push({type: subStatType4, value: parseInt(document.getElementById('editGearStat4Value').value || 0), modified: $('#subMod4').prop('checked')})

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

function safeGetSkill(hero, prefix) {
    if (!hero.skillOptions) {
        return {};
    }

    if (!hero.skillOptions[prefix]) {
        return {};
    }
    return hero.skillOptions[prefix];
}

function generateSkillOptionsHtml(prefix, hero, heroData) {
    var skillTypes = !heroData.skills ? [] : heroData.skills[prefix]
    var skillTypesHtml = ""
    for (var skillType of skillTypes.options) {
        var note = skillType.note ? " (" + skillType.note + ")" : "";
        skillTypesHtml += `<option value='${skillType.name}' ${safeGetSkill(hero, prefix).skillEffect == skillType.name ? "selected" : ""}>${skillType.name + note}</option>\n`
    }
    const html =
`
<div class="editGearFormRow">
        <div class="editGearFormRow">
            <div class="editSkillLabel" id="skillNumberLabel"  data-t>${i18next.t("Select Skill Effect")}</div>
            <select id="${prefix}SkillEffect" class="editSkillSelect skillTypeSelect">
                ${skillTypesHtml}
            </select>
        </div>
</div>
`
    return html
}

function generateSkillOptionsHtmlOLDWITHDAMAGECALC(prefix, hero, heroData) {
    var skillTypes = !heroData.skills ? [] : heroData.skills[prefix] 
    var skillTypesHtml = ""
    for (var skillType of skillTypes.options) {
        console.warn("---")
        console.warn(hero)
        console.warn(safeGetSkill(hero, prefix))
        console.warn(safeGetSkill(hero, prefix).skillEffect)
        skillTypesHtml += `<option value='${skillType.name}' ${safeGetSkill(hero, prefix).skillEffect == skillType.name ? "selected" : ""}>${skillType.name}</option>\n`
    }
    const html =
`
<div class="editGearFormRow">
    <div class="editGearFormHalf">
        <div class="editGearFormRow">
            <div class="editSkillLabel" id="skillNumberLabel"  data-t>${i18next.t("Select Skill Effect")}</div>
            <select id="${prefix}SkillEffect" class="editSkillSelect skillTypeSelect">
                ${skillTypesHtml}
            </select>
        </div>
    </div>

    <div class="editGearFormVerticalShort"></div>


    <div class="editGearFormHalf">
        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Apply options to all skills")}</div>
            <input type="checkbox" id="${prefix}EditApplyToAllSkillsBox" ${safeGetSkill(hero, prefix).applyToAllSkills ? "checked" : ""}>
        </div>
    </div>
</div>

<div class="horizontalLineWithMoreSpace"></div>

<div class="editGearFormRow">
    <div class="editGearFormHalf">

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Attack % Imprint")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditAttackPercentImprint" value="${safeGetSkill(hero, prefix).attackImprintPercent ? hero.skillOptions[prefix].attackImprintPercent : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Attack % Increase")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditAttackPercentIncrease" value="${safeGetSkill(hero, prefix).attackIncreasePercent ? hero.skillOptions[prefix].attackIncreasePercent : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Damage Increase")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditDamageIncrease" value="${safeGetSkill(hero, prefix).damageIncreasePercent ? hero.skillOptions[prefix].damageIncreasePercent : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Elemental Advantage")}</div>
            <input type="checkbox" id="${prefix}EditElementalAdvantageBox" ${safeGetSkill(hero, prefix).elementalAdvantageEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Decreased Attack")}</div>
            <input type="checkbox" id="${prefix}EditDecreasedAttackBox" ${safeGetSkill(hero, prefix).decreasedAttackBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Attack Buff")}</div>
            <input type="checkbox" id="${prefix}EditAttackBuffBox" ${safeGetSkill(hero, prefix).attackBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Greater Attack Buff")}</div>
            <input type="checkbox" id="${prefix}EditGreaterAttackBuffBox" ${safeGetSkill(hero, prefix).greaterAttackBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Crit Damage Buff")}</div>
            <input type="checkbox" id="${prefix}EditCritDamageBuffBox" ${safeGetSkill(hero, prefix).critDamageBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Vigor")}</div>
            <input type="checkbox" id="${prefix}EditVigorAttackBuffBox" ${safeGetSkill(hero, prefix).vigorAttackBuffEnabled ? "checked" : ""}>
        </div>
    </div>

    <div class="editGearFormVerticalMed"></div>

    <div class="editGearFormHalf">
        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Target Defense")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditTargetDefense" value="${safeGetSkill(hero, prefix).targetDefense ? hero.skillOptions[prefix].targetDefense : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Defense Increase")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditTargetDefenseIncrease" value="${safeGetSkill(hero, prefix).targetDefenseIncreasePercent ? hero.skillOptions[prefix].targetDefenseIncreasePercent : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Damage Reduction")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditTargetDamageReduction" value="${safeGetSkill(hero, prefix).targetDamageReductionPercent ? hero.skillOptions[prefix].targetDamageReductionPercent : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Damage Transfer")}</div>
            <span class="valuePadding input-holder">
                <input type="number" class="bonusStatInput" max="100" accuracy="1" min="0" id="${prefix}EditTargetDamageTransfer" value="${safeGetSkill(hero, prefix).targetDamageTransferPercent ? hero.skillOptions[prefix].targetDamageTransferPercent : 0}">
            </span>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Defense Buff")}</div>
            <input type="checkbox" id="${prefix}EditTargetDefenseBuffBox" ${safeGetSkill(hero, prefix).targetDefenseBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Vigor")}</div>
            <input type="checkbox" id="${prefix}EditTargetVigorBuffBox" ${safeGetSkill(hero, prefix).targetVigorDefenseBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Defense Break")}</div>
            <input type="checkbox" id="${prefix}EditTargetDefenseBreakBox" ${safeGetSkill(hero, prefix).targetDefenseBreakBuffEnabled ? "checked" : ""}>
        </div>

        <div class="editGearFormRow">
            <div class="editSkillLabel" data-t>${i18next.t("Target")}</div>
            <input type="checkbox" id="${prefix}EditTargetTargetBuffBox" ${safeGetSkill(hero, prefix).targetTargetBuffEnabled ? "checked" : ""}>
        </div>
    </div>
</div>
`
    return html
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
    var html = `<option value=6>${i18next.t("6 stars max awaken")}</option>
                <option value=5 ${hero.stars == 5 ? "selected" : ""}>${i18next.t("5 stars max awaken")}</option>`;

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
<option value="ProtectionSet" ${set == "ProtectionSet" ? "selected" : ""}>${i18next.t("Protection")}</option>
<option value="TorrentSet" ${set == "TorrentSet" ? "selected" : ""}>${i18next.t("Torrent")}</option>

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
    var keepStats = hero.keepStats || [];
    var discardStats = hero.discardStats || [];
    keepStats = keepStats.filter(x => !!x && x != 'undefined');
    discardStats = discardStats.filter(x => !!x && x != 'undefined');
    var list;

    if (state == "keep") {
        list = keepStats
    } else if (state == "discard") {
        list = discardStats
    } else {


        const ignoreList = stats.filter(x => !keepStats.includes(x) && !discardStats.includes(x))
        list = ignoreList;
    }

    var result = "";
    for (var i = 0; i < list.length; i++) {
        const stat = list[i];
        result += `<div class="list-group-item" data-id="${stat}">${i18next.t(optimizerStatToDisplayStat[stat])}</div>`
    }
    return result;
}

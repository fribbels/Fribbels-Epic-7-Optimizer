var echarts = require('echarts');

barsCharts = [undefined, undefined, undefined, undefined];
guageChart = undefined;
radarChart = undefined;

const maxes = {
    "Attack": 346 * 1.5,
    "AttackPercent": 56,
    "Defense": 264 * 1.5,
    "DefensePercent": 56,
    "Health": 1551 * 1.5,
    "HealthPercent": 56,
    "Speed": 28,
    "CriticalHitChancePercent": 36,
    "CriticalHitDamagePercent": 49,
    "EffectivenessPercent": 56,
    "EffectResistancePercent": 56,
}

const substatWeights = {
    "AttackPercent": 1,
    "DefensePercent": 1,
    "HealthPercent": 1,
    "EffectivenessPercent": 1,
    "EffectResistancePercent": 1,
    "Attack": (3.46 / 39),
    "Health": (3.09 / 174),
    "Defense": (4.99 / 31),
    "CriticalHitDamagePercent": (8/7),
    "CriticalHitChancePercent": (8/5),
    "Speed": (8/4),
}

const statToReadableText = {
    "Attack": "Attack",
    "AttackPercent": "Attack %",
    "Defense": "Defense",
    "DefensePercent": "Defense %",
    "Health": "Health",
    "HealthPercent": "Health %",
    "Speed": "Speed",
    "CriticalHitChancePercent": "Crit Chance",
    "CriticalHitDamagePercent": "Crit Dmg",
    "EffectivenessPercent": "Eff",
    "EffectResistancePercent": "Eff Res"
}

function calculateMaxPossibleScore(item) {
    var total = 0;

    for (substat of item.substats) {
        total += substat.reforgedMax * substatWeights[substat.type]
    }

    return total;
}

function calculateScoreTotals(item) {
    var totalMin = 0;
    var totalRolled = 0;
    var totalMissing = 0;

    for (substat of item.substats) {
        var stat = substat;

        var min = Math.floor(stat.reforgedMin);
        var rolled = (item.level == 85 ? stat.reforgedValue : stat.value) - Math.floor(stat.reforgedMin);
        var missing = Math.floor(stat.reforgedMax) - (item.level == 85 ? stat.reforgedValue : stat.value);

        totalMin += min * substatWeights[substat.type];
        totalRolled += rolled * substatWeights[substat.type];
        totalMissing += missing * substatWeights[substat.type];
    }

    return {
        totalMin: totalMin,
        totalRolled: totalRolled,
        totalMissing: totalMissing
    };
}

function setTheme() {
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['exports', 'echarts'], factory);
        } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
            // CommonJS
            factory(exports, require('echarts'));
        } else {
            // Browser globals
            factory({}, root.echarts);
        }
    }(this, function (exports, echarts) {
        var log = function (msg) {
            if (typeof console !== 'undefined') {
                console && console.error && console.error(msg);
            }
        };
        if (!echarts) {
            log('ECharts is not Loaded');
            return;
        }
        var contrastColor = '#eee';
        var axisCommon = function () {
            return {
                axisLine: {
                    lineStyle: {
                        color: contrastColor
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: contrastColor
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: contrastColor
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#aaa'
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: contrastColor
                    }
                }
            };
        };

        var colorPalette = ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'];
        var theme = {
            color: colorPalette,
            backgroundColor: '#00000000',
            // backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-color').replace(" ", ""),
            tooltip: {
                axisPointer: {
                    lineStyle: {
                        color: contrastColor
                    },
                    crossStyle: {
                        color: contrastColor
                    }
                }
            },
            legend: {
                textStyle: {
                    color: contrastColor
                }
            },
            textStyle: {
                color: contrastColor
            },
            title: {
                textStyle: {
                    color: contrastColor
                }
            },
            toolbox: {
                iconStyle: {
                    normal: {
                        borderColor: contrastColor
                    }
                }
            },
            dataZoom: {
                textStyle: {
                    color: contrastColor
                }
            },
            timeline: {
                lineStyle: {
                    color: contrastColor
                },
                itemStyle: {
                    normal: {
                        color: colorPalette[1]
                    }
                },
                label: {
                    normal: {
                        textStyle: {
                            color: contrastColor
                        }
                    }
                },
                controlStyle: {
                    normal: {
                        color: contrastColor,
                        borderColor: contrastColor
                    }
                }
            },
            timeAxis: axisCommon(),
            logAxis: axisCommon(),
            valueAxis: axisCommon(),
            categoryAxis: axisCommon(),

            line: {
                symbol: 'circle'
            },
            graph: {
                color: colorPalette
            },
            gauge: {
                title: {
                    textStyle: {
                        color: contrastColor
                    }
                }
            },
            candlestick: {
                itemStyle: {
                    normal: {
                        color: '#FD1050',
                        color0: '#0CF49B',
                        borderColor: '#FD1050',
                        borderColor0: '#0CF49B'
                    }
                }
            }
        };
        theme.categoryAxis.splitLine.show = false;
        echarts.registerTheme('dark', theme);
    }));
}

module.exports = {
    initialize: async () => {
        setTheme()
        function initializeBars() {
            barsIds = ['stat1bars', 'stat2bars', 'stat3bars', 'stat4bars']
            for (var i = 0; i < 4; i++) {
                var id = barsIds[i];
                console.log(id)
                var chartDom = document.getElementById(id);
                var barsChart = echarts.init(chartDom, DarkMode.isDark() ? 'dark' : undefined);
                barsCharts[i] = barsChart;
            }
        }

        var chartDom = document.getElementById('chart1');
        guageChart = echarts.init(chartDom, DarkMode.isDark() ? 'dark' : undefined);

        var radarChartDom = document.getElementById('chart2');
        radarChart = echarts.init(radarChartDom, DarkMode.isDark() ? 'dark' : undefined);

        initializeBars()
        // const getAllItemsResponse = await Api.getAllItems();
        // const items = getAllItemsResponse.items;
        // console.warn(items)
        // const item = items[900];

        // ItemAugmenter.augment([item])

        // document.getElementById('removeBuildSubmit').addEventListener("click", async () => {
        //     console.log("removeBuildSubmit");
        // });

        // // document.getElementById('tab2label').addEventListener("click", () => {
        // //     module.exports.redrawEnhanceGuide(item);
        // // });

        // module.exports.redrawEnhanceGuide(item);
    },

    // setItem: async (item) => {
    //     const html = HtmlGenerator.buildItemPanel(item, "enhanceTab", null, "Speed")
    //     document.getElementById("enhanceTabPreview").innerHTML = html;
    // },

    redrawEnhanceGuideFromRemoteId: async(itemId) => {
        Api.getItemById(itemId).then(x => {
            module.exports.redrawEnhanceGuide(x.item);
            $('#tab5').trigger('click');
        })
    },

    redrawEnhanceGuide: async (item) => {
        setTheme();
        Reforge.calculateMaxes(item);
        console.log("redraw", item);

        const baseStats = null;
        const html = HtmlGenerator.buildItemPanel(item, "enhanceTab", baseStats, true)
        document.getElementById("enhanceTabPreview").innerHTML = html;


        // Guage



        var maxScore = Math.floor(calculateMaxPossibleScore(item));
        var maxPerEnhance = [
            40,
            48,
            56,
            64,
            72,
            80
        ]
        var percent = Utils.round10ths(item.reforgedWss/maxScore*100)
        var option = {
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%'
            },
            series: [{
                name: 'Rating',
                type: 'gauge',
                startAngle: 225,
                radius: '90%',
                endAngle: -45,
                // max: 80,
                max: maxPerEnhance[Math.floor(item.enhance/3)],
                splitNumber: 8,
                detail: {
                    // formatter: '{value}',
                    formatter: '{value}' + ' / ' + maxScore + '\n ' + percent + '%',
                    fontSize: 18,
                    lineHeight: 20,
                    offsetCenter: [0, '15%'],
                    color: DarkMode.isDark() ? '#f0f0f0' : '#363636'
                },
                axisLabel: {
                    color: DarkMode.isDark() ? '#f0f0f0' : '#363636',
                    formatter: function (value) {
                        return Math.round(value);
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [40/80, '#FF6E76'],
                            [50/80, '#ffb340'],
                            [60/80, '#FDDD60'],
                            [70/80, '#7CFFB2'],
                            [1, '#58D9F9']
                        ]
                    }
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    color: DarkMode.isDark() ? '#f0f0f0' : '#363636'
                },
                data: [{
                    value: item.reforgedWss,
                    name: i18next.t('SCORE')
                }],
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '25%',
                    width: 20,
                    offsetCenter: [0, '-40%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                tooltip: {
                    trigger: false,
                    formatter: function (value) {
                        return "asdffsd" + value;
                    }
                }
            }]
        };

        guageChart.setOption(option);

        // Stats

        var text = "";
        var leftText = "";
        var rightText = "";

        // Speed
        // var speedStats = item.substats.filter(x => x.type == "Speed")
        // var roundedEnhance = Math.floor(item.enhance / 3) * 3;
        // var maxSpeed = 0;
        // if (speedStats.length > 0) {
        //     var speedStat = speedStats[0];
        //     var rolls = speedStat.rolls;
        //     var enhance = item.enhance;
        //     var rollsLeft = Math.ceil(15 - item.enhance)/3;

        //     var potentialRolls = Constants.speedByItemTypeAlreadyRolled[item.rank][roundedEnhance];

        //     var reforgedValue = item.level == 90 ? speedStat.value : speedStat.reforgedValue;

        //     console.warn(reforgedValue)
        //     console.warn(Constants.speedRollsToValue[potentialRolls + rolls] - Constants.speedRollsToValue[rolls])
        //     console.warn("------------------------")
        //     maxSpeed = reforgedValue + potentialRolls * 4 + (item.level == 85 ? Constants.speedRollsToValue[potentialRolls + rolls] - Constants.speedRollsToValue[rolls] : 0);
        // } else {
        //     var potentialRolls = Constants.speedByItemTypeNotYetRolled[item.rank][roundedEnhance];
        //     maxSpeed = potentialRolls * 4 + (item.level == 85 ? Constants.speedRollsToValue[potentialRolls] : 0);

        //     console.warn(potentialRolls)
        //     console.warn(Constants.speedRollsToValue[potentialRolls])
        //     console.warn("------------------------")
        // }

        // leftText += "Max speed: <br>";
        // rightText += maxSpeed + "<br>";


        // Score

        // var scores = calculateScoreTotals(item)

        // leftText += "Score: <br>";
        // rightText += item.reforgedWss + "<br>";

        // leftText += "Score: <br>";
        // rightText += maxScore + "<br>";

        // leftText += "Dps score: <br>";
        // rightText += item.dpsWss + "<br>";

        // leftText += "Support score: <br>";
        // rightText += item.supportWss + "<br>";

        // leftText += "Combat score: <br>";
        // rightText += item.combatWss + "<br>";

        //

        // $('#statsLeft').html(leftText)
        // $('#statsRight').html(rightText)

        // Radar

        var ratings = GearRating.rate(item);
        // var archetypes = GearRating.getArchetypes();
        ratings.forEach(x => x.max = 2)

        // console.error(ratings);
        var option;

        option = {
            // title: {
            //     text: 't'
            // },
            // legend: {
            //     data: ['x']
            // },
            radar: {
                // shape: 'circle',
                indicator: ratings
            },
            tooltip: {
                trigger: 'item'
            },
            series: [{
                name: 'Scores',
                type: 'radar',
                areaStyle: {},
                data: [
                    {
                        // value: [1, 2, 3, 4,5,6,7],
                        value: ratings.map(x => Utils.round100ths(x.score)),
                        name: i18next.t('Archetypes')
                    },
                ]
            }]
        };

        option && radarChart.setOption(option);

        // Bars

        function buildBars(id, showAxis, item, index) {
            var stat = item.substats[index]
            if (!stat)
                return;

            var option;

            // var min = Utils.round100ths(stat.reforgedMin / stat.reforgedMax);
            // var rolled = Utils.round100ths(((item.min == 85 ? stat.reforgedValue : stat.value) - stat.reforgedMin) / (stat.reforgedMax));
            // var missing = Utils.round100ths(1 - min - rolled);

            var min = Utils.round10ths(Math.floor(stat.reforgedMin));
            var rolled = Utils.round10ths((item.level == 85 ? stat.reforgedValue : stat.value) - Math.floor(stat.reforgedMin));
            var missing = Utils.round10ths(Math.floor(stat.reforgedMax) - (item.level == 85 ? stat.reforgedValue : stat.value));

            var barLabel = `    ${min + rolled} / ${min + rolled + missing}   (${Utils.round100ths(((min + rolled) / (min + rolled + missing)) * 100)} %)`;

            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // Use axis to trigger tooltip
                        type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                },
                xAxis: {
                    show: false,
                    minInterval: 10000,
                    type: 'value',
                    max: maxes[stat.type],
                    min: 0,
                    axisLabel: {
                      formatter: (x) => {return parseFloat(x)}
                    }
                },
                yAxis: {
                    type: 'category',
                    data: [i18next.t(statToReadableText[stat.type])]
                },
                series: [
                    {
                        type: 'bar',
                        stack: 'total',
                        name: i18next.t('Minimum possible stats'),
                        label: {
                            show: min < 1 ? false : true,
                            position: 'inside',
                            fontSize: 10,
                            overflow: 'truncate',

                        },
                        itemStyle: {
                            color: '#f2f2f2'
                        },
                        data: [
                            min
                        ]
                    },
                    {
                        type: 'bar',
                        stack: 'total',
                        name: i18next.t('Rolled stats'),
                        label: {
                            show: rolled < 1 ? false : true,
                            position: 'inside',
                            // position: stat.type == "Health" && rolled > 50 ? 'left' : 'inside',
                            fontSize: 10,
                            overflow: 'truncate',
                        },
                        itemStyle: {
                            color: '#8bde87'
                        },
                        data: [
                            rolled
                        ]
                    },
                    {
                        type: 'bar',
                        name: i18next.t('Missing potential stats'),
                        stack: 'total',
                        label: {
                            show: missing < 1 ? false : true,
                            position: 'inside',
                            // position: stat.type == "Health" && missing > 50 ? 'right' : 'inside',
                            fontSize: 10,
                            overflow: 'truncate',
                        },
                        itemStyle: {
                            color: '#f5bea9'
                        },
                        data: [
                            missing
                        ]
                    },
                    {
                        type: 'bar',
                        stack: 'total',
                        tooltip: {
                           show: false
                        },
                        label: {
                            show: true,
                            position: 'right',
                            // position: stat.type == "Health" && missing > 50 ? 'right' : 'inside',
                            fontSize: 10,
                            color: DarkMode.isDark() ? '#f0f0f0' : '#363636',
                            formatter: function x() {
                                return barLabel
                            }
                        },
                        itemStyle: {
                            color: '#f5bea9'
                        },
                        data: [
                            0
                        ]
                    },
                ]
            };

            option && barsCharts[index].setOption(option);
        }

        for (var x of barsCharts) {
            if (x) {
                x.clear()
            }
        }

        buildBars('stat1bars', false, item, 0)
        buildBars('stat2bars', false, item, 1)
        buildBars('stat3bars', false, item, 2)
        buildBars('stat4bars', true, item, 3)
    },
}
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const BTN_RESULT = document.querySelector('.btn'),
        DATE_TR_ONE = document.querySelector('.date-of-trans-one'),
        DATE_TR_TWO = document.querySelector('.date-of-trans-two'),
        DATE_TR_THREE = document.querySelector('.date-of-trans-one'),

        LOAD_FACTOR_IN_NORMAL_MODE = 0.7,              // коэфф.загрузки трансформатора в норм.режиме
        LOAD_FACTOR_AFTER_CRASH = 1.4;                   // коэфф.загрузки трансформатора в послеаварийном режиме
/////////////////////////////////////////////////////////////////////////
    const POWER_LOAD_ONE = {               // мощность нагрузки
        pn1: 0,
        qn1: 0,
        sn1: 0

    };
    const POWER_LOAD_TWO = {
        pn2: 0,
        qn2: 0,
        sn2: 0
    };

    const TRANSFORMER = {               // трансформатор
        nominalPower: 100,              // номинальна мощность трансформатора МВА
        limitTune: {
            level: 0,                   // +/- количество отпаек РПН
            percent: 0                // %
        },
        nominalVoltageHigh: 0,        // номинальное напряжение высокое кВ
        nominalVoltageLow: 0,          // номинальное напряжение низкое кВ
        resistanceR: 0,              // активное сопротивление Ом
        reactivityX: 0,              // реактивное сопротивление Ом
        chargingPower: 0,            // зарядная мощность Qx   Мвар
        reactiveIdlingLosses: null,     // реактивные потери холостого хода ΔQ_X кВар
        idlingLosses: null,             // потери холостого хода ΔP_X кВт
        shortCircuitLosses: null,       // потери короткого замыкания ΔP_K кВт
        shortCircuitVoltage: null,      // напряжение короткого замыкания Uк (%)
        noLoadCurrent: null             // ток холостого хода I_X (%)

    };

    const LINE_ONE = {              //  ЛЭП 1
        length: 0,
        mark: null,
        resistivity: null,              //сопротивление            r0        Ом/км
        reactivity: null,                //сопротивление            x0        Ом/км
        conductivity: null,             //проводимость             b0        См/км
        fullResistivityR: null,          //сопротивление           R         Ом
        fullResistivityX: null,          //сопротивление           X         Ом
        fullConductivityB: null,         //проводимость            B*10^-6   Cм
        chargingPowerQ: null             //зарядная мощность ЛЭП   Qc        МВар

    };

    const LINE_TWO = {              //  ЛЭП 2
        length: 0,
        mark: null,
        resistivity: null,              //сопротивление            r0        Ом/км
        reactiveResistivity: null,      //сопротивление            x0        Ом/км
        conductivity: null,             //проводимость             b0        См/км
        fullResistivityR: null,          //сопротивление           R         Ом
        fullResistivityX: null,          //сопротивление           X         Ом
        fullConductivityB: null,         //проводимость            B*10^-6   Cм
        chargingPowerQ: null            //зарядная мощность ЛЭП   Qc        МВар

    };

    const LINE_THREE = {            //  ЛЭП 3
        length: 0,
        mark: null,
        resistivity: null,              //сопротивление            r0        Ом/км
        reactiveResistivity: null,      //сопротивление            x0        Ом/км
        conductivity: null,             //проводимость             b0        См/км
        fullResistivityR: null,          //сопротивление           R         Ом
        fullResistivityX: null,          //сопротивление           X         Ом
        fullConductivityB: null,         //проводимость            B*10^-6   Cм
        chargingPowerQ: null            //зарядная мощность ЛЭП   Qc        МВар

    };
    //  Выбор количества трансформаторов
    //let quantityTransformerOne = Number(document.querySelector('.quantity-transformer-one').textContent);
    //let quantityTransformerTwo = Number(document.querySelector('.quantity-transformer-two').textContent);
    let quantityTransformerOne = 2,
        quantityTransformerTwo = 2;

    BTN_RESULT.addEventListener('click', async () => {
        let pn1 = document.querySelectorAll('.pn1'),
            pn2 = document.querySelectorAll('.pn2'),
            qn1 = document.querySelectorAll('.qn1'),
            qn2 = document.querySelectorAll('.qn2'),
            powerFactor = document.querySelectorAll('.power-factor'),         // коэффицент мощности  cos φ
            sn1 = document.querySelectorAll('.sn1'),
            sn2 = document.querySelectorAll('.sn2'),
            str1 = document.querySelector('.str-one'),
            str2 = document.querySelector('.str-two'),
            str1nominal = document.querySelectorAll('.str-one-nominal'),
            str2nominal = document.querySelectorAll('.str-two-nominal'),
            checkInNormalModeOne = document.querySelector('.check-in-normal-mode-one'),
            checkInNormalModeTwo = document.querySelector('.check-in-normal-mode-two'),
            checkInAfterCrashOne = document.querySelector('.check-in-after-crash-mode-one'),
            checkInAfterCrashTwo = document.querySelector('.check-in-after-crash-mode-two'),
            lineVoltage = Number.parseFloat(document.querySelector('.input-voltage-line').value);
        POWER_LOAD_ONE.pn1 = Number.parseFloat(document.querySelector('.input-pn1').value),
            POWER_LOAD_TWO.pn2 = Number.parseFloat(document.querySelector('.input-pn2').value),
            LINE_ONE.length = Number.parseFloat(document.querySelector('.input-length-one').value),
            LINE_TWO.length = Number.parseFloat(document.querySelector('.input-length-two').value),
            LINE_THREE.length = Number.parseFloat(document.querySelector('.input-length-three').value);
        const POWER_FACTOR = Number.parseFloat(document.querySelector('.input-power-factor').value);

        //Заполняем формулы
        pn1.forEach((elem) => {
            elem.textContent = POWER_LOAD_ONE.pn1;
        });
        POWER_LOAD_ONE.pn1 = Number.parseFloat(pn1[0].textContent);

        pn2.forEach((elem) => {
            elem.textContent = POWER_LOAD_TWO.pn2;
        });
        POWER_LOAD_TWO.pn2 = Number.parseFloat(pn2[0].textContent);

        powerFactor.forEach((elem) => {
            elem.textContent = String(POWER_FACTOR);
        });

        //расчитываем Sн1 и Qн1
        sn1.forEach((elem) => {
            elem.textContent = (POWER_LOAD_ONE.pn1 / POWER_FACTOR).toFixed(2);
        });
        POWER_LOAD_ONE.sn1 = Number.parseFloat(sn1[0].textContent);

        qn1.forEach((elem) => {
            elem.textContent = Math.sqrt(Math.pow(POWER_LOAD_ONE.sn1, 2) - Math.pow(POWER_LOAD_ONE.pn1, 2)).toFixed(2);
        });
        POWER_LOAD_ONE.qn1 = Number.parseFloat(qn1[0].textContent);


        //расчитываем Sн2 и Qн2
        sn2.forEach((elem) => {
            elem.textContent = (POWER_LOAD_TWO.pn2 / POWER_FACTOR).toFixed(2);
        });
        POWER_LOAD_TWO.sn2 = Number.parseFloat(sn2[0].textContent);

        qn2.forEach((elem) => {
            elem.textContent = Math.sqrt(Math.pow(POWER_LOAD_TWO.sn2, 2) - Math.pow(POWER_LOAD_TWO.pn2, 2)).toFixed(2);
        });
        POWER_LOAD_TWO.qn2 = Number.parseFloat(qn2[0].textContent);

        // Предварительный расчет трансформаторов
        str1.textContent = String((POWER_LOAD_ONE.pn1 / (quantityTransformerOne * POWER_FACTOR * LOAD_FACTOR_IN_NORMAL_MODE)).toFixed(2));
        str2.textContent = String((POWER_LOAD_TWO.pn2 / (quantityTransformerTwo * POWER_FACTOR * LOAD_FACTOR_IN_NORMAL_MODE)).toFixed(2));



        // Заполнение таблицы трансформаторов
        let url = './transformers.json';
        let response = await fetch(url);
        let arrTransformerOne = [];
        let arrTransformerTwo = [];
        if (response.ok) {
            let data = await response.json();

            data.transformer.forEach(item => {
                if (item.power >= Number(str1.textContent) && lineVoltage === item.voltage) {
                    arrTransformerOne.push(item);
                }
            });
            data.transformer.forEach(item => {
                if (item.power >= Number(str2.textContent) && lineVoltage === item.voltage) {
                    arrTransformerTwo.push(item);
                }
            });

        } else {
            alert("Ошибка HTTP: " + response.status);
        }
        ;


        let tableTransformer = (arr, date) => {
            const {
                type,
                power,
                nominalVoltageHigh,
                nominalVoltageLow,
                idlingLosses,
                shortCircuitLosses,
                shortCircuitVoltage,
                noLoadCurrent,
                chargingPower,
                resistanceR,
                reactivityX
            } = arr[0];
            date.innerHTML = `
             <tr>
                <td>${type}</td>
                <td>${power}</td>
                <td>${nominalVoltageHigh}</td>
                <td>${nominalVoltageLow}</td>
                <td>${idlingLosses}</td>
                <td>${shortCircuitLosses}</td>
                <td>${shortCircuitVoltage}</td>
                <td>${noLoadCurrent}</td>
                <td>${chargingPower}</td>
                <td>${resistanceR}</td>
                <td>${reactivityX}</td>
            </tr>`;
        };

        tableTransformer(arrTransformerOne, DATE_TR_ONE);
        tableTransformer(arrTransformerTwo, DATE_TR_TWO);
        const TRANSFORMER_ONE = arrTransformerOne[0],
            TRANSFORMER_TWO = arrTransformerTwo[0]
        console.log(TRANSFORMER_ONE);
        console.log(TRANSFORMER_TWO);

// Проверка трансформатора на первой подстанции в нормальном режиме
        str1nominal.forEach(elem => {
            elem.textContent = TRANSFORMER_ONE.power;
        });
        checkInNormalModeOne.textContent = String((POWER_LOAD_ONE.pn1 / (quantityTransformerOne * POWER_FACTOR * TRANSFORMER_ONE.power)).toFixed(2));





        // Проверка трансформатора на первой подстанции в послеаварийном режиме
        checkInAfterCrashOne.textContent = String((POWER_LOAD_ONE.pn1 / ((quantityTransformerOne - 1) * POWER_FACTOR * TRANSFORMER_ONE.power)).toFixed(2));


        // Проверка трансформатора на второй подстанции в нормальном режиме
        str2nominal.forEach(elem => {
            elem.textContent = TRANSFORMER_TWO.power;
        });
        checkInNormalModeTwo.textContent = String((POWER_LOAD_TWO.pn2 / (quantityTransformerTwo * POWER_FACTOR * TRANSFORMER_TWO.power)).toFixed(2));

        // Проверка трансформатора на второй подстанции в послеаварийном режиме
        checkInAfterCrashTwo.textContent = String((POWER_LOAD_TWO.pn2 / ((quantityTransformerTwo - 1) * POWER_FACTOR * TRANSFORMER_TWO.power)).toFixed(2));


        //Подсветка результата
        const lightingNormalMode = (elem, out) => {
            if(elem < 0.56 && elem > 0.75) {
                out.style.color = "red";
            }else {
                out.style.color = "#0d5400";
            }
        }
        const lightingAfterCrashMode = (elem, out) => {
            if(elem  > 1.45) {
                out.style.color = "red";
            }else {
                out.style.color = "#0d5400";
            }
        }
        lightingNormalMode(Number(checkInNormalModeOne.textContent), checkInNormalModeOne);
        lightingNormalMode(Number(checkInNormalModeTwo.textContent), checkInNormalModeTwo);
        lightingAfterCrashMode(Number(checkInAfterCrashOne.textContent), checkInAfterCrashOne);
        lightingAfterCrashMode(Number(checkInAfterCrashTwo.textContent), checkInAfterCrashTwo);

        // console.log(arrTransformerOne[0]);
        // const {
        //     typeTwo,
        //     powerTwo,
        //     nominalVoltageHighTwo,
        //     nominalVoltageLowTwo,
        //     idlingLossesTwo,
        //     shortCircuitLossesTwo,
        //     shortCircuitVoltageTwo,
        //     noLoadCurrentTwo,
        //     chargingPowerTwo,
        //     resistanceRTwo,
        //     reactivityXTwo
        // } = arrTransformerTwo[0];
        // console.log(arrTransformerTwo[0]);
        // console.log(DATE_TR_TWO);
        //
        // DATE_TR_TWO.innerHTML = `
        //      <tr>
        //         <td>${typeTwo}</td>
        //         <td>${powerTwo}</td>
        //         <td>${nominalVoltageHighTwo}</td>
        //         <td>${nominalVoltageLowTwo}</td>
        //         <td>${idlingLossesTwo}</td>
        //         <td>${shortCircuitLossesTwo}</td>
        //         <td>${shortCircuitVoltageTwo}</td>
        //         <td>${noLoadCurrentTwo}</td>
        //         <td>${chargingPowerTwo}</td>
        //         <td>${resistanceRTwo}</td>
        //         <td>${reactivityXTwo}</td>
        //     </tr>`;

        // Определение Pmax
        let powerMax;

        if (POWER_LOAD_ONE.pn1 > POWER_LOAD_TWO.pn2) {
            powerMax = POWER_LOAD_ONE.pn1;
        } else {
            powerMax = POWER_LOAD_TWO.pn2;
        }
        // определение Sтр


        // console.log(powerMax);
        // console.log(quantityTransformer);
        // console.log(inputPowerFactor);
        // console.log(loadFactor);
        // console.log(powerTransEstimated);
        // console.log(powerLoadOne.pn1);
        // console.log(powerLoadTwo.pn2);
        // console.log(powerLoadOne.qn1);
        // console.log(powerLoadTwo.qn2);
        // console.log(lineOne.length);
        // console.log(lineTwo.length);
        // console.log(lineThree.length);
        // console.log(lineVoltage);
        // console.log(inputPowerFactor);
    });
});


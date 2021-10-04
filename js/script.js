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
        nominalPower: 0,              // номинальна мощность трансформатора МВА
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
            inputLineVoltage = Number.parseFloat(document.querySelector('.input-voltage-line').value);
            POWER_LOAD_ONE.pn1 = Number.parseFloat(document.querySelector('.input-pn1').value),
            POWER_LOAD_TWO.pn2 = Number.parseFloat(document.querySelector('.input-pn2').value),
            LINE_ONE.length = Number.parseFloat(document.querySelector('.input-length-one').value),
            LINE_TWO.length = Number.parseFloat(document.querySelector('.input-length-two').value),
            LINE_THREE.length = Number.parseFloat(document.querySelector('.input-length-three').value);
        const POWER_FACTOR = Number.parseFloat(document.querySelector('.input-power-factor').value);

        //Определение класса напряжения
        let arrayVoltage = [35, 110, 150, 220, 330, 500, 750];
        let voltageClass = arrayVoltage.sort( (a, b) => Math.abs(inputLineVoltage - a) - Math.abs(inputLineVoltage - b) )[0];


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

        const prelimCalcOfTrans = () => {
            // Предварительный расчет трансформаторов
            str1.textContent = String((POWER_LOAD_ONE.pn1 / (quantityTransformerOne * POWER_FACTOR * LOAD_FACTOR_IN_NORMAL_MODE)).toFixed(2));
            str2.textContent = String((POWER_LOAD_TWO.pn2 / (quantityTransformerTwo * POWER_FACTOR * LOAD_FACTOR_IN_NORMAL_MODE)).toFixed(2));

        };
        prelimCalcOfTrans();


        // Обработка json и заполнение таблицы трансформаторов
        let url = './transformers.json';
        let response = await fetch(url);
        let arrTransformerOne = [];
        let arrTransformerTwo = [];
        if (response.ok) {
            let data = await response.json();

            data.transformer.forEach(item => {
                if (item.power >= Number(str1.textContent) && voltageClass === item.voltage) {
                    arrTransformerOne.push(item);
                }
            });
            data.transformer.forEach(item => {
                if (item.power >= Number(str2.textContent) && voltageClass === item.voltage) {
                    arrTransformerTwo.push(item);
                }
            });

        } else {
            alert("Ошибка HTTP: " + response.status);
        };

        let fillingInTheTable = (arrTransformer, dateTransformer) => {
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
            } = arrTransformer[0];
            dateTransformer.innerHTML = `
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

        fillingInTheTable(arrTransformerOne, DATE_TR_ONE);
        fillingInTheTable(arrTransformerTwo, DATE_TR_TWO);
        const TRANSFORMER_ONE = arrTransformerOne[0],
            TRANSFORMER_TWO = arrTransformerTwo[0]
        console.log(TRANSFORMER_ONE);
        console.log(TRANSFORMER_TWO);


        //Подсветка результата
        let check = true;
        const lightingMode = (elem, out, max, min) => {
            if( elem > max || elem < min) {
                out.style.color = "#ff0000";
                check = false;
            }else {
                out.style.color = "#0d5400";
            };
        };

        // Проверка трансформатора на первой подстанции в нормальном режиме
        const CHECK_TRANSFORMER_ONE_IN_NORMAL_MODE = () => {
            str1nominal.forEach(elem => {
                elem.textContent = TRANSFORMER_ONE.power;
            });
            checkInNormalModeOne.textContent = String((POWER_LOAD_ONE.pn1 / (quantityTransformerOne * POWER_FACTOR * TRANSFORMER_ONE.power)).toFixed(2));
            lightingMode(Number(checkInNormalModeOne.textContent), checkInNormalModeOne, 0.75, 0.56);

            if (check === false) {
                quantityTransformerOne++;
                prelimCalcOfTrans();
                fillingInTheTable(arrTransformerOne, DATE_TR_ONE);
                fillingInTheTable(arrTransformerTwo, DATE_TR_TWO);
                CHECK_TRANSFORMER_ONE_IN_NORMAL_MODE();
            }
        }
        CHECK_TRANSFORMER_ONE_IN_NORMAL_MODE();



        // Проверка трансформатора на первой подстанции в послеаварийном режиме

        checkInAfterCrashOne.textContent = String((POWER_LOAD_ONE.pn1 / ((quantityTransformerOne - 1) * POWER_FACTOR * TRANSFORMER_ONE.power)).toFixed(2));
        lightingMode(Number(checkInAfterCrashOne.textContent), checkInAfterCrashOne, 1.45);

        // Проверка трансформатора на второй подстанции в нормальном режиме
        const CHECK_TRANSFORMER_TWO_IN_NORMAL_MODE = () => {
            str2nominal.forEach(elem => {
                elem.textContent = TRANSFORMER_TWO.power;
            });
            checkInNormalModeTwo.textContent = String((POWER_LOAD_TWO.pn2 / (quantityTransformerTwo * POWER_FACTOR * TRANSFORMER_TWO.power)).toFixed(2));
            lightingMode(Number(checkInNormalModeTwo.textContent), checkInNormalModeTwo, 0.75, 0.56);

            if (check === false) {
                quantityTransformerOne++;
                prelimCalcOfTrans();
                fillingInTheTable(arrTransformerOne, DATE_TR_ONE);
                fillingInTheTable(arrTransformerTwo, DATE_TR_TWO);
                CHECK_TRANSFORMER_TWO_IN_NORMAL_MODE();
            }
        }
        CHECK_TRANSFORMER_TWO_IN_NORMAL_MODE();


        // Проверка трансформатора на второй подстанции в послеаварийном режиме
        checkInAfterCrashTwo.textContent = String((POWER_LOAD_TWO.pn2 / ((quantityTransformerTwo - 1) * POWER_FACTOR * TRANSFORMER_TWO.power)).toFixed(2));
        lightingMode(Number(checkInAfterCrashTwo.textContent), checkInAfterCrashTwo, 1.45);


    });
});


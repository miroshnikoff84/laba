document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const btnResult = document.querySelector('.btn');
    const output = document.querySelector('.date-of-transformer');


    const loadFactor = 0.7,              // коэфф.загрузки трансформатора в норм.режиме
        loadFactorAfterCrash = 1.4;    // коэфф.загрузки трансформатора в послеаварийном режиме
/////////////////////////////////////////////////////////////////////////
    const powerLoadOne = {               // мощность нагрузки
        pn1: 0,
        qn1: 0,
        sn1: 0

    };
    const powerLoadTwo = {
        pn2: 0,
        qn2: 0,
        sn2: 0
    };

    const transformer = {               // трансформатор
        nominalPower: 10,              // номинальна мощность трансформатора МВА
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
    console.log(transformer.nominalPower);

    const lineOne = {              //  ЛЭП 1
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

    const lineTwo = {              //  ЛЭП 2
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

    const lineThree = {            //  ЛЭП 3
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

    btnResult.addEventListener('click', async () => {
        let pn1 = document.querySelectorAll('.pn1'),
            pn2 = document.querySelectorAll('.pn2'),
            qn1 = document.querySelectorAll('.qn1'),
            qn2 = document.querySelectorAll('.qn2'),
            powerFactor = document.querySelectorAll('.powerFactor'),         // коэффицент мощности  cos φ
            sn1 = document.querySelectorAll('.sn1'),
            sn2 = document.querySelectorAll('.sn2');
        powerLoadOne.pn1 = Number.parseInt(document.querySelector('.input-pn1').value);
        powerLoadTwo.pn2 = Number.parseInt(document.querySelector('.input-pn2').value);
        lineOne.length = Number.parseInt(document.querySelector('.input-length-one').value);
        lineTwo.length = Number.parseInt(document.querySelector('.input-length-two').value);
        lineThree.length = Number.parseInt(document.querySelector('.input-length-three').value);
        let lineVoltage = Number.parseInt(document.querySelector('.input-voltage-line').value);
        let inputPowerFactor = Number.parseFloat(document.querySelector('.input-power-factor').value);

        //Заполняем формулы
        pn1.forEach((elem) => {
            elem.textContent = powerLoadOne.pn1;
        });
        powerLoadOne.pn1 = Number.parseFloat(pn1[0].textContent);

        pn2.forEach((elem) => {
            elem.textContent = powerLoadTwo.pn2;
        });
        powerLoadTwo.pn2 = Number.parseFloat(pn2[0].textContent);

        powerFactor.forEach((elem) => {
            elem.textContent = inputPowerFactor;
        });

        //расчитываем Sн1 и Qн1
        sn1.forEach((elem) => {
            elem.textContent = (powerLoadOne.pn1 / inputPowerFactor).toFixed(2);
        });
        powerLoadOne.sn1 = Number.parseFloat(sn1[0].textContent);

        qn1.forEach((elem) => {
            elem.textContent = Math.sqrt(Math.pow(powerLoadOne.sn1, 2) - Math.pow(powerLoadOne.pn1, 2)).toFixed(2);
        });
        powerLoadOne.qn1 = Number.parseFloat(qn1[0].textContent);


        //расчитываем Sн2 и Qн2
        sn2.forEach((elem) => {
            elem.textContent = (powerLoadTwo.pn2 / inputPowerFactor).toFixed(2);
        });
        powerLoadTwo.sn2 = Number.parseFloat(sn2[0].textContent);

        qn2.forEach((elem) => {
            elem.textContent = Math.sqrt(Math.pow(powerLoadTwo.sn2, 2) - Math.pow(powerLoadTwo.pn2, 2)).toFixed(2);
        });
        powerLoadTwo.qn2 = Number.parseFloat(qn2[0].textContent);

        let url = './transformers.json';
        let response = await fetch(url);

        if (response.ok) {
            let data = await response.json();

            data.transformer.forEach(item => {
                if (powerLoadOne.pn1 === item.power && lineVoltage === item.voltage) {
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
                    } = item;
                    output.innerHTML = `
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
                }
            })

        } else {
            alert("Ошибка HTTP: " + response.status);
        }
        ;

        // Определение Pmax
        let powerMax;

        if(powerLoadOne.pn1 > powerLoadTwo.pn2) {
            powerMax = powerLoadOne.pn1;
        }else {
            powerMax = powerLoadTwo.pn2;
        }
        // определение Sтр
        let quantityTransformer = 2;
        let powerTransEstimated = Number.parseInt(powerMax / (quantityTransformer * inputPowerFactor * loadFactor)); // Sтр = Smax/n*cosfi*b

        console.log(powerMax);
        console.log(quantityTransformer);
        console.log(inputPowerFactor);
        console.log(loadFactor);
        console.log(powerTransEstimated);
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
})
;


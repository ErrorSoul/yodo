var redLed = require("@amperka/led").connect(P2);
var greenLed = require("@amperka/led").connect(P5);
var buzzer = require("@amperka/buzzer").connect(P6);
var ir = require('@amperka/ir-receiver').connect(P7);
var servo = require("@amperka/servo").connect(P13);
var sonic = require("@amperka/ultrasonic")
    .connect({
        trigPin: P10,
        echoPin: P11
    });

var servoPosAngle = 0;

var brightness = 0.6;
var keyCodes = {
    378130479: 'POWER',
    378134559: 'MINUS',
    378132519: 'PLUS',
    378077439: 'RED',
    378126399: 'GREEN',
    378110079: 'BLUE',
    378114159: 'CROSS',
    378118239: 'SQUARE',
    378093759: 'TRIANGLE',
    378097839: 'TOP_LEFT',
    378101919: 'TOP',
    378099879: 'TOP_RIGHT',
    378081519: 'LEFT',
    378091719: 'PLAY',
    378116199: 'RIGHT',
    378083559: 'BOTTOM_LEFT',
    378124359: 'BOTTOM',
    378085599: 'BOTTOM_RIGHT',
    378089679: 'X',
    378122319: 'Y',
    378105999: 'Z'
};

var animation = require('@amperka/animation')
    .create({
        from: 0, // анимация от 30
        to: 90, // до 120
        duration: 1, // продолжительностью 4 секунды
        updateInterval: 1 // с обновлением каждые 20 мс
    }).queue({
        to: 0, // а сразу после этого от 120 до 90
        duration: 1 // продолжительностью 1 секунду
    }).queue({
        to: 90, // а сразу после этого от 120 до 90
        duration: 1 // продолжительностью 1 секунду
    });




const delay = function(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};


ir.on('receive', function(code, repeat) {
    if (!repeat) {
        //console.log('*******');
    }

    console.log('0x' + code.toString(16));
    console.log('norm   ', code);
    console.log('code   ', keyCodes[code]);
    console.log('Angle  ',     servoPosAngle);


    if (keyCodes[code] === 'PLUS') {
        if (servoPosAngle >= 180) {} else {
            servoPosAngle += 15;
            console.log(
        '<div style="font-size: 0.5em">',
        '<p> Кнопка нажата' + ' ' + keyCodes[code] + '</p>',
        '<p> Яркость' + ' ' + brightness + '</p>',
        '</div>'

    );
          servo.write(servoPosAngle);
        }
    } else if (keyCodes[code] === 'GREEN') {
        servoPosAngle = 0;
        redLed.brightness(brightness);
        greenLed.brightness(brightness);
        redLed.turnOff();
        greenLed.blink(0.8, 0.2);
        //servo.write(servoPosAngle);
    } else if (keyCodes[code] === 'RED') {
        servoPosAngle = 180;
        redLed.brightness(brightness);
        greenLed.brightness(brightness);
        greenLed.turnOff();
        redLed.blink(0.8, 0.2);
        //servo.write(servoPosAngle);
    } else if (keyCodes[code] === 'BLUE') {
        let x = brightness * 10;
        x += 1;
        brightness = (x % 10) / 10;
        console.log('brigt', brightness);
        redLed.brightness(brightness);
        greenLed.brightness(brightness);
    } else if (keyCodes[code] === 'MINUS') {
        if (servoPosAngle <= 0) {} else {
            servoPosAngle -= 15;
            servo.write(servoPosAngle);
        }
    } else if (keyCodes[code] === 'POWER' && !repeat) {
        buzzer.turnOff();
        redLed.turnOff();
        greenLed.turnOff();
    } else if (keyCodes[code] === 'TRIANGLE' && !repeat) {
        buzzer.beep(0.8);
    } else if (keyCodes[code] === 'SQUARE' && !repeat) {
        sonic.ping(function(err, value) {
            if (err) {
                buzzer.beep(0.5);
                redLed.blink(0.3, 0.3);
                setTimeout(() => {
                    redLed.turnOff();
                }, 3000);
                //console.log('An error occurred:', err);
            } else {
                buzzer.beep(0.5, 0.5);
                greenLed.blink(0.3, 0.3);
                setTimeout(() => {
                    buzzer.turnOff();
                    greenLed.turnOff();
                }, 3000);

                console.log('The distance is:', value, 'santimeters');
            }
        }, 'cm');
    }
    // console.log(
    //     '<div style="font-size: 0.5em">',
    //     '<p> Кнопка нажата' + ' ' + keyCodes[code] + '</p>',
    //     '<p> Яркость' + ' ' + brightness + '</p>',
    //     '</div>',
    //     12,
    //     '°C'
    // );
});


animation.on('update', function(val) {
    servo.write(val);
});
servo.write(0);

var marsohod = require('@amperka/robot-2wd')
    .connect();

var receiver = require('@amperka/ir-receiver')
    .connect(P2);

var led = require('@amperka/led')
    .connect(P1);
var ledg = require('@amperka/led')
    .connect(A0);
led.turnOff();
ledg.turnOff();

var ultrasonic = require('@amperka/ultrasonic').connect({
    trigPin: P12,
    echoPin: P13
});

var neck = require('@amperka/servo').connect(P8);


var SPEED = -0.48;
var LOW_SPEED = -0.37;
var BACKWARD = 0.6;
var ROTATE = 0.3;
// var SPEED = 0;
// var LOW_SPEED = 0;
// var BACKWARD = 0;
// var ROTATE = 0;
var DISTANCE_MIN = 10;
var DISTANCE_MAX = 24;

var servoPosAngle = 90;
var autoMode = false;
var intervalID = null;
var goState = false;
var backMode = false;

var lastDistance = 0;

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}


function lastDistanceAnalyze() {
    if (lastDistance > DISTANCE_MAX + 50) {
        console.log("MAXXXXXX DISTANOCE", lastDistance);

    } else if (lastDistance <= (DISTANCE_MIN + 5)) {
        console.log("MIN DISTANOCE", lastDistance);
        clearInterval(intervalID);
        intervalID = null;
        backMode = true;
        saveGoBack();
    }
}


function waitRollBack() {
    setTimeout(function() {
        sumoist.go({
            l: ROTATE,
            r: -ROTATE
        });
        intervalID = setInterval(detectBorder, 10);
    }, 500);
}

var goLeft = () => {
    marsohod.go({
        l: -1 * ROTATE,
        r: ROTATE
    });
    setTimeout(() => {
        marsohod.stop();
        goState = false;
    }, 600);
};

function saveGoBack() {
    marsohod.go({
        l: BACKWARD,
        r: BACKWARD
    });
    led.blink(1, 0.7);
    setTimeout(() => {
        marsohod.stop();
        goLeft();
        backMode = false;
        startPing();
        led.turnOff();
    }, 900);
}

var check = function(distance) {
    if (!intervalID) {
        marsohod.stop();
        goState = false;
        lastDistance = 0;
        return;
    }
    if (distance > DISTANCE_MAX) {
        led.turnOff();
        ledg.turnOff();
        lastDistance = distance;
        if (distance >= 27 && distance <= 45) {
            clearInterval(intervalID);
            intervalID = null;
            marsohod.stop();
            goState = false;
            marsohod.go({
                l: -1 * ROTATE,
                r: ROTATE
            });
            goState = true;
            console.log('ROTORORORO');
            led.turnOn();
            setTimeout(() => {
                marsohod.stop();
                goState = false;
                led.turnOff();
                startPing();

            }, 800);
        } else {
            console.log('i m going to object');
            console.log("distanse is ", distance, 'sm');
            marsohod.go({
                l: LOW_SPEED,
                r: LOW_SPEED
            });
            goState = true;
            setTimeout(() => {
                goState && marsohod.go({
                    l: SPEED,
                    r: SPEED
                });
            }, 100);
        }
    } else if (distance > DISTANCE_MIN) {
        led.turnOff();
        ledg.turnOff();
        lastDistance = distance;
        console.log('BACK i m going BACK');
        console.log("distanse is ", distance, 'sm');
        clearInterval(intervalID);
        intevalID = null;
        saveGoBack();
        goState = true;
    } else {
        led.blink(0.8, 0.8);
        ledg.blink(0.8, 0.8);
        lastDistance = distance;
        marsohod.stop();
        goState = false;
        clearInterval(intervalID);
        intevalID = null;
        saveGoBack();
        goState = true;
    }
};

var startPing = () => {
    intervalID = setInterval(function() {
        ultrasonic.ping(function(err, value) {
            if (!err) {
                console.log("CHECK PING ", value);
                check(value);
            } else if (err) {
                let sError = err.toString()
                console.log("ERRROR PINGGG");
                console.log("AFAF is ", err.message);
                console.log("ERROR is ", err);
                print("Eerr Message is ", sError);
                if (err.message == 'timeout') {
                    console.log(")))))error is ", sError);
                    lastDistanceAnalyze();
                }
            }
        }, 'cm');
    }, 170);
}

neck.write(servoPosAngle);

receiver.on('receive', function(code, repeat) {
    if (code === receiver.keys.TOP) {
        marsohod.go({
            l: SPEED,
            r: SPEED
        });
        goState = true;
    }
    if (code === receiver.keys.POWER) {
        marsohod.stop();
        goState = false;
    }

    if (code === receiver.keys.GREEN && !repeat) {
        if (!intervalID) {
            console.log('FFFFFFFFF');
            startPing();
        } else {

            clearTimeout(intervalID);
            intervalID = null;
            marsohod.stop();
            goState = false;
            console.log(')))))))))))))))))))))))))');
        }
    }

    if (code === receiver.keys.PLAY) {
        /*   ultrasonic.ping(function(error, value) {
           if (error) {
             console.log('error on ping', error);
         } else {
           console.log('value is ', value);
           (value > DISTANCE_MAX) ? led.turnOn() : null;
           setTimeout(() => {led.turnOff();}, 2000);
         }
         }, 'cm'); */
        marsohod.stop();
        goState = false;
    }
    if (code === receiver.keys.MINUS) {
        if (servoPosAngle <= 0) {} else {
            servoPosAngle -= 15;
        }
        neck.write(servoPosAngle);
    }
    if (code === receiver.keys.PLUS) {
        if (servoPosAngle >= 180) {} else {
            servoPosAngle += 15;
        }
        neck.write(servoPosAngle);
    }

    if (code === receiver.keys.RIGHT) {
        marsohod.go({
            l: -1 * ROTATE,
            r: ROTATE
        });
        setTimeout(() => {
            marsohod.stop();
            goState = false;
        }, 600);
    }
    if (code === receiver.keys.LEFT) {
        marsohod.go({
            l: ROTATE,
            r: -1 * ROTATE
        });
        setTimeout(() => {
            marsohod.stop();
            goState = false;
        }, 600);
    }
    if (code === receiver.keys.BOTTOM) {
        marsohod.go({
            l: SPEED * (-1),
            r: SPEED * (-1)
        });
        goState = true;
    }
    if (code) {
        console.log('code is', code);
    }
});

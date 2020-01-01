var led   = require("@amperka/led").connect(P1);
var ir    = require('@amperka/ir-receiver').connect(P7);
var servo = require("@amperka/servo").connect(P13);
var sonic = require("@amperka/ultrasonic")
  .connect({trigPin: P10, echoPin: P11});

var servoPosAngle = 0;
var keyCodes =
    {
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
      from: 0,             // анимация от 30
      to: 90,              // до 120
      duration: 1,          // продолжительностью 4 секунды
      updateInterval: 1  // с обновлением каждые 20 мс
    }).queue({
      to: 0,               // а сразу после этого от 120 до 90
      duration: 1           // продолжительностью 1 секунду
    }).queue({
      to: 90,               // а сразу после этого от 120 до 90
      duration: 1           // продолжительностью 1 секунду
    });




const delay = function(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};




ir.on('receive', function(code, repeat) {
    if (!repeat) {
        console.log('*******');
    }

    console.log('0x' + code.toString(16));
    console.log('norm   ', code);
  console.log('code   ', keyCodes[code]);
  console.log('Angle  ',     servoPosAngle);

  if (keyCodes[code] === 'PLUS') {
    if (servoPosAngle >= 180) {} else {
            servoPosAngle += 15;
            console.log('Update Angle  ',     servoPosAngle);
            servo.write(servoPosAngle);
        }
  } else if (keyCodes[code] === 'GREEN') {
        servoPosAngle = 0;
        servo.write(servoPosAngle);
    }

    else if (keyCodes[code] === 'RED') {
        servoPosAngle = 180;
        servo.write(servoPosAngle);
    }

  else if (keyCodes[code] === 'MINUS') {
        if (servoPosAngle <= 0) {} else {
            servoPosAngle -= 15;
            servo.write(servoPosAngle);
        }
    }
});

setInterval(function() {
    sonic.ping(function(err, value) {
        if (err) {
            console.log('An error occurred:', err);
        } else {
            console.log('The distance is:', value, 'sm');
        }
    }, 'cm');
}, 200);

animation.on('update', function(val) {
   servo.write(val);
});
servo.write(0);

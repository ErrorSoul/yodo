var servo = require("@amperka/servo").connect(P13);
var pot   = require("@amperka/pot").connect(A0);


setInterval(function() {
  let angle = 180 * pot.read();
	console.log("Angle is ", angle);
	servo.write(angle);
}, 20);

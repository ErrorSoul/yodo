var sonic = require("@amperka/ultrasonic")
  .connect({trigPin: P10, echoPin: P11});


setInterval(function() {
	sonic.ping(function(err, value) {
		if (err) {
			console.log('An error occurred:', err);
		} else {
			console.log('The distance is:', value, 'millimeters');
		}
	}, 'cm');
}, 200);

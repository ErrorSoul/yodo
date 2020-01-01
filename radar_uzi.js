var ultrasonic = require('@amperka/ultrasonic')
 .connect({trigPin: P10, echoPin: P11});
var servo = require('@amperka/servo')
 .connect(P13);
var canvas = {
 width: 800,
 height: 500,
 radius: 300,
 margin: 150
};
var sectors = {
 count: 18,
 current: 0,
 direction: 1
};

sectors.values = new Array(sectors.count);
function dumpSvg() {
 var svg = [];
 svg.push('<svg width="' + canvas.width + 'px' +
 '" height="' + canvas.height + 'px');
 svg.push('" xmlns="http://www.w3.org/2000/svg">');
 var cx = canvas.width / 2;
 var cy = canvas.height - canvas.margin;
 var astep = Math.PI / sectors.count;
 for (var i = 0; i < sectors.count; ++i) {
 var fill = 'black';
 var stroke = 'green';
 var r = sectors.values[i];
 if (!r || r > canvas.radius) {
 fill = 'none';
 stroke = 'white';
 r = canvas.radius;
 }
 if (i === sectors.current) {
 stroke = 'yellow';
 }
 var a1 = astep * i - Math.PI / 2;
 var a2 = a1 + astep;
var x1 = cx + r * Math.sin(a1);
 var y1 = cy - r * Math.cos(a1);
 var x2 = cx + r * Math.sin(a2);
 var y2 = cy - r * Math.cos(a2);
 x1 = x1.toFixed(0);
 y1 = y1.toFixed(0);
 x2 = x2.toFixed(0);
 y2 = y2.toFixed(0);
 svg.push('<path d="');
 svg.push('M' + cx + ' ' + cy + ' ');
 svg.push('L' + x1 + ' ' + y1 + ' ');
 svg.push('A' + r + ' ' + r + ' 0, 0, 1, ' +
 x2 + ' ' + y2 + ' ');
 svg.push('Z');
 svg.push('" stroke="' + stroke +
 '" fill="' + fill + '" />');
 }
 svg.push('</svg>');
 console.log(svg.join(''));
}
setInterval(function() {
 ultrasonic.ping(function(err, val) {
 sectors.values[sectors.current] = val;
 sectors.current += sectors.direction;
 if (sectors.current === sectors.count - 1 ||
 sectors.current === 0) {
 sectors.direction = -sectors.direction;
 }
 servo.write(sectors.current *
 (180 / sectors.count));
 dumpSvg();
 }, 'mm');
}, 300);
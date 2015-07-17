var parseString = require('xml2js').parseString;
var request = require('request');
var colors = require('colors');

// real time departure estimates northbound from powell st
exports = (function() {
  console.log(' ________________________________________'.grey)
  console.log('/___|___ NORTHBOUND FROM POWELL ST ___|___\\\n'.grey);
  var timeToStation = 3;
  var result = {};
  request('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=powl&' +
  'key=Q7V4-UL56-IUUQ-DT35&dir=n', function(error, response, body) {

    if (!error && response.statusCode === 200) {
      parseString(body, function (error, result) {
        var departures = [];
        var lines = result.root.station[0].etd;
        lines.forEach(function(line) {
          line.estimate.forEach(function(train) {
            if (train.minutes[0] !== 'Leaving') {
              departures.push(parseInt(train.minutes[0]));
            }
          });
        });
        departures.sort(function(a, b) {
          return a - b;
        });

        departures = departures.filter(function(item) {
          return item >= timeToStation;
        });

        var soon = departures.filter(function(item) {
          return item <= 15;
        });

        var hella = false;

        if (soon.length >= 3) {
          hella = true;
        }

        if (soon[0] <= 8) {
          result.main = 'FUCK! the next train leaves in ' + soon[0] + ' minutes!';
          // console.log(result.main);
          if (hella) {
            result.sub = "but your shit is fine because there's hella trains in this bitch.";
            // console.log(result.sub);
          }
        } else {
          result.main = 'fuck this noise! next train leaves in ' + departures[0] + ' minutes!';
          // console.log(result.main);
        }
        departures.forEach(function(departure) {
          var bar = ''
          for (var i = 0; i < departure; i++) {
            bar += '#';
          }
          if (departure <= 10) {
            console.log(bar.red + ' ' + departure.toString())
          } else {
            console.log(bar.grey + ' ' + departure.toString())
          }
          // console.log(departure + ' minutes'.grey);
        });
      });
    } else {
      // result.main = error + '...motherfucking ' + response.statusCode + '! bullshit!';
      // console.log(result.main);
      console.log(error);
    }
  });
})();

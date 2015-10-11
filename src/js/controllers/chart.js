
/* Controllers */
var kuzzle = Kuzzle.init("http://127.0.0.1:7512")

app
  // Flot Chart controller
  .controller('FlotChartDemoCtrl', ['$scope', '$interval', 'JQ_CONFIG', 'uiLoad', function($scope, $interval, JQ_CONFIG, uiLoad) {

    console.log("t");
    //load plotjs
    var plotLoaded = false;
    var easyPieChart = false;
    uiLoad.load(JQ_CONFIG['plot']).then(function() {plotLoaded=true}).catch(function() {});
    uiLoad.load(JQ_CONFIG['easyPieChart']).then(function() {
      easyPieChart=true
      $('#humidity_pie').easyPieChart({
         percent: 70,
         lineWidth: 10,
         trackColor: '#e8eff0',
         barColor: '#23b7e5',
         scaleColor: false,
         size: 158,
         rotate: 90,
         animate: 100,
         lineCap: 'butt'
     });
    }).catch(function() {});

    // init vars
    $scope.pi_accelerometer_x = "50%"
    $scope.pi_accelerometer_y = "50%"
    $scope.pi_accelerometer_z = "50%"

    $scope.lastDataUpdated = 0
    $scope.displayAlert = false

    var temperature_data_d = [],
        temperature_data = [],
        pressure_data_d = [],
        pressure_data = [];

    //$scope.temperature_data = []
    //$scope.temperature_data_d = []


    traqball_1 = new Traqball({stage: "stage", axis: [0, 0, 0], angle: 1})


    $scope.pi = {
      "accelerometer": {
        "date": 0,
        "raw": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "rad": {
          "pitch": 0,
          "roll": 0,
          "yaw": 0
        },
      },
      "environmental": {
        "date": 0,
        "humidity": 0,
        "pressure": 0,
        "temperature": {
          "average": 0,
          "humidity": 0,
          "pressure": 0,
        }
      }
    }

    // register kuzzle updates
    kuzzle.subscribe("raspberry_sense_accelerometer", {}, function(error, response) {
      if (error) {
        console.log(error)
      }

      $scope.$apply(function() {
        $scope.pi.accelerometer = response._source.accelerometer;
        $scope.pi.accelerometer.date = response._source.date;
        $scope.lastDataUpdated = Math.round($scope.pi.accelerometer.date * 1000)
      });
    });

    kuzzle.subscribe("raspberry_sense_environmental", {}, function(error, response) {
      if (error) {
        console.log(error)
      }

      $scope.$apply(function() {
        $scope.pi.environmental = response._source.environmental;
        $scope.pi.environmental.date = response._source.date;
        $scope.pi.environmental.temperature.average = ($scope.pi.environmental.temperature.humidity + $scope.pi.environmental.temperature.pressure) / 2
        $scope.lastDataUpdated = Math.round($scope.pi.environmental.date * 1000)
      });
    });

    $interval(function() {
      $scope.displayAlert = false;

      if ((new Date).getTime() - $scope.lastDataUpdated > 2500) {
        $scope.displayAlert = true;
      }

    }, 2000);

    // watch changed values on accelerometer
    $scope.$watch('pi.accelerometer', function() {
      // draw accelerometer X status
      if ($scope.pi.accelerometer.raw.x == 0) {
        $scope.pi_accelerometer_x = "50%"
      } else if ($scope.pi.accelerometer.raw.x > 0) {
        $scope.pi_accelerometer_x = (($scope.pi.accelerometer.raw.x*100)/2 +50) + "%"
      } else {
        $scope.pi_accelerometer_x = Math.abs(Math.abs($scope.pi.accelerometer.raw.x*100)/2-50) + "%"
      }

        // draw accelerometer Y status
      if ($scope.pi.accelerometer.raw.y == 0) {
        $scope.pi_accelerometer_y = "50%"
      } else if ($scope.pi.accelerometer.raw.y > 0) {
        $scope.pi_accelerometer_y = (($scope.pi.accelerometer.raw.y*100)/2 +50) + "%"
      } else {
        $scope.pi_accelerometer_y = Math.abs(Math.abs($scope.pi.accelerometer.raw.y*100)/2-50) + "%"
      }


      // draw accelerometer Z status
      if ($scope.pi.accelerometer.raw.z == 0) {
        $scope.pi_accelerometer_z = "50%"
      } else if ($scope.pi.accelerometer.raw.z > 0) {
        $scope.pi_accelerometer_z = (($scope.pi.accelerometer.raw.z*100)/2 +50) + "%"
      } else {
        $scope.pi_accelerometer_z = Math.abs(Math.abs($scope.pi.accelerometer.raw.z*100)/2-50) + "%"
      }

      //traqball_1.setup({stage: "stage", axis: [$scope.pi.accelerometer.rad.pitch, $scope.pi.accelerometer.rad.roll, $scope.pi.accelerometer.rad.yaw]})
      //traqball_1.setup({stage: "stage", axis: [$scope.pi.accelerometer.raw.z/1, $scope.pi.accelerometer.raw.y, $scope.pi.accelerometer.raw.x/1]})
      traqball_1.setup({stage: "stage", axis: [$scope.pi.accelerometer.rad.pitch, 0, 0]})
    });



    $scope.$watch('pi.environmental', function() {
      if (easyPieChart) {
        $('#humidity_pie').data('easyPieChart').update($scope.pi.environmental.humidity);
      }

      if (plotLoaded && typeof(pressure_data[$scope.pi.environmental.date]) == "undefined") {
        // update pressure graph
        pressure_data_d.push($scope.pi.environmental.pressure)
        pressure_data.push([$scope.pi.environmental.date, $scope.pi.environmental.pressure])

        if (pressure_data.length > 20) {
          pressure_data.shift()
          pressure_data_d.shift()
        }
          console.log(pressure_data)

        $.plot($("#pressure_chart"), [
            { data: pressure_data, label: 'Pressure', color: '#23b7e5' }
          ],
          {
            bars: { show: true, barWidth: 1.4, fillColor: { colors: [{ opacity: 0.5 }, { opacity: 0.9}] }  },
            xaxis: {
              mode: "time" ,
              font: { color: '#ccc' }
            },
            yaxis: {
              font: { color: '#ccc' },
              min: Math.min.apply(null, pressure_data_d) - (Math.min.apply(null, pressure_data_d) * 0.0001),
              max: Math.max.apply(null, pressure_data_d) + (Math.max.apply(null, pressure_data_d) * 0.0001),
            },
            grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },
            series: { shadowSize: 1 },
            tooltip: false
          }
        );
        $("#pressure_chart").data('plot').draw();
      }


      if (plotLoaded && typeof(temperature_data_d[$scope.pi.environmental.date]) == "undefined") {
        temperature_data_d.push($scope.pi.environmental.temperature.average)
        temperature_data.push([$scope.pi.environmental.date, $scope.pi.environmental.temperature.average])

        if (temperature_data.length > 60) {
          temperature_data.shift()
          temperature_data_d.shift()
        }

        $.plot($("#temperature_chart"),[
          { data: temperature_data, points: { show: false }, splines: { show: true, tension: 0.45, lineWidth: 5, fill: 0 } }
        ],
        {
          colors: ['#23b7e5'],
          series: { shadowSize: 3 },
          xaxis:{
            font: { color: '#ccc' },
            mode: "time" ,
          },
          yaxis:{
            font: { color: '#ccc' },
            min: Math.min.apply(null, temperature_data_d) - (Math.min.apply(null, temperature_data_d) * 0.01),
            max: Math.max.apply(null, temperature_data_d) + (Math.max.apply(null, temperature_data_d) * 0.01),
            tickDecimals: 0
          },
          grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },
          tooltip: false
        })

        $("#temperature_chart").data('plot').draw();
      }
    });



/*
    // watch changed values on environmental sensors
    $scope.$watch('pi.environmental', function() {


      if (plotLoaded && easyPieChart) {
        // update humidity graph
        temperature_data_d.push($scope.pi.environmental.humidity)
        temperature_data.push([(new Date()).getTime(), $scope.pi.environmental.humidity])

        if (temperature_data.length > 60) {
          temperature_data.shift()
          temperature_data_d.shift()
        }

        // draw graph
        $.plot($("#graph_1"), [
              { data: temperature_data, lines: { show: true, lineWidth: 1, fill:true, fillColor: { colors: [{opacity: 0.2}, {opacity: 0.8}] } } }
            ],
            {
              colors: ['#e8eff0'],
              series: { shadowSize: 3 },
              xaxis:{ mode: "time" },
              yaxis: {
                font: { color: '#a1a7ac' },
        				min: Math.min.apply(null, temperature_data_d) - (Math.min.apply(null, temperature_data_d) * 0.01),
        				max: Math.max.apply(null, temperature_data_d) + (Math.max.apply(null, temperature_data_d) * 0.01),
        				tickDecimals: 0
        			},
              grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#dce5ec' },
              tooltip: true,
              tooltipOpts: { content: '%s of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 10, y: -25 } }
            }
          )
        $("#graph_1").data('plot').draw();
      }
    });

*/








    $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];

    $scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];

    $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];

    $scope.d1_1 = [ [10, 120], [20, 70], [30, 70], [40, 60] ];

    $scope.d1_2 = [ [10, 50],  [20, 60], [30, 90],  [40, 35] ];

    $scope.d1_3 = [ [10, 80],  [20, 40], [30, 30],  [40, 20] ];

    $scope.d2 = [];

    for (var i = 0; i < 20; ++i) {
      $scope.d2.push([i, Math.round( Math.sin(i)*100)/100] );
    }

    $scope.d3 = [
      { label: "iPhone5S", data: 40 },
      { label: "iPad Mini", data: 10 },
      { label: "iPad Mini Retina", data: 20 },
      { label: "iPhone4S", data: 12 },
      { label: "iPad Air", data: 18 }
    ];

    $scope.refreshData = function(){
      $scope.d0_1 = $scope.d0_2;
    };

    $scope.getRandomData = function() {
      var data = [],
      totalPoints = 150;
      if (data.length > 0)
        data = data.slice(1);
      while (data.length < totalPoints) {
        var prev = data.length > 0 ? data[data.length - 1] : 50,
          y = prev + Math.random() * 10 - 5;
        if (y < 0) {
          y = 0;
        } else if (y > 100) {
          y = 100;
        }
        data.push(Math.round(y*100)/100);
      }
      // Zip the generated y values with the x values
      var res = [];
      for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]])
      }
      return res;
    }

    $scope.d4 = $scope.getRandomData();

  }]);

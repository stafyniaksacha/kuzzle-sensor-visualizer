
/* Controllers */
var kuzzle = Kuzzle.init('http://127.0.0.1:7512')

var setCubeRotation = function(pitch, roll, yawn) {
  document.querySelector('#cube').style.transform = 'rotateX( '+ (0+pitch) +'deg ) rotateY( '+ (0+yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) scale( 0.8 )';

  /*document.querySelector('#cube .front').style.transform = 'rotateX( '+ (0+pitch) +'deg ) rotateY( '+ (0+yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) translateZ( 97px )';
  document.querySelector('#cube .back').style.transform = 'rotateX( '+ (180+pitch) +'deg ) rotateY( '+ (0-yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) translateZ( 97px )';
  document.querySelector('#cube .right').style.transform = 'rotateX( '+ (0+pitch) +'deg ) rotateY( '+ (90+yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) translateZ( 97px )';
  document.querySelector('#cube .left').style.transform = 'rotateX( '+ (0+pitch) +'deg ) rotateY( '+ (-90+yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) translateZ( 97px )';
  document.querySelector('#cube .top').style.transform = 'rotateX( '+ (90+pitch) +'deg ) rotateZ( '+ (0-yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) translateZ( 97px )';
  document.querySelector('#cube .bottom').style.transform = 'rotateX( '+ (-90+pitch) +'deg ) rotateZ( '+ (0+yawn) +'deg ) rotateZ( '+ (0+roll) +'deg ) translateZ( 97px )';*/

}


app
  // Flot Chart controller
  .controller('FlotChartDemoCtrl', ['$scope', '$interval', 'JQ_CONFIG', 'uiLoad', function($scope, $interval, JQ_CONFIG, uiLoad) {

    //load plotjs & easyPieChart
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
    $scope.pi_accelerometer_x = '50%'
    $scope.pi_accelerometer_y = '50%'
    $scope.pi_accelerometer_z = '50%'

    $scope.pi_gyro_x = '50%'
    $scope.pi_gyro_y = '50%'
    $scope.pi_gyro_z = '50%'

    $scope.pi_orientation_x = '50%'
    $scope.pi_orientation_y = '50%'
    $scope.pi_orientation_z = '50%'

    $scope.pi_compass_x = '50%'
    $scope.pi_compass_y = '50%'
    $scope.pi_compass_z = '50%'

    $scope.lastDataUpdated = 0
    $scope.displayAlert = false

    var temperature_data_d = [],
        temperature_data = [],
        pressure_data_d = [],
        pressure_data = [];



    /////////////////////////
    // data model
    /////////////////////////
    $scope.pi = {
      'intertial' : {
        'date': 0,
        'accelerometer': {
          'deg': {'pitch': 0, 'roll': 0, 'yaw': 0},
          'raw': {'x': 0, 'y': 0, 'z': 0},
        },
        'compass': {
          'north': 0,
          'raw': {'x': 0, 'y': 0, 'z': 0},
        },
        'gyro': {
          'deg': {'pitch': 0, 'roll': 0, 'yaw': 0},
          'raw': {'x': 0, 'y': 0, 'z': 0},
        },
        'orientation': {
          'deg': {'pitch': 0, 'roll': 0, 'yaw': 0},
          'rad': {'pitch': 0, 'roll': 0, 'yaw': 0},
        },
      },
      'environmental': {
        'date': 0,
        'humidity': 0,
        'pressure': 0,
        'temperature': {'average': 0, 'humidity': 0, 'pressure': 0}
      }
    }


    /////////////////////////
    // register kuzzle updates
    /////////////////////////
    kuzzle.subscribe('raspberry_sense_inertial', {}, function(error, response) {
      if (error) {
        console.log(error)
      }

      $scope.$apply(function() {
        $scope.pi.inertial = response._source;
        $scope.pi.inertial.date = response._source.date;
        $scope.lastDataUpdated = Math.round($scope.pi.inertial.date * 1000)
      });
    });

    kuzzle.subscribe('raspberry_sense_environmental', {}, function(error, response) {
      if (error) {
        console.log(error)
      }

      $scope.$apply(function() {
        $scope.pi.environmental = response._source;
        $scope.pi.environmental.temperature.average = ($scope.pi.environmental.temperature.humidity + $scope.pi.environmental.temperature.pressure) / 2
        $scope.lastDataUpdated = Math.round($scope.pi.environmental.date * 1000)
      });
    });




    /////////////////////////
    // kuzzle connecion Check
    /////////////////////////
    $interval(function() {
      $scope.displayAlert = false;

      if ((new Date).getTime() - $scope.lastDataUpdated > 2500) {
        $scope.displayAlert = true;
      }

    }, 2000);




    //////////////////////////////////////////////////
    // watch changed values on inertial sensors
    //////////////////////////////////////////////////
    $scope.$watch('pi.inertial', function() {
      /////////////////////////
      // accelerometer
      /////////////////////////

      if ($scope.pi.inertial && $scope.pi.inertial.accelerometer) {
        // draw accelerometer X status
        if ($scope.pi.inertial.accelerometer.raw.x == 0) {
          $scope.pi_accelerometer_x = '50%'
        } else if ($scope.pi.inertial.accelerometer.raw.x > 0) {
          $scope.pi_accelerometer_x = (($scope.pi.inertial.accelerometer.raw.x*100)/2 +50) + '%'
        } else {
          $scope.pi_accelerometer_x = Math.abs(Math.abs($scope.pi.inertial.accelerometer.raw.x*100)/2-50) + '%'
        }

          // draw accelerometer Y status
        if ($scope.pi.inertial.accelerometer.raw.y == 0) {
          $scope.pi_accelerometer_y = '50%'
        } else if ($scope.pi.inertial.accelerometer.raw.y > 0) {
          $scope.pi_accelerometer_y = (($scope.pi.inertial.accelerometer.raw.y*100)/2 +50) + '%'
        } else {
          $scope.pi_accelerometer_y = Math.abs(Math.abs($scope.pi.inertial.accelerometer.raw.y*100)/2-50) + '%'
        }


        // draw accelerometer Z status
        if ($scope.pi.inertial.accelerometer.raw.z == 0) {
          $scope.pi_accelerometer_z = '50%'
        } else if ($scope.pi.inertial.accelerometer.raw.z > 0) {
          $scope.pi_accelerometer_z = (($scope.pi.inertial.accelerometer.raw.z*100)/2 +50) + '%'
        } else {
          $scope.pi_accelerometer_z = Math.abs(Math.abs($scope.pi.inertial.accelerometer.raw.z*100)/2-50) + '%'
        }
      }

      /////////////////////////
      // gyroscope
      /////////////////////////

      if ($scope.pi.inertial && $scope.pi.inertial.gyro) {
        // draw gyro X status
        if ($scope.pi.inertial.gyro.raw.x == 0) {
          $scope.pi_gyro_x = '50%'
        } else if ($scope.pi.inertial.gyro.raw.x > 0) {
          $scope.pi_gyro_x = (($scope.pi.inertial.gyro.raw.x*100)/2 +50) + '%'
        } else {
          $scope.pi_gyro_x = Math.abs(Math.abs($scope.pi.inertial.gyro.raw.x*100)/2-50) + '%'
        }

          // draw gyro Y status
        if ($scope.pi.inertial.gyro.raw.y == 0) {
          $scope.pi_gyro_y = '50%'
        } else if ($scope.pi.inertial.gyro.raw.y > 0) {
          $scope.pi_gyro_y = (($scope.pi.inertial.gyro.raw.y*100)/2 +50) + '%'
        } else {
          $scope.pi_gyro_y = Math.abs(Math.abs($scope.pi.inertial.gyro.raw.y*100)/2-50) + '%'
        }


        // draw gyro Z status
        if ($scope.pi.inertial.gyro.raw.z == 0) {
          $scope.pi_gyro_z = '50%'
        } else if ($scope.pi.inertial.gyro.raw.z > 0) {
          $scope.pi_gyro_z = (($scope.pi.inertial.gyro.raw.z*100)/2 +50) + '%'
        } else {
          $scope.pi_gyro_z = Math.abs(Math.abs($scope.pi.inertial.gyro.raw.z*100)/2-50) + '%'
        }
      }



      /////////////////////////
      // orientation
      /////////////////////////

      if ($scope.pi.inertial && $scope.pi.inertial.orientation) {
        // draw orientation X status
        if ($scope.pi.inertial.orientation.rad.pitch == 0) {
          $scope.pi_orientation_x = '50%'
        } else if ($scope.pi.inertial.orientation.rad.pitch > 0) {
          $scope.pi_orientation_x = (($scope.pi.inertial.orientation.rad.pitch*100)/2 +50) + '%'
        } else {
          $scope.pi_orientation_x = Math.abs(Math.abs($scope.pi.inertial.orientation.rad.pitch*100)/2-50) + '%'
        }

          // draw orientation Y status
        if ($scope.pi.inertial.orientation.rad.roll == 0) {
          $scope.pi_orientation_y = '50%'
        } else if ($scope.pi.inertial.orientation.rad.roll > 0) {
          $scope.pi_orientation_y = (($scope.pi.inertial.orientation.rad.roll*100)/2 +50) + '%'
        } else {
          $scope.pi_orientation_y = Math.abs(Math.abs($scope.pi.inertial.orientation.rad.roll*100)/2-50) + '%'
        }


        // draw orientation Z status
        if ($scope.pi.inertial.orientation.rad.yaw == 0) {
          $scope.pi_orientation_z = '50%'
        } else if ($scope.pi.inertial.orientation.rad.yaw > 0) {
          $scope.pi_orientation_z = (($scope.pi.inertial.orientation.rad.yaw*100)/2 +50) + '%'
        } else {
          $scope.pi_orientation_z = Math.abs(Math.abs($scope.pi.inertial.orientation.rad.yaw*100)/2-50) + '%'
        }


        /////////////////////////
        // cube representation
        /////////////////////////

        setCubeRotation($scope.pi.inertial.orientation.deg.pitch, $scope.pi.inertial.orientation.deg.roll/-1, 0);
      }



      /////////////////////////
      // compass
      /////////////////////////
      if ($scope.pi.inertial && $scope.pi.inertial.compass) {
        // draw compass X status
        if ($scope.pi.inertial.compass.raw.x == 0) {
          $scope.pi_compass_x = '50%'
        } else if ($scope.pi.inertial.compass.raw.x > 0) {
          $scope.pi_compass_x = (($scope.pi.inertial.compass.raw.x*100)/2 +50) + '%'
        } else {
          $scope.pi_compass_x = Math.abs(Math.abs($scope.pi.inertial.compass.raw.x*100)/2-50) + '%'
        }

          // draw compass Y status
        if ($scope.pi.inertial.compass.raw.y == 0) {
          $scope.pi_compass_y = '50%'
        } else if ($scope.pi.inertial.compass.raw.y > 0) {
          $scope.pi_compass_y = (($scope.pi.inertial.compass.raw.y*100)/2 +50) + '%'
        } else {
          $scope.pi_compass_y = Math.abs(Math.abs($scope.pi.inertial.compass.raw.y*100)/2-50) + '%'
        }


        // draw compass Z status
        if ($scope.pi.inertial.compass.raw.z == 0) {
          $scope.pi_compass_z = '50%'
        } else if ($scope.pi.inertial.compass.raw.z > 0) {
          $scope.pi_compass_z = (($scope.pi.inertial.compass.raw.z*100)/2 +50) + '%'
        } else {
          $scope.pi_compass_z = Math.abs(Math.abs($scope.pi.inertial.compass.raw.z*100)/2-50) + '%'
        }
      }



    });



    //////////////////////////////////////////////////
    // watch changed element in environmental sensors
    //////////////////////////////////////////////////
    $scope.$watch('pi.environmental', function() {
      if (easyPieChart) {
        /////////////////////////
        // update humidity chart
        /////////////////////////
        $('#humidity_pie').data('easyPieChart').update($scope.pi.environmental.humidity);
      }

      if (plotLoaded && typeof(pressure_data[$scope.pi.environmental.date]) == 'undefined') {
        /////////////////////////
        // update pressure graph
        /////////////////////////
        pressure_data_d.push($scope.pi.environmental.pressure)
        pressure_data.push([$scope.pi.environmental.date, $scope.pi.environmental.pressure])

        if (pressure_data.length > 20) {
          pressure_data.shift()
          pressure_data_d.shift()
        }

        $.plot($('#pressure_chart'), [
            { data: pressure_data, color: '#23b7e5' }
          ],
          {
            bars: { show: true, barWidth: 4.7, fillColor: { colors: [{ opacity: 0.5 }, { opacity: 0.9}] }  },
            xaxis: {
              mode: 'time' ,
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
        $('#pressure_chart').data('plot').draw();
      }


      if (plotLoaded && typeof(temperature_data_d[$scope.pi.environmental.date]) == 'undefined') {
        /////////////////////////
        // update temperature graph
        /////////////////////////
        temperature_data_d.push($scope.pi.environmental.temperature.average)
        temperature_data.push([$scope.pi.environmental.date, $scope.pi.environmental.temperature.average])

        if (temperature_data.length > 60) {
          temperature_data.shift()
          temperature_data_d.shift()
        }

        $.plot($('#temperature_chart'),[
          { data: temperature_data, points: { show: false }, splines: { show: true, tension: 0.45, lineWidth: 5, fill: 0 } }
        ],
        {
          colors: ['#23b7e5'],
          series: { shadowSize: 3 },
          xaxis:{
            font: { color: '#ccc' },
            mode: 'time' ,
          },
          yaxis:{
            font: { color: '#ccc' },
            min: Math.min.apply(null, temperature_data_d) - (Math.min.apply(null, temperature_data_d) * 0.01),
            max: Math.max.apply(null, temperature_data_d) + (Math.max.apply(null, temperature_data_d) * 0.01),
          },
          grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },
          tooltip: false
        })

        $('#temperature_chart').data('plot').draw();
      }
    });









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
      { label: 'iPhone5S', data: 40 },
      { label: 'iPad Mini', data: 10 },
      { label: 'iPad Mini Retina', data: 20 },
      { label: 'iPhone4S', data: 12 },
      { label: 'iPad Air', data: 18 }
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

module.exports = {
  angular:{
    src:[
      'libs/jquery/jquery/dist/jquery.js',

      'libs/angular/angular/angular.js',

      'libs/angular/angular-animate/angular-animate.js',
      'libs/angular/angular-aria/angular-aria.js',
      'libs/angular/angular-cookies/angular-cookies.js',
      'libs/angular/angular-messages/angular-messages.js',
      'libs/angular/angular-resource/angular-resource.js',
      'libs/angular/angular-sanitize/angular-sanitize.js',
      'libs/angular/angular-touch/angular-touch.js',
      'libs/angular/angular-material/angular-material.js',

      'libs/angular/angular-ui-router/release/angular-ui-router.js',
      'libs/angular/ngstorage/ngStorage.js',
      'libs/angular/angular-ui-utils/ui-utils.js',

      'libs/angular/angular-bootstrap/ui-bootstrap-tpls.js',

      'libs/angular/oclazyload/dist/ocLazyLoad.js',

      'libs/angular/angular-translate/angular-translate.js',
      'libs/angular/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'libs/angular/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'libs/angular/angular-translate-storage-local/angular-translate-storage-local.js',

      'libs/traqball.js/src/traqball.js',

      'libs/kuzzle/socket.io.min.js',
      'libs/kuzzle/kuzzle.min.js',

      'src/js/*.js',
      'src/js/directives/*.js',
      'src/js/services/*.js',
      'src/js/filters/*.js',
      'src/js/controllers/bootstrap.js'
    ],
    dest:'angular/js/app.src.js'
  },
  html:{
    src:[
      'libs/jquery/jquery/dist/jquery.js',
      'libs/jquery/bootstrap/dist/js/bootstrap.js',
      'html/js/*.js'
    ],
    dest:'html/js/app.src.js'
  }
}

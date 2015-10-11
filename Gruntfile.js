module.exports = function(grunt) {
	var gtx = require('gruntfile-gtx').wrap(grunt);

	var path = require('path');
  gtx.loadAuto();

  var gruntConfig = require('./grunt');
  gruntConfig.package = require('./package.json');

  gtx.config(gruntConfig);

  grunt.registerTask('build:angular', ['recess:less', 'clean:angular', 'copy:libs', 'copy:angular', 'recess:angular', 'concat:angular', 'uglify:angular']);
  grunt.registerTask('build:html', ['clean:html', 'copy:html', 'recess:html', 'swig:html', 'concat:html', 'uglify:html']);
  grunt.registerTask('build:landing', ['copy:landing', 'swig:landing']);

  grunt.registerTask('release', ['bower-install-simple', 'bump-commit']);
  grunt.registerTask('release-patch', ['bump-only:patch', 'release']);
  grunt.registerTask('release-minor', ['bump-only:minor', 'release']);
  grunt.registerTask('release-major', ['bump-only:major', 'release']);
  grunt.registerTask('prerelease', ['bump-only:prerelease', 'release']);

	  // We need our bower components in order to develop

	  gtx.finalise();
}

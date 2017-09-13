var gulpSequence = require('gulp-sequence');

module.exports = function(gulp, config) {

    gulp.task('run', run);

    //////

    function run(cb) {
        return gulpSequence('clean', 'build', 'electron:serve', 'watch', cb);
    }
}

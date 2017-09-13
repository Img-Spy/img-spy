var rm = require('gulp-rm');

module.exports = function(gulp, config) {
    gulp.task('clean', clean);

    //////

    function clean() {
        return gulp
                .src('dist/**/*', { read: false }) 
                .pipe(rm());
    }
}

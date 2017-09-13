var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

module.exports = function(gulp, config) {
    gulp.task('sass', sassTask);
    gulp.task('watch:sass', watchScss);

    //////

    function sassTask() {
        return gulp.src('src/style/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/style'));
    }

    function watchScss() {
        watch('src/style/**/*.scss', sassTask);
    }
}

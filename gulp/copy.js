var watch = require('gulp-watch');

module.exports = function(gulp, config) {
    const filesToCopy = 'src/**/*.{html,css,json,js,svg,ttf,woff,woff2,eot}';
    gulp.task('copy:assets', copyAssets);
    gulp.task('watch:assets', watchAssets);

    //////

    function copyAssets() {
        return gulp
                .src(filesToCopy) 
                .pipe(gulp.dest('dist'));
    }

    function watchAssets() {
        return watch(filesToCopy, copyAssets);
    }
}

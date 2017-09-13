var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var tsProject = ts.createProject('tsconfig.json');

module.exports = function(gulp, config) {
    gulp.task('ts', ts);
    gulp.task('watch:ts', watchTs);

    //////

    function compileTs(src, dest) {
        var tsResult = gulp.src(src)
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return tsResult.js
            .pipe(sourcemaps.write(".", { sourceRoot: 'src' }))
            .pipe(gulp.dest(dest));
    }

    function ts() {
        return compileTs('src/**/*.{ts,tsx}', 'dist');
    }

    function watchTs() {
        watch('src/main/**/*.ts', () => compileTs('src/main/**/*.ts', 'dist/main'));
        watch('src/app/**/*.{ts,tsx}', () => compileTs('src/app/**/*.{ts,tsx}', 'dist/app'));
    }
}

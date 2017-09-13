module.exports = function(gulp, config) {
    gulp.task('watch', ['electron:watch', 'watch:assets', 'watch:ts', 'watch:sass']);
}

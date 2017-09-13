var eConnect = require('electron-connect').server.create();
var watch = require('gulp-watch');

module.exports = function(gulp, config) {
    var softTimeout = {};

    gulp.task('electron:serve', electronServe);
    gulp.task('electron:watch', electronWatch);

    //////

    function electronServe() {
        // Start browser process
        eConnect.start();
    }

    function smoothify(cb, id) {
        return () => {
            if(softTimeout[id]) {
                clearTimeout(softTimeout[id]);
                softTimeout[id] = undefined;
            }
            softTimeout[id] = setTimeout(cb, 200);
        }
    }

    function electronWatch() {
        // Restart browser process
        watch('dist/main/**/*.js', 
              smoothify(eConnect.restart, "restart"));

        // Reload renderer process
        watch(['dist/app/**/*.js', 'dist/style/**/*.css'],
              smoothify(eConnect.reload, "reload"));
    }
}

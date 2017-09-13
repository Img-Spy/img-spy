"use strict";

const gulp = require("gulp");
const config = require("./gulp.json");

// Load all tasks
require("./gulp/typescript") (gulp, config);
require("./gulp/electron")   (gulp, config);
require("./gulp/copy")       (gulp, config);
require("./gulp/build")      (gulp, config);
require("./gulp/watch")      (gulp, config);
require("./gulp/run")        (gulp, config);
require("./gulp/clean")      (gulp, config);
require("./gulp/sass")       (gulp, config);

//
gulp.task("default", ["run"]);

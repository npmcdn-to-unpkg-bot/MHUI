/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    ts = require("gulp-typescript"),
    typescript = require("typescript"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    util = require("gulp-util");

var paths = {
    webroot: "./wwwroot/",
    srcroot: "."
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

paths.reactJs = paths.srcroot + "/React/**/*";
paths.reactCompiledOutput = paths.srcroot + "/ReactCompiled";
paths.reactCompiledPages = paths.srcroot + "/ReactCompiled/Pages/*.js";

paths.reactServerSide = paths.srcroot + "/ReactCompiled/server.js";
paths.concatReactPath = paths.webroot + "js";

paths.jsLibs = paths.srcroot + "/React/libs.js";
paths.minJsLibs = paths.webroot + "js/";

var commonLibraries = ['react', 'react-dom', 'domready'];

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("compile:tsx", function () {
    return gulp.src([paths.reactJs], { base: 'React' })
    .pipe(ts({
        typescript: typescript,
        jsx: "react",
        target: "ES5",
        module: "commonjs",
        hasExports: false
    }))
    .pipe(gulp.dest(paths.reactCompiledOutput));
});

gulp.task("compile:server", ['compile:tsx'], function () {
    console.log(paths.reactServerSide);
    return browserify(paths.reactServerSide, {
        standalone: 'pages'
    })
    .bundle()
    .pipe(source("server.js"))
    .pipe(gulp.dest(paths.minJsLibs));
});

gulp.task("compile:libs", function () {
    return browserify()
    .require(commonLibraries)
    .bundle()
    .pipe(source("libs.js"))
    .pipe(gulp.dest(paths.minJsLibs));
});

gulp.task("compile:client", ['compile:tsx'], function () {
    return browserify(paths.reactCompiledOutput + '/Pages/index.js', {
        standalone: 'page'
    })
    .external(commonLibraries)
    .bundle()
    .pipe(source("index.js"))
    .pipe(gulp.dest(paths.minJsLibs));
});

gulp.task("min", ["min:js", "min:css"]);

"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    eslint = require("gulp-eslint");

var paths = {
    webroot: "."
};

paths.js = [
    paths.webroot + "/bower_components/jquery/dist/jquery.js",
    paths.webroot + "/bower_components/moment/moment.js",
    paths.webroot + "/bower_components/bootstrap/dist/js/bootstrap.js",
    paths.webroot + "/bower_components/bootstrap-daterangepicker/daterangepicker.js",
    paths.webroot + "/bower_components/chartjs/Chart.js",
    paths.webroot + "/bower_components/signalr/jquery.signalR.js",
    paths.webroot + "/bower_components/angular/angular.js",
    paths.webroot + "/bower_components/angular-signalr-hub/signalr-hub.js",
    paths.webroot + "/bower_components/angular-deferred-bootstrap/angular-deferred-bootstrap.js",
    paths.webroot + "/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    paths.webroot + "/bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.js",
    paths.webroot + "/bower_components/angular-resource/angular-resource.js",
    paths.webroot + "/bower_components/angular-route/angular-route.js",
    paths.webroot + "/bower_components/angular-ui-router/release/angular-ui-router.js",
    paths.webroot + "/bower_components/angular-breadcrumb/dist/angular-breadcrumb.js",
    paths.webroot + "/bower_components/angular-sanitize/angular-sanitize.js",
    paths.webroot + "/bower_components/angular-ui-select/dist/select.js",
    paths.webroot + "/bower_components/angular-daterangepicker/js/angular-daterangepicker.js",
    paths.webroot + "/bower_components/bootstrap-switch/dist/js/bootstrap-switch.js",
    paths.webroot + "/bower_components/ng-notify/dist/ng-notify.min.js",
    paths.webroot + "/bower_components/ngprogress/build/ngprogress.js",
    paths.webroot + "/bower_components/angular-cron-jobs/dist/angular-cron-jobs.js",
    paths.webroot + "/bower_components/alasql/console/alasql.min.js",
    paths.webroot + "/bower_components/alasql/console/xlsx.core.min.js",
    paths.webroot + "/bower_components/angular-signature/src/signature.js",
    paths.webroot + "/bower_components/signature_pad/signature_pad.min.js",
    paths.webroot + "/bower_components/alasql/dist/alasql.min.js",
    paths.webroot + "/js/**/*.js"];

paths.css = [
    paths.webroot + "/bower_components/bootstrap/dist/css/bootstrap.css",
    paths.webroot + "/bower_components/bootstrap-daterangepicker/daterangepicker.css",
    paths.webroot + "/bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css",
    paths.webroot + "/bower_components/font-awesome/css/font-awesome.css",
    paths.webroot + "/bower_components/angular-bootstrap/ui-bootstrap-csp.css",
    paths.webroot + "/bower_components/angular-ui-select/dist/select.css",
    paths.webroot + "/bower_components/ng-notify/dist/ng-notify.min.css",
    paths.webroot + "/bower_components/ngprogress/ngprogress.css",
    paths.webroot + "/bower_components/angular-cron-jobs/dist/angular-cron-jobs.css"];

paths.concatJsDest = paths.webroot + "/site.min.js";
paths.concatCssDest = paths.webroot + "/site.min.css";

gulp.task("min:js", function () {
    return gulp.src(paths.js, { base: "." })
        .pipe(concat(paths.concatJsDest))
        // .pipe(uglify())
        .pipe(gulp.dest("."));
});
gulp.task("min:css", function () {
    return gulp.src(paths.css)
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("lint", function () {
    return gulp.src(paths.webroot + "/js/**/*.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task("watch", function () {
    gulp.watch(paths.webroot + "/js/**/*.js", function () {
        gulp.run("min:js");
    });
    gulp.watch(paths.webroot + "/css/**/*.css", function () {
        gulp.run("min:css");
    });
});
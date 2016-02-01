var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');


gulp.task('scripts-dev', function() {
    return gulp.src(['./src/js/extensions.js', './src/js/countdown.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('countdown.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts', function() {
    return gulp.src(['./src/js/extensions.js', './src/js/countdown.js'])
        .pipe(concat('countdown.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('minify', function () {
    return gulp.src('./dist/js/countdown.js')
        .pipe(uglify())
        .pipe(rename('./countdown.min.js'))
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('default', ['scripts', 'minify']);
gulp.task('dev', ['scripts-dev']);

gulp.task('watch', function() {
    gulp.watch('./src/js/*.js', ['dev']);
});
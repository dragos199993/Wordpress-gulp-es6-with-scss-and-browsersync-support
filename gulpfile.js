var gulp = require('gulp'),
settings = require('./settings'),
webpack = require('webpack'),
browserSync = require('browser-sync').create(),
sass = require('gulp-sass');



// Add Sass/Scss task 
gulp.task('sass', function () {
  return gulp.src(settings.themeLocation + './css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(settings.themeLocation + './css'));
});
// Add browsersync Sass/Scss support
gulp.task('waitForStyles', ['sass'], function() {
  return gulp.src(settings.themeLocation + '/css/main.css')
    .pipe(browserSync.stream());
});


gulp.task('scripts', function(callback) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }

    console.log(stats.toString());
    callback();
  });
});

gulp.task('watch', function() {
  browserSync.init({
    notify: false,
    proxy: settings.urlToPreview,
    ghostMode: false,
    open: 'external',
    socket: {
      domain: "localhost:3000"
    }
  });

  gulp.watch('./**/*.php', function() {
    browserSync.reload();
  });
  gulp.watch(settings.themeLocation + 'css/**/*.css', ['waitForStyles']);
  gulp.watch([settings.themeLocation + 'js/*.js', settings.themeLocation + 'js/script.js'], ['waitForScripts']);

  //Watch sass/scss files
  gulp.watch(settings.themeLocation + './css/**/*.scss', ['sass']);
});


gulp.task('waitForScripts', ['scripts'], function() {
  browserSync.reload();
});
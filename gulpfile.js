var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    browserSync = require("browser-sync").create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');


/*
## browser sync
*/

gulp.task("browser-sync", function(){
  browserSync.init({
    proxy: "draganddrop_test.lcl:8888"
  });
});

gulp.task("bs-reload", function(){
  browserSync.reload();
});



/*
## StyleSheet
*/

gulp.task("scss", function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
      cascade: false
    }))
    .pipe(gulp.dest('htdocs/css'))
    .pipe(browserSync.stream());
});



/*
## watch
*/

gulp.task("default", ["browser-sync"], function(){
  
  gulp.watch('src/scss/**/*.scss', ['scss']);
  
  gulp.watch('htdocs/**/*.html', ['bs-reload']);
  gulp.watch('htdocs/**/*.php', ['bs-reload']);
  //gulp.watch('htdocs/**/*.css', ['bs-reload']);
  gulp.watch('htdocs/**/*.js', ['bs-reload']);
});

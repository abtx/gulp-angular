var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// https://css-tricks.com/gulp-for-beginners/

<!-- DEV TASKS -->

// add task to compile sass to css
gulp.task('sass', function(){
  return gulp.src('app/styles/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// init Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// add task to watch the sass folder for any changes and use 'sass' task to compile sass to css when scss changes
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/scripts/**/*.js', browserSync.reload);
});

// default task
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

<!-- DEPLOY TASKS -->

// register useref tasks (concat and minification of js & css)
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// optimize images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

// delete unused files
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// delete cache
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})

// compile optimization tasks
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images'],
    callback
  )
})

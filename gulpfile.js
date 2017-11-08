//include promise to remedy server bug
require('es6-promise').polyfill();

//Gulp & Gulp Plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    gulpCopy = require('gulp-copy'),
    pngquant = require('imagemin-pngquant');


//NPM dependencies
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');


gulp.task('watch', function() {
    gulp.watch('dev/styles/*.scss', ['styles']);
    gulp.watch('dev/scripts/*', ['scripts']);
    gulp.watch('dev/images/**/*', ['images']);
});

//Styling Tasks
gulp.task('styles', function(){
  gulp.src(['dev/styles/styles.scss'])
    .pipe(sass().on('error', sass.logError))
    //.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(cssnano({zindex: false}))
    .pipe(rename(function (path) {
        path.extname = ".min.css"
    }))
    .pipe(gulp.dest('public/styles/'));
}),

gulp.task('fonts', function(){
  gulp.src('dev/fonts/*')
    .pipe(gulpCopy('public/fonts/',{prefix:2}));
}),

//JavaScript (Front-end) Tasks
gulp.task('scripts',function(){
    gulp.src('dev/scripts/main.js')
  .pipe(rename('main.dev.js'))
  .pipe(uglify())
  .pipe(rename('main.min.js'))
  .pipe(gulp.dest('public/scripts'))
});

//Image Compression Tasks
gulp.task('images', function(){
    gulp.src('dev/images/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('public/images'))
});

gulp.task('default', ['images','scripts','styles','fonts']);
var gulp = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var minifyJs = require('gulp-minify');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sprite = require('gulp-sprite-generator');

gulp.task('sprite', function() {

    var output = gulp.src('src/css/main.css')
        .pipe(sprite({
            baseUrl: 'src/images',
            spriteSheetPath: '../img',
            spriteSheetName: 'sprite.png',
            // algorithm: 'binary-tree'
        }));

    output.css
        .pipe(minifyCss())
        .pipe(gulp.dest('public/css'));

    output.img
        .pipe(gulp.dest('public/img'));

});

gulp.task('styles', function() {

     gulp.src('src/scss/**/*.scss')
         .pipe(sass())
         .on('error', console.log)
         .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],cascade: false}))
         .pipe(concat('main.css'))
         .pipe(gulp.dest('src/css'));


});

gulp.task('scripts', function() {
    return gulp.src(['src/js/1_jquery.js',
        'src/js/2_vue.min.js',
        // 'src/js/lodash.min.js',
        'src/js/isotope.js',
        // 'src/js/3_datepicker.js' ,
        'src/js/3_partials.js'])
        .pipe(concat('bundle.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*', ['styles']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/css/*.css', ['sprite']);
});

gulp.task('default',['styles', 'scripts']);

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    babel       = require('gulp-babel'),
    sourcemaps  = require('gulp-sourcemaps');

// resource/sass/*.sass - all files with "sass" extention
// resource/sass/**/*.sass - all files with "sass" extention in the any
//                           directories and sub directories of "resource/sass/"
// !resource/sass/main.sass - all files exclude "main.sass"
// ['!resource/sass/main.sass', 'resource/sass/*.sass'] - exclude "main.sass"
//                           and include all other
// resource/sass/*.+(sass|scss) - all files with "sass" and "scss" extensions
//

// Simple variant
// gulp.task('sass', function() {
//     return gulp.src('resource/sass/*.sass')
//     .pipe(sass())
//     .pipe(gulp.dest('public/css'));
// });

// Live reload variant
gulp.task('sass', function() {
    return gulp.src('resources/sass/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
    return gulp.src('resources/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'));
});

gulp.task('css-minify', ['sass'], function() {
    return gulp.src('public/css/main.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'));
});

// Localhost server settings
// gulp.task('browser-sync', function() {
//     browserSync({
//         server: {
//             baseDir: './' // Base directory
//         },
//         notify: false // Disable notifications from browser-sync
//     });
// });

gulp.task('browser-sync', function() {
    browserSync.init({
        open: 'external',
        host: 'alma.dev', // Apache local virtual host
        proxy: 'alma.dev', // Apache local virtual host
        port: 8080,
        notify: false // Disable notifications from browser-sync
    });
});

// Simple variant
// gulp.task('watch', function() {
//     gulp.watch('resource/sass/*.sass', ['sass']);
// });

// Live reload variant
gulp.task('watch', ['browser-sync', 'css-minify', 'scripts'], function() {
    gulp.watch('resources/sass/*.sass', ['sass']);
    gulp.watch('resources/js/**/*.js', ['scripts']);
    gulp.watch('*.html', browserSync.reload);
});

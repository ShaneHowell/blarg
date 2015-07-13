// Include gulp
var gulp         = require('gulp'),

/*
 * Gulp plugins.
 */
    gutil        = require('gulp-util'),
    notify       = require('gulp-notify'),
    rename       = require('gulp-rename'),
    scss         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    plumber      = require('gulp-plumber'),
    uglify       = require('gulp-uglify'),
    filter       = require('gulp-filter'),
    jshint       = require('gulp-jshint'),
    imagemin     = require('gulp-imagemin'),
    newer        = require('gulp-newer'),
    concat       = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    reload       = browserSync.reload,
    srcPath      = 'blarg-starter-scss/',
    distPath     = 'blarg-starter-scss/',
    buildPath    = 'blarg-starter-scss/',
    indexPath    = 'path-to-index-file',
    templatePath = 'path-to-template-file-folder',
    concatCss    = 'blarg-starter-scss/allthe.css',
    concatJs     = 'blarg-starter-scss/allthe.js'
    ;


/*
 * Input, Output paths and environment variables.
 */
    // Set proxy
    var proxy = "";

    var input_paths = {
        images:  [srcPath + '**/*.jpg', srcPath + '**/*.png', srcPath + '**/*.gif', '!' + srcPath + '**/*.min.*', '!' + srcPath + '**/min/*.*' ],
        scripts: [srcPath + '**/*.js', '!**/*.min.*', '!**/min/*.*'],
        styles:  [srcPath + '**/*.scss', '!' + srcPath + 'partials{,/**}']
    };

    var output_paths = {
        images:  distPath,
        scripts: distPath,
        styles:  distPath
    };

    var template_paths = {
        twig: indexPath + '**/*.twig',
        html: templatePath + '**/*.html'
    };



/*
 * Plugin options.
 */

    // Sass
    var scss_options = {
        outputStyle: 'compressed', // variables - https://github.com/andrew/node-sass
        errLogToConsole: false,
        onError: function(err) {
            notify().write(err);                    // Growl it.
            console.log(gutil.colors.red(err));      // Log the occurred error.
            process.stdout.write('\x07');          // Beep boop the terminal.
        }
    };

    // JS Uglify
    var uglify_options = {
        mangle: false
    };



/*
 * Tasks.
 */
    gulp.task('browser-sync', function() {

        browserSync({
            proxy: proxy
        });

    });


    gulp.task('reload', function() {
        browserSync.reload();
    });


    gulp.task('sass', function() {

        return gulp.src(input_paths.styles)
            .pipe(scss(scss_options))
            .pipe(
                autoprefixer({
                    browsers: ['last 2 versions', 'Explorer >= 9'],
                    cascade: false
                })
            )
            .pipe(gulp.dest(output_paths.styles))
            .pipe(reload({stream:true}));

    });

    gulp.task('img', function() {

        return gulp.src( input_paths.images )
            .pipe(imagemin())
            .pipe( rename( function ( path ) {
                path.dirname += '/min';
            }))
            .pipe( gulp.dest( output_paths.images ) )
            .pipe( notify({ message: 'Image minification complete!' }) );

    });

    gulp.task('min-scripts', function() {

        return gulp.src(input_paths.scripts)
            .pipe(concat('allthe.js'))
            .pipe(gulp.dest(buildPath))
            .pipe(uglify( uglify_options ))
            .pipe(gulp.dest(buildPath));

    });

    gulp.task('min-styles', function() {

        return gulp.src(input_paths.styles)
            .pipe(scss(scss_options))
            .pipe(concat('allthe.css'))
            .pipe(gulp.dest(buildPath));

    });


    gulp.task('default', ['sass', 'browser-sync'], function() {
        gulp.watch(input_paths.styles, ['sass', 'build']);
        gulp.watch([template_paths.twig, template_paths.html], ['reload']);
        gulp.watch(input_paths.scripts, ['build']);
    });

    gulp.task('build', ['min-styles', 'min-scripts']);

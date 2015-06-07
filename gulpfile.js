// To log, use process.stdout.write
// Can use gulp-load-plugin

var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    // less = require('gulp-less-sourcemap'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concatenate = require('gulp-concat'),
    header = require('gulp-header'),
    replace = require('gulp-replace'),
    base64 = require('gulp-base64'),
    fs = require('fs'),
    del = require('del');

var date = new Date();
var year = date.getFullYear();

var header_message  = '<!-- Built ' + date + '\n';
    header_message += '     (c) ' + year + ' Nikhil Anand, nikhil.io\n';
    header_message += '     Please don\'t steal. -->\n';

var destination = 'dist/'

var files = {
    templates: [
        'src/templates/base.jade'
    ],
    styles: [
        'src/styles/base.less'
    ],
    scripts: [
        'src/scripts/base.coffee'
    ]
}

// Clean the output folder
gulp.task('clean', function(){
    del(destination + '*');
});

// Templates
gulp.task('templates', ['scripts', 'styles'], function() {
    return gulp.src(files.templates)
               .pipe(jade({pretty: true}))
               .pipe(header(header_message))
               .pipe(rename('log.nikhil.io.html'))

               /* Inline Javascript */
               .pipe(replace(/<script type="application\/javascript" src="log.nikhil.io.js"[^>]*><\/script>/, function(s) {
                    var script = fs.readFileSync('dist/log.nikhil.io.js', 'utf8');
                    return '<script type="text\/javascript">\n' + script + '\n</script>';
                }))

               /* Inline CSS */
               .pipe(replace(/<link rel="stylesheet" href="log.nikhil.io.css"[^>]*>/, function(s) {
                    var style = fs.readFileSync('dist/log.nikhil.io.css', 'utf8');
                    return '<style type="text/css">\n' + style + '\n</style>';
                }))
               .pipe(gulp.dest(destination));
});

// Styles
gulp.task('styles', function(){
    return gulp.src(files.styles)
               .pipe(less())
               .pipe(base64())
               // .pipe(cssmin())
               .pipe(rename('log.nikhil.io.css'))
               .pipe(gulp.dest(destination));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(files.scripts)
               .pipe(coffee())
               .pipe(uglify())
               .pipe(concatenate('log.nikhil.io.js'))
               .pipe(gulp.dest(destination));
});

// Watcher
gulp.task('watch', ['templates', 'styles', 'scripts'], function() {
    gulp.watch(files.templates, ['templates']);
    gulp.watch(files.styles, ['styles', 'templates']);
    gulp.watch(files.scripts, ['scripts', 'templates']);
});

// Start gulping!
gulp.task('default', ['clean', 'templates', 'styles', 'scripts']);


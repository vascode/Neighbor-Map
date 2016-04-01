var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename');

gulp.task('scripts', function(){
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function(){
    return gulp.src('css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('style.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function(){
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('css/**/*.css', ['minify-css']);
});

gulp.task('default', ['scripts', 'minify-css']);

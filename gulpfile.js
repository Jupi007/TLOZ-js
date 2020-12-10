var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');

gulp.task('build-js', function(){
	return gulp.src('src/js/**/*.js')

	.pipe(concat('main.js'))

	.pipe(gulp.dest('build'));
});

gulp.task('watch',  function() {
	browserSync.init({
		proxy: {
	        target: "localhost"
	    }
	});
    gulp.watch('src/js/**/*.js', gulp.series('default')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build-js'));

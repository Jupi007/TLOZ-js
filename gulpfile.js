var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');

gulp.task('build-ts', function(){
	return gulp.src('src/ts/**/*.ts')

    .pipe(typescript({
        target: 'ES6'
    }))
	.pipe(concat('main.js'))

	.pipe(gulp.dest('build'));
});

gulp.task('watch',  function() {
	browserSync.init({
		proxy: {
	        target: 'localhost'
	    }
	});
    gulp.watch('src/ts/**/*.ts', gulp.series('default')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build-ts'));

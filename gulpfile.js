var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');

gulp.task('build-ts', function(){
	return gulp.src('src/ts/**/*.ts')

    .pipe(typescript({
        target: 'es2020',
        moduleResolution: "node"
    }))

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

var gulp = require("gulp");
var sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css");
var connect = require("gulp-connect");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var sourceMap = require("gulp-sourcemaps");
var imageMin = require("gulp-imagemin");
var imageResize = require("gulp-image-resize")

function processHTML() {
	return gulp.src("src/html/**/*.html")
		.pipe(gulp.dest("dist/"))
		.pipe(connect.reload());
}

function processSass() {
	return gulp.src("src/sass/**/*.scss")
		.pipe(sourceMap.init())
		.pipe(sass())
		.pipe(cleanCSS({ compatibility: "ie9" }))
		.pipe(sourceMap.write("."))
		.pipe(gulp.dest("dist/assets/css"))
		.pipe(connect.reload());
}

function processJs(){
	return gulp.src("src/js/**/*.js")
	.pipe(sourceMap.init())
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(concat("app.js"))
	.pipe(sourceMap.write("."))
	.pipe(gulp.dest("dist/assets/js"))
	.pipe(connect.reload());
}

function processImages(){
	return gulp.src("src/images/**/*", "!src/images/**/thumb.db")
	.pipe(imageResize({
		width : 3000,
		crop : false,
		upscale : false
	  }))
	.pipe(imageMin([
		imageMin.mozjpeg({ quality: 75 }),
		imageMin.optipng({ optimizationLevel: 1 })
	]))
	
	.pipe(gulp.dest("dist/assets/media"))
	.pipe(connect.reload())
}
function watch() {
	gulp.watch("src/sass/**/*.scss",
	{ ignoreInitial: false },
	processSass);
	gulp.watch("src/html/**/*.html",
	{ ignoreInitial: false },
	processHTML);
	gulp.watch("src/js/**/*.js",
	{ ignoreInitial: false },
	processJs);
	gulp.watch("src/js/**/*",
	{ ignoreInitial: false },
	processImages);
}

function server() {
  return connect.server({
    root: 'dist',
    livereload: true
  });
}

gulp.task("default", gulp.parallel(server, watch));

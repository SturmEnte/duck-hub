const { task, series, src, dest } = require("gulp");
const compressJs = require("gulp-uglify");
const compressCss = require("gulp-uglifycss");
const compressHTMl = require("gulp-htmlmin");
const compressImages = require("gulp-imagemin");
const del = require("del");

// Build Server
async function clearServerBuild() {
	await del("./build/server");
}

async function copyServer() {
	await src("server/json/**/*").pipe(dest("build/server/json"));
	await src("server/licenses/**/*").pipe(dest("build/server/licenses"));
	await src("server/src/models/**/*").pipe(dest("build/server/src/models"));
	await src("server/src/routes/**/*").pipe(dest("build/server/src/routes"));
	await src("server/src/util/**/*").pipe(dest("build/server/src/util"));
	await src("server/src/public/plugins/**/*").pipe(dest("build/server/src/public/plugins"));
	await src("server/src/public/vendor/**/*").pipe(dest("build/server/src/public/vendor"));
	await src("server/src/public/fonts/**/*").pipe(dest("build/server/src/public/fonts"));
	await src("server/src/public/manifest.json").pipe(dest("build/server/src/public"));
	await src("server/src/main.js").pipe(dest("build/server/src"));
	await src("server/README.md").pipe(dest("build/server"));
	await src("server/package*.json").pipe(dest("build/server"));
}

async function compressAndCopyJs() {
	await src("server/src/public/js/**/*.js")
		.pipe(compressJs({ compress: true }))
		.pipe(dest("build/server/src/public/"));
}

async function compressAndCopyCss() {
	await src("server/src/public/css/**/*.css")
		.pipe(compressCss())
		.pipe(dest("build/server/src/public/css"));
}

async function compressAndCopyHTML() {
	await src("server/src/public/html/**/*.html")
		.pipe(
			compressHTMl({
				collapseWhitespace: true,
				removeComments: true,
				useShortDoctype: true,
			})
		)
		.pipe(dest("build/server/src/public/html"));

	await src("server/src/views/**/*.html")
		.pipe(
			compressHTMl({
				collapseWhitespace: true,
				removeComments: true,
				useShortDoctype: true,
			})
		)
		.pipe(dest("build/server/src/views"));
}

async function compressAndCopyImages() {
	await src("server/src/public/icons/**/*")
		.pipe(compressImages())
		.pipe(dest("build/server/src/public/icons"));

	await src("server/src/public/img/**/*")
		.pipe(compressImages())
		.pipe(dest("build/server/src/public/img"));
}

// Tasks
task("server", series(clearServerBuild, copyServer, compressAndCopyJs, compressAndCopyCss, compressAndCopyHTML, compressAndCopyImages));

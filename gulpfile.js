import gulp from 'gulp';
import * as dartSass from 'sass';  // 최신 방식으로 sass 가져오기
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import browsersync from 'browser-sync';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);
const browserSync = browsersync.create();

// Paths
const paths = {
    scss: {
        src: './scss/**/*.scss',
        dest: './css/'
    }
};

// Compile SCSS to CSS
function style() {
    return gulp
        .src(paths.scss.src)
        .pipe(sass().on('error', sass.logError))  // Compile SCSS
        .pipe(autoprefixer({  // Add vendor prefixes
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(cleanCSS())  // Minify CSS
        .pipe(rename({ suffix: '.min' }))  // Rename to *.min.css
        .pipe(gulp.dest(paths.scss.dest))  // Save to destination
        .pipe(browserSync.stream());  // Stream changes to all browsers
}

// Watch for changes
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(paths.scss.src, style);  // Watch SCSS files
    gulp.watch('./*.html').on('change', browserSync.reload);  // Watch HTML files
}

// Define complex tasks
const watch = gulp.series(style, watchFiles);

// Export tasks
export { style, watch };
export default watch;
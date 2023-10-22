import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import nodeSass from 'sass'
import nunjucksRender from 'gulp-nunjucks-render'
import webpack from 'webpack-stream'
import browsersync from 'browser-sync'

const sass = gulpSass(nodeSass)
browsersync.create()

const browserSync = () => {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    notify: false,
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', function (req, res) {
          res.writeHead(302, {
            location: 'error.html',
          })
          res.end('Redirecting!')
        })
      },
    },
  })

  gulp.watch('./dist', browserSync.reload)
}

const html = () => {
  return gulp
    .src('./src/njk/**/*.njk')
    .pipe(
      nunjucksRender({
        path: ['src/njk/layout/', 'src/njk/components/'],
      })
    )
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.stream())
}

const style = () => {
  return gulp
    .src('./src/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.stream())
}

const script = () => {
  return gulp
    .src('./src/js/main.js')
    .pipe(
      webpack({
        mode: 'development',
        output: {
          filename: 'main.js',
        },
      })
    )
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.stream())
}

const image = () => {
  return gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img'))
}

const font = () => {
  return gulp.src('./src/font/**/*').pipe(gulp.dest('./dist/font/'))
}

const resource = () => {
  return gulp.src('./src/resource/**/*').pipe(gulp.dest('./dist/'))
}

export { html, style, script, image, font, browserSync }

export default () => {
  html()
  style()
  script()
  image()
  font()
  resource()
  browserSync()
  gulp.watch('./src/njk/**/*.njk', html)
  gulp.watch('./src/scss/**/*.scss', style)
  gulp.watch('./src/js/**/*.js', script)
  gulp.watch('./src/img/**/*', image)
  gulp.watch('./src/font/**/*', font)
  gulp.watch('./src/resource/**/*', resource)
}

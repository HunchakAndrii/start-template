import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import nodeSass from 'sass'
import pug from 'gulp-pug'
import webpack from 'webpack-stream'
import esbuild from 'gulp-esbuild'
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
        console.log(bs.options.get('urls'))
        bs.addMiddleware('*', function (req, res) {
          res.writeHead(302, {
            location: '404.html',
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
    .src('./src/pug/page/*.pug')
    .pipe(
      pug({
        pretty: true,
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
  return (
    gulp
      .src('./src/js/main.js')
      .pipe(
        esbuild({
          outfile: 'main.js',
          bundle: true,
        })
      )
      // .pipe(
      //   webpack({
      //     mode: 'development',
      //     output: {
      //       filename: 'main.js',
      //     },
      //   })
      // )
      .pipe(gulp.dest('./dist'))
      .pipe(browsersync.stream())
  )
  // return gulp
  //   .src('./src/ts/main.ts')
  //   .pipe(
  //     esbuild({
  //       outfile: 'main.js',
  //       bundle: true
  //     })
  //   )
  //   .pipe(gulp.dest('./dist'))
  //   .pipe(browsersync.stream())
}

const image = () => {
  return gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img'))
}

const font = () => {
  return gulp.src('./src/font/**/*').pipe(gulp.dest('./dist/font/'))
}

export { html, style, script, image, font, browserSync }

export default () => {
  html()
  style()
  script()
  image()
  font()
  browserSync()
  gulp.watch('./src/pug/**/*.pug', html)
  gulp.watch('./src/scss/**/*.scss', style)
  gulp.watch('./src/js/**/*.js', script)
  gulp.watch('./src/img/**/*', image)
  gulp.watch('./src/font/**/*', font)
}

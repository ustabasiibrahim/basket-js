/* Gulp modülünü yüklüyoruz */
var gulp = require('gulp')
/* Watch modunda çalışırken hata oluştuğunda Gulp'ın otomatik olarak kapanmasını engelleme modülünü yüklüyoruz */
var plumber = require('gulp-plumber')
/* CSS ve JS dosyaları için source map oluşturma modülünü yüklüyoruz */
var sourcemaps = require('gulp-sourcemaps')
/* SCSS dosyalarını compile etme modülünü yüklüyoruz */
var sass = require('gulp-sass')
/* Sunucu oluşturma ve dosya değişimlerinde tarayıcıya yenileme komutu gönderme modülünü yüklüyoruz */
var prefix = require('gulp-autoprefixer')

/* Sunucu oluşturma ve dosya değişimlerinde tarayıcıya yenileme komutu gönderme modülünü yüklüyoruz */
var rename = require('gulp-rename')
var iconfont = require('gulp-iconfont')
var iconfontCss = require('gulp-iconfont-css')

var path = {
    scss: { source: './assets/scss/**/**.scss', target: './assets/css/' }
}

/* SCSS dosyalarını compile ve minify edip, source map'lerini oluşturma görevini tanımlıyoruz */
gulp.task('scss', function () {
    /* SCSS dosyalarının yolunu gösteriyoruz */
    gulp.src(path.scss.source)
    /* Hata oluştuğunda Gulp'ın otomatik olarak kendisini kapatmasını engelliyoruz */
        .pipe(plumber())
        /* Source map oluşturma zincirini başlatıyoruz */
        .pipe(sourcemaps.init())
        /* Tarayıcı uyumlulukları için auto prefixer */
        //.pipe(prefix())
        /* SCSS dosyalarını compile ve minify edip, CSS dosyaları üretiyoruz */
        .pipe(sass({ outputStyle: 'compressed' }))
        // /* CSS dosyalarının uzantılarını değiştiriyoruz */
        .pipe(rename({ extname: '.css' }))
        /* Source map dosyalarını kaydediyoruz */
        .pipe(sourcemaps.write('.'))
        /* CSS dosyalarını kaydediyoruz */
        .pipe(gulp.dest(path.scss.target))
})

gulp.task('watch', function () {
    /* SCSS dosyalarını dinleyip, değişimleri sonrasında `scss` görevini çalıştırıyoruz */
    gulp.watch(path.scss.source, ['scss'])
})

gulp.task('default', ['scss','watch'])

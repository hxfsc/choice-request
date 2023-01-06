import gulp from "gulp"
import { resolve } from "path"
import { deleteSync } from "del"

const { src, dest, series, watch } = gulp
import shell from "gulp-shell"

const source = "src"
const dist = "dist"

function assets(cb) {
  src(resolve("manifest.json")).pipe(dest(resolve(dist)))
  src(resolve("popup/popup.png")).pipe(dest(resolve(dist, "popup/")))
  cb()
}

function clean(cb) {
  deleteSync([dist])
  cb()
}

function html(cb) {
  cb()
}

function css(cb) {
  cb()
}

function javascript(cb) {
  cb()
}

function viteBuild(cb) {
  shell.task("npm run build", {
    verbose: true,
    quiet: true,
    ignoreErrors: () => {
      console.log("1111")
    }
  })
  cb()
}

export const build = series(clean, viteBuild, assets)

export const watcher = () => {
  watch(resolve(source, "**"), build)
  //   watch(resolve(source, "*/*.js"), series(javascript))
  //   watch(resolve(source, "*/*.html"), series(html))
}
export default series(assets)

import path from "path"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"

const ROOT_DIR = path.resolve(__dirname, `../../`)
const OUT_DIR = path.resolve(ROOT_DIR, `build`)
const SRC_DIR = path.resolve(ROOT_DIR, `src/main/js`)

export default {
  input: {
    include: `${SRC_DIR}/**/*.js`
  }
, output: {
    file: `${OUT_DIR}/scriptex.js`
  , format: "iife"
  , banner: "/* Scriptex 0.0.1 */"
  , footer: "/* ////////////// */"
  }
, plugins: [
    includePaths({
      paths: [
        SRC_DIR
      ]
    })
  , multiEntry({
      exports: true
    })
  ]
}

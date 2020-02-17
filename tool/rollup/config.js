import pkg from "../../package.json"
import path from "path"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"

const ROOT_DIR = path.resolve(__dirname, `../../`)
const OUT_DIR = path.resolve(ROOT_DIR, `build`)
const SRC_DIR = path.resolve(ROOT_DIR, `src/main/js`)

export default {
  input: {
    include: `${SRC_DIR}/**/*.js`
  },
  output: {
    file: `${OUT_DIR}/scriptex-${pkg.version}.js`,
    format: "esm"
  },
  plugins: [
    includePaths({
      paths: [SRC_DIR]
    })
  , multiEntry({
      exports: true
    })
  ]
}

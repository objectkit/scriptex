import pkg from "../../package.json"
import path from "path"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"
import {terser} from "rollup-plugin-terser"

// TODO consider `process.chdir("../../")` instead
const ROOT_DIR = path.resolve(__dirname, `../../`)
const OUT_DIR = path.resolve(ROOT_DIR, `build`)
const SRC_DIR = path.resolve(ROOT_DIR, `src/main/js`)

export default {

  /* @see https://rollupjs.org/guide/en/#input */
  input: {
    include: [
      /*
       * Path to the custom non-executable library MANIFEST file
       * It is a simple linking file that details the libraries
       * exports and nothing more.
       * @see Java MANIFEST
       * @see HTML5 CACHE MANIFEST
       */
      `${ROOT_DIR}/tool/rollup/MANIFEST`

      /*
       * Glob defining paths to legitimate source files
       */
    , `${SRC_DIR}/**/*.js`
    ]
  },

  /* @see https://rollupjs.org/guide/en/#output */
  output: {
    file: `${OUT_DIR}/scriptex-${pkg.version}.js`,
    format: "esm",
    /* @see https://rollupjs.org/guide/en/#outputinterop */
    // interop: false,
    plugins: [
      /* @see https://github.com/terser/terser#minify-options */
      terser({
        keep_classnames: true,
        safari10: true
      })
    ]
  },

  /* @see https://rollupjs.org/guide/en/#plugins */
  plugins: [

    /* @see https://github.com/dot-build/rollup-plugin-includepaths */
    includePaths({
      paths: [ SRC_DIR ]
    }),

    /* @see https://github.com/rollup/plugins/tree/master/packages/multi-entry */
    multiEntry({
      exports: true
    }),
  ]
}

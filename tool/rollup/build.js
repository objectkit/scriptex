/* @todo use environmental var to disable terser during development due to BAD PERFORMANCE */
/* @todo DECIDE src directory and associated globs to src/main|test/js OR src/main|test */
import pkg from "../../package.json"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"
// import { terser } from "rollup-plugin-terser"
let terser = () => {}

let buildRelease =
  {
    input: [
      `tool/rollup/index.js`,
      `src/main/js/**/*.js`
    ],
    output: {
      file: `${pkg.exports}`,
      format: "esm"
    },
    plugins: [
      includePaths({
        paths: [
          `src/main/js`
        ]
      }),
      multiEntry({
        exports: true
      }),
      terser({
        mangle: {
          safari10: true
        , keep_classnames: true
        , properties: {
            regex: /^_|_$/
          }
        }
      })
    ]
  }
;
let buildTest = {
  input: [
    `tool/rollup/index.test.js`,
    `src/main/js/**/*.js`,
    `src/test/js/**/*.js`
  ],
  output: {
    // file: `build/${pkg.name}/${pkg.version}/${pkg.name}-test.js`,
    file: `${pkg.exports}/../${pkg.name}-test.js`,
    format: "cjs"
  },
  plugins: [
    includePaths({
      paths: [
        `src/main/js`,
        `src/test/js`
      ]
    }),
    multiEntry({
      exports: true
    }),
    terser(
      {
        mangle: {
          safari10: true
        , properties: {
            regex: /^_|_$/
          }
        }
      }
    )
  ]
}

export default [buildRelease, buildTest]

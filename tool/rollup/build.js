import pkg from "../../package.json"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"
/* disable terser during development due to BAD PERFORMANCE */
// import { terser } from "rollup-plugin-terser"
let terser = () => {}

let buildRelease =
  {
    input: [
      `tool/rollup/index.js`,
      `src/main/js/**/*.js`
    ],
    output: {
      file: `build/${pkg.name}/${pkg.version}/${pkg.name}.js`,
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
    file: `build/${pkg.name}/${pkg.version}/${pkg.name}-test.js`,
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

/* @todo use environmental var to disable terser during development due to BAD PERFORMANCE */
import pkg from "../../package.json"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"
import { terser } from "rollup-plugin-terser"

const MINIFY = !(process.env.npm_config_MINIFIER_OFF)
const BANNER = `/* Scriptex v${pkg.version} (c) ObjectKit 2020 | license: Apache-2.0 */`
const FOOTER = `/* @todo implement MIDI processor with the Scriptex library */\n`

let buildRelease =
  {
    input: [
      `tool/rollup/index.js`,
      `src/main/js/**/*.js`
    ],
    output: {
      file: `out/scriptex.js`,
      format: "esm"
    },
    cache: true,
    plugins: [
      includePaths({
        paths: [
          `src/main/js`
        ]
      }),
      multiEntry({
        exports: true
      }),
      MINIFY && terser({
        mangle: {
          safari10: true
        , keep_classnames: true
        , properties: {
            regex: /^_|_$/
          }
        }
      , format: {
          preamble: BANNER
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
    file: `out/scriptex.test.js`,
    format: "cjs"
  },
  cache: true,
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
    MINIFY && terser(
      {
        mangle: {
          safari10: true
        , properties: {
            regex: /^_|_$/
          }
        }
      , keep_classnames: true
      , format: {
          preamble: BANNER
        }
      }
    )
  ]
}
let buildRuntime = Object.assign(
  Object.create(null)
, buildRelease
, {
    output: {
      file: `out/scriptex.preset.js`,
      format: "iife",
      name: `scriptex`
    }
  }
)
export default [
  buildRelease
, buildRuntime
, buildTest
]

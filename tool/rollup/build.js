import pkg from "../../package.json"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"
import { terser } from "rollup-plugin-terser"
import removeExports from "./plugin/removeExports"

/* conditional terser compression */
const MINIFY = !(process.env.npm_config_MINIFIER_OFF)

/* @see presetConf */
/* @see releaseConf */
/* @see testConf */
const multiEntryConf = {
  exports: true
}

/* @see presetConf */
/* @see releaseConf */
const includePathsConf = {
  paths: [
    `src/main/js`
  ]
}

/* @see releaseConf */
/* @see presetConf */
/* @see testConf */
const terserConf = {
  mangle: {
    safari10: true,
    keep_classnames: true,
    reserved: [`Scripter`],
    properties: {
      regex: /^_|_$/
    }
  },
  format: {
    preamble: `/* Scriptex v${pkg.version} (c) ObjectKit 2020 | license: Apache-2.0 */`
  }
}

/**
 * The release build configuration
 * @type {Object}
 */
const releaseConf = {
  input: [
    `tool/rollup/index.js`,
    `src/main/js/**/*.js`
  ],
  output: {
    file: `out/scriptex.js`,
    format: "es"
  },
  cache: true,
  plugins: [
    includePaths(includePathsConf),
    multiEntry(multiEntryConf),
    MINIFY && terser(terserConf)
  ]
};

/**
 * The test build configuration
 * @type {Object}
 */
const testConf = {
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
    multiEntry(multiEntryConf),
    MINIFY && terser(terserConf)
  ]
}

/**
 * The "preset" build configuration.
 *
 * This build defines the Scriptex library in the global scope.
 * The intention is that the contents of this file will be used
 * to create a template preset in the Scripter plugin.
 * @type {Object}
 */
const presetConf = {
  input: [
    `tool/rollup/index.js`,
    `src/main/js/**/*.js`
  ],
  output: {
    file: `out/scriptex.preset.js`,
    format: "es"
  },
  cache: true,
  plugins: [
    includePaths(includePathsConf)
  , multiEntry(multiEntryConf)
  , (MINIFY && terser(terserConf))
  , removeExports()
  ]
}

export default [
  releaseConf, presetConf, testConf
]

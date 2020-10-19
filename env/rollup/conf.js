import pkg from "../../package.json"
import includePaths from "rollup-plugin-includepaths"
import multiEntry from "@rollup/plugin-multi-entry"
import { terser } from "rollup-plugin-terser"
import replaceExportStatement from "./plugin/replaceExportStatement"

/* conditional terser compression */
const MINIFY = !(process.env.npm_config_MINIFIER_OFF)

/*
 * @see presetConf
 * @see releaseConf
 * @see testConf
 */
const multiEntryConf = {
  exports: true
}

/*
 * @see presetConf
 * @see releaseConf
 */
const includePathsConf = {
  paths: [
    `src/main/js`
  ]
}

/*
 * @see releaseConf
 * @see presetConf
 * @see testConf
 */
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
    `tool/rollup/manifest/index.js`,
    `src/main/js/**/*.js`
  ],
  output: {
    file: process.env.npm_package_main,
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
 * The "preset" build configuration.
 *
 * This build defines the Scriptex library in the global scope
 * for deployment to the Scripter Code Editor.
 *
 * @see lib/scriptex.preset.js
 * @type {Object}
 */
const presetConf = {
  input: [
    `tool/rollup/manifest/index.js`,
    `src/main/js/**/*.js`
  ],
  output: {
    file: process.env.npm_package_unpkg,
    format: "es"
  },
  cache: true,
  plugins: [
    includePaths(includePathsConf)
  , multiEntry(multiEntryConf)
  , (MINIFY && terser(terserConf))
  , replaceExportStatement(`
/* @todo custom midi processor */
Scripter.Trace("\\n> Scriptex v${pkg.version}\\n")`)
  ]
}

export default [
  releaseConf, presetConf
]

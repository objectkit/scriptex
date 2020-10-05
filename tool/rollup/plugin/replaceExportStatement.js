const EXPORTS_PATTERN = /export\s?{\s*.+};/
const BUNDLE_ID = `scriptex.preset.js`

/**
 * Replace and export statement with a comment
 * @return {Object} The rollup plugin configuratino
 */
export default function replaceExportStatement (replacementText="") {
  return {
    name: `rollup-remove-exports-plugin`
  , generateBundle (opts, bundle) {
      const asset = bundle[BUNDLE_ID]
      asset.code = asset.code.replace(EXPORTS_PATTERN, replacementText)
      return
    }
  }
}

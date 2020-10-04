const EXPORTS_PATTERN = /export\s?{\s*.+};/
const FOOTER_TEXT = `\n/** @todo bespoke midi processor */\n\n`
const BUNDLE_ID = `scriptex.preset.js`

/**
 * Replace and export statement with a comment
 * @return {Object} The rollup plugin configuratino
 */
export default function replaceExportStatement (replacementText=FOOTER_TEXT) {
  return {
    name: `rollup-remove-exports-plugin`
  , generateBundle (opts, bundle) {
      const asset = bundle[BUNDLE_ID]
      asset.code = asset.code.replace(EXPORTS_PATTERN, replacementText)
      return
    }
  }
}

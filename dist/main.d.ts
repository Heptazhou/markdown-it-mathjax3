import type MarkdownIt from "markdown-it"
import "@mathjax/src/js/util/asyncLoad/esm.js"
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js"
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js"
import "@mathjax/src/js/input/tex/mhchem/MhchemConfiguration.js"
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js"
import "@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js"
declare function plugin(md: MarkdownIt, options: any): void
export default plugin

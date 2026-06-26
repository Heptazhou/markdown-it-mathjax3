import { AssistiveMmlHandler } from "@mathjax/src/js/a11y/assistive-mml.js"
import { liteAdaptor } from "@mathjax/src/js/adaptors/liteAdaptor.js"
import { mathjax } from "@mathjax/src/js/mathjax.js"
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js"
import { SVG } from "@mathjax/src/js/output/svg.js"
import { TeX } from "@mathjax/src/js/input/tex.js"
import juice from "juice"
import "@mathjax/src/js/util/asyncLoad/esm.js"
const AllPackages = ["base", "ams", "mhchem", "newcommand", "noundefined"]
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js"
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js"
import "@mathjax/src/js/input/tex/mhchem/MhchemConfiguration.js"
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js"
import "@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js"
function renderMath(content, documentOptions, convertOptions) {
	const adaptor = liteAdaptor()
	const handler = RegisterHTMLHandler(adaptor)
	AssistiveMmlHandler(handler)
	const mathDocument = mathjax.document(content, documentOptions)
	const html = adaptor.outerHTML(
		mathDocument.convert(content, convertOptions),
	)
	const css = adaptor.outerHTML(
		documentOptions.OutputJax.styleSheet(mathDocument),
	)
	const ret = juice(css + html, {
		preserveFontFaces: false,
		preserveMediaQueries: false,
	})
	return ret
}
function isValidDelim(state, pos) {
	let max = state.posMax,
		can_open = true,
		can_close = true
	const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1,
		nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1
	if (
		prevChar === 0x20 ||
		prevChar === 0x09 ||
		(nextChar >= 0x30 && nextChar <= 0x39)
	) {
		can_close = false
	}
	if (nextChar === 0x20 || nextChar === 0x09) {
		can_open = false
	}
	return {
		can_open: can_open,
		can_close: can_close,
	}
}
function math_inline(state, silent) {
	if (state.src[state.pos] !== "$") {
		return false
	}
	let res = isValidDelim(state, state.pos)
	if (!res.can_open) {
		if (!silent) {
			state.pending += "$"
		}
		state.pos += 1
		return true
	}
	const start = state.pos + 1
	let match = start
	while ((match = state.src.indexOf("$", match)) !== -1) {
		let pos = match - 1
		while (state.src[pos] === "\\") {
			pos -= 1
		}
		if ((match - pos) % 2 == 1) {
			break
		}
		match += 1
	}
	if (match === -1) {
		if (!silent) {
			state.pending += "$"
		}
		state.pos = start
		return true
	}
	if (match - start === 0) {
		if (!silent) {
			state.pending += "$$"
		}
		state.pos = start + 1
		return true
	}
	res = isValidDelim(state, match)
	if (!res.can_close) {
		if (!silent) {
			state.pending += "$"
		}
		state.pos = start
		return true
	}
	if (!silent) {
		const token = state.push("math_inline", "math", 0)
		token.markup = "$"
		token.content = state.src.slice(start, match)
	}
	state.pos = match + 1
	return true
}
function math_block(state, start, end, silent) {
	let next, lastPos
	let found = false,
		pos = state.bMarks[start] + state.tShift[start],
		max = state.eMarks[start],
		lastLine = ""
	if (pos + 2 > max) {
		return false
	}
	if (state.src.slice(pos, pos + 2) !== "$$") {
		return false
	}
	pos += 2
	let firstLine = state.src.slice(pos, max)
	if (silent) {
		return true
	}
	if (firstLine.trim().slice(-2) === "$$") {
		firstLine = firstLine.trim().slice(0, -2)
		found = true
	}
	for (next = start; !found; ) {
		next++
		if (next >= end) {
			break
		}
		pos = state.bMarks[next] + state.tShift[next]
		max = state.eMarks[next]
		if (pos < max && state.tShift[next] < state.blkIndent) {
			break
		}
		if (state.src.slice(pos, max).trim().slice(-2) === "$$") {
			lastPos = state.src.slice(0, max).lastIndexOf("$$")
			lastLine = state.src.slice(pos, lastPos)
			found = true
		}
	}
	state.line = next + 1
	const token = state.push("math_block", "math", 0)
	token.block = true
	token.content =
		(firstLine && firstLine.trim() ? firstLine + "\n" : "") +
		state.getLines(start + 1, next, state.tShift[start], true) +
		(lastLine && lastLine.trim() ? lastLine : "")
	token.map = [start, state.line]
	token.markup = "$$"
	return true
}
function plugin(md, options) {
	const documentOptions = {
		InputJax: new TeX({ packages: AllPackages, ...options?.tex }),
		OutputJax: new SVG({ font: "mathjax-tex", ...options?.svg }),
	}
	const convertOptions = {
		display: false,
	}
	md.inline.ruler.after("escape", "math_inline", math_inline)
	md.block.ruler.after("blockquote", "math_block", math_block, {
		alt: ["paragraph", "reference", "blockquote", "list"],
	})
	md.renderer.rules["math_inline"] = function (tokens, idx) {
		convertOptions.display = false
		return renderMath(tokens[idx].content, documentOptions, convertOptions)
	}
	md.renderer.rules["math_block"] = function (tokens, idx) {
		convertOptions.display = true
		return renderMath(tokens[idx].content, documentOptions, convertOptions)
	}
}
export default plugin

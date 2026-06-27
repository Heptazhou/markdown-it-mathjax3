#	markdown-it-mathjax3
`markdown-it` plugin for LaTeX rendering, based on MathJax v4.

*****
##	Install
Add the following to your [`package.json`](package.json).
```json
{
	"pnpm": {
		"overrides": {
			"encoding-sniffer": "^1",
			"markdown-it-mathjax3": "github:Heptazhou/markdown-it-mathjax3#v4.4.2"
		},
		"packageExtensions": {
			"@mathjax/mathjax-newcm-font": {
				"peerDependencies": {
					"@mathjax/src": "*"
				}
			}
		}
	}
}
```
```shell
pnpm add -D github:Heptazhou/markdown-it-mathjax3
pnpm up
```
See also [pnpm v11 changelog](https://github.com/pnpm/pnpm/blob/v11.0.0/pnpm/CHANGELOG.md#configuration), as:
> pnpm no longer reads settings from the `pnpm` field of `package.json`.

*****
##	Usage
```ts
import Markdown from "markdown-it"
import mathjax3 from "markdown-it-mathjax3"

const md = Markdown().use(mathjax3)
// md.render("")
// md.renderInline("")
```

To use with VitePress, simply add the following to your `.vitepress/config.ts`.
```ts
import { defineConfig } from "vitepress"

export default defineConfig({
	markdown: {
		math: true,
	},
})
```

*****
##	Reference
*	[markdown-it - Usage examples](https://github.com/markdown-it/markdown-it#usage-examples)
*	[MathJax-src (@mathjax/src)](https://github.com/mathjax/MathJax-src)
*	[VitePress - Math Equations](https://vitepress.dev/guide/markdown#math-equations)


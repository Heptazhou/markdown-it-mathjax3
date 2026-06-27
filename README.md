#	markdown-it-mathjax3
Add the following to your [`package.json`](package.json).
```json
{
	"pnpm": {
		"overrides": {
			"encoding-sniffer": "^1",
			"markdown-it-mathjax3": "github:Heptazhou/markdown-it-mathjax3#v4.4.1"
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
See also [pnpm v11 changelog](https://github.com/pnpm/pnpm/blob/v11.0.0/pnpm/CHANGELOG.md#configuration), as:
> pnpm no longer reads settings from the `pnpm` field of `package.json`.

*****
##	Install
```shell
pnpm add -D github:Heptazhou/markdown-it-mathjax3
pnpm up
```

*****
##	Usage
```ts
import Markdown from "markdown-it"
import mathjax3 from "markdown-it-mathjax3"

const md = Markdown().use(mathjax3)
// md.render("")
// md.renderInline("")
```

*****
##	Reference
*	[markdown-it](https://github.com/markdown-it/markdown-it#usage-examples)
*	[VitePress](https://vitepress.dev/guide/markdown#math-equations)


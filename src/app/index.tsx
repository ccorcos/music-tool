import { css } from "glamor"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./components/App"
import { JournalOne } from "./journal/one"

css.global("a", {
	color: "inherit",
	textDecoration: "none",
})

const root = document.createElement("div")
document.body.appendChild(root)

function render() {
	if (location.href.endsWith("#1")) {
		return ReactDOM.render(<JournalOne />, root)
	}

	ReactDOM.render(<App />, root)
}

render()

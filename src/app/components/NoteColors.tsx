import React, { CSSProperties } from "react"

export function NoteColors(props: {
	noteColors: Array<string>
	style: CSSProperties
	size: number
	containerStyle?: CSSProperties
}) {
	const { noteColors, style, size } = props
	if (noteColors.length < 2) {
		return null
	}
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
				...style,
			}}
		>
			{noteColors.map((color, i) => (
				<div
					key={color}
					style={{
						background: color,
						height: size,
						width: size,
						borderRadius: 99,
						marginLeft: i === 0 ? 0 : 1,
						marginBottom: 1,
					}}
				></div>
			))}
		</div>
	)
}

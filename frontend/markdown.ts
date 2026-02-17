import { Platform } from "react-native";

export const getStyles = (
	theme: string = "light",
	fontSize: number = 15.5,
) => {
	// --- Theme-Specific Color Definitions ---
	const isDark = theme === "dark";

	const fontColor = isDark ? "#FFFFFF" : "#000000"; // White text for dark, Black text for light
	// const bodyBg = isDark ? "#121212" : "#FFFFFF"; // Dark background for dark, White background for light

	// Secondary background for elements like code blocks and blockquotes
	const secondaryBg = isDark ? "#1E1E1E" : "#F5F5F5";

	// Border and Rule Colors (not very dark)
	const borderColor = isDark ? "#404040" : "#B0B0B0";
	const hrColor = isDark ? "#404040" : "#A0A0A0"; // Horizontal rule color

	// Link Color
	const linkColor = isDark ? "#79B8FF" : "#0366D6";

	// --- Styles Object ---
	return {
		// The main container
		body: {
			fontSize: fontSize,
			color: fontColor,
			// backgroundColor: bodyBg, // Set the main background color
		},

		// Headings
		heading1: {
			flexDirection: "row",
			fontSize: 32,
		},
		heading2: {
			flexDirection: "row",
			fontSize: 24,
		},
		heading3: {
			flexDirection: "row",
			fontSize: 18,
		},
		heading4: {
			flexDirection: "row",
			fontSize: 16,
		},
		heading5: {
			flexDirection: "row",
			fontSize: 13,
		},
		heading6: {
			flexDirection: "row",
			fontSize: 11,
		},

		// Horizontal Rule
		hr: {
			backgroundColor: hrColor, // Themed HR color
			height: 1,
		},

		// Emphasis
		strong: {
			fontWeight: "bold",
		},
		em: {
			fontStyle: "italic",
		},
		s: {
			textDecorationLine: "line-through",
		},

		// Blockquotes
		blockquote: {
			backgroundColor: secondaryBg, // Themed background
			borderColor: borderColor, // Themed border
			borderLeftWidth: 4,
			marginLeft: 5,
			paddingHorizontal: 5,
		},

		// Lists
		bullet_list: {},
		ordered_list: {},
		list_item: {
			flexDirection: "row",
			justifyContent: "flex-start",
		},
		// @pseudo class, does not have a unique render rule
		bullet_list_icon: {
			marginLeft: 10,
			marginRight: 10,
		},
		// @pseudo class, does not have a unique render rule
		bullet_list_content: {
			flex: 1,
		},
		// @pseudo class, does not have a unique render rule
		ordered_list_icon: {
			marginLeft: 10,
			marginRight: 10,
		},
		// @pseudo class, does not have a unique render rule
		ordered_list_content: {
			flex: 1,
		},

		// Code
		code_inline: {
			borderWidth: 1,
			borderColor: borderColor, // Themed border
			backgroundColor: secondaryBg, // Themed background
			padding: 10,
			borderRadius: 4,
			color: fontColor, // Ensure code text is readable
			...Platform.select({
				["ios"]: {
					fontFamily: "Courier",
				},
				["android"]: {
					fontFamily: "monospace",
				},
			}),
		},
		code_block: {
			borderWidth: 1,
			borderColor: borderColor, // Themed border
			backgroundColor: secondaryBg, // Themed background
			padding: 10,
			borderRadius: 4,
			color: fontColor, // Ensure code text is readable
			...Platform.select({
				["ios"]: {
					fontFamily: "Courier",
				},
				["android"]: {
					fontFamily: "monospace",
				},
			}),
		},
		fence: {
			borderWidth: 1,
			borderColor: borderColor, // Themed border
			backgroundColor: secondaryBg, // Themed background
			padding: 10,
			borderRadius: 4,
			color: fontColor, // Ensure code text is readable
			...Platform.select({
				["ios"]: {
					fontFamily: "Courier",
				},
				["android"]: {
					fontFamily: "monospace",
				},
			}),
		},

		// Tables
		table: {
			borderLeftWidth: 1,
			borderRightWidth: 1,
			borderTopWidth: 1,
			borderBottomWidth: 0,
			borderColor: borderColor, // Themed border
			borderRadius: 3,
		},
		thead: {},
		tbody: {},
		th: {
			flex: 1,
			padding: 5,
		},
		tr: {
			borderBottomWidth: 0.5,
			borderColor: hrColor, // Themed border for row separation
			flexDirection: "row",
		},
		td: {
			flex: 1,
			padding: 5,
		},

		// Links
		link: {
			textDecorationLine: "underline",
			color: linkColor, // Themed link color
		},
		blocklink: {
			flex: 1,
			borderColor: borderColor, // Themed border
			borderBottomWidth: 1,
		},

		// Images
		image: {
			flex: 1,
		},

		// Text Output
		text: {},
		textgroup: {},
		paragraph: {
			marginTop: 10,
			marginBottom: 10,
			flexWrap: "wrap",
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "flex-start",
			width: "100%",
		},
		hardbreak: {
			width: "100%",
			height: 1,
		},
		softbreak: {},

		// Believe these are never used but retained for completeness
		pre: {},
		inline: {},
		span: {},
	};
};
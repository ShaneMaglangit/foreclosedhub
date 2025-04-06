import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        ".storybook/preview-body.html",
    ],
    darkMode: "class",
    theme: {
        fontFamily: {
            sans: [
                "Inter",
                "ui-sans-serif",
                "system-ui",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
        },
        extend: {
            colors: {
                black: {
                    DEFAULT: "#111111",
                    muted: "#6C6D6B",
                    trace: "#BABBB7",
                },
                light: {
                    DEFAULT: "#FFFFFF",
                    muted: "#8E8E93",
                    trace: "#56575D",
                },
                border: {
                    dark: colors.gray['700'],
                    light: colors.gray['200']
                },
                primary: {
                    50: "#E7EDFF",
                    100: "#D0D8FF",
                    200: "#AAB9FF",
                    300: "#859AFF",
                    400: "#597DCE",
                    500: "#445CFF",
                    600: "#3A4CC9",
                    700: "#313DA0",
                    800: "#2830A6",
                    900: "#202780",
                },
                danger: {
                    50: "#F5E6E0",
                    100: "#F2CFC7",
                    200: "#EB9F8A",
                    300: "#E5704D",
                    400: "#DF4B1F",
                    500: "#DB3706",
                    600: "#B22E05",
                    700: "#992705",
                    800: "#7F2104",
                    900: "#661A03",
                },
                warning: {
                    50: "#F8F2E2",
                    100: "#F6E9C6",
                    200: "#F2D490",
                    300: "#EFBF5A",
                    400: "#F4B534",
                    500: "#F3A503",
                    600: "#DB9402",
                    700: "#E09423",
                    800: "#A67019",
                    900: "#735014",
                },
            },
            animation: {
                writhe: "writhe 1.5s infinite ease both",
            },
            keyframes: {
                writhe: {
                    "0%, 100%": {
                        strokeDasharray: 70,
                        strokeDashoffset: -60,
                    },
                    "50%": {
                        strokeDasharray: 70,
                        strokeDashoffset: -30,
                    },
                },
            },
            zIndex: {
                modal: "1000", // ideally always within 1000-1500 range
            },
        },
    },
    plugins: [],
};
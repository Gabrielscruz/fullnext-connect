import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: 'var(--p)', // Usa a variável CSS para a cor primária
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				warning: '#FBA94C',
				error: '#F75A68',
				'gray-100': '#E1E1E6',
				'gray-200': '#C4C4CC',
				'gray-300': '#8D8D99',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontSize: {
				'4.5xl': '40px'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("daisyui"), require("tailwindcss-animate")],
	daisyui: {
		themes: [
			{
				"fullnest-dark": {
					"base-300": "#323238",
					"base-200": "#121214",
					"base-100": "#09090A",
					"secondary": "#009bde",
					"accent": "#00ffba",
					"neutral": "#28100e",
					"info": "#81D8F7",
					"success": "#00875F",
					"warning": "#FBA94C",
					"error": "#F75A68",
				},
				"fullnest-light": {
					"base-300": "#E5E6E6",
					"base-200": "#F2F2F2",
					"base-100": "#FFFFFF",
					"secondary": "#009bde",
					"accent": "#00ffba",
					"neutral": "#28100e",
					"info": "#81D8F7",
					"success": "#00875F",
					"warning": "#FBA94C",
					"error": "#F75A68",
				}

			},
		], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "fullnest-light", // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
		themeRoot: ":root", // The element that receives theme color CSS variables
	},
};
export default config;

/** @type {import('tailwindcss').Config} */
const brandColors = require("./assets/colors");
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                brand: brandColors
            }
        },
    },
    plugins: [],
}

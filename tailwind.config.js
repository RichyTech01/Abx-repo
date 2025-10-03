/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
    "./app/**/*.{js,ts,jsx,tsx}",       
    "./components/**/*.{js,ts,jsx,tsx}", 
    "./common/**/*.{js,ts,jsx,tsx}",  
    "./Modals/**/*.{js,ts,jsx,tsx}",  
    "./app/(auth)/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       fontFamily: {
        orelega: ["OrelegaOne"], 
        "Urbanist-Light": ["UrbanistLight"],
        urbanist: ["UrbanistRegular"],
        "urbanist-medium": ["UrbanistMedium"],
        "urbanist-semibold": ["UrbanistSemiBold"],
        "urbanist-bold": ["UrbanistBold"],
      },
    },
  },
  plugins: [],
}
// UrbanistLight
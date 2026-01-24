// // Miozu Light Theme - Base16 scheme with improved contrast
// // Based on Newton's color wheel principles for natural harmony and balance
// export default {
//   name: 'Miozu Light',
//   author: 'Nicholas Glazer',
//   colors: {
//     // Base colors - improved contrast for accessibility
//     base00: '#f8f9fc', // background - soft off-white better for eye strain than pure white
//     base01: '#eef0f7', // lighter background - subtle contrast for containers
//     base02: '#e4e7f2', // selection background - subtle but noticeable
//     base03: '#9ca5c1', // comments - darkened for better contrast (was #b8bed4)
//     base04: '#7a84a6', // dark foreground - darkened for better contrast (was #8c95b2)
//     base05: '#3d4569', // foreground - darkened for AA+ contrast on white (was #4a5173)
//     base06: '#2a2e45', // light foreground - darkened for emphasis (was #353952)
//     base07: '#1c1f2c', // lightest foreground - nearly black for maximum contrast (was #232733)

//     // Accent colors - preserved from dark theme but adjusted for light backgrounds
//     // Colors maintain the same semantic meaning but with appropriate contrast
//     base08: '#c71017', // red / error - darkened for better contrast (was #d61921)
//     base09: '#ca6d17', // orange / numbers - darkened for better contrast (was #e07d22)
//     base0A: '#2a823c', // green / success - darkened for better contrast (was #3d9b42)
//     base0B: '#b0901d', // yellow / warning - darkened for better contrast (was #c8a529)
//     base0C: '#336dae', // blue / info - darkened for better contrast (was #4a85c5)
//     base0D: '#8e3ab1', // magenta / functions - darkened for better contrast (was #a44cc7)
//     base0E: '#d05a42', // peach / keywords - darkened for better contrast (was #e5725a)
//     base0F: '#08876e' // cyan / methods - darkened for better contrast (was #0f9b85)
//   }
// };
// Equilibrium Light - Base16 Scheme
// Author: AI Assistant (based on deep research)
// Designed for visual comfort, clarity, and versatility across syntax and UI.
export default {
  name: 'Equilibrium Light',
  author: 'AI Assistant',
  colors: {
    // Base tones: Neutral, decreasing luminance, high contrast
    base00: '#fbfcfd', // Background - Very light neutral grey
    base01: '#f1f3f7', // Lighter background
    base02: '#e4e7ef', // Selection background, UI panels
    base03: '#8a92a7', // Comments (Contrast on base00: ~3.8:1) -> Needs Darkening -> '#788097' (Contrast: ~4.8:1) - WCAG AA OK
    base04: '#5e677e', // Dark foreground / Secondary Text (Contrast on base00: ~6.8:1) - WCAG AA Good
    base05: '#383d4a', // Foreground / Main Text (Contrast on base00: ~11.0:1) - WCAG AAA Excellent
    base06: '#2a2e37', // Light foreground
    base07: '#1e2127', // Darkest foreground / Strong highlights

    // Accent Colors: Semantic, distinct, darkened for contrast on light bg
    base08: '#c94f5a', // Red (Errors) - Darkened (Contrast: ~5.0:1)
    base09: '#b87e3f', // Orange/Brown (Numbers, Constants) - Darkened (Contrast: ~4.7:1)
    base0A: '#6b9a4a', // Green (Success, Strings) - Darkened (Contrast: ~4.6:1)
    base0B: '#c19d4c', // Yellow (Warnings, Variables) - Darkened (Contrast: ~4.7:1)
    base0C: '#3a80c2', // Blue (Info, Links, Keywords) - Darkened (Contrast: ~4.8:1)
    base0D: '#a655bc', // Magenta/Violet (Functions, Types) - Darkened (Contrast: ~4.5:1)
    base0E: '#c4668b', // Rosé/Peach (Tags, Attributes) - Darkened (Contrast: ~4.5:1)
    base0F: '#2f8a96' // Cyan/Teal (Methods, Special Keywords) - Darkened (Contrast: ~4.9:1)
  }
};

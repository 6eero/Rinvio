/**
 * Design tokens. The app is dark-only: always use these instead of hex
 * literals in components, so the palette can be changed in one place.
 */
export const Colors = {
  // Backgrounds, from the darkest
  background: "#0d0d0d",
  header: "#151718",
  tabBar: "#121414",
  surface: "#161616", // cards, inputs, option buttons
  surfaceMuted: "#1f1f1f", // disabled inputs, secondary buttons
  surfaceRaised: "#252525", // badges, grade box
  surfaceAction: "#2c2c2c", // buttons on a surface
  surfaceSelected: "#474747",

  // Borders
  border: "#202020",
  borderSelected: "#505050",
  borderSubtle: "rgba(255,255,255,0.075)",
  divider: "#2a2a2a",

  // Text, from the brightest
  text: "#ffffff",
  textSecondary: "#cccccc",
  textLabel: "#aaaaaa",
  textMuted: "#888888",
  textFaint: "#555555",
  textOnLight: "#0d0d0d",

  // Semantic
  tint: "#ffffff",
  danger: "#ef4444",
  successBg: "#2a4a2a",
  successText: "#aaffaa",
  warningBg: "#4a3f22",
  warningText: "#ffdd99",
  failureBg: "#4a2a2a",
  failureText: "#ffaaaa",

  // Data viz
  chartBar: "#b3b3b3",
  // Perceived difficulty, from easy to hard: one color per level
  difficulty: ["#5cb85c", "#a3c94f", "#e8c547", "#e8893c", "#d9534f"],
  activity: "#ffffff",
  // How a route went, from the best to the worst (validated for color vision
  // deficiencies on the dark surface; always shown with a label too)
  outcome: {
    firstTry: "#199e70",
    redpoint: "#3987e5",
    hangdog: "#c98500",
    follow: "#9085e9",
    failure: "#e66767",
  },
  chartGrid: "#262626",
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 14,
};

export const Layout = {
  padding: 16,
};

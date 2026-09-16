// Only the truly industry-specific tokens: canvas/surface/border/status
// colors stay in globals.css, which already defines correct light AND
// dark values for them. Setting them here too would inline-style
// <html>, and inline styles beat the html[data-theme='dark'] stylesheet
// rule regardless of theme — that was silently breaking dark mode.
export const MUSIC_ORG_THEME = {
  accent: '#0eafa0',
  accentSoft: '#e6f7f4',
  accentInk: '#08796f',
};

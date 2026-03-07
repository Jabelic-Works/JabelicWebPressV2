export default defineAppConfig({
  title: "JabelicWebPress",
  ui: {
    // セマンティックカラーの割り当てだけを担当し、
    // 実際のパレット定義は app/assets/style/index.css に集約する
    colors: {
      primary: "brand",
      secondary: "accent",
      neutral: "slate",
    },
  },
});

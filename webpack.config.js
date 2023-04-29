const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  // ...other webpack configuration options...
  plugins: [new BundleAnalyzerPlugin()],
};

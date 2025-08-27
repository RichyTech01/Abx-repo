const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// get expo default config
const config = getDefaultConfig(__dirname);

// add svg transformer
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// tell metro to treat .svg as source files, not assets
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// wrap with nativewind config
module.exports = withNativeWind(config, {
  input: "./app/global.css",
});

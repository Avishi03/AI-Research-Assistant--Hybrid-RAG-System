const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

let config = getDefaultConfig(__dirname);

// Add support for .cjs files
config.resolver.sourceExts.push("cjs");

// **NEW for SDK 53:** Disable package.json:exports field for incompatible packages (like Firebase)
config.resolver.unstable_enablePackageExports = false;

// Wrap WITH NativeWind first, then wrap with Reanimated after
config = withNativeWind(config, { input: "./global.css" });
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;

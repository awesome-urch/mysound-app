// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Update the resolver configuration
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "mjs",
  "cjs",
  "jsx",
  "js",
  "ts",
  "tsx",
  "json",
];

config.watchFolders = [__dirname];
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "db",
  "mp3",
  "wav",
  "m4a",
];

// Remove this section since we're not using react-native-track-player anymore
// config.resolver.extraNodeModules = {
//   ...config.resolver.extraNodeModules,
//   'react-native-track-player': require.resolve('react-native-track-player'),
// };

module.exports = config;

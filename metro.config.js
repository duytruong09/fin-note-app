const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for axios trying to import Node crypto
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  resolveRequest: (context, moduleName, platform) => {
    // Redirect axios to use the browser version to avoid Node crypto import
    if (moduleName === 'axios') {
      return {
        filePath: require.resolve('axios/dist/browser/axios.cjs'),
        type: 'sourceFile',
      };
    }
    // Use default resolver for everything else
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;

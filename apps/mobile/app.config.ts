import type { ConfigContext, ExpoConfig } from 'expo/config'

export default function defineConfig({ config }: ConfigContext): ExpoConfig {
  // Fallback to production environment
  const appName = process.env.APP_NAME || 'SD Quick'
  const appPackageId = process.env.APP_PACKAGE_ID || 'com.curios.sd-quick'
  const appIcon = process.env.APP_ICON || './assets/brand/icon.png'
  const appAdaptiveIcon = process.env.APP_ADAPTIVE_ICON || './assets/brand/adaptive-icon.png'

  const appSplashImage = process.env.APP_SLASH_IMAGE || './assets/brand/splash-icon.png'

  const expoProjectId = process.env.EXPO_PROJECT_ID || ''

  return {
    ...config,
    // App details
    name: appName,
    version: '0.1.0',
    slug: 'sd-quick',
    scheme: 'sd-quick',
    description: 'A Quick app to make working shaladarpan easier',
    orientation: 'portrait',
    icon: appIcon,
    splash: {
      image: appSplashImage,
      resizeMode: 'contain',
    },
    userInterfaceStyle: 'automatic',

    // Platform specific
    android: {
      package: appPackageId,
      adaptiveIcon: {
        foregroundImage: appAdaptiveIcon,
        backgroundColor: '#FFFFFF',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    ios: {
      supportsTablet: true,
    },

    // Settings
    experiments: {
      reactCompiler: true,
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: expoProjectId,
      },
    },
    githubUrl: 'https://github.com/curiosbasant/sd-quick.git',
    // Required to auto build by expo for this "extra.eas.projectId"
    owner: 'curiosbasant',
    plugins: ['expo-router'],
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/' + expoProjectId,
    },
  }
}

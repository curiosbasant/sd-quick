import type { ConfigContext, ExpoConfig } from 'expo/config'

const EXPO_PROJECT_ID = '1171c42c-2483-48f6-a87c-e0427167a3a2',
  EXPO_PROJECT_SLUG = 'sd-quick',
  EXPO_PROJECT_OWNER = 'curiosbasant',
  PROJECT_GITHUB_URL = 'https://github.com/curiosbasant/sd-quick.git'

export default function defineConfig({ config }: ConfigContext): ExpoConfig {
  const app = getDynamicAppConfig(process.env.APP_VARIANT || 'development')

  return {
    ...config,
    // App details
    name: app.name,
    version: '0.1.0',
    scheme: app.scheme,
    description: 'A Quick app to make working shaladarpan easier',
    orientation: 'portrait',
    icon: app.icon,
    splash: {
      image: app.splashImage,
      resizeMode: 'contain',
    },

    // Platform specific
    android: {
      package: app.packageId,
      adaptiveIcon: {
        foregroundImage: app.adaptiveIcon,
        backgroundColor: '#FFFFFF',
      },
    },
    ios: {
      bundleIdentifier: app.packageId,
      supportsTablet: true,
    },
    web: {
      output: 'server',
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
        projectId: EXPO_PROJECT_ID,
      },
    },
    githubUrl: PROJECT_GITHUB_URL,
    slug: EXPO_PROJECT_SLUG || 'set EXPO_PROJECT_SLUG',
    // Required to auto build by expo for this "extra.eas.projectId"
    owner: EXPO_PROJECT_OWNER,
    plugins: ['expo-router'],
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/' + EXPO_PROJECT_ID,
    },
  }
}

const getDynamicAppConfig = (environment: string) => {
  switch (environment) {
    case 'production':
      return {
        name: 'SD Quick',
        scheme: 'sd-quick',
        packageId: 'com.curios.sdquick',
        icon: './assets/brand/icon.png',
        adaptiveIcon: './assets/brand/adaptive-icon.png',
        splashImage: './assets/brand/splash-icon.png',
      }
    case 'preview':
      return {
        name: 'SD Quick (Preview)',
        scheme: 'sd-quick-preview',
        packageId: 'com.curios.sdquick.preview',
        icon: './assets/brand/icon.png',
        adaptiveIcon: './assets/brand/adaptive-icon.png',
        splashImage: './assets/brand/splash-icon.png',
      }
    default:
      return {
        name: 'SD Quick (Dev)',
        scheme: 'sd-quick-dev',
        packageId: 'com.curios.sdquick.dev',
        icon: './assets/brand/icon.png',
        adaptiveIcon: './assets/brand/adaptive-icon.png',
        splashImage: './assets/brand/splash-icon.png',
      }
  }
}

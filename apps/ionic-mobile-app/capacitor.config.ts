import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eclaircommerce.app',
  appName: 'Eclair Commerce',
  webDir: '../../dist/apps/ionic-mobile-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
    plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;

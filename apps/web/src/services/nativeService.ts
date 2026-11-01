import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export const isNative = Capacitor.isNativePlatform();

/**
 * Initialize native device capabilities on app mount
 */
export async function initNativeServices(onBackPress?: () => void) {
  if (!isNative) return;

  try {
    // 1. Status Bar styling
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#F7F8FC' });
  } catch (err) {
    console.warn('StatusBar init:', err);
  }

  try {
    // 2. Hide Splash Screen after React mounts
    await SplashScreen.hide();
  } catch (err) {
    console.warn('SplashScreen hide:', err);
  }

  try {
    // 3. Android Hardware Back Button
    CapApp.addListener('backButton', () => {
      if (onBackPress) {
        onBackPress();
      } else {
        if (window.history.length > 1) {
          window.history.back();
        }
      }
    });
  } catch (err) {
    console.warn('BackButton listener:', err);
  }
}

/**
 * Capture photo via native Android Camera or HTML5 input fallback
 */
export async function captureDocumentPhoto(): Promise<string | null> {
  if (isNative) {
    try {
      const photo = await Camera.getPhoto({
        quality: 92,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      return photo.dataUrl || null;
    } catch (err) {
      console.warn('Camera error or cancelled:', err);
      return null;
    }
  }
  return null;
}

/**
 * Pick image from native Android Gallery
 */
export async function pickGalleryPhoto(): Promise<string | null> {
  if (isNative) {
    try {
      const photo = await Camera.getPhoto({
        quality: 92,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      return photo.dataUrl || null;
    } catch (err) {
      console.warn('Gallery error or cancelled:', err);
      return null;
    }
  }
  return null;
}

/**
 * Open native Android Share Sheet
 */
export async function shareDocumentNative(title: string, text?: string, url?: string): Promise<boolean> {
  if (isNative) {
    try {
      await Share.share({
        title,
        text: text || `Sharing ${title} from PaperTrail Vault`,
        url,
        dialogTitle: `Share ${title}`,
      });
      return true;
    } catch (err) {
      console.warn('Share error or cancelled:', err);
      return false;
    }
  } else if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Schedule local notification for document expiration
 */
export async function scheduleExpiryNotification(title: string, body: string, inSeconds: number = 3) {
  if (!isNative) return;

  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted') {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now() + inSeconds * 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    }
  } catch (err) {
    console.warn('Notification scheduling error:', err);
  }
}

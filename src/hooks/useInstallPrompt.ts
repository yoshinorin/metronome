import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface InstallPromptState {
  /** True once the browser has signaled the app is installable (Chromium only; Safari never fires this). */
  canInstall: boolean;
  promptInstall: () => void;
}

/** Surfaces the browser's native "install app" prompt, when available. */
export function useInstallPrompt(): InstallPromptState {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredEvent(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(() => {
    if (!deferredEvent) {
      return;
    }
    deferredEvent.prompt();
    deferredEvent.userChoice.then(() => setDeferredEvent(null));
  }, [deferredEvent]);

  return { canInstall: deferredEvent !== null, promptInstall };
}

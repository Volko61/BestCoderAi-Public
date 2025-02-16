/// <reference types="vite/client" />
VITE_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_XX"



interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
  
  declare global {
    interface WindowEventMap {
      beforeinstallprompt: BeforeInstallPromptEvent;
    }
  }
  
  window.addEventListener("beforeinstallprompt", (e) => {}); // e is now typed

  interface Window {
    // Declare the beforeinstallprompt event
    beforeinstallprompt: Event;
  }
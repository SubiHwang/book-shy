declare module 'virtual:pwa-register/react' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export interface useRegisterSWOptions extends RegisterSWOptions {
    immediate?: boolean;
  }

  export function useRegisterSW(options?: useRegisterSWOptions): {
    needRefresh: boolean;
    offlineReady: boolean;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

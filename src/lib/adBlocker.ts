export class AdvancedAdBlocker {
  private blockedPatterns = [
    // VidSrc-specific ad networks
    'acscdn.com',
    'dtscout.com',
    'vidsrc-embed.ru',
    'googlesyndication',
    'doubleclick',
    'googletagmanager',
    'googleadservices',
    // Generic ad/tracking patterns
    '/ads/',
    '/ad/',
    '/advert',
    '/banner',
    '/popup',
    '/popunder',
    '/redirect',
    '/click/',
    '/track/',
    '/analytics',
    '/telemetry',
    '/beacon',
    '/pixel',
    '/impression',
    '/aff/',
    '/out/',
    '/go/',
    // Known ad networks
    'taboola',
    'outbrain',
    'criteo',
    'adnxs',
    'adsystem',
    'adserver',
    'advertising',
  ];

  private whitelistPatterns = [
    '/api/',
    'vidsrc.to',
    'vidsrc.me',
    'vidsrc.pm',
    'youtube.com',
    'ytimg.com',
  ];

  private originalFetch: typeof fetch;
  private originalXHR: typeof XMLHttpRequest;
  private clickListeners: Map<Element, (e: Event) => void> = new Map();

  constructor() {
    this.originalFetch = window.fetch;
    this.originalXHR = window.XMLHttpRequest;
    this.init();
  }

  private init() {
    this.interceptFetch();
    this.interceptXHR();
    this.blockWindowOpen();
    this.blockNavigationHijacking();
    this.setupClickProtection();
    this.setupMutationObserver();
    this.blockIframeMessages();
    console.log('🛡️ Advanced Ad Blocker initialized');
  }

  private shouldBlock(url: string): boolean {
    const urlLower = url.toLowerCase();
    
    // Check whitelist first
    if (this.whitelistPatterns.some(pattern => urlLower.includes(pattern))) {
      return false;
    }

    // Check if same origin
    try {
      const requestUrl = new URL(url);
      if (requestUrl.origin === window.location.origin) {
        return false;
      }
    } catch {
      // Invalid URL, block it
      return true;
    }

    // Check blocked patterns
    return this.blockedPatterns.some(pattern => urlLower.includes(pattern));
  }

  private interceptFetch() {
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof URL ? args[0].toString() : args[0].url;
      
      if (this.shouldBlock(url)) {
        console.log('🚫 Blocked fetch:', url);
        return Promise.reject(new Error('Blocked by ad blocker'));
      }

      return this.originalFetch.apply(window, args);
    };
  }

  private interceptXHR() {
    const self = this;
    
    window.XMLHttpRequest = function() {
      const xhr = new self.originalXHR();
      const originalOpen = xhr.open;

      xhr.open = function(method: string, url: string | URL, ...rest: any[]) {
        const urlString = url.toString();
        
        if (self.shouldBlock(urlString)) {
          console.log('🚫 Blocked XHR:', urlString);
          // Return a fake successful response
          return;
        }

        return originalOpen.apply(this, [method, url, ...rest]);
      };

      return xhr;
    } as any;
  }

  private blockWindowOpen() {
    const originalOpen = window.open;
    
    window.open = function(...args) {
      const url = args[0]?.toString() || '';
      
      // Block all popups from iframes
      if (url && url !== 'about:blank') {
        console.log('🚫 Blocked popup:', url);
        return null;
      }

      return originalOpen.apply(window, args);
    };
  }

  private blockNavigationHijacking() {
    const suspiciousPatterns = [
      '/go/',
      '/out/',
      '/click/',
      '/track/',
      '/redirect/',
      '/aff/',
      '/away/',
      '/exit/',
      'short.link',
      'bit.ly',
      'tinyurl',
    ];

    // Intercept all navigation attempts
    window.addEventListener('beforeunload', (e) => {
      const target = (e.target as any)?.activeElement?.href;
      if (target && suspiciousPatterns.some(pattern => target.includes(pattern))) {
        e.preventDefault();
        console.log('🚫 Blocked navigation hijack:', target);
      }
    }, true);

    // Prevent location changes
    const originalLocationSet = Object.getOwnPropertyDescriptor(window, 'location')?.set;
    if (originalLocationSet) {
      Object.defineProperty(window, 'location', {
        set: function(value) {
          const url = value.toString();
          if (suspiciousPatterns.some(pattern => url.includes(pattern))) {
            console.log('🚫 Blocked location change:', url);
            return;
          }
          return originalLocationSet.call(window, value);
        }
      });
    }
  }

  private setupClickProtection() {
    let lastClickTime = 0;
    
    document.addEventListener('click', (e) => {
      const now = Date.now();
      
      // Detect rapid clicks (potential ad click hijacking)
      if (now - lastClickTime < 100) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 Blocked rapid click');
        return;
      }
      
      lastClickTime = now;

      // Check if click target is suspicious
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href;
        if (this.shouldBlock(href)) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🚫 Blocked suspicious link:', href);
        }
      }
    }, true);
  }

  private setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            
            // Remove suspicious elements
            if (
              element.tagName === 'IFRAME' &&
              element.getAttribute('src') &&
              this.shouldBlock(element.getAttribute('src')!)
            ) {
              console.log('🚫 Removed ad iframe');
              element.remove();
            }

            // Remove elements with ad-related classes/ids
            const adKeywords = ['ad', 'banner', 'popup', 'overlay'];
            const classList = element.className?.toString().toLowerCase() || '';
            const id = element.id?.toLowerCase() || '';
            
            if (adKeywords.some(keyword => classList.includes(keyword) || id.includes(keyword))) {
              console.log('🚫 Removed suspicious element');
              element.remove();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private blockIframeMessages() {
    window.addEventListener('message', (e) => {
      // Block messages from suspicious origins
      const origin = e.origin.toLowerCase();
      
      if (this.shouldBlock(origin)) {
        e.stopImmediatePropagation();
        console.log('🚫 Blocked iframe message from:', origin);
      }
    }, true);
  }

  public destroy() {
    // Restore original functions
    window.fetch = this.originalFetch;
    window.XMLHttpRequest = this.originalXHR;
    console.log('🛡️ Ad Blocker destroyed');
  }
}

import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [iosVisible, setIosVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem("pwa-prompt-dismissed")) return;

    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone;
    if (ios) {
      setIsIOS(true);
      setTimeout(() => setIosVisible(true), 3000);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      setInstalling(false);
    }
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setVisible(false);
    setIosVisible(false);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  };

  if (isIOS && iosVisible) {
    return (
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
        style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a3e] via-[#2d1060] to-[#0f0a1e]" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="relative p-5">
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-3 rounded-full p-1 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/assets/generated/pwa-icon.dim_512x512.png"
                  alt="TrendDrop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  Add TrendDrop to Home Screen
                </p>
                <p className="text-white/60 text-xs mt-1 leading-relaxed">
                  Tap the share icon below, then select{" "}
                  <span className="text-purple-300 font-medium">
                    &ldquo;Add to Home Screen&rdquo;
                  </span>
                  .
                </p>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#2d1060] border-r border-b border-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
      style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a3e] via-[#2d1060] to-[#0f0a1e]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 60%)",
          }}
        />
        <div className="relative p-5">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-3 right-3 rounded-full p-1 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden shadow-lg ring-2 ring-purple-500/30">
              <img
                src="/assets/generated/pwa-icon.dim_512x512.png"
                alt="TrendDrop"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base leading-tight">
                TrendDrop
              </p>
              <p className="text-white/50 text-xs mt-0.5">
                Install the app for faster shopping
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-white/40 text-xs">
            <div className="flex items-center gap-1.5">
              <Smartphone size={12} />
              <span>Works offline</span>
            </div>
            <span>&bull;</span>
            <span>No app store needed</span>
            <span>&bull;</span>
            <span>Free</span>
          </div>

          <button
            type="button"
            onClick={handleInstall}
            disabled={installing}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-900/40 active:scale-95 disabled:opacity-60"
          >
            {installing ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  aria-label="Loading"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Installing...
              </span>
            ) : (
              <>
                <Download size={16} />
                Install App
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

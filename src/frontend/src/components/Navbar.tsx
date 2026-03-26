import { Button } from "@/components/ui/button";
import {
  Globe,
  Heart,
  Link,
  Menu,
  MessageCircle,
  MessageSquare,
  Search,
  Share2,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { CartItem } from "../types/cart";

interface NavbarProps {
  cartItems: CartItem[];
  onCartOpen: () => void;
}

const NAV_LINKS = [
  "Home",
  "Trending",
  "Shop All",
  "New Arrivals",
  "About",
  "FAQ",
];

function SharePanel({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const nativeShare = async () => {
    await navigator.share({ url: window.location.href, title: "TrendDrop" });
    onClose();
  };

  const url = encodeURIComponent(window.location.href);

  const options = [
    ...((navigator as any).share
      ? [
          {
            label: "Share",
            icon: <Share2 className="w-4 h-4" />,
            action: nativeShare,
            ocid: "share.native_button",
          },
        ]
      : []),
    {
      label: copied ? "Copied!" : "Copy Link",
      icon: <Link className="w-4 h-4" />,
      action: copyLink,
      ocid: "share.button",
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      action: () => openUrl(`https://wa.me/?text=${url}`),
      ocid: "share.button",
    },
    {
      label: "Facebook",
      icon: <Globe className="w-4 h-4" />,
      action: () =>
        openUrl(`https://www.facebook.com/sharer/sharer.php?u=${url}`),
      ocid: "share.button",
    },
    {
      label: "Twitter / X",
      icon: <MessageSquare className="w-4 h-4" />,
      action: () =>
        openUrl(
          `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent("Check out TrendDrop!")}`,
        ),
      ocid: "share.button",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-[oklch(0.3_0.01_220)] bg-[oklch(0.22_0.01_220)] shadow-xl z-50 overflow-hidden"
      data-ocid="share.panel"
    >
      {options.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={opt.action}
          data-ocid={opt.ocid}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[oklch(0.75_0.01_220)] hover:text-white hover:bg-[oklch(0.3_0.01_220)] transition-colors"
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </motion.div>
  );
}

export function Navbar({ cartItems, onCartOpen }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Trending");
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (!shareOpen) return;
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [shareOpen]);

  return (
    <header
      className="sticky top-0 z-50 bg-dark-nav shadow-md"
      data-ocid="navbar.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <a
          href="/"
          className="text-2xl font-black tracking-widest text-brand uppercase shrink-0"
          data-ocid="nav.link"
        >
          TRENDIFY
        </a>

        <nav
          className="hidden lg:flex items-center gap-1 ml-6"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => setActiveLink(link)}
              data-ocid="nav.link"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeLink === link
                  ? "text-brand"
                  : "text-[oklch(0.75_0.01_220)] hover:text-white"
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2 bg-[oklch(0.3_0.01_220)] rounded-md px-3 py-1.5 w-48">
          <Search className="w-4 h-4 text-[oklch(0.6_0.01_220)]" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent text-sm text-white placeholder:text-[oklch(0.55_0.01_220)] outline-none w-full"
            data-ocid="nav.search_input"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-[oklch(0.75_0.01_220)] hover:text-white hover:bg-[oklch(0.3_0.01_220)]"
            data-ocid="nav.link"
          >
            <User className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[oklch(0.75_0.01_220)] hover:text-white hover:bg-[oklch(0.3_0.01_220)]"
            data-ocid="nav.link"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[oklch(0.75_0.01_220)] hover:text-white hover:bg-[oklch(0.3_0.01_220)]"
            onClick={onCartOpen}
            data-ocid="nav.open_modal_button"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Share button */}
          <div className="relative" ref={shareRef}>
            <Button
              variant="ghost"
              size="icon"
              className="text-[oklch(0.75_0.01_220)] hover:text-white hover:bg-[oklch(0.3_0.01_220)]"
              onClick={() => setShareOpen((v) => !v)}
              data-ocid="share.open_modal_button"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <AnimatePresence>
              {shareOpen && <SharePanel onClose={() => setShareOpen(false)} />}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[oklch(0.75_0.01_220)] hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-[oklch(0.22_0.01_220)] border-t border-[oklch(0.3_0.01_220)]"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 bg-[oklch(0.3_0.01_220)] rounded-md px-3 py-2 mb-2">
                <Search className="w-4 h-4 text-[oklch(0.6_0.01_220)]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent text-sm text-white placeholder:text-[oklch(0.55_0.01_220)] outline-none w-full"
                  data-ocid="nav.search_input"
                />
              </div>
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => {
                    setActiveLink(link);
                    setMobileOpen(false);
                  }}
                  data-ocid="nav.link"
                  className={`px-3 py-2 text-sm font-medium rounded-md text-left transition-colors ${
                    activeLink === link
                      ? "text-brand bg-[oklch(0.28_0.01_220)]"
                      : "text-[oklch(0.75_0.01_220)] hover:text-white"
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

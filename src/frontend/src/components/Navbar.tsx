import { Button } from "@/components/ui/button";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

export function Navbar({ cartItems, onCartOpen }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Trending");
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

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

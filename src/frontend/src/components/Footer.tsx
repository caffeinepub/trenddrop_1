import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";

const SOCIAL_LINKS = [
  { icon: SiInstagram, label: "Instagram" },
  { icon: SiTiktok, label: "TikTok" },
  { icon: SiX, label: "X" },
  { icon: SiFacebook, label: "Facebook" },
  { icon: SiYoutube, label: "YouTube" },
];

const QUICK_LINKS = [
  "Home",
  "Trending Now",
  "Shop All",
  "New Arrivals",
  "About Us",
  "Contact",
];
const CATEGORIES = [
  "Tech Gadgets",
  "Home & Living",
  "Beauty & Skincare",
  "Lifestyle",
  "Novelty Items",
  "Sale Items",
];
const CARE_LINKS = [
  "FAQ",
  "Shipping Policy",
  "Returns & Refunds",
  "Track Your Order",
  "Privacy Policy",
  "Terms of Service",
];
const PAYMENT_METHODS = ["VISA", "MC", "AMEX", "PayPal", "Apple Pay"];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer
      className="bg-dark-footer text-[oklch(0.75_0.01_220)]"
      data-ocid="footer.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="text-2xl font-black uppercase tracking-widest text-brand mb-3">
              TRENDIFY
            </p>
            <p className="text-sm leading-relaxed text-[oklch(0.6_0.01_220)] max-w-xs">
              Your one-stop shop for the internet's most viral and trendy
              products. Curated daily so you never miss what's hot.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-[oklch(0.28_0.01_220)] flex items-center justify-center hover:bg-brand transition-colors"
                  data-ocid="footer.link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="hover:text-brand transition-colors"
                    data-ocid="footer.link"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <a
                    href="/"
                    className="hover:text-brand transition-colors"
                    data-ocid="footer.link"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
              {CARE_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="hover:text-brand transition-colors"
                    data-ocid="footer.link"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[oklch(0.28_0.01_220)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className="text-[oklch(0.5_0.01_220)]">
            © {year} Trendify. All rights reserved. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-3 text-[oklch(0.5_0.01_220)]">
            <span>We accept:</span>
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="px-2 py-0.5 bg-[oklch(0.28_0.01_220)] rounded text-[10px] font-bold"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
}

const BADGE_COLORS: Record<string, string> = {
  TRENDING: "bg-brand text-white",
  SALE: "bg-red-500 text-white",
  HOT: "bg-orange-500 text-white",
  NEW: "bg-green-600 text-white",
};

const STAR_LABELS = ["one", "two", "three", "four", "five"];

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const [shimmer, setShimmer] = useState(false);
  const [ripple, setRipple] = useState(false);
  const shimmerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const badgeClass = product.badge
    ? (BADGE_COLORS[product.badge] ?? "bg-brand text-white")
    : "";

  const handleImageHover = () => {
    if (shimmerTimer.current) clearTimeout(shimmerTimer.current);
    setShimmer(true);
    shimmerTimer.current = setTimeout(() => setShimmer(false), 700);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    if (rippleTimer.current) clearTimeout(rippleTimer.current);
    setRipple(true);
    rippleTimer.current = setTimeout(() => setRipple(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group bg-card rounded-lg overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
      data-ocid={`product.item.${index + 1}`}
    >
      <div
        className="relative overflow-hidden aspect-square bg-muted cursor-pointer"
        onMouseEnter={handleImageHover}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Shimmer effect */}
        {shimmer && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 w-1/3 animate-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              }}
            />
          </div>
        )}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded ${badgeClass}`}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {STAR_LABELS.map((label, i) => (
            <Star
              key={label}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? "text-brand fill-brand"
                  : "text-[oklch(0.85_0_0)]"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {product.rating} ({Number(product.reviewCount).toLocaleString()})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base font-bold text-foreground">
            $
            {(product.isOnSale && product.salePrice
              ? product.salePrice
              : product.price
            ).toFixed(2)}
          </span>
          {product.isOnSale && product.salePrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          className={`w-full bg-brand hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-wider h-9 relative overflow-hidden transition-all duration-200 ${
            ripple ? "animate-pulse-ring" : ""
          }`}
          data-ocid={`product.primary_button.${index + 1}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}

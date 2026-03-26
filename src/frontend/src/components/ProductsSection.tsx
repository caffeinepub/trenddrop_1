import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "../backend.d";
import { ProductCard } from "./ProductCard";

const CATEGORIES = ["All", "Tech", "Home", "Beauty", "Lifestyle", "Novelty"];

type SortKey = "trending" | "price-asc" | "price-desc" | "rating";

interface ProductsSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductsSection({
  products,
  onAddToCart,
}: ProductsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("trending");

  const filtered = useMemo(() => {
    const list =
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);
    switch (sortBy) {
      case "price-asc":
        return [...list].sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        );
      case "price-desc":
        return [...list].sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        );
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return [...list].sort(
          (a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0),
        );
    }
  }, [products, activeCategory, sortBy]);

  return (
    <section
      className="relative py-14 px-4 sm:px-6 overflow-hidden"
      id="products"
      data-ocid="products.section"
      style={{ backgroundColor: "#f9fafb" }}
    >
      {/* Animated mesh grid background */}
      <div
        className="absolute inset-0 pointer-events-none animate-mesh"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.7 0.01 220 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.01 220 / 0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">
            This Week's Top Trends
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight">
            Most Viral Products Right Now
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2" data-ocid="products.tab">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid="products.tab"
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-brand text-white border-brand shadow-sm shadow-brand/30 scale-105"
                    : "bg-white text-foreground border-border hover:border-brand hover:text-brand"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="w-48" data-ocid="products.select">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

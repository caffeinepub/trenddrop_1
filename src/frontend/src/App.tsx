import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import type { Product } from "./backend.d";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { InstallPrompt } from "./components/InstallPrompt";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { ProductsSection } from "./components/ProductsSection";
import { SAMPLE_PRODUCTS } from "./data/sampleProducts";
import { useActor } from "./hooks/useActor";
import { useGetAllProducts } from "./hooks/useQueries";
import type { CartItem } from "./types/cart";

function useUtmTracking() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];
    for (const key of utmKeys) {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    }
  }, []);
}

function useSeedProducts() {
  const { actor, isFetching } = useActor();
  useEffect(() => {
    if (!actor || isFetching) return;
    actor.addSampleProducts().catch(() => {
      // idempotent — ignore errors
    });
  }, [actor, isFetching]);
}

export default function App() {
  useUtmTracking();
  useSeedProducts();

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { data: backendProducts, isLoading } = useGetAllProducts();

  const products: Product[] =
    !isLoading && backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price:
            product.isOnSale && product.salePrice
              ? product.salePrice
              : product.price,
          quantity: 1,
          image: product.imageUrl,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty < 1) {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity: qty } : i,
        ),
      );
    }
  };

  const handleRemove = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cartItems} onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Hero onShopNow={scrollToProducts} />
        <ProductsSection products={products} onAddToCart={handleAddToCart} />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* PWA install prompt — appears after 3s if not already installed */}
      <InstallPrompt />

      <Toaster position="top-right" richColors />
    </div>
  );
}

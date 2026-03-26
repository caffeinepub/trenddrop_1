import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { CartItem } from "../types/cart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

function AnimatedBadge({ count }: { count: number }) {
  const prevCount = useRef(count);
  const shouldAnimate = count !== prevCount.current;

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={shouldAnimate ? { scale: 1.5, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="ml-auto text-xs font-semibold bg-brand text-white px-2 py-0.5 rounded-full"
      >
        {count} items
      </motion.span>
    </AnimatePresence>
  );
}

export function CartDrawer({
  open,
  onClose,
  cartItems,
  onUpdateQty,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingFee;
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleCheckoutClick = () => {
    onClose();
    onCheckout();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-wide">
            <ShoppingBag className="w-5 h-5 text-brand" />
            Your Cart
            {cartItems.length > 0 && <AnimatedBadge count={totalItems} />}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full gap-4 text-center"
              data-ocid="cart.empty_state"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground/70">
                Add some trending items to get started!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-brand mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.productId, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-brand hover:text-brand transition-colors"
                          data-ocid={`cart.secondary_button.${idx + 1}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.productId, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-brand hover:text-brand transition-colors"
                          data-ocid={`cart.primary_button.${idx + 1}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.productId)}
                      className="text-muted-foreground hover:text-red-500 transition-colors self-start mt-1"
                      data-ocid={`cart.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Shipping</span>
              {shippingFee === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                <span className="font-semibold">${shippingFee.toFixed(2)}</span>
              )}
            </div>
            <Separator className="mb-4" />
            <div className="flex justify-between font-black text-base mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckoutClick}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider h-11"
              data-ocid="cart.submit_button"
            >
              Checkout — ${total.toFixed(2)}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="cart.cancel_button"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

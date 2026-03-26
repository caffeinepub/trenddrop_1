import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ChevronLeft, Loader2, Package, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { usePlaceOrder } from "../hooks/useQueries";
import type { CartItem } from "../types/cart";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Japan",
  "South Korea",
  "Singapore",
  "Mexico",
  "Brazil",
  "India",
  "New Zealand",
  "Other",
];

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

type Step = 1 | 2 | 3;

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const STEP_LABELS = ["Contact Info", "Shipping", "Review Order"];

export function CheckoutModal({
  open,
  onClose,
  cartItems,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [contact, setContact] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [shipping, setShipping] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingFee;

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!contact.firstName.trim()) e.firstName = "Required";
    if (!contact.lastName.trim()) e.lastName = "Required";
    if (!contact.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(contact.email))
      e.email = "Valid email required";
    if (!contact.phone.trim()) e.phone = "Required";
    return e;
  };

  const validateShipping = () => {
    const e: Record<string, string> = {};
    if (!shipping.street.trim()) e.street = "Required";
    if (!shipping.city.trim()) e.city = "Required";
    if (!shipping.state.trim()) e.state = "Required";
    if (!shipping.zip.trim()) e.zip = "Required";
    if (!shipping.country) e.country = "Required";
    return e;
  };

  const handleNext = () => {
    if (step === 1) {
      const e = validateContact();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      const e = validateShipping();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      setErrors({});
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const id = await placeOrder({
        customerName: `${contact.firstName} ${contact.lastName}`.trim(),
        customerEmail: contact.email,
        customerPhone: contact.phone,
        shippingAddress: shipping,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: BigInt(item.quantity),
          unitPrice: item.price,
        })),
        subtotal,
        shippingFee,
        total,
      });
      setOrderId(id);
      onOrderSuccess();
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  const handleClose = () => {
    setStep(1);
    setContact({ firstName: "", lastName: "", email: "", phone: "" });
    setShipping({
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    });
    setOrderId(null);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          data-ocid="checkout.modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand" />
                <span className="font-black text-lg uppercase tracking-wide">
                  {orderId ? "Order Confirmed" : "Checkout"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="checkout.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderId ? (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-10 flex flex-col items-center text-center gap-4"
                data-ocid="checkout.success_state"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-black text-foreground">
                  Order Placed! 🎉
                </h2>
                <div className="bg-brand/10 border border-brand/20 rounded-lg px-5 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                  <p className="text-lg font-black text-brand">{orderId}</p>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">
                  We'll send updates to{" "}
                  <span className="font-semibold text-foreground">
                    {contact.email}
                  </span>
                  . Your order is being processed!
                </p>
                <Button
                  onClick={handleClose}
                  className="mt-2 bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-8"
                  data-ocid="checkout.confirm_button"
                >
                  Continue Shopping
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Progress indicator */}
                <div className="px-6 pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    {STEP_LABELS.map((label, i) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 flex-1"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                            i + 1 < step
                              ? "bg-green-500 text-white"
                              : i + 1 === step
                                ? "bg-brand text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1 < step ? "✓" : i + 1}
                        </div>
                        <span
                          className={`text-xs font-semibold truncate ${
                            i + 1 === step
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {label}
                        </span>
                        {i < STEP_LABELS.length - 1 && (
                          <div
                            className={`h-px flex-1 transition-all duration-300 ${
                              i + 1 < step ? "bg-green-500" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Step {step} of 3 — {STEP_LABELS[step - 1]}
                  </p>
                </div>

                <div className="px-6 pb-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="firstName"
                              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                            >
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={contact.firstName}
                              onChange={(e) =>
                                setContact((p) => ({
                                  ...p,
                                  firstName: e.target.value,
                                }))
                              }
                              placeholder="John"
                              data-ocid="checkout.input"
                            />
                            {errors.firstName && (
                              <p
                                className="text-xs text-red-500 mt-1"
                                data-ocid="checkout.error_state"
                              >
                                {errors.firstName}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="lastName"
                              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={contact.lastName}
                              onChange={(e) =>
                                setContact((p) => ({
                                  ...p,
                                  lastName: e.target.value,
                                }))
                              }
                              placeholder="Doe"
                              data-ocid="checkout.input"
                            />
                            {errors.lastName && (
                              <p
                                className="text-xs text-red-500 mt-1"
                                data-ocid="checkout.error_state"
                              >
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                          >
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={contact.email}
                            onChange={(e) =>
                              setContact((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            placeholder="john@example.com"
                            data-ocid="checkout.input"
                          />
                          {errors.email && (
                            <p
                              className="text-xs text-red-500 mt-1"
                              data-ocid="checkout.error_state"
                            >
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                          >
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={contact.phone}
                            onChange={(e) =>
                              setContact((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+1 555 000 0000"
                            data-ocid="checkout.input"
                          />
                          {errors.phone && (
                            <p
                              className="text-xs text-red-500 mt-1"
                              data-ocid="checkout.error_state"
                            >
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={handleNext}
                          className="w-full bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider mt-2"
                          data-ocid="checkout.primary_button"
                        >
                          Continue to Shipping
                        </Button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4"
                      >
                        <div>
                          <Label
                            htmlFor="street"
                            className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                          >
                            Street Address
                          </Label>
                          <Input
                            id="street"
                            value={shipping.street}
                            onChange={(e) =>
                              setShipping((p) => ({
                                ...p,
                                street: e.target.value,
                              }))
                            }
                            placeholder="123 Main Street"
                            data-ocid="checkout.input"
                          />
                          {errors.street && (
                            <p
                              className="text-xs text-red-500 mt-1"
                              data-ocid="checkout.error_state"
                            >
                              {errors.street}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="city"
                              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                            >
                              City
                            </Label>
                            <Input
                              id="city"
                              value={shipping.city}
                              onChange={(e) =>
                                setShipping((p) => ({
                                  ...p,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="New York"
                              data-ocid="checkout.input"
                            />
                            {errors.city && (
                              <p
                                className="text-xs text-red-500 mt-1"
                                data-ocid="checkout.error_state"
                              >
                                {errors.city}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="state"
                              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                            >
                              State / Province
                            </Label>
                            <Input
                              id="state"
                              value={shipping.state}
                              onChange={(e) =>
                                setShipping((p) => ({
                                  ...p,
                                  state: e.target.value,
                                }))
                              }
                              placeholder="NY"
                              data-ocid="checkout.input"
                            />
                            {errors.state && (
                              <p
                                className="text-xs text-red-500 mt-1"
                                data-ocid="checkout.error_state"
                              >
                                {errors.state}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="zip"
                              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                            >
                              ZIP / Postal Code
                            </Label>
                            <Input
                              id="zip"
                              value={shipping.zip}
                              onChange={(e) =>
                                setShipping((p) => ({
                                  ...p,
                                  zip: e.target.value,
                                }))
                              }
                              placeholder="10001"
                              data-ocid="checkout.input"
                            />
                            {errors.zip && (
                              <p
                                className="text-xs text-red-500 mt-1"
                                data-ocid="checkout.error_state"
                              >
                                {errors.zip}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="country"
                              className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                            >
                              Country
                            </Label>
                            <Select
                              value={shipping.country}
                              onValueChange={(v) =>
                                setShipping((p) => ({ ...p, country: v }))
                              }
                            >
                              <SelectTrigger
                                id="country"
                                data-ocid="checkout.select"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRIES.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.country && (
                              <p
                                className="text-xs text-red-500 mt-1"
                                data-ocid="checkout.error_state"
                              >
                                {errors.country}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 mt-2">
                          <Button
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1"
                            data-ocid="checkout.cancel_button"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                          </Button>
                          <Button
                            onClick={handleNext}
                            className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider"
                            data-ocid="checkout.primary_button"
                          >
                            Review Order
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4"
                      >
                        {/* Order items */}
                        <div className="bg-muted/50 rounded-lg p-4 flex flex-col gap-3">
                          {cartItems.map((item, idx) => (
                            <div
                              key={item.productId}
                              className="flex items-center gap-3"
                              data-ocid={`checkout.item.${idx + 1}`}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover border border-border shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold line-clamp-1">
                                  {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold shrink-0">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Totals */}
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Subtotal
                            </span>
                            <span className="font-semibold">
                              ${subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Shipping
                            </span>
                            {shippingFee === 0 ? (
                              <span className="text-green-600 font-semibold">
                                FREE (over $50)
                              </span>
                            ) : (
                              <span className="font-semibold">
                                ${shippingFee.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between border-t border-border pt-2 font-black text-base">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Shipping info summary */}
                        <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
                          <p className="font-semibold text-foreground mb-1">
                            Shipping to:
                          </p>
                          <p>
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p>
                            {shipping.street}, {shipping.city}, {shipping.state}{" "}
                            {shipping.zip}
                          </p>
                          <p>{shipping.country}</p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="flex-1"
                            data-ocid="checkout.cancel_button"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                          </Button>
                          <Button
                            onClick={handlePlaceOrder}
                            disabled={isPending}
                            className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider"
                            data-ocid="checkout.submit_button"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Placing...
                              </>
                            ) : (
                              "Place Order"
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

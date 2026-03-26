import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: bigint | number;
  unitPrice: number;
}

interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  createdAt: bigint | number;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  {
    orderId: "ORD-001",
    customerName: "Sarah Chen",
    customerEmail: "sarah.chen@email.com",
    customerPhone: "+1 555-0101",
    shippingAddress: {
      street: "123 Maple Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
    },
    items: [
      {
        productId: "p1",
        productName: "Wireless ANC Headphones",
        quantity: BigInt(1),
        unitPrice: 89.99,
      },
      {
        productId: "p2",
        productName: "Smart LED Desk Lamp",
        quantity: BigInt(2),
        unitPrice: 34.99,
      },
    ],
    subtotal: 159.97,
    shippingFee: 0,
    total: 159.97,
    status: "pending",
    createdAt: BigInt(Date.now() - 1000 * 60 * 15) * BigInt(1_000_000),
  },
  {
    orderId: "ORD-002",
    customerName: "Marcus Johnson",
    customerEmail: "marcus.j@gmail.com",
    customerPhone: "+1 555-0202",
    shippingAddress: {
      street: "456 Oak Street",
      city: "Brooklyn",
      state: "NY",
      zip: "11201",
      country: "USA",
    },
    items: [
      {
        productId: "p3",
        productName: "Portable Bluetooth Speaker",
        quantity: BigInt(1),
        unitPrice: 49.99,
      },
    ],
    subtotal: 49.99,
    shippingFee: 4.99,
    total: 54.98,
    status: "processing",
    createdAt: BigInt(Date.now() - 1000 * 60 * 45) * BigInt(1_000_000),
  },
  {
    orderId: "ORD-003",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@work.com",
    customerPhone: "+1 555-0303",
    shippingAddress: {
      street: "789 Pine Blvd",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "USA",
    },
    items: [
      {
        productId: "p4",
        productName: "Ergonomic Lumbar Cushion",
        quantity: BigInt(1),
        unitPrice: 39.99,
      },
      {
        productId: "p5",
        productName: "Bamboo Phone Stand",
        quantity: BigInt(1),
        unitPrice: 24.99,
      },
    ],
    subtotal: 64.98,
    shippingFee: 0,
    total: 64.98,
    status: "shipped",
    createdAt: BigInt(Date.now() - 1000 * 60 * 90) * BigInt(1_000_000),
  },
  {
    orderId: "ORD-004",
    customerName: "Alex Rivera",
    customerEmail: "alex.rivera@hotmail.com",
    customerPhone: "+1 555-0404",
    shippingAddress: {
      street: "321 Elm Ct",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA",
    },
    items: [
      {
        productId: "p1",
        productName: "Wireless ANC Headphones",
        quantity: BigInt(1),
        unitPrice: 89.99,
      },
    ],
    subtotal: 89.99,
    shippingFee: 0,
    total: 89.99,
    status: "fulfilled",
    createdAt: BigInt(Date.now() - 1000 * 60 * 180) * BigInt(1_000_000),
  },
  {
    orderId: "ORD-005",
    customerName: "Emma Williams",
    customerEmail: "emma.w@outlook.com",
    customerPhone: "+1 555-0505",
    shippingAddress: {
      street: "654 Cedar Lane",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    items: [
      {
        productId: "p6",
        productName: "Minimalist Leather Wallet",
        quantity: BigInt(2),
        unitPrice: 29.99,
      },
      {
        productId: "p7",
        productName: "UV Sanitizer Box",
        quantity: BigInt(1),
        unitPrice: 44.99,
      },
    ],
    subtotal: 104.97,
    shippingFee: 0,
    total: 104.97,
    status: "pending",
    createdAt: BigInt(Date.now() - 1000 * 60 * 300) * BigInt(1_000_000),
  },
  {
    orderId: "ORD-006",
    customerName: "David Kim",
    customerEmail: "david.kim@tech.io",
    customerPhone: "+1 555-0606",
    shippingAddress: {
      street: "987 Birch Way",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    items: [
      {
        productId: "p8",
        productName: "Collapsible Water Bottle",
        quantity: BigInt(3),
        unitPrice: 19.99,
      },
    ],
    subtotal: 59.97,
    shippingFee: 0,
    total: 59.97,
    status: "cancelled",
    createdAt: BigInt(Date.now() - 1000 * 60 * 480) * BigInt(1_000_000),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function timeAgo(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts / BigInt(1_000_000)) : ts;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    color: "oklch(0.85 0.18 85)",
    bg: "oklch(0.25 0.06 85)",
  },
  processing: {
    label: "Processing",
    color: "oklch(0.75 0.15 220)",
    bg: "oklch(0.22 0.06 220)",
  },
  shipped: {
    label: "Shipped",
    color: "oklch(0.75 0.15 280)",
    bg: "oklch(0.22 0.06 280)",
  },
  fulfilled: {
    label: "Fulfilled",
    color: "oklch(0.75 0.15 145)",
    bg: "oklch(0.22 0.06 145)",
  },
  cancelled: {
    label: "Cancelled",
    color: "oklch(0.75 0.15 25)",
    bg: "oklch(0.22 0.06 25)",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "oklch(0.7 0 0)",
    bg: "oklch(0.25 0 0)",
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [_copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-1.5 text-[oklch(0.5_0.01_220)] hover:text-[oklch(0.75_0.15_280)] transition-colors"
      title="Copy"
    >
      <Copy className="w-3.5 h-3.5" />
    </button>
  );
}

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [shaking, setShaking] = useState(false);

  const submit = () => {
    if (pw === "trenddrop2025") {
      onAuth();
    } else {
      setError("Incorrect password. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.1 0.015 280)" }}
      data-ocid="admin.panel"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.25 0.1 280 / 0.3) 0%, transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={shaking ? "animate-[shake_0.5s_ease]" : ""}
      >
        <div
          className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl"
          style={{
            background: "oklch(0.15 0.015 280)",
            border: "1px solid oklch(0.28 0.05 280)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
              style={{ background: "oklch(0.35 0.18 280)" }}
            >
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1
              className="text-2xl font-black tracking-widest uppercase"
              style={{ color: "oklch(0.9 0.15 280)" }}
            >
              TRENDIFY
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.55 0.03 280)" }}
            >
              Admin Dashboard
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter admin password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="pr-10 text-white placeholder:text-[oklch(0.4_0.01_280)]"
                style={{
                  background: "oklch(0.2 0.02 280)",
                  border: error
                    ? "1px solid oklch(0.65 0.2 25)"
                    : "1px solid oklch(0.28 0.05 280)",
                }}
                data-ocid="admin.input"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.5_0.02_280)] hover:text-white transition-colors"
              >
                {show ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs"
                style={{ color: "oklch(0.7 0.2 25)" }}
                data-ocid="admin.error_state"
              >
                {error}
              </motion.p>
            )}

            <Button
              onClick={submit}
              className="w-full font-bold tracking-wide"
              style={{ background: "oklch(0.55 0.22 280)", color: "white" }}
              data-ocid="admin.submit_button"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className="border-0 relative overflow-hidden"
        style={{
          background: "oklch(0.15 0.015 280)",
          border: "1px solid oklch(0.22 0.04 280)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-10"
          style={{ background: accent }}
        />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: "oklch(0.5 0.03 280)" }}
              >
                {label}
              </p>
              <p
                className="text-2xl font-black"
                style={{ color: "oklch(0.95 0.01 280)" }}
              >
                {value}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accent}22` }}
            >
              <Icon className="w-5 h-5" style={{ color: accent }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({
  order,
  index,
  onStatusChange,
}: {
  order: Order;
  index: number;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const itemCount = order.items.reduce((s, i) => s + Number(i.quantity), 0);
  const addr = order.shippingAddress;

  const STATUSES = [
    "pending",
    "processing",
    "shipped",
    "fulfilled",
    "cancelled",
  ];

  const handleStatus = async (newStatus: string) => {
    setUpdating(true);
    await onStatusChange(order.orderId, newStatus);
    setUpdating(false);
  };

  return (
    <>
      <TableRow
        className="border-b transition-colors cursor-pointer"
        style={{ borderColor: "oklch(0.2 0.02 280)" }}
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`orders.row.${index + 1}`}
      >
        <TableCell
          className="font-mono text-xs"
          style={{ color: "oklch(0.6 0.1 280)" }}
        >
          {order.orderId}
        </TableCell>
        <TableCell>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.92 0.01 280)" }}
            >
              {order.customerName}
            </p>
            <div
              className="flex items-center text-xs"
              style={{ color: "oklch(0.55 0.03 280)" }}
            >
              <span className="truncate max-w-[140px]">
                {order.customerEmail}
              </span>
              <CopyButton value={order.customerEmail} />
            </div>
          </div>
        </TableCell>
        <TableCell
          className="text-xs"
          style={{ color: "oklch(0.65 0.03 280)" }}
        >
          {itemCount} item{itemCount !== 1 ? "s" : ""}
          <br />
          <span className="truncate block max-w-[120px]">
            {order.items[0]?.productName}
            {order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
          </span>
        </TableCell>
        <TableCell
          className="font-bold"
          style={{ color: "oklch(0.85 0.15 145)" }}
        >
          {formatCurrency(order.total)}
        </TableCell>
        <TableCell
          className="text-xs"
          style={{ color: "oklch(0.55 0.03 280)" }}
        >
          {timeAgo(order.createdAt)}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <StatusBadge status={order.status} />
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatus(e.target.value)}
            className="text-xs rounded-md px-2 py-1 outline-none cursor-pointer"
            style={{
              background: "oklch(0.2 0.03 280)",
              color: "oklch(0.8 0.05 280)",
              border: "1px solid oklch(0.3 0.05 280)",
            }}
            data-ocid={`orders.select.${index + 1}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </TableCell>
        <TableCell>
          <button
            type="button"
            className="text-[oklch(0.5_0.03_280)] hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </TableCell>
      </TableRow>
      <AnimatePresence>
        {expanded && (
          <TableRow style={{ borderColor: "oklch(0.2 0.02 280)" }}>
            <TableCell colSpan={8} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
                  style={{ background: "oklch(0.13 0.01 280)" }}
                >
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "oklch(0.5 0.03 280)" }}
                    >
                      Shipping Address
                    </p>
                    <div className="flex items-start gap-1.5">
                      <p style={{ color: "oklch(0.8 0.02 280)" }}>
                        {addr.street}, {addr.city}, {addr.state} {addr.zip},{" "}
                        {addr.country}
                      </p>
                      <CopyButton
                        value={`${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`}
                      />
                    </div>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "oklch(0.55 0.03 280)" }}
                    >
                      📞 {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "oklch(0.5 0.03 280)" }}
                    >
                      Items
                    </p>
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between"
                      >
                        <span style={{ color: "oklch(0.78 0.02 280)" }}>
                          {item.productName} × {Number(item.quantity)}
                        </span>
                        <span style={{ color: "oklch(0.7 0.1 145)" }}>
                          {formatCurrency(
                            item.unitPrice * Number(item.quantity),
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "oklch(0.5 0.03 280)" }}
                    >
                      Summary
                    </p>
                    <div className="space-y-1">
                      <div
                        className="flex justify-between text-xs"
                        style={{ color: "oklch(0.6 0.03 280)" }}
                      >
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div
                        className="flex justify-between text-xs"
                        style={{ color: "oklch(0.6 0.03 280)" }}
                      >
                        <span>Shipping</span>
                        <span>
                          {order.shippingFee === 0
                            ? "FREE"
                            : formatCurrency(order.shippingFee)}
                        </span>
                      </div>
                      <div
                        className="flex justify-between font-bold"
                        style={{ color: "oklch(0.9 0.15 145)" }}
                      >
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                    {order.notes && (
                      <p
                        className="mt-2 text-xs italic"
                        style={{ color: "oklch(0.55 0.03 280)" }}
                      >
                        Note: {order.notes}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("all");
  const [subCount, setSubCount] = useState<number | null>(null);
  const { actor, isFetching } = useActor();

  const loadOrders = async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    setLoadError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await (actor as any).getAllOrders()) as Order[];
      if (result && result.length > 0) setOrders(result);
    } catch {
      setLoadError("Could not load live orders — showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async () => {
    if (!actor || isFetching) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emails = (await (actor as any).getNewsletterEmails()) as string[];
      setSubCount(emails.length);
    } catch {
      // ignore
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional manual reload pattern
  useEffect(() => {
    if (authed) {
      loadOrders();
      loadSubscribers();
    }
  }, [authed, actor, isFetching]);

  const handleStatusChange = async (orderId: string, status: string) => {
    // Optimistically update
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
    );
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).updateOrderStatus(orderId, status);
    } catch {
      // Live call failed, keep optimistic update
    }
  };

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  // Filtered orders
  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  // Recent activity (last 5)
  const recent = [...orders]
    .sort((a, b) => Number(BigInt(b.createdAt) - BigInt(a.createdAt)))
    .slice(0, 5);

  // Top products
  const productMap = new Map<string, { name: string; units: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const prev = productMap.get(item.productId);
      if (prev) {
        prev.units += Number(item.quantity);
      } else {
        productMap.set(item.productId, {
          name: item.productName,
          units: Number(item.quantity),
        });
      }
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);
  const maxUnits = topProducts[0]?.units ?? 1;

  return (
    <TooltipProvider>
      <div
        className="min-h-screen"
        style={{
          background: "oklch(0.1 0.015 280)",
          color: "oklch(0.9 0.02 280)",
        }}
        data-ocid="admin.page"
      >
        {/* Header */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
          style={{
            background: "oklch(0.13 0.018 280 / 0.95)",
            borderBottom: "1px solid oklch(0.22 0.04 280)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xl font-black tracking-widest uppercase"
              style={{ color: "oklch(0.88 0.18 280)" }}
            >
              TrendDrop
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
              style={{ background: "oklch(0.35 0.18 280)", color: "white" }}
            >
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-3">
            {loadError && (
              <span className="text-xs" style={{ color: "oklch(0.7 0.18 55)" }}>
                ⚠️ {loadError}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadOrders}
              disabled={loading}
              className="gap-2 text-xs"
              style={{
                background: "oklch(0.18 0.03 280)",
                borderColor: "oklch(0.3 0.06 280)",
                color: "oklch(0.7 0.1 280)",
              }}
              data-ocid="admin.secondary_button"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
              style={{
                background: "oklch(0.22 0.04 280)",
                color: "oklch(0.75 0.1 280)",
              }}
              data-ocid="admin.link"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Store
            </a>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Orders"
              value={loading ? "—" : String(orders.length)}
              icon={ShoppingBag}
              accent="oklch(0.75 0.15 280)"
              delay={0}
            />
            <StatCard
              label="Total Revenue"
              value={loading ? "—" : formatCurrency(totalRevenue)}
              icon={DollarSign}
              accent="oklch(0.75 0.15 145)"
              delay={0.05}
            />
            <StatCard
              label="Avg Order Value"
              value={loading ? "—" : formatCurrency(avgOrder)}
              icon={TrendingUp}
              accent="oklch(0.85 0.18 55)"
              delay={0.1}
            />
            <StatCard
              label="Pending Orders"
              value={loading ? "—" : String(pendingCount)}
              icon={Clock}
              accent="oklch(0.7 0.18 25)"
              delay={0.15}
            />
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Orders Table — left/wide */}
            <div className="xl:col-span-2 space-y-4">
              <Card
                className="border-0"
                style={{
                  background: "oklch(0.14 0.015 280)",
                  border: "1px solid oklch(0.22 0.04 280)",
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="text-base font-bold"
                      style={{ color: "oklch(0.9 0.05 280)" }}
                    >
                      Orders
                    </CardTitle>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.5 0.03 280)" }}
                    >
                      {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Tabs value={tab} onValueChange={setTab}>
                    <TabsList
                      className="h-8 gap-0.5 p-1"
                      style={{ background: "oklch(0.18 0.02 280)" }}
                    >
                      {[
                        "all",
                        "pending",
                        "processing",
                        "shipped",
                        "fulfilled",
                        "cancelled",
                      ].map((t) => (
                        <TabsTrigger
                          key={t}
                          value={t}
                          className="h-6 px-2.5 text-xs capitalize rounded"
                          data-ocid="orders.tab"
                        >
                          {t}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[520px]">
                    {loading ? (
                      <div
                        className="p-6 space-y-3"
                        data-ocid="orders.loading_state"
                      >
                        {["sk1", "sk2", "sk3", "sk4"].map((k) => (
                          <Skeleton
                            key={k}
                            className="h-12 w-full"
                            style={{ background: "oklch(0.2 0.02 280)" }}
                          />
                        ))}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div
                        className="flex flex-col items-center justify-center py-16 gap-3"
                        data-ocid="orders.empty_state"
                      >
                        <Package
                          className="w-10 h-10"
                          style={{ color: "oklch(0.4 0.05 280)" }}
                        />
                        <p
                          className="text-sm"
                          style={{ color: "oklch(0.5 0.03 280)" }}
                        >
                          No {tab !== "all" ? tab : ""} orders found
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow
                            style={{ borderColor: "oklch(0.2 0.02 280)" }}
                          >
                            {[
                              "Order ID",
                              "Customer",
                              "Items",
                              "Total",
                              "Date",
                              "Status",
                              "Action",
                              "",
                            ].map((h) => (
                              <TableHead
                                key={h}
                                className="text-xs"
                                style={{ color: "oklch(0.5 0.05 280)" }}
                              >
                                {h}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((order, i) => (
                            <OrderRow
                              key={order.orderId}
                              order={order}
                              index={i}
                              onStatusChange={handleStatusChange}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card
                  className="border-0"
                  style={{
                    background: "oklch(0.14 0.015 280)",
                    border: "1px solid oklch(0.22 0.04 280)",
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-sm font-bold flex items-center gap-2"
                      style={{ color: "oklch(0.9 0.05 280)" }}
                    >
                      <Clock
                        className="w-4 h-4"
                        style={{ color: "oklch(0.75 0.15 280)" }}
                      />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recent.map((order, i) => (
                      <motion.div
                        key={order.orderId}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="flex items-center justify-between py-1.5"
                        style={{
                          borderBottom:
                            i < recent.length - 1
                              ? "1px solid oklch(0.2 0.02 280)"
                              : "none",
                        }}
                        data-ocid={`activity.item.${i + 1}`}
                      >
                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: "oklch(0.82 0.04 280)" }}
                          >
                            {order.customerName}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: "oklch(0.5 0.03 280)" }}
                          >
                            {order.orderId} · {timeAgo(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-sm font-bold"
                            style={{ color: "oklch(0.8 0.15 145)" }}
                          >
                            {formatCurrency(order.total)}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Products */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card
                  className="border-0"
                  style={{
                    background: "oklch(0.14 0.015 280)",
                    border: "1px solid oklch(0.22 0.04 280)",
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-sm font-bold flex items-center gap-2"
                      style={{ color: "oklch(0.9 0.05 280)" }}
                    >
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: "oklch(0.75 0.15 280)" }}
                      />
                      Top Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.name} data-ocid={`products.item.${i + 1}`}>
                        <div className="flex justify-between text-xs mb-1">
                          <span
                            className="truncate pr-2"
                            style={{ color: "oklch(0.78 0.03 280)" }}
                          >
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold mr-1.5"
                              style={{
                                background: "oklch(0.28 0.1 280)",
                                color: "oklch(0.85 0.15 280)",
                              }}
                            >
                              {i + 1}
                            </span>
                            {p.name}
                          </span>
                          <span
                            className="shrink-0 font-semibold"
                            style={{ color: "oklch(0.75 0.15 280)" }}
                          >
                            {p.units} sold
                          </span>
                        </div>
                        <Progress
                          value={(p.units / maxUnits) * 100}
                          className="h-1.5"
                          style={{
                            background: "oklch(0.2 0.02 280)",
                          }}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Newsletter Subscribers */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Card
                  className="border-0"
                  style={{
                    background: "oklch(0.14 0.015 280)",
                    border: "1px solid oklch(0.22 0.04 280)",
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: "oklch(0.22 0.08 280)" }}
                      >
                        <Mail
                          className="w-5 h-5"
                          style={{ color: "oklch(0.75 0.18 280)" }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-xs uppercase tracking-widest"
                          style={{ color: "oklch(0.5 0.03 280)" }}
                        >
                          Newsletter
                        </p>
                        <p
                          className="text-2xl font-black"
                          style={{ color: "oklch(0.88 0.15 280)" }}
                        >
                          {subCount === null ? "—" : subCount}
                          <span
                            className="text-sm font-normal ml-1"
                            style={{ color: "oklch(0.5 0.03 280)" }}
                          >
                            subscribers
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions — bonus widget */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Card
                  className="border-0"
                  style={{
                    background: "oklch(0.14 0.015 280)",
                    border: "1px solid oklch(0.22 0.04 280)",
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-sm font-bold flex items-center gap-2"
                      style={{ color: "oklch(0.9 0.05 280)" }}
                    >
                      <Users
                        className="w-4 h-4"
                        style={{ color: "oklch(0.75 0.15 280)" }}
                      />
                      Order Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                      const count = orders.filter(
                        (o) => o.status === key,
                      ).length;
                      const pct = orders.length
                        ? (count / orders.length) * 100
                        : 0;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span
                            className="text-xs w-20 shrink-0"
                            style={{ color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                          <div className="flex-1">
                            <Progress
                              value={pct}
                              className="h-1.5"
                              style={{ background: "oklch(0.2 0.02 280)" }}
                            />
                          </div>
                          <span
                            className="text-xs w-5 text-right"
                            style={{ color: "oklch(0.55 0.03 280)" }}
                          >
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="text-center py-4 text-xs"
          style={{ color: "oklch(0.35 0.02 280)" }}
        >
          © {new Date().getFullYear()} TrendDrop Admin ·{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Built with caffeine.ai
          </a>
        </footer>
      </div>
    </TooltipProvider>
  );
}

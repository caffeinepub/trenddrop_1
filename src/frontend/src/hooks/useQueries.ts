import { useMutation, useQuery } from "@tanstack/react-query";
import type { Product } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addNewsletterEmail(email);
    },
  });
}

interface OrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: bigint;
    unitPrice: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  notes?: string;
}

export function usePlaceOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (orderInput: OrderInput): Promise<string> => {
      if (!actor) throw new Error("Actor not ready");
      // placeOrder is available on the backend but not reflected in the generated type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).placeOrder(orderInput) as Promise<string>;
    },
  });
}

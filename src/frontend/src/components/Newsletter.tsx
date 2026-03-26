import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubscribeNewsletter } from "../hooks/useQueries";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useSubscribeNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(email, {
      onSuccess: () => {
        toast.success("You're in! Welcome to the Trendify family 🎉");
        setEmail("");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });
  };

  return (
    <section
      className="bg-newsletter py-16 px-4 sm:px-6"
      data-ocid="newsletter.section"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand/10 rounded-full mb-4">
          <Mail className="w-6 h-6 text-brand" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mb-3">
          Stay Ahead of the Trends!
        </h2>
        <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
          Get exclusive early access to viral products, flash sales, and trend
          alerts delivered weekly.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-11 border-border focus-visible:ring-brand"
            data-ocid="newsletter.input"
          />
          <Button
            type="submit"
            disabled={isPending}
            className="bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider h-11 px-6 shrink-0"
            data-ocid="newsletter.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Join 50k+ Trendsetters!
          </span>{" "}
          No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

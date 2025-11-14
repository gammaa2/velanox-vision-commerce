import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import productMens from "@/assets/product-mens-1.jpg";
import productWomens from "@/assets/product-womens-1.jpg";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[800px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/40" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
              <p className="text-lg text-primary font-semibold uppercase tracking-wider">
                New Collection 2024
              </p>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                Style<br />Reimagined
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl">
                We build confidence through clothing — Discover premium fashion that defines you
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/shop">
                <Button size="lg" className="group text-lg px-8 py-6 shadow-glow">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-smooth group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover-lift border-0 shadow-elegant bg-card">
              <Shield className="h-14 w-14 mx-auto mb-6 text-primary" />
              <h3 className="font-bold text-xl mb-3">Sustainable</h3>
              <p className="text-muted-foreground">
                Eco-friendly materials and ethical production practices
              </p>
            </Card>
            <Card className="p-8 text-center hover-lift border-0 shadow-elegant bg-card">
              <Award className="h-14 w-14 mx-auto mb-6 text-primary" />
              <h3 className="font-bold text-xl mb-3">Luxury Fabric</h3>
              <p className="text-muted-foreground">
                Premium quality materials for ultimate comfort and style
              </p>
            </Card>
            <Card className="p-8 text-center hover-lift border-0 shadow-elegant bg-card">
              <Truck className="h-14 w-14 mx-auto mb-6 text-primary" />
              <h3 className="font-bold text-xl mb-3">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Free express delivery on all orders over ₹999
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/shop?category=men" className="group">
              <Card className="overflow-hidden hover:shadow-hover transition-smooth">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={productMens}
                    alt="Men's Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Men</h3>
                  <p className="text-muted-foreground">Explore Collection</p>
                </div>
              </Card>
            </Link>
            
            <Link to="/shop?category=women" className="group">
              <Card className="overflow-hidden hover:shadow-hover transition-smooth">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={productWomens}
                    alt="Women's Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Women</h3>
                  <p className="text-muted-foreground">Explore Collection</p>
                </div>
              </Card>
            </Link>
            
            <Link to="/shop?category=unisex" className="group">
              <Card className="overflow-hidden hover:shadow-hover transition-smooth">
                <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                  <span className="text-4xl font-bold text-muted-foreground">UNISEX</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Unisex</h3>
                  <p className="text-muted-foreground">Explore Collection</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to get special offers and exclusive updates
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background text-foreground"
            />
            <Button type="submit" variant="default">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

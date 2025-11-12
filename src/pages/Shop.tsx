import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchParams, priceRange, sortBy]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    const category = searchParams.get("category");
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const setCategory = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shop All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Category</h3>
            <div className="space-y-2">
              <Button
                variant={!searchParams.get("category") ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setCategory("all")}
              >
                All
              </Button>
              <Button
                variant={searchParams.get("category") === "men" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setCategory("men")}
              >
                Men
              </Button>
              <Button
                variant={searchParams.get("category") === "women" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setCategory("women")}
              >
                Women
              </Button>
              <Button
                variant={searchParams.get("category") === "unisex" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setCategory("unisex")}
              >
                Unisex
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={3000}
              step={100}
              className="mb-2"
            />
            <div className="text-sm text-muted-foreground">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No products found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-hover transition-smooth group">
                    <div className="aspect-square overflow-hidden bg-muted">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 capitalize">
                        {product.category}
                      </p>
                      <p className="font-bold">₹{product.price.toFixed(2)}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

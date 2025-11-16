import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/SearchBar";

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchParams, priceRange, sortBy, searchQuery]);

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

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="flex gap-8">
          <div className="w-64 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-2">Shop Collection</h1>
      <p className="text-xl text-muted-foreground mb-12">Discover your unique style</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Category</h3>
            <div className="space-y-2">
              <Button
                variant={!searchParams.get("category") ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setCategory("all")}
              >
                All Products
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
            <h3 className="font-bold text-lg mb-4">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={3000}
              step={100}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <SearchBar onSearch={setSearchQuery} placeholder="Search products..." />
          </div>
          <div className="flex justify-between items-center mb-8">
            <p className="text-lg font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

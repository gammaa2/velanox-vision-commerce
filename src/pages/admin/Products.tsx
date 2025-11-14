import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleSeedProducts = async () => {
    setSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-products', {
        body: {}
      });

      if (error) throw error;

      toast.success(data.message || "Products seeded successfully!");
      fetchProducts();
    } catch (error: any) {
      console.error('Error seeding products:', error);
      toast.error(error.message || "Failed to seed products");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Products Management</h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'} in catalog
          </p>
        </div>
        <Button 
          onClick={handleSeedProducts} 
          disabled={seeding || products.length > 0}
          size="lg"
        >
          {seeding ? "Seeding..." : "Seed Products"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">No products found</p>
          <p className="text-sm text-muted-foreground mb-6">Click "Seed Products" to add the initial 20 mock products</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover-lift">
              {/* Product Image */}
              <div className="aspect-square bg-muted relative overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">₹{Number(product.price).toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground block mb-1">Stock</span>
                    <p className="font-medium">{product.stock || 0} units</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Colors</span>
                    <p className="font-medium">{product.colors?.length || 0}</p>
                  </div>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.sizes.map((size) => (
                      <span key={size} className="px-2 py-1 bg-muted rounded text-xs font-medium">
                        {size}
                      </span>
                    ))}
                  </div>
                )}

                {product.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

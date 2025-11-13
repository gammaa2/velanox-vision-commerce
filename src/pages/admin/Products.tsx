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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Manage Products</h1>
          <p className="text-muted-foreground mt-2">
            Total Products: {products.length}
          </p>
        </div>
        <Button 
          onClick={handleSeedProducts} 
          disabled={seeding || products.length > 0}
        >
          {seeding ? "Seeding..." : "Seed Products"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No products found.</p>
            <p className="text-sm">Click "Seed Products" to add the initial 20 products.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{product.name}</span>
                  <span className="text-primary">₹{product.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <p className="font-medium">{product.stock}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Colors:</span>
                    <p className="font-medium">{product.colors?.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sizes:</span>
                    <p className="font-medium">{product.sizes?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
                {product.description && (
                  <p className="text-muted-foreground mt-4 text-sm">
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

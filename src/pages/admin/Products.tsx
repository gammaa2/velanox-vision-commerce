import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Products</h1>
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <h3 className="font-bold">{product.name}</h3>
            <p>₹{product.price} - Stock: {product.stock}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

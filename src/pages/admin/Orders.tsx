import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{order.total}</p>
                <p className="text-sm capitalize">{order.status}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

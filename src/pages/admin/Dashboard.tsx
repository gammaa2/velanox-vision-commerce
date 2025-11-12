import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, messages: 0 });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchStats();
  };

  const fetchStats = async () => {
    const [products, orders, users, messages] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      products: products.count || 0,
      orders: orders.count || 0,
      users: users.count || 0,
      messages: messages.count || 0,
    });
  };

  if (!isAdmin) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <Package className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.products}</h3>
          <p className="text-muted-foreground">Products</p>
        </Card>
        <Card className="p-6">
          <ShoppingCart className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.orders}</h3>
          <p className="text-muted-foreground">Orders</p>
        </Card>
        <Card className="p-6">
          <Users className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.users}</h3>
          <p className="text-muted-foreground">Users</p>
        </Card>
        <Card className="p-6">
          <MessageSquare className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.messages}</h3>
          <p className="text-muted-foreground">Messages</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/products"><Button size="lg" className="w-full">Manage Products</Button></Link>
        <Link to="/admin/orders"><Button size="lg" className="w-full" variant="outline">Manage Orders</Button></Link>
        <Link to="/admin/users"><Button size="lg" className="w-full" variant="outline">Manage Users</Button></Link>
        <Link to="/admin/messages"><Button size="lg" className="w-full" variant="outline">View Messages</Button></Link>
      </div>
    </div>
  );
}

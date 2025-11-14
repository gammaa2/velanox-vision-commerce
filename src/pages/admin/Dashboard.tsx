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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Velanox store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Active</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.products}</h3>
          <p className="text-sm text-muted-foreground">Total Products</p>
        </Card>
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent-foreground">New</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.orders}</h3>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </Card>
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary-foreground">Users</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.users}</h3>
          <p className="text-sm text-muted-foreground">Registered Users</p>
        </Card>
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Inbox</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.messages}</h3>
          <p className="text-sm text-muted-foreground">Contact Messages</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/products" className="block">
            <Button size="lg" className="w-full h-auto py-6 flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>Manage Products</span>
            </Button>
          </Link>
          <Link to="/admin/orders" className="block">
            <Button size="lg" variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span>View Orders</span>
            </Button>
          </Link>
          <Link to="/admin/users" className="block">
            <Button size="lg" variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </Link>
          <Link to="/admin/messages" className="block">
            <Button size="lg" variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>View Messages</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

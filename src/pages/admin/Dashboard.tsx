import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, MessageSquare, TrendingUp, DollarSign, Activity } from "lucide-react";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    users: 0, 
    messages: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

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
    const [products, orders, users, messages, ordersData, productsData] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total, status, created_at"),
      supabase.from("products").select("name, category, price, stock"),
    ]);

    // Calculate revenue and pending orders
    const totalRevenue = ordersData.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const pending = ordersData.data?.filter(o => o.status === 'pending').length || 0;

    setStats({
      products: products.count || 0,
      orders: orders.count || 0,
      users: users.count || 0,
      messages: messages.count || 0,
      revenue: totalRevenue,
      pendingOrders: pending
    });

    // Sales data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const salesByDay = last7Days.map(date => {
      const dayOrders = ordersData.data?.filter(o => 
        o.created_at?.startsWith(date)
      ) || [];
      const total = dayOrders.reduce((sum, o) => sum + Number(o.total), 0);
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: total
      };
    });
    setSalesData(salesByDay);

    // Top products
    const productMap = new Map();
    productsData.data?.slice(0, 5).forEach(p => {
      productMap.set(p.name, { name: p.name, value: p.stock || 0 });
    });
    setTopProducts(Array.from(productMap.values()));

    // Category distribution
    const categoryMap = new Map();
    productsData.data?.forEach(p => {
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
    });
    const catData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    setCategoryData(catData);
  };

  if (!isAdmin) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Velanox store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
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
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.revenue.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </Card>
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-orange-600" />
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">Pending</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.pendingOrders}</h3>
          <p className="text-sm text-muted-foreground">Pending Orders</p>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart 
          type="line" 
          data={salesData} 
          title="Sales Last 7 Days" 
          dataKey="value"
          xAxisKey="name"
        />
        <AnalyticsChart 
          type="bar" 
          data={topProducts} 
          title="Top Products by Stock" 
          dataKey="value"
          xAxisKey="name"
        />
      </div>

      <div className="mb-8">
        <AnalyticsChart 
          type="pie" 
          data={categoryData} 
          title="Products by Category" 
          dataKey="value"
        />
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

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  color: string;
  size: string;
  products: {
    name: string;
    price: number;
    images: string[];
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchCartItems(session.user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchCartItems = async (userId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (name, price, images)
      `)
      .eq("user_id", userId);

    if (data) {
      setCartItems(data as any);
    }
    setLoading(false);
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (!error) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart");
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    if (!error) {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
        <Link to="/auth">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-muted-foreground mb-8">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4 sm:p-6 hover-lift">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {item.products.images[0] ? (
                    <img
                      src={item.products.images[0]}
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{item.products.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm px-2 py-1 bg-muted rounded">{item.color}</span>
                      <span className="text-sm px-2 py-1 bg-muted rounded">{item.size}</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">₹{Number(item.products.price).toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                    <div className="flex items-center gap-2 border rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold">
                  {total > 999 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    "₹99"
                  )}
                </span>
              </div>
              {total <= 999 && (
                <p className="text-xs text-muted-foreground">
                  Add ₹{(1000 - total).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(total + (total > 999 ? 0 : 99)).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
            
            <Link to="/shop" className="block mt-4">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

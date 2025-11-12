import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">VELANOX</h3>
            <p className="text-sm text-muted-foreground">
              Style Reimagined — We build confidence through clothing.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop?category=men" className="hover:text-primary transition-smooth">Men</Link></li>
              <li><Link to="/shop?category=women" className="hover:text-primary transition-smooth">Women</Link></li>
              <li><Link to="/shop?category=unisex" className="hover:text-primary transition-smooth">Unisex</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-smooth">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-smooth">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-smooth">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-smooth">Privacy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/account" className="hover:text-primary transition-smooth">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-smooth">Cart</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Velanox Apparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

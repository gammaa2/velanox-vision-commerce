import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  return (
    <Link to={`/shop/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-elegant hover-lift cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-smooth group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 uppercase text-xs"
          >
            {category}
          </Badge>
        </div>
        <div className="p-5 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-smooth">
            {name}
          </h3>
          <p className="text-xl font-bold">₹{price.toFixed(2)}</p>
        </div>
      </Card>
    </Link>
  );
};

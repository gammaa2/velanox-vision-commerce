export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6">About Velanox Apparel</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Style Reimagined — We build confidence through clothing.
        </p>

        <div className="prose prose-lg max-w-none space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            Founded with a vision to revolutionize the fashion industry, Velanox Apparel combines
            cutting-edge design with sustainable practices. We believe that style should never
            compromise comfort or conscience.
          </p>

          <h2 className="text-3xl font-bold mt-12">Our Mission</h2>
          <p className="text-muted-foreground">
            To create premium, futuristic clothing that empowers individuals to express their unique
            identity while contributing to a sustainable future. Every piece we design is crafted
            with meticulous attention to detail and a commitment to quality.
          </p>

          <h2 className="text-3xl font-bold mt-12">Sustainability</h2>
          <p className="text-muted-foreground">
            At Velanox, sustainability isn't just a buzzword — it's our core value. We use eco-friendly
            materials, ethical production processes, and work with suppliers who share our commitment
            to the environment.
          </p>

          <h2 className="text-3xl font-bold mt-12">Quality & Craftsmanship</h2>
          <p className="text-muted-foreground">
            Each garment is made from luxury fabrics chosen for their durability, comfort, and
            aesthetic appeal. Our designs blend minimalist elegance with bold, contemporary elements
            to create pieces that stand the test of time.
          </p>
        </div>
      </div>
    </div>
  );
}

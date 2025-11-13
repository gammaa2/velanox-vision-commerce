import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (existingProducts && existingProducts.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Products already seeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const products = [
      // Men's Products (8)
      {
        name: 'Geometric Oversized Tee',
        category: 'men',
        price: 1299,
        description: 'Premium black oversized t-shirt with minimal geometric logo. Crafted from high-quality cotton for ultimate comfort.',
        stock: 50,
        colors: ['Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-tshirt-1.jpg'],
        material: 'Premium Cotton'
      },
      {
        name: 'Futuristic Navy Tee',
        category: 'men',
        price: 1499,
        description: 'Navy blue oversized t-shirt with futuristic V-design elements. Perfect blend of style and comfort.',
        stock: 45,
        colors: ['Navy', 'Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-tshirt-2.jpg'],
        material: '100% Organic Cotton'
      },
      {
        name: 'Essential White Tee',
        category: 'men',
        price: 999,
        description: 'Classic white oversized t-shirt with subtle branding. A wardrobe essential for every modern man.',
        stock: 60,
        colors: ['White', 'Beige'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-tshirt-3.jpg'],
        material: 'Premium Cotton Blend'
      },
      {
        name: 'Black Denim Jacket',
        category: 'men',
        price: 2999,
        description: 'Luxury black denim jacket with premium silver hardware. Timeless style meets modern design.',
        stock: 30,
        colors: ['Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-jacket-1.jpg'],
        material: 'Premium Denim'
      },
      {
        name: 'Indigo Denim Jacket',
        category: 'men',
        price: 2799,
        description: 'Dark blue denim jacket with modern cut. Versatile piece for any season.',
        stock: 35,
        colors: ['Navy', 'Blue'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-jacket-2.jpg'],
        material: 'Japanese Denim'
      },
      {
        name: 'Minimal Black Hoodie',
        category: 'men',
        price: 1999,
        description: 'Black oversized hoodie with minimal branding. Perfect for streetwear enthusiasts.',
        stock: 40,
        colors: ['Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-hoodie-1.jpg'],
        material: 'Premium Fleece'
      },
      {
        name: 'Cloud Grey Hoodie',
        category: 'men',
        price: 1899,
        description: 'Premium grey oversized hoodie with modern design. Comfort meets luxury.',
        stock: 42,
        colors: ['Grey', 'Beige'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-hoodie-2.jpg'],
        material: 'Soft Fleece Cotton'
      },
      {
        name: 'Tapered Joggers',
        category: 'men',
        price: 1699,
        description: 'Luxury black joggers with tapered fit. Premium athleisure for the modern lifestyle.',
        stock: 55,
        colors: ['Black', 'Navy', 'Olive'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/mens-joggers.jpg'],
        material: 'Tech Fabric'
      },
      // Women's Products (8)
      {
        name: 'Essential Crop Top',
        category: 'women',
        price: 899,
        description: 'Premium white crop top with modern minimalist design. Perfect for everyday wear.',
        stock: 50,
        colors: ['White', 'Black', 'Beige'],
        sizes: ['XS', 'S', 'M', 'L'],
        images: ['/src/assets/products/womens-crop-1.jpg'],
        material: 'Stretch Cotton'
      },
      {
        name: 'Elegant Crop Top',
        category: 'women',
        price: 1099,
        description: 'Luxury black crop top with elegant cut. Sophisticated design for confident style.',
        stock: 45,
        colors: ['Black', 'White'],
        sizes: ['XS', 'S', 'M', 'L'],
        images: ['/src/assets/products/womens-crop-2.jpg'],
        material: 'Premium Lycra Blend'
      },
      {
        name: 'Oversized Beige Shirt',
        category: 'women',
        price: 1799,
        description: 'Premium beige oversized shirt with modern design. Effortlessly chic and comfortable.',
        stock: 38,
        colors: ['Beige', 'White', 'Black'],
        sizes: ['XS', 'S', 'M', 'L'],
        images: ['/src/assets/products/womens-shirt-1.jpg'],
        material: 'Luxury Cotton'
      },
      {
        name: 'Classic White Shirt',
        category: 'women',
        price: 1699,
        description: 'Luxury white oversized shirt with elegant fit. Timeless sophistication.',
        stock: 40,
        colors: ['White', 'Beige'],
        sizes: ['XS', 'S', 'M', 'L'],
        images: ['/src/assets/products/womens-shirt-2.jpg'],
        material: 'Premium Silk Blend'
      },
      {
        name: 'High-Waist Blue Jeans',
        category: 'women',
        price: 2299,
        description: 'Premium blue high-waist jeans. Perfect fit and luxury comfort.',
        stock: 35,
        colors: ['Blue', 'Navy'],
        sizes: ['24', '26', '28', '30', '32'],
        images: ['/src/assets/products/womens-jeans-1.jpg'],
        material: 'Stretch Denim'
      },
      {
        name: 'Skinny Black Jeans',
        category: 'women',
        price: 2199,
        description: 'Luxury black skinny jeans. Flattering fit with premium comfort.',
        stock: 40,
        colors: ['Black'],
        sizes: ['24', '26', '28', '30', '32'],
        images: ['/src/assets/products/womens-jeans-2.jpg'],
        material: 'Premium Stretch Denim'
      },
      {
        name: 'Minimalist Sneakers',
        category: 'women',
        price: 2499,
        description: 'Premium white minimalist sneakers with sleek design. Comfort meets style.',
        stock: 30,
        colors: ['White', 'Black'],
        sizes: ['36', '37', '38', '39', '40'],
        images: ['/src/assets/products/womens-sneakers.jpg'],
        material: 'Premium Leather'
      },
      {
        name: 'Luxury Crossbody Bag',
        category: 'women',
        price: 2999,
        description: 'Black leather crossbody bag with gold hardware. Sophisticated elegance.',
        stock: 25,
        colors: ['Black', 'Beige'],
        sizes: ['One Size'],
        images: ['/src/assets/products/womens-bag.jpg'],
        material: 'Genuine Leather'
      },
      // Unisex Products (4)
      {
        name: 'Circuit Graphic Tee',
        category: 'unisex',
        price: 1399,
        description: 'Black unisex graphic t-shirt with futuristic circuit typography. Bold statement piece.',
        stock: 50,
        colors: ['Black', 'White'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/unisex-tee-1.jpg'],
        material: 'Premium Cotton'
      },
      {
        name: 'Abstract Art Tee',
        category: 'unisex',
        price: 1299,
        description: 'White unisex graphic t-shirt with vibrant abstract art print. Express your creativity.',
        stock: 48,
        colors: ['White', 'Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/unisex-tee-2.jpg'],
        material: '100% Organic Cotton'
      },
      {
        name: 'Performance Tracksuit',
        category: 'unisex',
        price: 2799,
        description: 'Premium black unisex tracksuit with modern athletic design. Luxury athleisure.',
        stock: 32,
        colors: ['Black', 'Navy', 'Grey'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/unisex-tracksuit.jpg'],
        material: 'Performance Fabric'
      },
      {
        name: 'Olive Bomber Jacket',
        category: 'unisex',
        price: 2899,
        description: 'Luxury olive green unisex bomber jacket. Sleek design with premium finish.',
        stock: 28,
        colors: ['Olive', 'Black', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/src/assets/products/unisex-bomber.jpg'],
        material: 'Water-Resistant Nylon'
      }
    ];

    const { data, error } = await supabase.from('products').insert(products);

    if (error) {
      console.error('Error seeding products:', error);
      throw error;
    }

    console.log('Successfully seeded 20 products');

    return new Response(
      JSON.stringify({ message: 'Successfully seeded 20 products', count: 20 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in seed-products function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

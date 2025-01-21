'use client';

import { client } from '@/sanity/lib/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/navbar';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categories: { name: string }[]; // Assuming category is an array of objects
}

interface RandomProduct {
  _id: string;
  name: string;
  imageUrl: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const ProductListingPage = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [randomProducts, setRandomProducts] = useState<RandomProduct[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const query = `*[_type == "product" && _id == "${params.id}"][0]{
        _id,
        name,
        description,
        price,
        "imageUrl": image.asset->url,
        "category": category->name
      }`;

      const data = await client.fetch(query);
      setProduct(data);
    };

    const fetchRandomProducts = async () => {
      const query = `*[_type == "product"][0..3]{
        _id,
        name,
        "imageUrl": image.asset->url
      }`;

      const randomData = await client.fetch(query);
      setRandomProducts(randomData);
    };

    if (params.id) {
      fetchProduct();
      fetchRandomProducts();
    }
  }, [params.id]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleBuyNow = () => {
    if (product) {
      // For simplicity, let's just log the product info for now
      alert(`Redirecting to checkout for ${product.name}`);
    }
  };

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <section className="px-4 md:px-8 py-12 text-[#2A254B]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg object-cover w-full"
          />
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg mb-6">${product.price}</p>
            <p className="mb-6">{product.description}</p>
            <div className="flex gap-2 mb-6">
              {/* Display categories if they exist */}
              {product.categories?.map((category) => (
                <span
                  key={category.name}
                  className="bg-[#F9F9F9] text-[#2A254B] py-2 px-4 rounded-lg"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product)}
                className="bg-[#2A254B] text-white py-3 px-6 mt-4 rounded-md"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-[#F9F9F9] text-[#2A254B] py-2 px-6 rounded-lg border"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Random Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {randomProducts.map((randomProduct) => (
              <div key={randomProduct._id} className="w-full h-auto">
                <Image
                  src={randomProduct.imageUrl}
                  alt={randomProduct.name}
                  width={250}
                  height={250}
                  className="w-full h-[80%] object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:translate-y-1"
                />
                <div className="mt-4 text-[#2A254B]">
                  <h3 className="py-2">{randomProduct.name}</h3>
                  <p>${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductListingPage;

"use client";

import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// import CollectionPage from '../Collection/page';
import Link from 'next/link';

const Ceramics = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCeramics = async () => {
      const ceramics = await getCeramics();
      setProducts(ceramics);
    };

    fetchCeramics();
  }, []);

  const getCeramics = async () => {
    const ceramics = await client.fetch(
      `*[_type=="product"]{
  _id,
      name,
      price,
  "imageUrl": images[0].asset->url
}
`
    );
    console.log('Ceramics Data from Sanity:', ceramics); // Check the ceramics data from Sanity

    return ceramics;
  };
  console.log('Products state:', products); // Check the state of products after being set

  return (
    <>
      <section>
        <div className="px-4 md:px-8 py-12 text-[#2A254B] mt-12">
          {/* Title */}
          <h1 className="text-2xl font-semibold">New Ceramics</h1>

          {/* Product Items */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {products.map((product) => (
              <div key={product._id} className="w-full h-auto">
                <Image
                  src={product.imageUrl}
                  height={700}
                  width={700}
                  alt={product.name}
                  className="w-full h-[80%] object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:translate-y-1"
                />
                <div className="mt-4 text-[#2A254B]">
                  <p className="py-2">{product.name}</p>
                  <p>${product.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View Collection Button */}
          <div className="my-10 flex justify-center items-center">
          <Link href="/Collection">
    <button className="bg-[#F9F9F9] py-4 px-6 rounded-[5px] text-[#2A254B] hover:bg-[#E6E6E6] transition-colors">
      View Collection
    </button>
  </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Ceramics;

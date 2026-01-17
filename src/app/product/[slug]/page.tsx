"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// Inline SVG Placeholder
const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
    <rect width='100%' height='100%' fill='#e5e7eb'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-size='24' fill='#374151' font-family='Arial, Helvetica, sans-serif'>
      Product Image
    </text>
  </svg>`);

export default function ProductPage() {
  const { slug } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProduct(data);

      const relatedQuery = supabase
        .from("products")
        .select("*")
        .neq("slug", slug)
        .limit(4);

      const conditions: string[] = [];
      if (data.form_factor) conditions.push(`form_factor.eq.${data.form_factor}`);
      if (data.processor) conditions.push(`processor.eq.${data.processor}`);
      if (data.memory) conditions.push(`memory.eq.${data.memory}`);

      if (conditions.length > 0) {
        relatedQuery.or(conditions.join(","));
      }

      const { data: related } = await relatedQuery;
      setRelatedProducts(related || []);
    };

    fetchProduct();
  }, [slug]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const stockQty = product?.stock_quantity ?? 0;

  const increaseQty = () => {
    if (quantity < stockQty) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQty = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* PRODUCT SECTION */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image */}
        <div className="lg:w-1/2 w-full flex justify-center">
          <div
            className="w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] relative rounded-xl overflow-hidden shadow cursor-zoom-in"
            onClick={() => setZoomOpen(true)}
          >
            <Image
              src={product.thumbnail_url || PLACEHOLDER_SVG}
              alt={product.product_name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2 w-full flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="text-gray-500">SKU: {product.sku}</p>
            <p className="text-gray-700">
              {product.description || "No description available."}
            </p>

            {/* Quantity selector (only if stock > 0) */}
            {stockQty > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={decreaseQty}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    onClick={increaseQty}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stock Info */}
          <p className="text-sm text-gray-600">
            Available Stock:{" "}
            <span
              className={`font-semibold ${
                stockQty > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {stockQty}
            </span>
          </p>

          {/* IN STOCK */}
          {stockQty > 0 ? (
            <button className="w-xs bg-yellow-400 text-black py-3 rounded hover:bg-yellow-500 font-semibold">
              Add to Cart
            </button>
          ) : (
            /* OUT OF STOCK */
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
              {/* Locked Email */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-1 w-full px-3 py-2 border rounded bg-gray-200 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="mt-1 w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Wishlist / Waitlist */}
              <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold">
                Add to Wishlist / Waitlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ZOOM MODAL */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-zoom-out"
          onClick={() => setZoomOpen(false)}
        >
          <div className="w-[80%] max-w-4xl h-[80%] relative">
            <Image
              src={product.thumbnail_url || PLACEHOLDER_SVG}
              alt={product.product_name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group border rounded-lg p-3 hover:shadow transition"
              >
                <div className="relative w-full h-[180px] mb-3 overflow-hidden rounded">
                  <Image
                    src={item.thumbnail_url || PLACEHOLDER_SVG}
                    alt={item.product_name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="text-sm font-semibold line-clamp-2">
                  {item.product_name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useAuthRole } from "@/app/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Pencil, Trash2 } from "lucide-react";

const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
    <rect width='100%' height='100%' fill='#e5e7eb'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-size='24' fill='#374151'>
      Product Image
    </text>
  </svg>`);

export default function ProductPage() {
  const router = useRouter();
  const { slug } = useParams();

  const { user, loading: authLoading } = useAuth();
  const { isAllowed } = useAuthRole(["admin", "shop manager"]);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* 🔒 LOGIN REQUIRED */
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/product/${slug}`);
    }
  }, [authLoading, user, router, slug]);

  /* 📦 FETCH PRODUCT */
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!data) return;

      setProduct(data);
      setMainImage(data.thumbnail_url || PLACEHOLDER_SVG);

      const { data: related } = await supabase
        .from("products")
        .select("*")
        .neq("slug", slug)
        .limit(4);

      setRelatedProducts(related || []);
    };

    fetchProduct();
  }, [slug]);

  /* 🔍 ZOOM SCROLL LOCK */
  useEffect(() => {
    document.body.style.overflow = zoomOpen ? "hidden" : "auto";
  }, [zoomOpen]);

  /* ⛔ SAFE RETURNS */
  if (authLoading) return null;
  if (!user) return null;
  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const stockQty = product.stock_quantity ?? 0;

  const gallery = [
    product.thumbnail_url || PLACEHOLDER_SVG,
    ...(product.gallery_urls || []),
  ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* IMAGE SECTION */}
        <div className="lg:w-1/2 w-full flex flex-col items-center">
          <div
            className="relative w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow group"
          >
            <Image
              src={mainImage}
              alt={product.product_name}
              fill
              className="object-cover"
              unoptimized
            />

            {/* 🛠 ADMIN / SHOP MANAGER ICONS */}
            {isAllowed && (
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => router.push(`/edit-product?id=${product.id}`)}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => alert("Delete logic here")}
                  className="p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* GALLERY */}
          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            {gallery.map((url: string, idx: number) => (
              <div
                key={idx}
                className={`relative w-[80px] h-[80px] rounded border cursor-pointer ${
                  selectedIndex === idx ? "border-blue-500" : ""
                }`}
                onClick={() => {
                  setMainImage(url);
                  setSelectedIndex(idx);
                }}
              >
                <Image src={url} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.product_name}</h1>
          <p className="text-gray-500">SKU: {product.sku}</p>

          <p className="text-sm">
            Stock:{" "}
            <span className={stockQty > 0 ? "text-green-600" : "text-red-500"}>
              {stockQty}
            </span>
          </p>

          {stockQty > 0 && (
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  product_name: product.product_name,
                  image_url: mainImage,
                  sku: product.sku,
                  slug: product.slug,
                  quantity,
                })
              }
              className="bg-yellow-400 px-6 py-3  cursor-pointer rounded font-semibold hover:bg-yellow-500"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="border rounded p-3 hover:shadow"
              >
                <div className="relative h-[160px] mb-2">
                  <Image
                    src={item.thumbnail_url || PLACEHOLDER_SVG}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold line-clamp-2">
                  {item.product_name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

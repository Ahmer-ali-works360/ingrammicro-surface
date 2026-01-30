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

  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string>(PLACEHOLDER_SVG);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ✅ Quantity state (missing in your code)
  const [quantity, setQuantity] = useState(1);
  const [companyName, setCompanyName] = useState("");

  // ✅ ZOOM STATES
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  /* 🗑 SAFE DELETE */
  const handleDeleteProduct = async () => {
    if (!product?.id) return;

    setDeleting(true);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    setDeleting(false);

    if (error) {
      alert("Failed to delete product");
      return;
    }

    router.push("/create-demo-kit");
  };

  const stockQty = product?.stock_quantity ?? 0;

  const increaseQty = () => {
    if (quantity < stockQty) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQty = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  /* ⛔ SAFE RENDERS */
  if (authLoading || !user) return null;
  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const outOfStock = stockQty === 0;

  const gallery = [
    product.thumbnail_url || PLACEHOLDER_SVG,
    ...(product.gallery_urls || []),
  ].filter(Boolean);

  // ✅ IMAGE ZOOM FUNCTIONALITY
  const handleZoomImage = (imageUrl: string) => {
    setZoomImage(imageUrl);
    setZoomOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* IMAGE */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <div className="relative w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow group">
            {product.five_g && (
              <Image
                src="/5g-logo.png"
                alt="5G"
                width={40}
                height={40}
                className="absolute top-2 right-2 z-10"
              />
            )}

            {outOfStock && (
              <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
              </div>
            )}

            <Image
              src={mainImage}
              alt={product.product_name}
              fill
              className="object-cover cursor-zoom-in"
              unoptimized
              onClick={() => handleZoomImage(mainImage)}
            />

            {isAllowed && (
              <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition z-20">
                <button
                  onClick={() => router.push(`/edit-product?id=${product.id}`)}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
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
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  onClick={() => handleZoomImage(url)} // Enable zoom
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2 w-full flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="text-gray-500">SKU: {product.sku}</p>

            {/* Description as Bullet Points */}
            {product.description ? (
              <ul className="ml-5 list-disc text-gray-700 space-y-2">
                {product.description
                  .split("\n")
                  .map((line: string, idx: number) => (
                    <li key={idx}>{line}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-700">No description available.</p>
            )}

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

            {/* Stock */}
            <p className="text-sm mt-2">
              Stock:{" "}
              <span className={outOfStock ? "text-red-600" : "text-green-600"}>
                {stockQty}
              </span>
            </p>

            {/* Add to Cart */}
            {/* IN STOCK / OUT OF STOCK LOGIC */}
{stockQty > 0 ? (
  /* ✅ IN STOCK */
  <button
    className="w-xs bg-yellow-400 text-black py-3 rounded hover:bg-yellow-500 font-semibold"
    onClick={() =>
      addToCart({
        id: product.id,
        product_name: product.product_name,
        image_url: mainImage,
        sku: product.sku,
        slug: product.slug,
        quantity: quantity,
      })
    }
  >
    Add to Cart
  </button>
) : (
  /* ❌ OUT OF STOCK */
  <div className="border rounded-lg p-4 bg-gray-50 space-y-4 mt-4">
    {/* Email */}
    <div>
      <label className="text-sm font-medium text-gray-600">Email</label>
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

    {/* Waitlist Button */}
    <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold">
      Add to Wishlist / Waitlist
    </button>
  </div>
)}

          </div>
        </div>
      </div>

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => {
              const out =
                item.stock_quantity === 0 || item.stock_quantity == null;

              return (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="border rounded p-3 hover:shadow"
                >
                  <div className="relative h-[160px] mb-2 overflow-hidden">
                    {item.five_g && (
                      <Image
                        src="/5g-logo.png"
                        alt="5G"
                        width={30}
                        height={30}
                        className="absolute top-2 right-2 z-10"
                      />
                    )}

                    {out && (
                      <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}

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
              );
            })}
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Delete Product</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product?
              <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
                disabled={deleting}
              >
                No
              </button>

              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ZOOM MODAL ================= */}
      {zoomOpen && zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={zoomImage}
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
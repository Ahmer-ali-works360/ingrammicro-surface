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

  const [quantity, setQuantity] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  // ✅ ZOOM STATES
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ✅ WAITLIST MODAL STATES
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [alreadyOnWaitlist, setAlreadyOnWaitlist] = useState(false);

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

  /* ✅ CHECK WAITLIST */
useEffect(() => {
  if (!user?.email || !product?.id) return;

  const checkWaitlist = async () => {
    const res = await fetch(
      `/api/check-waitlist?email=${user.email}&productId=${product.id}`
    );
    const data = await res.json();
    setAlreadyOnWaitlist(data.alreadyAdded);
  };

  checkWaitlist();
}, [user, product]);

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




  // ✅ WAITLIST SUBMIT — API ke through
  const handleWaitlistSubmit = async () => {
    if (!user?.email) return;

    setWaitlistLoading(true);

    const response = await fetch("/api/add-to-waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        companyName: companyName || null,
        productId: product.id,
      }),
    });

    const result = await response.json();
    setWaitlistLoading(false);
    setShowWaitlistModal(false); // Confirmation modal band karo

    if (!response.ok) {
      alert(result.message || "Something went wrong.");
      return;
    }


  // ✅ User ko email
  fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: user.email,
      type: "WAITLIST_USER",
      data: {
        productName: product.product_name,
        email: user.email,
      },
    }),
  });

  // ✅ Admin ko email
  fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "ahmer.ali@works360.com",
      type: "WAITLIST_ADMIN",
      data: {
        productName: product.product_name,
        email: user.email,
        companyName: companyName || null,
      },
    }),
  });

    setWaitlistSuccess(true); // Success modal dikhao
    setAlreadyOnWaitlist(true); 
    setCompanyName("");
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
              <div className="absolute top-3 left-3 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition z-20">
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
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2 w-full flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{product.product_name}</h1>
            <p className="text-gray-500">SKU: {product.sku}</p>

            {/* Separator line */}
            <hr className="border-gray-300" />

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
            {stockQty > 0 ? (
              /* ✅ IN STOCK */
              <button
                className="w-xs custom-blue text-white py-3 rounded font-semibold transition duration-200"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    product_name: product.product_name,
                    image_url: mainImage,
                    sku: product.sku,
                    brand: product.brand ?? "—",
                    processor: product.processor ?? "—",
                    memory: product.memory ?? "—",
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

                {/* ✅ Waitlist Button — ab modal kholega */}
{alreadyOnWaitlist ? (
  <p className="text-green-600 font-semibold text-sm text-center py-2">
    ✓ You are already on the waitlist for this product!
  </p>
) : (
  <button
    onClick={() => setShowWaitlistModal(true)}
    disabled={waitlistLoading || !companyName.trim()}
    className="w-full custom-blue cursor-pointer text-white py-3 rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
  >
    Add to Waitlist
  </button>
)}
              </div>
            )}

            {/* Separator line */}
            <hr className="border-gray-300" />
          </div>
        </div>
      </div>

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => {
              const out = item.stock_quantity === 0 || item.stock_quantity == null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col group relative"
                >
                  <div className="relative left-0 w-full h-[35px] p-2 pointer-events-none">
                    {out && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                    {item.five_g && (
                      <Image
                        src="/5g-logo.png"
                        alt="5G Badge"
                        width={30}
                        height={30}
                        className="absolute top-2 right-2 z-10"
                      />
                    )}
                  </div>

                  {/* Image div */}
                  <div className="w-full h-[200px] relative rounded-t-2xl overflow-hidden">
                    <Image
                      src={item.thumbnail_url || PLACEHOLDER_SVG}
                      alt={item.product_name}
                      fill
                      className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => {
                        if (!item.slug) return;
                        router.push(`/product/${item.slug}`);
                      }}
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">
                        {item.product_name}
                      </h3>

                      <div className="flex-1" />

                      <p className="text-xs text-gray-500 text-center mt-6">
                        SKU: {item.sku}
                      </p>
                    </div>

                    <div className="flex justify-center mt-1">
                      <button
                        disabled={out}
                        onClick={() => {
                          if (out) return;
                          addToCart({
                            id: item.id,
                            product_name: item.product_name,
                            image_url: item.thumbnail_url,
                            sku: item.sku,
                            brand: item.brand ?? "—",
                            processor: item.processor ?? "—",
                            memory: item.memory ?? "—",
                            quantity: 1,
                          });
                        }}
                        className={`w-32 py-2 px-4 rounded text-sm transition ${
                          out
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "custom-blue text-white cursor-pointer"
                        }`}
                      >
                        {out ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
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
                className="px-4 py-2 cursor-pointer rounded border hover:bg-gray-100"
                disabled={deleting}
              >
                No
              </button>

              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 cursor-pointer rounded bg-red-600 text-white hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ WAITLIST CONFIRMATION MODAL */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Join Waitlist</h2>
            <p className="text-gray-600 mb-6">
              Do you want to be added to the waitlist for this product?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="px-4 py-2 cursor-pointer rounded border hover:bg-gray-100"
                disabled={waitlistLoading}
              >
                No
              </button>

              <button
  onClick={handleWaitlistSubmit}
  className="px-4 py-2 rounded  cursor-pointer custom-blue text-white"
  disabled={waitlistLoading}
>
  {waitlistLoading ? "Adding..." : "Yes, Add to Waitlist"}
</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ WAITLIST SUCCESS MODAL */}
      {waitlistSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg text-center">
            
            <h2 className="text-xl font-semibold mb-2">Added to the waitlist!</h2>
            <p className="text-gray-600 mb-6">
              You will be notified when product stock is updated.
            </p>
            <button
  onClick={() => setWaitlistSuccess(false)}
  className="px-6 py-2 rounded  cursor-pointer custom-blue text-white"
>
  OK
</button>
          </div>
        </div>
      )}

      {/* ZOOM MODAL */}
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
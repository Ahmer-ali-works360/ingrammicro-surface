"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
  <rect width='100%' height='100%' fill='#e5e7eb'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
    font-size='24' fill='#374151' font-family='Arial, Helvetica, sans-serif'>
    Demo Product Image
  </text>
</svg>`);

export default function CreateDemoKitPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    formFactor: [] as string[],
    processor: [] as string[],
    screenSize: [] as string[],
    memory: [] as string[],
    storage: [] as string[],
    copilot: [] as string[],
    fiveG: [] as string[],
  });

  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const { role } = useAuth();

  // 🔒 AUTH CHECK (NO BLINK)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login?redirect=/create-demo-kit");
      } else {
        setAuthLoading(false);
      }
    });
  }, [router]);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.error("Error fetching products:", error);
      else setProducts(data || []);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const list = prev[category as keyof typeof prev];
      return {
        ...prev,
        [category]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  // ✅ FILTER + SORT
  const filteredProducts = products
    .filter((product) => {
      if (
  product.status === "Private" &&
  !["admin", "shop manager"].includes(role ?? "")
)
  return false;

      if (
        selectedFilters.formFactor.length &&
        !selectedFilters.formFactor.includes(product.form_factor)
      )
        return false;

      if (
        selectedFilters.processor.length &&
        !selectedFilters.processor.includes(product.processor)
      )
        return false;

      if (
        selectedFilters.screenSize.length &&
        !selectedFilters.screenSize.includes(product.screen_size)
      )
        return false;

      if (
        selectedFilters.memory.length &&
        (!product.memory || !selectedFilters.memory.includes(product.memory))
      )
        return false;

      if (
        selectedFilters.storage.length &&
        (!product.storage || !selectedFilters.storage.includes(product.storage))
      )
        return false;

      if (
        selectedFilters.copilot.length &&
        !selectedFilters.copilot.includes(product.copilot ? "Yes" : "No")
      )
        return false;

      if (
        selectedFilters.fiveG.length &&
        !selectedFilters.fiveG.includes(product.five_g ? "Yes" : "No")
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      const aOut = a.stock_quantity === 0 || a.stock_quantity == null;
      const bOut = b.stock_quantity === 0 || b.stock_quantity == null;
      if (aOut === bOut) return 0;
      return aOut ? 1 : -1;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {authLoading ? null : (
        <>
          {/* Banner */}
          <div className="w-full overflow-hidden">
            <Image
              src="/products-banner.png"
              alt="Demo Kit Banner"
              width={1600}
              height={400}
              priority
              className="w-full h-[360px] object-cover"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            {/* Filters */}
            <aside className="bg-white rounded-2xl shadow p-5 space-y-4">
              <FilterGroup title="Form Factor" options={["2 in 1's", "Accessories", "Notebooks"]} category="formFactor" selectedFilters={selectedFilters} onChange={handleFilterChange} />
              <FilterGroup title="Processor" options={["Intel® Core™ Ultra 5","Intel® Core™ Ultra 7","Snapdragon X Elite","Snapdragon X Plus"]} category="processor" selectedFilters={selectedFilters} onChange={handleFilterChange} />
              <FilterGroup title="Screen Size" options={['12"','13"','13.8"','15"']} category="screenSize" selectedFilters={selectedFilters} onChange={handleFilterChange} />
              <FilterGroup title="Memory" options={["16GB","32GB"]} category="memory" selectedFilters={selectedFilters} onChange={handleFilterChange} />
              <FilterGroup title="Storage" options={["256GB","512GB","1TB"]} category="storage" selectedFilters={selectedFilters} onChange={handleFilterChange} />
              <FilterGroup title="Copilot+ PC" options={["Yes"]} category="copilot" selectedFilters={selectedFilters} onChange={handleFilterChange} />
              <FilterGroup title="5G Enabled" options={["Yes"]} category="fiveG" selectedFilters={selectedFilters} onChange={handleFilterChange} />
            </aside>

            {/* Products */}
            <section className="flex flex-col">
              {(role === "admin"|| role === "shop manager") && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => router.push("/add-product")}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Add Product
                  </button>
                </div>
              )}

              {loading ? (
                <p className="text-center py-10 text-gray-500">Loading products...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  No products found for selected filters.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const outOfStock =
                      product.stock_quantity === 0 ||
                      product.stock_quantity == null;

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col group"
                      >
                        <div className="w-full h-[200px] relative rounded-t-2xl overflow-hidden">
                          {product.five_g && (
                            <Image
                              src="/5g-logo.png"
                              alt="5G Badge"
                              width={40}
                              height={40}
                              className="absolute top-2 right-2 z-10"
                            />
                          )}

                          {outOfStock && (
                            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              Out of Stock
                            </div>
                          )}

                          <Image
                            src={product.thumbnail_url || PLACEHOLDER_SVG}
                            alt={product.product_name}
                            fill
                            className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onClick={() => {
                              if (!product.slug) return;
                              router.push(`/product/${product.slug}`);
                            }}
                          />
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-sm">
                              {product.product_name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </p>
                          </div>

                          <button
                            disabled={outOfStock}
                            onClick={() => {
                              if (outOfStock) return;
                              addToCart({
                                id: product.id,
                                product_name: product.product_name,
                                image_url: product.thumbnail_url,
                                sku: product.sku,
                                slug: product.slug,
                                quantity: 1,
                              });
                              openCart();
                            }}
                            className={`mt-3 w-full py-2 rounded text-sm transition ${
                              outOfStock
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer"
                            }`}
                          >
                            {outOfStock ? "Out of Stock" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------------
// Filter Group Component
// ------------------------
function FilterGroup({
  title,
  options,
  category,
  selectedFilters,
  onChange,
}: {
  title: string;
  options: string[];
  category: string;
  selectedFilters: any;
  onChange: (category: string, value: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b pb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold"
      >
        <span>{title}</span>
        <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {options.map((opt) => {
            const isSelected = selectedFilters[category]?.includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-2 text-sm px-2 py-1 rounded cursor-pointer ${
                  isSelected
                    ? "bg-yellow-400 text-black font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onChange(category, opt)}
                  className="rounded accent-yellow-400"
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

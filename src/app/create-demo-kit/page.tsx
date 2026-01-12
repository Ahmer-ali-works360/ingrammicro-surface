"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext"; // ✅ Cart hook

// Placeholder SVG
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
  const { addToCart, openCart } = useCart(); // ✅ Cart actions

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.error("Error fetching products:", error);
      else setProducts(data || []);
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

  // Apply filters
  const filteredProducts = products.filter((product) => {
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
      !selectedFilters.memory.includes(product.memory)
    )
      return false;
    if (
      selectedFilters.storage.length &&
      !selectedFilters.storage.includes(product.storage)
    )
      return false;
    if (
      selectedFilters.copilot.length &&
      (product.copilot ? "Yes" : "No") !== selectedFilters.copilot[0]
    )
      return false;
    if (
      selectedFilters.fiveG.length &&
      (product.five_g ? "Yes" : "No") !== selectedFilters.fiveG[0]
    )
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Filters */}
        <aside className="bg-white rounded-2xl shadow p-5 space-y-4">
          <FilterGroup
            title="Form Factor"
            options={["2 in 1's", "Accessories", "Notebooks"]}
            category="formFactor"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
          <FilterGroup
            title="Processor"
            options={[
              "Intel® Core™ Ultra 5",
              "Intel® Core™ Ultra 7",
              "Snapdragon X Elite",
              "Snapdragon X Plus",
            ]}
            category="processor"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
          <FilterGroup
            title="Screen Size"
            options={['12"', '13"', '13.8"', '15"']}
            category="screenSize"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
          <FilterGroup
            title="Memory"
            options={["16GB", "32GB"]}
            category="memory"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
          <FilterGroup
            title="Storage"
            options={["256GB", "512GB", "1TB"]}
            category="storage"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
          <FilterGroup
            title="Copilot+ PC"
            options={["Yes"]}
            category="copilot"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
          <FilterGroup
            title="5G Enabled"
            options={["Yes"]}
            category="fiveG"
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
        </aside>

        {/* Products */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col group"
              >
                <div className="w-full h-[240px] relative rounded-t-2xl overflow-hidden">
                  {/* 5G Badge Image */}
                  {product.five_g && (
                    <Image
                      src="/5g-logo.png"
                      alt="5G Badge"
                      width={40}
                      height={40}
                      className="absolute top-2 right-2 z-10"
                    />
                  )}

                  {/* Product Image */}
                  <Image
                    src={product.image_url || PLACEHOLDER_SVG}
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
                    <h3 className="font-medium text-sm">{product.product_name}</h3>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>

                  {/* ✅ Add to Cart Button with default quantity */}
                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        product_name: product.product_name,
                        image_url: product.image_url,
                        sku: product.sku,
                        slug: product.slug,
                        quantity: 1, // ✅ Default quantity
                      });
                      openCart();
                    }}
                    className="mt-3 w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
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
        <span
          className={`transform transition-transform ${open ? "rotate-180" : ""}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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

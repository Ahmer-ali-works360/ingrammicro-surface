"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "next/navigation";

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

type FilterCategory =
  | "formFactor"
  | "processor"
  | "screenSize"
  | "memory"
  | "storage"
  | "copilot"
  | "fiveG";


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

  const [filterOptions, setFilterOptions] = useState({
    formFactor: [] as string[],
    processor: [] as string[],
    screenSize: [] as string[],
    memory: [] as string[],
    storage: [] as string[],
    copilot: [] as string[],
    fiveG: [] as string[],
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const { role } = useAuth();

  const searchParams = useSearchParams();

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
        .order("publish_date", { ascending: false });

      if (error) console.error("Error fetching products:", error);
      else setProducts(data || []);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
  const formFactorFromURL = searchParams.get("form_factor");

  if (formFactorFromURL) {
    setSelectedFilters((prev) => ({
      ...prev,
      formFactor: [formFactorFromURL],
    }));
  }
}, [searchParams]);


  // ✅ DYNAMIC FILTER FETCHING WITH NULL FILTERING
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch unique form_factor options
        const { data: formFactorData, error: formFactorError } = await supabase
          .from("products")
          .select("form_factor");

        // Remove null values and log data
        const uniqueFormFactor = Array.from(new Set(formFactorData?.map((item: any) => item.form_factor)))
          .filter((value) => value !== null);

        console.log("Fetched form_factor data (after removing nulls):", uniqueFormFactor);

        if (formFactorError) {
          console.error("Error fetching form_factor:", formFactorError);
        }

        // Fetch unique processor options
        const { data: processorData, error: processorError } = await supabase
          .from("products")
          .select("processor");

        const uniqueProcessor = Array.from(new Set(processorData?.map((item: any) => item.processor)))
          .filter((value) => value !== null);

        console.log("Fetched processor data (after removing nulls):", uniqueProcessor);

        if (processorError) {
          console.error("Error fetching processor:", processorError);
        }

        // Fetch unique screen_size options
        const { data: screenSizeData, error: screenSizeError } = await supabase
          .from("products")
          .select("screen_size");

        const uniqueScreenSize = Array.from(new Set(screenSizeData?.map((item: any) => item.screen_size)))
          .filter((value) => value !== null);

        console.log("Fetched screen_size data (after removing nulls):", uniqueScreenSize);

        if (screenSizeError) {
          console.error("Error fetching screen_size:", screenSizeError);
        }

        // Fetch unique memory options
        const { data: memoryData, error: memoryError } = await supabase
          .from("products")
          .select("memory");

        const uniqueMemory = Array.from(new Set(memoryData?.map((item: any) => item.memory)))
          .filter((value) => value !== null);

        console.log("Fetched memory data (after removing nulls):", uniqueMemory);

        if (memoryError) {
          console.error("Error fetching memory:", memoryError);
        }

        // Fetch unique storage options
        const { data: storageData, error: storageError } = await supabase
          .from("products")
          .select("storage");

        const uniqueStorage = Array.from(new Set(storageData?.map((item: any) => item.storage)))
          .filter((value) => value !== null);

        console.log("Fetched storage data (after removing nulls):", uniqueStorage);

        if (storageError) {
          console.error("Error fetching storage:", storageError);
        }

        // Fetch unique copilot options
        const { data: copilotData, error: copilotError } = await supabase
          .from("products")
          .select("copilot");

        const uniqueCopilot = Array.from(new Set(copilotData?.map((item: any) => (item.copilot ? "Yes" : "No"))))
          .filter((value) => value !== null);

        console.log("Fetched copilot data (after removing nulls):", uniqueCopilot);

        if (copilotError) {
          console.error("Error fetching copilot:", copilotError);
        }

        // Fetch unique 5G options
        const { data: fiveGData, error: fiveGError } = await supabase
          .from("products")
          .select("five_g");

        const uniqueFiveG = Array.from(new Set(fiveGData?.map((item: any) => (item.five_g ? "Yes" : "No"))))
          .filter((value) => value !== null);

        console.log("Fetched fiveG data (after removing nulls):", uniqueFiveG);

        if (fiveGError) {
          console.error("Error fetching fiveG:", fiveGError);
        }

        // Update filter options in the state
        setFilterOptions({
          formFactor: uniqueFormFactor,
          processor: uniqueProcessor,
          screenSize: uniqueScreenSize,
          memory: uniqueMemory,
          storage: uniqueStorage,
          copilot: uniqueCopilot,
          fiveG: uniqueFiveG,
        });

        console.log("Final filter options:", filterOptions);

      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // ✅ HANDLE FILTER CHANGE
  const handleFilterChange = (category: FilterCategory, value: string) => {
    setSelectedFilters((prev) => {
      const list = prev[category];
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
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex justify-end">
              <button
                className="bg-yellow-400 text-black px-4 py-2 rounded text-sm hover:bg-yellow-500 transition"
                onClick={() => setMobileFilterOpen(true)}
              >
                Filters
              </button>
            </div>

            {/* Filters for desktop */}
            <aside className="hidden lg:block bg-white rounded-2xl shadow p-5 space-y-4">
              {(Object.keys(filterOptions) as FilterCategory[]).map((category) => (
                <FilterGroup
                  key={category}
                  title={category.replace(/([A-Z])/g, " $1")}
                  options={filterOptions[category]}
                  category={category}
                  selectedFilters={selectedFilters}
                  onChange={handleFilterChange}
                />
              ))}

            </aside>

            {/* Products */}
            <section className="flex flex-col">
              {(role === "admin" || role === "shop manager") && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => router.push("/add-product")}
                    className="custom-blue cursor-pointer text-white px-4 py-2 rounded transition text-sm"
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
  className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col group relative"
> <div className="relative left-0 w-full h-[35px] p-2 pointer-events-none">
    {outOfStock && (
      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
        Out of Stock
      </div>
    )}
    {product.five_g && (
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

  {/* Separate div for 5G icon and Out of Stock, overlaid on the image */}
 

  <div className="p-4 flex-1 flex flex-col justify-between">
    <div className="text-center">
      <h3 className="font-semibold  text-sm">
        {product.product_name}
      </h3>

      <div className="flex-1" />

      <p className="text-xs text-gray-500 text-center mt-6">
        SKU: {product.sku}
      </p>
    </div>
<div className="flex justify-center mt-1" >
    <button
      disabled={outOfStock}
      onClick={() => {
        if (outOfStock) return;
        addToCart({
          id: product.id,
          product_name: product.product_name,
          image_url: product.thumbnail_url,
          sku: product.sku,
          brand: product.brand ?? "—", // 👈 IMPORTANT
          processor: product.processor ?? "—",
          memory: product.memory ?? "—",
          quantity: 1,
        });
        openCart();
      }}
      className={` w-32 py-2 px-4 rounded text-sm transition ${
        outOfStock
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer"
      }`}
    >
      {outOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
    </div>
  </div>
</div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
              <div className="bg-white w-64 p-5 overflow-y-auto h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setMobileFilterOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                {(Object.keys(filterOptions) as FilterCategory[]).map((category) => (
                  <FilterGroup
                    key={category}
                    title={category.replace(/([A-Z])/g, " $1")}
                    options={filterOptions[category]}
                    category={category}
                    selectedFilters={selectedFilters}
                    onChange={handleFilterChange}
                  />
                ))}

              </div>
            </div>
          )}
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
  category: FilterCategory;
  selectedFilters: Record<FilterCategory, string[]>;
  onChange: (category: FilterCategory, value: string) => void;

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
                className={`flex items-center gap-2 text-sm px-2 py-1 rounded cursor-pointer ${isSelected
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
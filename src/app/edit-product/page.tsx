"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthRole } from "../context/AuthContext";

type SelectedState = {
  brand: string;
  processor: string;
  generation: string;
  memory: string;
  storage: string;
  fiveg: string;   // 🔥 SAME AS ADD PRODUCT
  copilot: string;
  status: string;
  OS: string;
  formFactor: string;
  screen: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdRaw = searchParams.get("id");
  const productId = productIdRaw ? Number(productIdRaw) : null;

  /* ================= ROLE CHECK ================= */
  const { loading, isAllowed } = useAuthRole(["admin", "shop manager"]);

  useEffect(() => {
    if (!loading && !isAllowed) router.replace("/login");
  }, [loading, isAllowed, router]);


  useEffect(() => {
    if (!productId) {
      alert("Invalid product ID");
      router.push("/create-demo-kit");
    }
  }, [productId, router]);

  /* ================= STATES ================= */

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👇 UI DEPENDENCIES (DO NOT REMOVE)
  const [customBrand, setCustomBrand] = useState(false);
  const [customProcessor, setCustomProcessor] = useState(false);
  const [customGeneration, setCustomGeneration] = useState(false);
  const [customFormFactor, setCustomFormFactor] = useState(false);
  const [customScreen, setCustomScreen] = useState(false);
  const [customMemory, setCustomMemory] = useState(false);
  const [customStorage, setCustomStorage] = useState(false);
  const [customOS, setcustomOS] = useState(false);

  const [selected, setSelected] = useState<SelectedState>({
    brand: "",
    processor: "",
    generation: "",
    memory: "",
    storage: "",
    fiveg: "",
    copilot: "",
    status: "",
    OS: "",
    formFactor: "",
    screen: "",
  });


  // ✅ NEW: brand options from DB
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT brand values
  useEffect(() => {
    const fetchBrandOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("brand")
        .not("brand", "is", null)
        .neq("brand", "");

      if (error) {
        console.error("Error fetching brand options:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.brand!.trim()))
      );

      setBrandOptions(unique);
    };

    fetchBrandOptions();
  }, []);

  // ✅ NEW: processor options from DB
  const [processorOptions, setProcessorOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT processors
  useEffect(() => {
    const fetchProcessors = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("processor")
        .not("processor", "is", null)
        .neq("processor", "");

      if (error) {
        console.error("Error fetching processors:", error);
        return;
      }

      const unique = Array.from(
        new Set(data.map((d) => d.processor!.trim()))
      );

      setProcessorOptions(unique);
    };

    fetchProcessors();
  }, []);


  // ✅ NEW: form factor options from DB
  const [formFactorOptions, setFormFactorOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT form factors
  useEffect(() => {
    const fetchFormFactorOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("form_factor")
        .not("form_factor", "is", null)
        .neq("form_factor", "");

      if (error) {
        console.error("Error fetching form factors:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.form_factor!.trim()))
      );

      setFormFactorOptions(unique);
    };

    fetchFormFactorOptions();
  }, []);


  // ✅ NEW: generation options from DB
  const [generationOptions, setGenerationOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT generation values
  useEffect(() => {
    const fetchGenerationOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("generation")
        .not("generation", "is", null)
        .neq("generation", "");

      if (error) {
        console.error("Error fetching generation options:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.generation!.trim()))
      );

      setGenerationOptions(unique);
    };

    fetchGenerationOptions();
  }, []);

  // ✅ NEW: memory options from DB
  const [memoryOptions, setMemoryOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT memory values
  useEffect(() => {
    const fetchMemoryOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("memory")
        .not("memory", "is", null)
        .neq("memory", "");

      if (error) {
        console.error("Error fetching memory options:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.memory!.trim()))
      );

      setMemoryOptions(unique);
    };

    fetchMemoryOptions();
  }, []);

  // ✅ NEW: storage options from DB
  const [storageOptions, setStorageOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT storage values
  useEffect(() => {
    const fetchStorageOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("storage")
        .not("storage", "is", null)
        .neq("storage", "");

      if (error) {
        console.error("Error fetching storage options:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.storage!.trim()))
      );

      setStorageOptions(unique);
    };

    fetchStorageOptions();
  }, []);



  // ✅ NEW: operating system options from DB
  const [osOptions, setOsOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT OS values
  useEffect(() => {
    const fetchOsOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("OS")
        .not("OS", "is", null)
        .neq("OS", "");

      if (error) {
        console.error("Error fetching OS options:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.OS!.trim()))
      );

      setOsOptions(unique);
    };

    fetchOsOptions();
  }, []);



  // ✅ NEW: screen size options from DB
  const [screenOptions, setScreenOptions] = useState<string[]>([]);

  // 🔄 Fetch DISTINCT screen sizes
  useEffect(() => {
    const fetchScreenOptions = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("screen_size")
        .not("screen_size", "is", null)
        .neq("screen_size", "");

      if (error) {
        console.error("Error fetching screen sizes:", error);
        return;
      }

      // ✅ remove duplicates + trim
      const unique = Array.from(
        new Set(data.map((d) => d.screen_size!.trim()))
      );

      setScreenOptions(unique);
    };

    fetchScreenOptions();
  }, []);









  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [totalInventory, setTotalInventory] = useState<number | "">("");
  const [inventoryType, setInventoryType] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [publishDate, setPublishDate] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  /* ================= HELPERS ================= */

  const handleSelect = (field: keyof SelectedState, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const handleThumbnailClick = () => thumbnailRef.current?.click();
  const handleGalleryClick = () => galleryRef.current?.click();

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setThumbnail(e.target.files[0]);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGallery((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > 5) {
        alert("Maximum 5 images allowed");
        return combined.slice(0, 5);
      }
      return combined;
    });
  };

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) {
        alert("Product not found");
        router.push("/create-demo-kit");
        return;
      }

      console.log("🟢 PREFILL PRODUCT:", data);

      setProductName(data.product_name || "");
      setSku(data.sku || "");
      setTechnologies(data.technologies || "");
      setTotalInventory(data.inventory ?? "");
      setInventoryType(data.inventory_type || "");
      setStockQuantity(data.stock_quantity ?? "");
      setPublishDate(data.publish_date || "");
      setDescription(data.description || "");

      setSelected({
        brand: data.brand || "",
        processor: data.processor || "",
        generation: data.generation || "",
        memory: data.memory || "",
        storage: data.storage || "",
        fiveg: data.five_g ? "Yes" : "No",
        copilot: data.copilot ? "Yes" : "No",
        status: data.status || "",
        OS: data.OS || "",
        formFactor: data.form_factor || "",
        screen: data.screen_size || "",
      });

      setExistingThumbnail(data.thumbnail_url || null);
      setExistingGallery(data.gallery_urls || []);
    };

    fetchProduct();
  }, [productId, router]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (isSubmitting || !productId) return;
    setIsSubmitting(true);

    try {
      console.log("🟡 EDIT SUBMIT START");
      console.log("Product ID:", productId);
      console.log("Selected:", selected);
      console.log("Stock Qty:", stockQuantity);

      let thumbnailUrl = existingThumbnail;
      let galleryUrls = [...existingGallery];

      if (thumbnail) {
        const safe = thumbnail.name.replace(/\s/g, "_");
        const { data } = await supabase.storage
          .from("product-images")
          .upload(`thumbnails/${Date.now()}_${safe}`, thumbnail);

        thumbnailUrl = supabase.storage
          .from("product-images")
          .getPublicUrl(data!.path).data.publicUrl;
      }

      for (const file of gallery) {
        const safe = file.name.replace(/\s/g, "_");
        const { data } = await supabase.storage
          .from("product-images")
          .upload(`gallery-images/${Date.now()}_${safe}`, file);

        galleryUrls.push(
          supabase.storage
            .from("product-images")
            .getPublicUrl(data!.path).data.publicUrl
        );
      }

      const updatedProduct = {
        product_name: productName,
        sku,
        brand: selected.brand || null,
        form_factor: selected.formFactor || null,
        processor: selected.processor || null,
        generation: selected.generation || null,
        memory: selected.memory || null,
        storage: selected.storage || null,
        copilot: selected.copilot === "Yes",
        five_g: selected.fiveg === "Yes",
        status: selected.status || null,
        OS: selected.OS || null,
        screen_size: selected.screen || null,
        technologies: technologies || null,
        inventory: totalInventory === "" ? null : Number(totalInventory),
        inventory_type: inventoryType || null,
        stock_quantity:
          stockQuantity === "" ? null : Number(stockQuantity),
        publish_date: publishDate || null,
        description: description || null,
        thumbnail_url: thumbnailUrl,
        gallery_urls: galleryUrls.length ? galleryUrls : null,
      };

      console.log("🟠 UPDATE PAYLOAD:", updatedProduct);

      const { data, error } = await supabase
        .schema("public")
        .from("products")
        .update(updatedProduct)
        .eq("id", productId)
        .select();

      console.log("🔵 UPDATE RESPONSE:", data, error);

      if (error || !data || data.length === 0) {
        throw new Error("DB UPDATE FAILED (0 rows affected)");
      }

      setShowSuccess(true);
    } catch (err: any) {
      console.error("🔴 EDIT ERROR:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAllowed) return null;

  /* ================= RETURN (UI SAME AS BEFORE) ================= */

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold w-full sm:w-auto text-center sm:text-left">
          Edit Device
        </h1>
        <p
          className="text-sm text-blue-600 cursor-pointer w-full sm:w-auto text-center sm:text-right mt-2 sm:mt-0"
          onClick={() => router.push("/create-demo-kit")}
        >
          ← Back to Inventory
        </p>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          Product Images
        </h2>
        <p className="text-xs text-gray-400 mb-4">Supported: PNG, JPG, WEBP</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ================= THUMBNAIL ================= */}
          <div
            onClick={!thumbnail ? handleThumbnailClick : undefined}
            className="relative bg-gray-300 border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition"
          >
            {(thumbnail || existingThumbnail) ? (
              <>
                {/* Remove Thumbnail */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnail(null);
                    setExistingThumbnail(null);
                    if (thumbnailRef.current) {
                      thumbnailRef.current.value = "";
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                >
                  ✕
                </button>

                <img
                  src={
                    thumbnail
                      ? URL.createObjectURL(thumbnail)
                      : existingThumbnail
                  }
                  alt="Thumbnail"
                  className="w-20 h-20 object-cover mb-2"
                />
              </>
            ) : (
              <div className="bg-gray-300 w-12 h-12 flex items-center justify-center rounded mb-2">
                <img src="/upload-icon.png" alt="Upload" className="w-10 h-10" />
              </div>
            )}

            <p className="text-sm font-medium text-gray-600">Thumbnail Image</p>
            <p className="text-xs text-gray-400">Click to upload (Max 10MB)</p>

            <input
              type="file"
              accept="image/*"
              ref={thumbnailRef}
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </div>

          {/* ================= GALLERY ================= */}
          <div
            onClick={handleGalleryClick}
            className="bg-gray-300 border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition"
          >
            <div className="bg-gray-300 w-12 h-12 flex items-center justify-center rounded mb-2">
              <img
                src="/upload-gallery.png"
                alt="Upload Gallery"
                className="w-6 h-6 object-contain"
              />
            </div>

            <p className="text-sm font-medium text-gray-600">Additional Images</p>
            <p className="text-xs text-gray-400">Add more images (Max 5)</p>

            {/* Existing Gallery (prefilled) */}
            {existingGallery.length > 0 && gallery.length === 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {existingGallery.map((url, idx) => (
                  <div key={idx} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExistingGallery((prev) =>
                          prev.filter((_, i) => i !== idx)
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>

                    <img
                      src={url}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* New Gallery Upload Preview */}
            {gallery.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {gallery.map((file, idx) => (
                  <div key={idx} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGallery((prev) =>
                          prev.filter((_, i) => i !== idx)
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>

                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Gallery ${idx}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              ref={galleryRef}
              className="hidden"
              onChange={handleGalleryChange}
            />
          </div>
        </div>
      </div>



      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <p className="text-sm font-medium mb-2">Product Name</p>
            <input className="w-full border rounded px-3 py-2 text-sm" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>

          {/* SKU */}
          <div>
            <p className="text-sm font-medium mb-2">SKU</p>
            <input className="w-full border rounded px-3 py-2 text-sm"
              value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>

          {/* OEM Brand */}
          <div>
            <p className="text-sm font-medium mb-2">OEM Brand</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {brandOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("brand", option);
                      setCustomBrand(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.brand === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.brand === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("brand", "Custom");
                    setCustomBrand(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.brand === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.brand === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customBrand && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.brand === "Custom" ? "" : selected.brand}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    brand: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Processor */}
          <div>
            <p className="text-sm font-medium mb-2">Processor</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {processorOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("processor", option);
                      setCustomProcessor(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.processor === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.processor === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom Option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("processor", "Custom");
                    setCustomProcessor(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.processor === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.processor === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom Input */}
            {customProcessor && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.processor === "Custom" ? "" : selected.processor}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    processor: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Form Factor */}

          <div>
            <p className="text-sm font-medium mb-2">Form Factor</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {formFactorOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("formFactor", option);
                      setCustomFormFactor(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.formFactor === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.formFactor === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("formFactor", "Custom");
                    setCustomFormFactor(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.formFactor === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.formFactor === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customFormFactor && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.formFactor === "Custom" ? "" : selected.formFactor}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    formFactor: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Generation */}
          <div>
            <p className="text-sm font-medium mb-2">Generation</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {generationOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("generation", option);
                      setCustomGeneration(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.generation === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.generation === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("generation", "Custom");
                    setCustomGeneration(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.generation === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.generation === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customGeneration && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.generation === "Custom" ? "" : selected.generation}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    generation: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Memory */}
          <div>
            <p className="text-sm font-medium mb-2">Memory</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {memoryOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("memory", option);
                      setCustomMemory(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.memory === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.memory === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("memory", "Custom");
                    setCustomMemory(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.memory === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.memory === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customMemory && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.memory === "Custom" ? "" : selected.memory}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    memory: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Storage */}
          <div>
            <p className="text-sm font-medium mb-2">Storage</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {storageOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("storage", option);
                      setCustomStorage(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.storage === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.storage === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("storage", "Custom");
                    setCustomStorage(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.storage === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.storage === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customStorage && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.storage === "Custom" ? "" : selected.storage}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    storage: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Operating System */}
          <div>
            <p className="text-sm font-medium mb-2">Operating System</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {osOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("OS", option);
                      setcustomOS(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.OS === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.OS === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("OS", "Custom");
                    setcustomOS(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.OS === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.OS === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customOS && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.OS === "Custom" ? "" : selected.OS}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    OS: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* Technologies */}
          <div>
            <p className="text-sm font-medium mb-2">Technologies</p>
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Technologies" value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
          </div>


          {/* Total Inventory */}
          <div>
            <p className="text-sm font-medium mb-2">Total Inventory</p>
            <input className="w-full border rounded px-3 py-2 text-sm" type="number" value={totalInventory} onChange={(e) => { const val = e.target.value; setTotalInventory(val === "" ? "" : Number(val)); }} />

          </div>

          {/* Inventory Type */}
          <div>
            <p className="text-sm font-medium mb-2">Inventory Type</p>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={inventoryType}
              onChange={(e) => setInventoryType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Program">Program</option>
              <option value="Global">Global</option>
            </select>
          </div>


          {/* Stock Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Stock Quantity</p>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-sm"
              value={stockQuantity}
              onChange={(e) => {
                const val = e.target.value;
                setStockQuantity(val === "" ? "" : Number(val));
              }}
            />
          </div>

          {/* Screen Size */}
          <div>
            <p className="text-sm font-medium mb-2">Screen Size</p>

            {/* Responsive Grid: 1 column on mobile, 2 columns on tablet and larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {screenOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => {
                      handleSelect("screen", option);
                      setCustomScreen(false);
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.screen === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.screen === option && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}

              {/* Custom option */}
              <label className="flex items-center gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    handleSelect("screen", "Custom");
                    setCustomScreen(true);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.screen === "Custom" ? "bg-blue-600" : "bg-white"
                    }`}
                >
                  {selected.screen === "Custom" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="select-none">Custom</span>
              </label>
            </div>

            {/* Custom input */}
            {customScreen && (
              <input
                className="mt-2 w-full sm:max-w-xs border rounded px-3 py-2 text-sm"
                value={selected.screen === "Custom" ? "" : selected.screen}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    screen: e.target.value,
                  }))
                }
              />
            )}
          </div>

          {/* 5G Enabled */}
          <div>
            <p className="text-sm font-medium mb-2">5G Enabled</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => handleSelect("fiveg", option)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.fiveg === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.fiveg === option && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Copilot */}
          <div>
            <p className="text-sm font-medium mb-2">Copilot</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => handleSelect("copilot", option)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.copilot === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.copilot === option && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Status */}
          <div>
            <p className="text-sm font-medium mb-2">Product Status</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm">
              {["Publish", "Private"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                  <div
                    onClick={() => handleSelect("status", option)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 border border-gray-400 rounded-sm flex items-center justify-center ${selected.status === option ? "bg-blue-600" : "bg-white"
                      }`}
                  >
                    {selected.status === option && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="select-none">{option}</span>
                </label>
              ))}
            </div>
          </div>


          {/* Publish Date */}
          <div>
            <p className="text-sm font-medium mb-2">Publish Date</p>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </div>
        </div>

        {/* description */}
        <div>
          <p className="text-sm font-medium mb-2">Description</p>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm mt-6 h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            className="custom-blue px-10 py-2.5 mt-6 rounded-lg cursor-pointer text-white text-sm font-medium transition"
            onClick={handleSubmit}
          >
            Update Product
          </button>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2">
              Product Updated
            </h2>

            <p className="text-gray-600 mb-6">
              Product successfully updated.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push("/create-demo-kit");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// src/app/components/navbar.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiSearch,
  FiUser,
  FiChevronDown,
  FiShoppingCart,
  FiBell,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const { cartItems, openCart } = useCart();
  const { role, user, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔔 REAL notification counts (from API)
  const [notificationCounts, setNotificationCounts] = useState({
    users: 0,
    orders: 0,
    total: 0,
  });

  const isadminOrPMOrSM = user && (role === "admin" || role === "program_manager" || role === "shop_manager");

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔔 Fetch notification counts
  useEffect(() => {
    if (!isadminOrPMOrSM) return;

    async function fetchNotificationCounts() {
      try {
        const res = await fetch("/api/notifications/count");
        const data = await res.json();
        setNotificationCounts(data);
      } catch (err) {
        console.error("Failed to fetch notification counts", err);
      }
    }

    fetchNotificationCounts();
  }, [isadminOrPMOrSM]);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const handleSearchClick = () => {
    setSearchVisible(!searchVisible);
  };

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        console.log("All products loaded, count:", data.length);
        setAllProducts(data);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      // Products ko filter karein, ab product_name use karein
      const filteredSuggestions = allProducts.filter(product =>
        product.product_name && typeof product.product_name === 'string' && product.product_name.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Filtered suggestions:", filteredSuggestions); // Debug ke liye
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };


  const handleSearchSelect = (slug) => {
    setSelectedProductSlug(slug);
    // Redirect to the product page using the slug
    window.location.href = `/product/${slug}`;
  };



  const handleLogout = async () => {
    await logout();
  };

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white py-2 border-b relative z-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Ingram_micro_logo.png"
            alt="Ingram Micro"
            width={140}
            height={28}
            priority
          />
        </Link>

        {/* CENTER: MENU (Desktop) */}
        <ul className="hidden md:flex items-center gap-10 text-[14px] leading-[20px] font-normal text-[#2B3F50]">
          <li><Link href="/" className="hover:opacity-70">Home</Link></li>
          <li><Link href="/how-it-works" className="hover:opacity-70">How it Works</Link></li>
          <li><Link href="/create-demo-kit" className="hover:opacity-70">Create Demo Kit</Link></li>

          {user && (
            <>
              <li><Link href="/report-a-win" className="hover:opacity-70">Report a Win</Link></li>
              {role === "admin" && (
                <li><Link href="/admin/Dashboard360" className="hover:opacity-70">360 Dashboard</Link></li>
              )}
            </>
          )}
        </ul>

        {/* MOBILE: HAMBURGER */}
        <button
          className="md:hidden text-xl text-[#2B3F50] hover:opacity-70"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* RIGHT: ICONS (Desktop only) */}
        <div className="hidden md:flex items-center gap-6 text-xl text-[#2B3F50] relative">

          {/* 🔔 NOTIFICATIONS (Admin & PM only) */}
          {isadminOrPMOrSM && (
            <div className="relative group">
              <button aria-label="Notifications" className="relative hover:opacity-70 flex items-center">
                <FiBell className="w-6 h-8" />
                {notificationCounts.total > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {notificationCounts.total}
                  </span>
                )}
              </button>

              {/* Notification dropdown (SAME UI AS USER DROPDOWN) */}
              <div className="absolute right-0 top-full pt-0 w-36 bg-white border border-gray-200 rounded shadow-md text-[13px] leading-[20px] font-normal text-[#2B3F50] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">

                <Link
                  href="/orders"
                  onClick={async () => {
                    await fetch("/api/notifications/mark-read", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ type: "order" }),
                    });
                    // 🔥 YEH LINE REAL-TIME UPDATE KARTI HAI
                    setNotificationCounts(prev => ({
                      ...prev,
                      orders: 0,
                      total: prev.total - prev.orders,
                    }));
                  }}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-t hover:bg-[#2B3F50] hover:text-white"
                >
                  <span>Orders</span>
                  {notificationCounts.orders > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2">
                      {notificationCounts.orders}
                    </span>
                  )}
                </Link>

                {role !== "shop_manager" && (
                  <Link
                    href="/users"
                    onClick={async () => {
                      await fetch("/api/notifications/mark-read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "user" }),
                      });
                      setNotificationCounts(prev => ({
                        ...prev,
                        users: 0,
                        total: prev.total - prev.users,
                      }));
                    }}
                    className="flex items-center justify-between w-full px-3 py-3 rounded-b hover:bg-[#2B3F50] hover:text-white"
                  >
                    <span>Users</span>
                    {notificationCounts.users > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2">
                        {notificationCounts.users}
                      </span>
                    )}
                  </Link>
                )}


              </div>
            </div>
          )}

{/* SEARCH */}
<button 
  aria-label="Search" 
  className="relative hover:opacity-70" 
  onClick={handleSearchClick}
>
  <FiSearch className="w-6 h-8" />
</button>

{/* SEARCH INPUT FIELD */}
{searchVisible && (
  <div className="absolute top-full left-0 right-0 mt-2 w-full max-w-lg mx-auto bg-white shadow-lg rounded-md border border-gray-300">
    <input
      type="text"
      placeholder="Search for products..."
      value={searchQuery}
      onChange={handleSearchChange}
      className="w-full p-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {/* Suggestions Dropdown */}
    {suggestions.length > 0 && (
      <div className="absolute top-full left-0 right-0 bg-white shadow-md mt-1 rounded-b-md border border-gray-300 z-50">
        {suggestions.map((product) => (
          <div
            key={product.id}
            onClick={() => handleSearchSelect(product.slug)}
            className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
          >
            {product.product_name}
          </div>
        ))}
      </div>
    )}
  </div>
)}



          {/* USER ACCOUNT */}
          <div className="relative group">
            <Link href="/account" aria-label="Account" className="flex items-center gap-1 hover:opacity-70">
              <FiUser className="w-6 h-8" />
              <FiChevronDown size={16} className="transition-transform group-hover:rotate-180" />
            </Link>

            <div className="absolute right-0 top-full pt-0 w-36 bg-white border border-gray-200 rounded shadow-md text-[13px] leading-[20px] font-normal text-[#2B3F50] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              {!user ? (
                <>
                  <Link href="/account-registration" className="block w-full px-3 py-3 rounded-t hover:bg-[#2B3F50] hover:text-white">Register</Link>
                  <Link href="/login" className="block w-full px-3 py-3 rounded-b hover:bg-[#2B3F50] hover:text-white">Login</Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-3 rounded hover:bg-[#2B3F50] hover:text-white bg-transparent border-none text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* CART */}
          <button aria-label="Cart" className="relative hover:opacity-70" onClick={openCart}>
            <FiShoppingCart className="w-6 h-8" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col gap-2 px-4 py-4 text-[14px] leading-[20px] font-normal text-[#2B3F50]">

            {/* NAV LINKS */}
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:opacity-70">
                Home
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:opacity-70">
                How it Works
              </Link>
            </li>
            <li>
              <Link href="/create-demo-kit" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:opacity-70">
                Create Demo Kit
              </Link>
            </li>

            {user && (
              <>
                <li>
                  <Link href="/report-a-win" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:opacity-70">
                    Report a Win
                  </Link>
                </li>

                {role === "admin" && (
                  <li>
                    <Link href="/admin/Dashboard360" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:opacity-70">
                      360 Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}

            {/* 🔔 NOTIFICATIONS */}
            {isadminOrPMOrSM && (
              <li className="pt-2 border-t border-gray-200">
                <Link
                  href="/orders"
                  onClick={async () => {
                    await fetch("/api/notifications/mark-read", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ type: "order" }),
                    });
                    // 🔥 YEH LINE REAL-TIME UPDATE KARTI HAI
                    setNotificationCounts(prev => ({
                      ...prev,
                      orders: 0,
                      total: prev.total - prev.orders,
                    }));
                    setMobileMenuOpen(false);
                  }}
                  className="flex justify-between py-2 hover:opacity-70"
                >

                  <span>Orders</span>
                  {notificationCounts.orders > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2">
                      {notificationCounts.orders}
                    </span>
                  )}
                </Link>
                {role !== "shop_manager" && (
                  <Link
                    href="/users"
                    onClick={async () => {
                      await fetch("/api/notifications/mark-read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "user" }),
                      });
                      setNotificationCounts(prev => ({
                        ...prev,
                        users: 0,
                        total: prev.total - prev.users,
                      }));
                      setMobileMenuOpen(false);
                    }}
                    className="flex justify-between py-2 hover:opacity-70"
                  >

                    <span>Users</span>
                    {notificationCounts.users > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2">
                        {notificationCounts.users}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            )}

            {/* 🔍 SEARCH & 🛒 CART */}
            <li className="flex items-center gap-6 pt-3 border-t border-gray-200">
              <button
                aria-label="Search"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:opacity-70"
              >
                <FiSearch className="w-6 h-6" />
              </button>

              <button
                aria-label="Cart"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="relative hover:opacity-70"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </li>

            {/* USER ACCOUNT */}
            <li className="pt-2 border-t border-gray-200">
              {!user ? (
                <>
                  <Link
                    href="/account-registration"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:opacity-70"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:opacity-70"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left py-2 hover:opacity-70"
                >
                  Logout
                </button>
              )}
            </li>

          </ul>
        </div>
      )}

    </nav>
  );
}

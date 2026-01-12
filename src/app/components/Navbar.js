"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSearch, FiUser, FiChevronDown, FiShoppingCart, FiBell } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext"; // ✅ Cart context

export default function Navbar() {
  const router = useRouter();
  const { cartItems, openCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth on load + listen for changes
  useEffect(() => {
    if (!mounted) return;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [mounted]);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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
            height={40}
            priority
          />
        </Link>

        {/* CENTER: MENU */}
        <ul className="hidden md:flex items-center gap-10 text-[14px] leading-[20px] font-normal text-[#2B3F50]">
          <li>
            <Link href="/" className="hover:opacity-70">Home</Link>
          </li>
          <li>
            <Link href="/how-it-works" className="hover:opacity-70">How it Works</Link>
          </li>
          <li>
            <Link href="/create-demo-kit" className="hover:opacity-70">Create Demo Kit</Link>
          </li>

          {user && (
            <>
              <li>
                <Link href="/report-a-win" className="hover:opacity-70">Report a Win</Link>
              </li>
              <li>
                <Link href="/admin/Dashboard360" className="hover:opacity-70">360 Dashboard</Link>
              </li>
            </>
          )}
        </ul>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-6 text-xl text-[#2B3F50] relative">

          {user && (
            <button aria-label="Notifications" className="relative hover:opacity-70">
              <FiBell className="w-6 h-8" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                0
              </span>
            </button>
          )}

          <button aria-label="Search" className="hover:opacity-70">
            <FiSearch className="w-6 h-8" />
          </button>

          <div className="relative group">
            <Link
              href="/account"
              aria-label="Account"
              className="flex items-center gap-1 hover:opacity-70"
            >
              <FiUser size={22} />
              <FiChevronDown size={16} className="transition-transform group-hover:rotate-180" />
            </Link>

            <div className="absolute right-0 top-full pt-0 w-36 bg-white border border-gray-200 rounded shadow-md text-[13px] leading-[20px] font-normal text-[#2B3F50] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              {!user ? (
                <>
                  <Link href="/account-registration" className="block w-full px-3 py-3 rounded-t hover:bg-[#2B3F50] hover:text-white transition-colors">
                    Register
                  </Link>
                  <Link href="/login" className="block w-full px-3 py-3 rounded-b hover:bg-[#2B3F50] hover:text-white transition-colors">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/change-password" className="block w-full px-3 py-3 rounded-t hover:bg-[#2B3F50] hover:text-white transition-colors">
                    Password Reset
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-3 rounded-b hover:bg-[#2B3F50] hover:text-white transition-colors bg-transparent border-none text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* CART ICON */}
          <button
            aria-label="Cart"
            className="relative hover:opacity-70"
            onClick={openCart} // ✅ Open cart drawer
          >
            <FiShoppingCart className="w-6 h-8" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartItems.length} {/* ✅ Cart item count */}
              </span>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
}

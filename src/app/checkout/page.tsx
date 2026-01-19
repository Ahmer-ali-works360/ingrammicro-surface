"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    sellerName: "",
    sellerEmail: "",
    opportunityName: "",
    budget: "",
    revenue: "",
    quote: "",
    segment: "",
    manufacturer: "",
    isReseller: "",
    companyName: "",
    contactName: "",
    contactEmail: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    deliveryDate: "",
    notes: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log(error.message);
        return;
      }

      if (data?.user?.email) {
        setForm(prev => ({ ...prev, sellerEmail: data?.user?.email || "" }));
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Team Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Team Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">
            
            <div>
              <label className="block mb-1 font-medium">Seller Contact Name *</label>
              <input
                name="sellerName"
                value={form.sellerName}
                onChange={handleChange}
                placeholder="Seller Contact Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Seller Contact Email *</label>
              <input
                name="sellerEmail"
                value={form.sellerEmail}
                onChange={handleChange}
                placeholder="Seller Contact Email *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full bg-gray-100"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Opportunity Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Opportunity Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Opportunity Name *</label>
              <input
                name="opportunityName"
                value={form.opportunityName}
                onChange={handleChange}
                placeholder="Revise Opportunity Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Budget Per Device ($)</label>
              <input
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="Budget Per Device ($)"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Revenue Opportunity Sale & Device Plan *</label>
              <input
                name="revenue"
                value={form.revenue}
                onChange={handleChange}
                placeholder="Revenue Opportunity Sale & Device Plan *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Quote #</label>
              <input
                name="quote"
                value={form.quote}
                onChange={handleChange}
                placeholder="Quote #"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Segment</label>
              <select
                name="segment"
                value={form.segment}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              >
                <option value="">Segment</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Current Manufacturer</label>
              <select
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              >
                <option value="">Current Manufacturer</option>
                <option value="X">X</option>
                <option value="Y">Y</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Is this a reseller opportunity?</label>
              <select
                name="isReseller"
                value={form.isReseller}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              >
                <option value="">Is this a reseller opportunity?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white border rounded shadow border-gray-300">
          <div className="custom-blue text-white px-4 py-2 font-semibold">Shipping Details</div>
          <div className="p-4 grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Customer Company Name *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Customer Company Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Contact Name *</label>
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Customer Contact Name *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Contact Email *</label>
              <input
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="Customer Contact Email Address *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Shipping Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Customer Shipping Address *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              >
                <option value="">State *</option>
                <option value="CA">CA</option>
                <option value="TX">TX</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Zip *</label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="Zip *"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border border-gray-300 p-2 rounded focus:border-black outline-none w-full"
              />
            </div>

          </div>
        </div>

        {/* Order */}
        <div className="bg-white border rounded shadow p-4 border-gray-300">
          <div className="text-lg font-semibold mb-2">Your order</div>

          <div className="border border-gray-300 p-3 rounded bg-gray-50 flex items-center">
            <div>Product:</div>
            <div className="font-semibold ml-2">Surface Pro 11</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="min-w-xs custom-blue text-white py-4 rounded font-semibold">
            Place order
          </button>
        </div>

      </form>
    </div>
  );
}

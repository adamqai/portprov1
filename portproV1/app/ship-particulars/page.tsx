"use client";
import React, { useState, useEffect } from "react";

export default function ShipParticularsPage() {
  const [form, setForm] = useState({
    name: "",
    imo: "",
    mmsi: "",
    callSign: "",
    flag: "",
    type: "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage in this window
    const entries = JSON.parse(localStorage.getItem("shipParticulars") || "[]");
    entries.push({ ...form, id: Date.now() });
    localStorage.setItem("shipParticulars", JSON.stringify(entries));
    setSaved(true);
    setForm({
      name: "",
      imo: "",
      mmsi: "",
      callSign: "",
      flag: "",
      type: "",
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">Add Ship Particulars</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Vessel Name" required className="border p-1 w-full" />
        <input name="imo" value={form.imo} onChange={handleChange} placeholder="IMO" className="border p-1 w-full" />
        <input name="mmsi" value={form.mmsi} onChange={handleChange} placeholder="MMSI" className="border p-1 w-full" />
        <input name="callSign" value={form.callSign} onChange={handleChange} placeholder="Call Sign" className="border p-1 w-full" />
        <input name="flag" value={form.flag} onChange={handleChange} placeholder="Flag" className="border p-1 w-full" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="border p-1 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded w-full">Save Ship Particulars</button>
      </form>
      {saved && <div className="mt-4 text-green-600">Ship particulars saved!</div>}
    </div>
  );
} 
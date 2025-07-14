"use client"

import React, { useState, useEffect } from "react";

export function VesselForm() {
  const [form, setForm] = useState({
    name: "",
    imo: "",
    mmsi: "",
    callSign: "",
    flag: "",
    type: "",
  });
  const [vessels, setVessels] = useState<any[]>([]);

  // Load vessels from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vessels");
    if (saved) setVessels(JSON.parse(saved));
  }, []);

  // Save vessels to localStorage whenever vessels change
  useEffect(() => {
    localStorage.setItem("vessels", JSON.stringify(vessels));
  }, [vessels]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVessels([...vessels, { ...form, id: Date.now() }]);
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
      <h1 className="text-lg font-semibold mb-4">Add New Vessel</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Vessel Name" required className="border p-1 w-full" />
        <input name="imo" value={form.imo} onChange={handleChange} placeholder="IMO" className="border p-1 w-full" />
        <input name="mmsi" value={form.mmsi} onChange={handleChange} placeholder="MMSI" className="border p-1 w-full" />
        <input name="callSign" value={form.callSign} onChange={handleChange} placeholder="Call Sign" className="border p-1 w-full" />
        <input name="flag" value={form.flag} onChange={handleChange} placeholder="Flag" className="border p-1 w-full" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="border p-1 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded w-full">Save Vessel</button>
      </form>
      {/* Saved Vessels list is now hidden by default. Uncomment below to show. */}
      {/*
      <div className="mt-4">
        <h2 className="font-semibold mb-2">Saved Vessels</h2>
        <ul className="list-disc pl-5 max-h-60 overflow-y-auto">
          {vessels.map((v) => (
            <li key={v.id}>{v.name} {v.imo && `(${v.imo})`}</li>
          ))}
        </ul>
      </div>
      */}
    </div>
  );
} 
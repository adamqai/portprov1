"use client";
import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const emptyBerth = { name: "", status: "available", maxDepth: "", maxLength: "" };

export default function BerthsPage() {
  const { data, mutate, error } = useSWR("/api/berths", fetcher);
  const berths = Array.isArray(data) ? data : [];
  const [formOpen, setFormOpen] = useState(false);
  const [editBerth, setEditBerth] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyBerth);

  const openAdd = () => { setEditBerth(null); setForm(emptyBerth); setFormOpen(true); };
  const openEdit = (berth: any) => { setEditBerth(berth); setForm(berth); setFormOpen(true); };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this berth?")) return;
    await fetch(`/api/berths/${id}`, { method: "DELETE" });
    mutate();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editBerth) {
      await fetch(`/api/berths/${editBerth.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/berths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setFormOpen(false); setEditBerth(null); setForm(emptyBerth); mutate();
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Berths Management</h1>
        <Button onClick={openAdd}>Add Berth</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Berths</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600">Failed to load berths.</div>}
          {!Array.isArray(data) && data?.error && (
            <div className="text-red-600">Error: {data.error}</div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Max Depth</th>
                  <th className="p-2 border">Max Length</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {berths.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">No berths found.</td>
                  </tr>
                )}
                {berths.map((b: any) => (
                  <tr key={b.id} className="border-b">
                    <td className="p-2 border">{b.name}</td>
                    <td className="p-2 border">{b.status}</td>
                    <td className="p-2 border">{b.maxDepth}</td>
                    <td className="p-2 border">{b.maxLength}</td>
                    <td className="p-2 border space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(b)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {formOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold mb-2">{editBerth ? "Edit Berth" : "Add Berth"}</h2>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input className="w-full border rounded p-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select className="w-full border rounded p-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Max Depth</label>
              <input className="w-full border rounded p-2" value={form.maxDepth} onChange={e => setForm({ ...form, maxDepth: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Max Length</label>
              <input className="w-full border rounded p-2" value={form.maxLength} onChange={e => setForm({ ...form, maxLength: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => { setFormOpen(false); setEditBerth(null); setForm(emptyBerth); }}>Cancel</Button>
              <Button type="submit">{editBerth ? "Update" : "Add"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 
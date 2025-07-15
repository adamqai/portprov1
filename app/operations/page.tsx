"use client";
import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const emptyOp = { vesselId: "", berthId: "", operationType: "", startTime: "", endTime: "", status: "scheduled", remarks: "" };

export default function OperationsPage() {
  const { data, mutate, error } = useSWR("/api/operations", fetcher);
  const operations = Array.isArray(data) ? data : [];
  const [formOpen, setFormOpen] = useState(false);
  const [editOp, setEditOp] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyOp);

  const openAdd = () => { setEditOp(null); setForm(emptyOp); setFormOpen(true); };
  const openEdit = (op: any) => { setEditOp(op); setForm(op); setFormOpen(true); };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this operation?")) return;
    await fetch(`/api/operations/${id}`, { method: "DELETE" });
    mutate();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editOp) {
      await fetch(`/api/operations/${editOp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setFormOpen(false); setEditOp(null); setForm(emptyOp); mutate();
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Operations Management</h1>
        <Button onClick={openAdd}>Add Operation</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Operations</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600">Failed to load operations.</div>}
          {!Array.isArray(data) && data?.error && (
            <div className="text-red-600">Error: {data.error}</div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Vessel ID</th>
                  <th className="p-2 border">Berth ID</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Start</th>
                  <th className="p-2 border">End</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {operations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">No operations found.</td>
                  </tr>
                )}
                {operations.map((op: any) => (
                  <tr key={op.id} className="border-b">
                    <td className="p-2 border">{op.vesselId}</td>
                    <td className="p-2 border">{op.berthId}</td>
                    <td className="p-2 border">{op.operationType}</td>
                    <td className="p-2 border">{op.startTime ? new Date(op.startTime).toLocaleString() : ""}</td>
                    <td className="p-2 border">{op.endTime ? new Date(op.endTime).toLocaleString() : ""}</td>
                    <td className="p-2 border">{op.status}</td>
                    <td className="p-2 border space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(op)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(op.id)}>Delete</Button>
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
            <h2 className="text-xl font-bold mb-2">{editOp ? "Edit Operation" : "Add Operation"}</h2>
            <div>
              <label className="block text-sm font-medium">Vessel ID</label>
              <input className="w-full border rounded p-2" value={form.vesselId} onChange={e => setForm({ ...form, vesselId: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Berth ID</label>
              <input className="w-full border rounded p-2" value={form.berthId} onChange={e => setForm({ ...form, berthId: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Type</label>
              <input className="w-full border rounded p-2" value={form.operationType} onChange={e => setForm({ ...form, operationType: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input type="datetime-local" className="w-full border rounded p-2" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input type="datetime-local" className="w-full border rounded p-2" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select className="w-full border rounded p-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Remarks</label>
              <input className="w-full border rounded p-2" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => { setFormOpen(false); setEditOp(null); setForm(emptyOp); }}>Cancel</Button>
              <Button type="submit">{editOp ? "Update" : "Add"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 
"use client";
import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VesselForm } from "@/components/forms/VesselForm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function VesselsPage() {
  const { data, mutate, error } = useSWR("/api/vessels", fetcher);
  const vessels = Array.isArray(data) ? data : [];
  const [formOpen, setFormOpen] = useState(false);
  const [editVessel, setEditVessel] = useState<any>(null);

  const handleEdit = (vessel: any) => {
    setEditVessel(vessel);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vessel?")) return;
    await fetch(`/api/vessels/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vessels Management</h1>
        <Button onClick={() => { setEditVessel(null); setFormOpen(true); }}>Add Vessel</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Vessels</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600">Failed to load vessels.</div>}
          {!Array.isArray(data) && data?.error && (
            <div className="text-red-600">Error: {data.error}</div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">IMO</th>
                  <th className="p-2 border">Flag</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vessels.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">No vessels found.</td>
                  </tr>
                )}
                {vessels.map((v: any) => (
                  <tr key={v.id} className="border-b">
                    <td className="p-2 border">{v.vesselName}</td>
                    <td className="p-2 border">{v.vesselType}</td>
                    <td className="p-2 border">{v.imoNumber}</td>
                    <td className="p-2 border">{v.flag}</td>
                    <td className="p-2 border space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(v)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <VesselForm isOpen={formOpen} onClose={() => { setFormOpen(false); mutate(); setEditVessel(null); }} vessel={editVessel} />
    </div>
  );
} 
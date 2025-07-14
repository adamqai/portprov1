"use client"

import { useState } from "react"
import { X, Ship, Calendar, MapPin, Users, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface VesselFormProps {
  isOpen: boolean
  onClose: () => void
}

export function VesselForm({ isOpen, onClose }: VesselFormProps) {
  const [formData, setFormData] = useState({
    vesselName: "",
    vesselType: "",
    imoNumber: "",
    callSign: "",
    flag: "",
    grossTonnage: "",
    netTonnage: "",
    length: "",
    beam: "",
    draft: "",
    arrivalPort: "",
    berth: "",
    eta: "",
    etd: "",
    agent: "",
    cargo: "",
    cargoWeight: "",
    iidNo: "",
    consignee: "",
    remarks: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Transform form data to match database schema
      const vesselData = {
        vessel_name: formData.vesselName,
        vessel_type: formData.vesselType,
        imo_number: formData.imoNumber,
        call_sign: formData.callSign,
        flag: formData.flag,
        gross_tonnage: formData.grossTonnage,
        length: formData.length ? parseFloat(formData.length) : null,
        beam: formData.beam ? parseFloat(formData.beam) : null,
        draft: formData.draft ? parseFloat(formData.draft) : null,
        net_tonnage: formData.netTonnage,
        arrival_port: formData.arrivalPort,
        berth_id: formData.berth || null,
        eta: formData.eta ? new Date(formData.eta).toISOString() : null,
        etd: formData.etd ? new Date(formData.etd).toISOString() : null,
        agent: formData.agent,
        cargo: formData.cargo,
        cargo_weight: formData.cargoWeight,
        iid_no: formData.iidNo,
        consignee: formData.consignee,
        remarks: formData.remarks
      }

      const response = await fetch('/api/vessels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vesselData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save vessel')
      }

      const result = await response.json()
      console.log("Vessel saved successfully:", result)
      onClose()
      
      // Reset form
      setFormData({
        vesselName: "",
        vesselType: "",
        imoNumber: "",
        callSign: "",
        flag: "",
        grossTonnage: "",
        length: "",
        beam: "",
        draft: "",
        netTonnage: "",
        arrivalPort: "",
        berth: "",
        eta: "",
        etd: "",
        agent: "",
        cargo: "",
        cargoWeight: "",
        iidNo: "",
        consignee: "",
        remarks: ""
      })
    } catch (error) {
      console.error("Error saving vessel:", error)
      alert("Failed to save vessel. Please try again.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Vessel</h2>
              <p className="text-gray-600">Enter vessel details and shipping information</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-50">
          {/* Vessel Information */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-blue-900">
                <Ship className="mr-2 h-5 w-5" />
                Vessel Information
              </CardTitle>
              <CardDescription className="text-blue-700">Basic vessel details and specifications</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vessel Name *</label>
                <Input
                  placeholder="Enter vessel name"
                  value={formData.vesselName}
                  onChange={(e) => handleInputChange("vesselName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vessel Type</label>
                <Select value={formData.vesselType} onValueChange={(value) => handleInputChange("vesselType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="container">Container Ship</SelectItem>
                    <SelectItem value="bulk">Bulk Carrier</SelectItem>
                    <SelectItem value="tanker">Tanker</SelectItem>
                    <SelectItem value="passenger">Passenger Ship</SelectItem>
                    <SelectItem value="cargo">General Cargo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IMO Number</label>
                <Input
                  placeholder="IMO number"
                  value={formData.imoNumber}
                  onChange={(e) => handleInputChange("imoNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Call Sign</label>
                <Input
                  placeholder="Call sign"
                  value={formData.callSign}
                  onChange={(e) => handleInputChange("callSign", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Flag</label>
                <Input
                  placeholder="Flag state"
                  value={formData.flag}
                  onChange={(e) => handleInputChange("flag", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gross Tonnage</label>
                <Input
                  placeholder="GT"
                  value={formData.grossTonnage}
                  onChange={(e) => handleInputChange("grossTonnage", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Vessel Specifications */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-green-900">
                <Package className="mr-2 h-5 w-5" />
                Vessel Specifications
              </CardTitle>
              <CardDescription className="text-green-700">Physical dimensions and capacity</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Length (m)</label>
                <Input
                  placeholder="Length"
                  value={formData.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Beam (m)</label>
                <Input
                  placeholder="Beam"
                  value={formData.beam}
                  onChange={(e) => handleInputChange("beam", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Draft (m)</label>
                <Input
                  placeholder="Draft"
                  value={formData.draft}
                  onChange={(e) => handleInputChange("draft", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Net Tonnage</label>
                <Input
                  placeholder="NT"
                  value={formData.netTonnage}
                  onChange={(e) => handleInputChange("netTonnage", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Port & Berthing Information */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-purple-900">
                <MapPin className="mr-2 h-5 w-5" />
                Port & Berthing Information
              </CardTitle>
              <CardDescription className="text-purple-700">Arrival, departure, and berthing details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Arrival Port</label>
                <Input
                  placeholder="Port name"
                  value={formData.arrivalPort}
                  onChange={(e) => handleInputChange("arrivalPort", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Berth</label>
                <Select value={formData.berth} onValueChange={(value) => handleInputChange("berth", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select berth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="berth-1">Berth 1</SelectItem>
                    <SelectItem value="berth-2">Berth 2</SelectItem>
                    <SelectItem value="berth-3">Berth 3</SelectItem>
                    <SelectItem value="berth-4">Berth 4</SelectItem>
                    <SelectItem value="anchorage">Anchorage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ETA</label>
                <Input
                  type="datetime-local"
                  value={formData.eta}
                  onChange={(e) => handleInputChange("eta", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ETD</label>
                <Input
                  type="datetime-local"
                  value={formData.etd}
                  onChange={(e) => handleInputChange("etd", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent</label>
                <Input
                  placeholder="Shipping agent"
                  value={formData.agent}
                  onChange={(e) => handleInputChange("agent", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cargo & Personnel */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-orange-900">
                <Users className="mr-2 h-5 w-5" />
                Cargo & Personnel
              </CardTitle>
              <CardDescription className="text-orange-700">Cargo details and personnel information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo Type</label>
                <Input
                  placeholder="Cargo description"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange("cargo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo Weight (tons)</label>
                <Input
                  placeholder="Weight"
                  value={formData.cargoWeight}
                  onChange={(e) => handleInputChange("cargoWeight", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IID No</label>
                <Input
                  placeholder="Enter IID number"
                  value={formData.iidNo}
                  onChange={(e) => handleInputChange("iidNo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Consignee</label>
                <Input
                  placeholder="Enter consignee name"
                  value={formData.consignee}
                  onChange={(e) => handleInputChange("consignee", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-gray-900">
                <Clock className="mr-2 h-5 w-5" />
                Additional Remarks
              </CardTitle>
              <CardDescription className="text-gray-700">Any additional notes or special requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any additional remarks, special requirements, or notes..."
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 bg-white p-6 -mx-6 -mb-6">
            <Button variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Ship className="mr-2 h-4 w-4" />
              Add Vessel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 
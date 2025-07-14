"use client"

import { useState } from "react"
import {
  Ship,
  Scale,
  Container,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Activity,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VesselForm } from "@/components/vessel-form"


export default function PortProDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [vesselFormOpen, setVesselFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedShifts, setSelectedShifts] = useState<{[key: string]: string}>({})
  const [showActivityForm, setShowActivityForm] = useState<{[key: string]: boolean}>({})
  const [activityData, setActivityData] = useState<{[key: string]: {timeFrom: string, timeTo: string, remark: string}}>({})
  const [activities, setActivities] = useState<{[key: string]: Array<{timeFrom: string, timeTo: string, remark: string}>}>({})

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "shipping", label: "Shipping & Berthing", icon: Ship },
    { id: "weighbridge", label: "Weighbridge", icon: Scale },
    { id: "operations", label: "Cargo Operations", icon: Container },
    { id: "reports", label: "Reports", icon: FileText },
  ]



  const recentActivities = [
    { id: 1, type: "Vessel Arrival", vessel: "MSC MAYA", berth: "Berth 3", time: "2 hours ago", status: "completed" },
    { id: 2, type: "Weight Check", truck: "TRK-001", weight: "45.2T", time: "30 mins ago", status: "active" },
    { id: 3, type: "Loading Op", container: "MSKU-123456", crane: "Crane 2", time: "1 hour ago", status: "active" },
    { id: 4, type: "Report Gen", report: "Daily Summary", user: "Admin", time: "3 hours ago", status: "completed" },
  ]

  const kpiData = [
    { label: "Vessels in Port", value: "12", change: "+2", trend: "up" },
    { label: "Active Operations", value: "8", change: "-1", trend: "down" },
    { label: "Cargo Processed", value: "2,450T", change: "+15%", trend: "up" },
    { label: "Berth Utilization", value: "85%", change: "+5%", trend: "up" },
  ]

  const handleShiftChange = (berth: string, shift: string) => {
    setSelectedShifts(prev => ({ ...prev, [berth]: shift }))
    setShowActivityForm(prev => ({ ...prev, [berth]: true }))
    setActivityData(prev => ({ ...prev, [berth]: { timeFrom: "", timeTo: "", remark: "" } }))
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setShowCalendar(false)
    // Clear all activities and forms when date changes
    setActivities({})
    setShowActivityForm({})
    setActivityData({})
    setSelectedShifts({})
  }

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isToday = (date: Date) => {
    return formatDate(date) === new Date().toISOString().split('T')[0]
  }

  const isSelected = (date: Date) => {
    return formatDate(date) === selectedDate
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  const handleActivitySubmit = async (berth: string) => {
    const data = activityData[berth]
    if (data && data.timeFrom && data.timeTo && data.remark) {
      try {
        // Simulate API call - in real app, this would save to database
        console.log(`Activity saved for ${berth}:`, data)
        
        // Add activity to the list
        setActivities(prev => ({
          ...prev,
          [berth]: [...(prev[berth] || []), data]
        }))
        
        setShowActivityForm(prev => ({ ...prev, [berth]: false }))
        setActivityData(prev => ({ ...prev, [berth]: { timeFrom: "", timeTo: "", remark: "" } }))
      } catch (error) {
        console.error("Error saving activity:", error)
        alert("Failed to save activity. Please try again.")
      }
    }
  }

  const getShiftTimeRange = (shift: string) => {
    switch (shift) {
      case "0000-0800": return { start: "00:00", end: "08:00" }
      case "0800-1600": return { start: "08:00", end: "16:00" }
      case "1600-0000": return { start: "16:00", end: "00:00" }
      default: return { start: "00:00", end: "00:00" }
    }
  }

  // Helper to check if a time is within a shift range
  function isTimeWithinShift(time: string, shift: string) {
    if (!time || !shift) return false;
    const { start, end } = getShiftTimeRange(shift);
    if (start < end) {
      // e.g. 08:00-16:00
      return time >= start && time <= end;
    } else {
      // e.g. 16:00-00:00 (overnight)
      return (time >= start && time <= "23:59") || (time >= "00:00" && time <= end);
    }
  }

  // Generate time options for a shift (10-minute intervals)
  function generateTimeOptions(shift: string) {
    const { start, end } = getShiftTimeRange(shift);
    const options = [];
    
    if (start < end) {
      // Normal shift (e.g., 08:00-16:00)
      let currentTime = new Date(`2000-01-01T${start}`);
      const endTime = new Date(`2000-01-01T${end}`);
      
      while (currentTime <= endTime) {
        const timeString = currentTime.toTimeString().slice(0, 5);
        options.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + 10);
      }
    } else {
      // Overnight shift (e.g., 16:00-00:00)
      let currentTime = new Date(`2000-01-01T${start}`);
      const endTime = new Date(`2000-01-02T${end}`);
      
      while (currentTime <= endTime) {
        const timeString = currentTime.toTimeString().slice(0, 5);
        options.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + 10);
      }
    }
    
    return options;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Content Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-transparent pointer-events-none z-30 lg:block hidden" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out z-[60] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-0"
        } ${sidebarCollapsed ? "w-20" : "w-72"}`}
      >
        <div className="p-6 border-b border-white/20">
          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-white/20 p-0 h-auto" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Ship className="h-5 w-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-opacity duration-300 ${sidebarCollapsed ? "opacity-0" : "opacity-100"}`}>
                PortPro V1
              </h1>
            </div>
          </Button>
        </div>

        <nav className="p-6 space-y-3 flex-1">
          {navigationItems.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-500 ease-out rounded-xl ${
                      sidebarCollapsed ? "justify-center px-3" : "justify-start px-4"
                    } ${activeTab === item.id ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" : "hover:bg-white/20"}`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <item.icon className={`h-5 w-5 ${sidebarCollapsed ? "mr-0" : "mr-3"}`} />
                    <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                      {item.label}
                    </span>
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right" className="bg-white/90 backdrop-blur-sm border-white/20">
                    <p className="text-gray-900">{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/20">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className={`transition-opacity duration-300 ${sidebarCollapsed ? "opacity-0" : "opacity-100"}`}>
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-600">Port Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-h-screen transition-all duration-500 ease-out ${
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
      }`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Search operations, vessels, reports..." 
                    className="pl-12 w-80 bg-white/50 backdrop-blur-sm border-white/20 focus:bg-white/80 transition-all duration-300" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 lg:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Port Operations Overview
                </h2>
                <p className="text-gray-600 mt-2 text-lg">Real-time monitoring and analytics dashboard</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">{kpi.label}</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {kpi.value}
                          </p>
                        </div>
                        <div
                          className={`flex items-center space-x-2 p-3 rounded-full ${
                            kpi.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          <TrendingUp className="h-5 w-5" />
                          <span className="text-sm font-semibold">{kpi.change}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activities */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-white/20">
                  <CardTitle className="flex items-center text-blue-900">
                    <Activity className="mr-3 h-6 w-6" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-white/20 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              activity.status === "active" ? "bg-green-500 shadow-lg" : "bg-gray-400"
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{activity.type}</p>
                            <p className="text-sm text-gray-600">
                              {activity.vessel || activity.truck || activity.container || activity.report}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={activity.status === "active" ? "default" : "secondary"}
                            className={`${
                              activity.status === "active" 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {activity.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}



          {activeTab === "shipping" && (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Shipping Movement & Berthing
                  </h2>
                  <p className="text-gray-600 mt-2 text-lg">Vessel tracking and berth management</p>
                </div>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                  onClick={() => setVesselFormOpen(true)}
                >
                  <Ship className="mr-3 h-5 w-5" />
                  Add New Vessel
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-white/20">
                    <CardTitle className="text-blue-900">Active Vessels</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-gray-700 font-semibold">Vessel Name</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Berth</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-700 font-semibold">ETA/ETD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-white/20 hover:bg-white/50 transition-colors">
                          <TableCell className="font-semibold">MSC MAYA</TableCell>
                          <TableCell>Berth 3</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 border-green-200">Berthed</Badge>
                          </TableCell>
                          <TableCell>ETD: 14:00</TableCell>
                        </TableRow>
                        <TableRow className="border-white/20 hover:bg-white/50 transition-colors">
                          <TableCell className="font-semibold">COSCO SHIPPING</TableCell>
                          <TableCell>Berth 1</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Loading</Badge>
                          </TableCell>
                          <TableCell>ETD: 18:30</TableCell>
                        </TableRow>
                        <TableRow className="border-white/20 hover:bg-white/50 transition-colors">
                          <TableCell className="font-semibold">EVERGREEN</TableCell>
                          <TableCell>Anchorage</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Waiting</Badge>
                          </TableCell>
                          <TableCell>ETA: 16:00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-white/20">
                    <CardTitle className="text-green-900">Berth Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((berth) => (
                        <div key={berth} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-white/20 hover:shadow-md transition-all duration-300">
                          <span className="font-semibold text-gray-900">Berth {berth}</span>
                          <Badge 
                            className={`${
                              berth <= 3 
                                ? "bg-red-100 text-red-700 border-red-200" 
                                : "bg-green-100 text-green-700 border-green-200"
                            }`}
                          >
                            {berth <= 3 ? "Occupied" : "Available"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Reports Page */}
          {activeTab === "reports" && (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Operations Report
                  </h2>
                  <p className="text-gray-600 mt-2 text-lg">Real-time berth occupancy and vessel information</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
                    <Button
                      variant="outline"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-48 justify-between"
                    >
                      <span>{selectedDate}</span>
                      <Calendar className="h-4 w-4" />
                    </Button>
                    
                    {/* Calendar Dropdown */}
                    {showCalendar && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth('prev')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-semibold">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth('next')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="p-3">
                          {/* Day Headers */}
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} className="text-xs text-gray-500 text-center py-1">
                                {day}
                              </div>
                            ))}
                          </div>
                          
                          {/* Calendar Days */}
                          <div className="grid grid-cols-7 gap-1">
                            {(() => {
                              const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)
                              const days = []
                              
                              // Add empty cells for days before the first day of the month
                              for (let i = 0; i < startingDay; i++) {
                                days.push(<div key={`empty-${i}`} className="h-8" />)
                              }
                              
                              // Add days of the month
                              for (let day = 1; day <= daysInMonth; day++) {
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                const isCurrentDay = isToday(date)
                                const isSelectedDay = isSelected(date)
                                
                                days.push(
                                  <button
                                    key={day}
                                    onClick={() => handleDateChange(formatDate(date))}
                                    className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                                      isSelectedDay
                                        ? 'bg-blue-600 text-white'
                                        : isCurrentDay
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                )
                              }
                              
                              return days
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Berth Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Berth 1 */}
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-white/20">
                    <CardTitle className="flex items-center text-blue-900">
                      <Ship className="mr-2 h-5 w-5" />
                      Berth 1
                    </CardTitle>
                    <CardDescription className="text-blue-700">Vessel berthing information and operations</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vessel Name</label>
                        <p className="text-lg font-semibold text-gray-900">MSC MAYA</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Berthing Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Consignee Name</label>
                        <p className="text-lg font-semibold text-gray-900">ABC Shipping Co.</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Cargo</label>
                        <p className="text-lg font-semibold text-gray-900">2,450 tons</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Shift Selection</label>
                        <Select value={selectedShifts["berth1"]} onValueChange={(value) => handleShiftChange("berth1", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0000-0800">0000-0800</SelectItem>
                            <SelectItem value="0800-1600">0800-1600</SelectItem>
                            <SelectItem value="1600-0000">1600-0000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Always Show Add Activity Button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowActivityForm(prev => ({ ...prev, berth1: !prev.berth1 }))}
                        className="text-xs px-3 py-1 h-7"
                      >
                        {showActivityForm["berth1"] ? "Hide Form" : "Add Activity"}
                      </Button>
                    </div>

                    {/* Add New Activity Section */}
                    {showActivityForm["berth1"] && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time From</label>
                            <Select 
                              value={activityData["berth1"]?.timeFrom || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth1: { ...prev.berth1, timeFrom: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth1"] && generateTimeOptions(selectedShifts["berth1"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time To</label>
                            <Select 
                              value={activityData["berth1"]?.timeTo || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth1: { ...prev.berth1, timeTo: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth1"] && generateTimeOptions(selectedShifts["berth1"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Remark</label>
                            <Input
                              placeholder="e.g., raining"
                              value={activityData["berth1"]?.remark || ""}
                              onChange={(e) => setActivityData(prev => ({
                                ...prev,
                                berth1: { ...prev.berth1, remark: e.target.value }
                              }))}
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        {/* Validation message */}
                        {(
                          activityData["berth1"]?.timeFrom &&
                          activityData["berth1"]?.timeTo &&
                          (!isTimeWithinShift(activityData["berth1"].timeFrom, selectedShifts["berth1"]) ||
                            !isTimeWithinShift(activityData["berth1"].timeTo, selectedShifts["berth1"]))
                        ) && (
                          <div className="text-xs text-red-600 mt-1">Time must be within the selected shift range.</div>
                        )}
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleActivitySubmit("berth1")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                            disabled={
                              !activityData["berth1"]?.timeFrom ||
                              !activityData["berth1"]?.timeTo ||
                              !activityData["berth1"]?.remark ||
                              !isTimeWithinShift(activityData["berth1"].timeFrom, selectedShifts["berth1"]) ||
                              !isTimeWithinShift(activityData["berth1"].timeTo, selectedShifts["berth1"]) ||
                              activityData["berth1"].timeFrom > activityData["berth1"].timeTo
                            }
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Display Activities */}
                    {activities["berth1"] && activities["berth1"].length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Activities</h4>
                        <div className="space-y-2">
                          {activities["berth1"].map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-gray-700">
                                    {activity.timeFrom} - {activity.timeTo}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {activity.remark}
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedShifts["berth1"]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Berth 2 */}
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-white/20">
                    <CardTitle className="flex items-center text-green-900">
                      <Ship className="mr-2 h-5 w-5" />
                      Berth 2
                    </CardTitle>
                    <CardDescription className="text-green-700">Vessel berthing information and operations</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vessel Name</label>
                        <p className="text-lg font-semibold text-gray-900">COSCO SHIPPING</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Berthing Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Consignee Name</label>
                        <p className="text-lg font-semibold text-gray-900">XYZ Logistics</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Cargo</label>
                        <p className="text-lg font-semibold text-gray-900">1,850 tons</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Shift Selection</label>
                        <Select value={selectedShifts["berth2"]} onValueChange={(value) => handleShiftChange("berth2", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0000-0800">0000-0800</SelectItem>
                            <SelectItem value="0800-1600">0800-1600</SelectItem>
                            <SelectItem value="1600-0000">1600-0000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Always Show Add Activity Button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowActivityForm(prev => ({ ...prev, berth2: !prev.berth2 }))}
                        className="text-xs px-3 py-1 h-7"
                      >
                        {showActivityForm["berth2"] ? "Hide Form" : "Add Activity"}
                      </Button>
                    </div>

                    {/* Add New Activity Section */}
                    {showActivityForm["berth2"] && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time From</label>
                            <Select 
                              value={activityData["berth2"]?.timeFrom || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth2: { ...prev.berth2, timeFrom: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth2"] && generateTimeOptions(selectedShifts["berth2"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time To</label>
                            <Select 
                              value={activityData["berth2"]?.timeTo || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth2: { ...prev.berth2, timeTo: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth2"] && generateTimeOptions(selectedShifts["berth2"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Remark</label>
                            <Input
                              placeholder="e.g., raining"
                              value={activityData["berth2"]?.remark || ""}
                              onChange={(e) => setActivityData(prev => ({
                                ...prev,
                                berth2: { ...prev.berth2, remark: e.target.value }
                              }))}
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        {/* Validation message */}
                        {(
                          activityData["berth2"]?.timeFrom &&
                          activityData["berth2"]?.timeTo &&
                          (!isTimeWithinShift(activityData["berth2"].timeFrom, selectedShifts["berth2"]) ||
                            !isTimeWithinShift(activityData["berth2"].timeTo, selectedShifts["berth2"]))
                        ) && (
                          <div className="text-xs text-red-600 mt-1">Time must be within the selected shift range.</div>
                        )}
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleActivitySubmit("berth2")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                            disabled={
                              !activityData["berth2"]?.timeFrom ||
                              !activityData["berth2"]?.timeTo ||
                              !activityData["berth2"]?.remark ||
                              !isTimeWithinShift(activityData["berth2"].timeFrom, selectedShifts["berth2"]) ||
                              !isTimeWithinShift(activityData["berth2"].timeTo, selectedShifts["berth2"]) ||
                              activityData["berth2"].timeFrom > activityData["berth2"].timeTo
                            }
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Display Activities */}
                    {activities["berth2"] && activities["berth2"].length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Activities</h4>
                        <div className="space-y-2">
                          {activities["berth2"].map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-gray-700">
                                    {activity.timeFrom} - {activity.timeTo}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {activity.remark}
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedShifts["berth2"]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Berth 3 */}
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-white/20">
                    <CardTitle className="flex items-center text-purple-900">
                      <Ship className="mr-2 h-5 w-5" />
                      Berth 3
                    </CardTitle>
                    <CardDescription className="text-purple-700">Vessel berthing information and operations</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vessel Name</label>
                        <p className="text-lg font-semibold text-gray-900">EVERGREEN</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Berthing Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Consignee Name</label>
                        <p className="text-lg font-semibold text-gray-900">Global Trade Ltd.</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Cargo</label>
                        <p className="text-lg font-semibold text-gray-900">3,200 tons</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Shift Selection</label>
                        <Select value={selectedShifts["berth3"]} onValueChange={(value) => handleShiftChange("berth3", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0000-0800">0000-0800</SelectItem>
                            <SelectItem value="0800-1600">0800-1600</SelectItem>
                            <SelectItem value="1600-0000">1600-0000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Always Show Add Activity Button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowActivityForm(prev => ({ ...prev, berth3: !prev.berth3 }))}
                        className="text-xs px-3 py-1 h-7"
                      >
                        {showActivityForm["berth3"] ? "Hide Form" : "Add Activity"}
                      </Button>
                    </div>

                    {/* Add New Activity Section */}
                    {showActivityForm["berth3"] && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time From</label>
                            <Select 
                              value={activityData["berth3"]?.timeFrom || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth3: { ...prev.berth3, timeFrom: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth3"] && generateTimeOptions(selectedShifts["berth3"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time To</label>
                            <Select 
                              value={activityData["berth3"]?.timeTo || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth3: { ...prev.berth3, timeTo: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth3"] && generateTimeOptions(selectedShifts["berth3"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Remark</label>
                            <Input
                              placeholder="e.g., raining"
                              value={activityData["berth3"]?.remark || ""}
                              onChange={(e) => setActivityData(prev => ({
                                ...prev,
                                berth3: { ...prev.berth3, remark: e.target.value }
                              }))}
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        {/* Validation message */}
                        {(
                          activityData["berth3"]?.timeFrom &&
                          activityData["berth3"]?.timeTo &&
                          (!isTimeWithinShift(activityData["berth3"].timeFrom, selectedShifts["berth3"]) ||
                            !isTimeWithinShift(activityData["berth3"].timeTo, selectedShifts["berth3"]))
                        ) && (
                          <div className="text-xs text-red-600 mt-1">Time must be within the selected shift range.</div>
                        )}
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleActivitySubmit("berth3")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                            disabled={
                              !activityData["berth3"]?.timeFrom ||
                              !activityData["berth3"]?.timeTo ||
                              !activityData["berth3"]?.remark ||
                              !isTimeWithinShift(activityData["berth3"].timeFrom, selectedShifts["berth3"]) ||
                              !isTimeWithinShift(activityData["berth3"].timeTo, selectedShifts["berth3"]) ||
                              activityData["berth3"].timeFrom > activityData["berth3"].timeTo
                            }
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Display Activities */}
                    {activities["berth3"] && activities["berth3"].length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Activities</h4>
                        <div className="space-y-2">
                          {activities["berth3"].map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-gray-700">
                                    {activity.timeFrom} - {activity.timeTo}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {activity.remark}
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedShifts["berth3"]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Berth 4 */}
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-white/20">
                    <CardTitle className="flex items-center text-orange-900">
                      <Ship className="mr-2 h-5 w-5" />
                      Berth 4
                    </CardTitle>
                    <CardDescription className="text-orange-700">Vessel berthing information and operations</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vessel Name</label>
                        <p className="text-lg font-semibold text-gray-900">MAERSK LINE</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Berthing Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Consignee Name</label>
                        <p className="text-lg font-semibold text-gray-900">Maritime Solutions</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Cargo</label>
                        <p className="text-lg font-semibold text-gray-900">2,800 tons</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Shift Selection</label>
                        <Select value={selectedShifts["berth4"]} onValueChange={(value) => handleShiftChange("berth4", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0000-0800">0000-0800</SelectItem>
                            <SelectItem value="0800-1600">0800-1600</SelectItem>
                            <SelectItem value="1600-0000">1600-0000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Always Show Add Activity Button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowActivityForm(prev => ({ ...prev, berth4: !prev.berth4 }))}
                        className="text-xs px-3 py-1 h-7"
                      >
                        {showActivityForm["berth4"] ? "Hide Form" : "Add Activity"}
                      </Button>
                    </div>

                    {/* Add New Activity Section */}
                    {showActivityForm["berth4"] && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time From</label>
                            <Select 
                              value={activityData["berth4"]?.timeFrom || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth4: { ...prev.berth4, timeFrom: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth4"] && generateTimeOptions(selectedShifts["berth4"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Time To</label>
                            <Select 
                              value={activityData["berth4"]?.timeTo || ""} 
                              onValueChange={(value) => setActivityData(prev => ({
                                ...prev,
                                berth4: { ...prev.berth4, timeTo: value }
                              }))}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedShifts["berth4"] && generateTimeOptions(selectedShifts["berth4"]).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700">Remark</label>
                            <Input
                              placeholder="e.g., raining"
                              value={activityData["berth4"]?.remark || ""}
                              onChange={(e) => setActivityData(prev => ({
                                ...prev,
                                berth4: { ...prev.berth4, remark: e.target.value }
                              }))}
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        {/* Validation message */}
                        {(
                          activityData["berth4"]?.timeFrom &&
                          activityData["berth4"]?.timeTo &&
                          (!isTimeWithinShift(activityData["berth4"].timeFrom, selectedShifts["berth4"]) ||
                            !isTimeWithinShift(activityData["berth4"].timeTo, selectedShifts["berth4"]))
                        ) && (
                          <div className="text-xs text-red-600 mt-1">Time must be within the selected shift range.</div>
                        )}
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleActivitySubmit("berth4")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                            disabled={
                              !activityData["berth4"]?.timeFrom ||
                              !activityData["berth4"]?.timeTo ||
                              !activityData["berth4"]?.remark ||
                              !isTimeWithinShift(activityData["berth4"].timeFrom, selectedShifts["berth4"]) ||
                              !isTimeWithinShift(activityData["berth4"].timeTo, selectedShifts["berth4"]) ||
                              activityData["berth4"].timeFrom > activityData["berth4"].timeTo
                            }
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Display Activities */}
                    {activities["berth4"] && activities["berth4"].length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Activities</h4>
                        <div className="space-y-2">
                          {activities["berth4"].map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-gray-700">
                                    {activity.timeFrom} - {activity.timeTo}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {activity.remark}
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedShifts["berth4"]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab !== "overview" && activeTab !== "shipping" && activeTab !== "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace("-", " & ")}</h2>
                <p className="text-gray-600">Module under development</p>
              </div>
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    {activeTab === "weighbridge" && <Scale className="h-16 w-16 mx-auto" />}
                    {activeTab === "operations" && <Container className="h-16 w-16 mx-auto" />}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-gray-600">This module is being developed and will be available soon.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      
      {/* Vessel Form Modal */}
      <VesselForm 
        isOpen={vesselFormOpen} 
        onClose={() => setVesselFormOpen(false)} 
      />
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Ship, Activity, MapPin, TrendingUp } from 'lucide-react'

export function DashboardStats() {
  // Removed: const { vessels, loading: vesselsLoading } = useVessels()
  // Removed: const { activities, loading: activitiesLoading } = useActivities()
  // Removed: const { berths, loading: berthsLoading } = useBerths()

  const stats = [
    {
      title: "Total Vessels",
      value: 0, // Placeholder, as useVessels is removed
      change: "+2",
      trend: "up",
      icon: Ship,
      loading: true // Placeholder, as useVessels is removed
    },
    {
      title: "Active Operations",
      value: 0, // Placeholder, as useActivities is removed
      change: "-1",
      trend: "down",
      icon: Activity,
      loading: true // Placeholder, as useActivities is removed
    },
    {
      title: "Available Berths",
      value: 0, // Placeholder, as useBerths is removed
      change: "+1",
      trend: "up",
      icon: MapPin,
      loading: true // Placeholder, as useBerths is removed
    },
    {
      title: "Today's Activities",
      value: 0, // Placeholder, as useActivities is removed
      change: "+5",
      trend: "up",
      icon: TrendingUp,
      loading: true // Placeholder, as useActivities is removed
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {stat.loading ? "..." : stat.value}
                </p>
              </div>
              <div
                className={`flex items-center space-x-2 p-3 rounded-full ${
                  stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                <stat.icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{stat.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
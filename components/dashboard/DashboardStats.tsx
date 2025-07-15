"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Ship, Activity, MapPin, TrendingUp } from 'lucide-react'
import { useStats } from '@/hooks/use-stats'

export function DashboardStats() {
  const { vessels, operations, berths, loading, error } = useStats();

  if (error) return <div>Failed to load stats</div>;

  const stats = [
    {
      title: "Total Vessels",
      value: vessels?.length || 0,
      change: "+2", // Placeholder
      trend: "up",
      icon: Ship,
      loading: loading,
    },
    {
      title: "Active Operations",
      value: operations?.filter((op: any) => op.status === 'in-progress').length || 0,
      change: "-1", // Placeholder
      trend: "down",
      icon: Activity,
      loading: loading,
    },
    {
      title: "Available Berths",
      value: berths?.filter((b: any) => b.status === 'available').length || 0,
      change: "+1", // Placeholder
      trend: "up",
      icon: MapPin,
      loading: loading,
    },
    {
      title: "Today's Activities",
      value: operations?.filter((op: any) => new Date(op.startTime).toDateString() === new Date().toDateString()).length || 0,
      change: "+5", // Placeholder
      trend: "up",
      icon: TrendingUp,
      loading: loading,
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
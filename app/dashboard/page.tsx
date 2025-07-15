"use client";

import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { LiveMap } from '@/components/maps/LiveMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStats } from '@/hooks/use-stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { error, operations, berths } = useStats();

  // Sort operations by startTime descending and take the 5 most recent
  const recentOps = [...operations].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).slice(0, 5);

  // Prepare berth utilization data
  const statusCounts = berths.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const berthChartData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-4xl font-bold">Port Operations Dashboard</h1>
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mb-4">
          Failed to load dashboard data. Please check your connection or try again later.
        </div>
      )}
      <DashboardStats />
      <Card>
        <CardHeader>
          <CardTitle>Berth Utilization</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={berthChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {recentOps.length === 0 && <li className="py-2 text-gray-500">No recent operations.</li>}
            {recentOps.map((op) => (
              <li key={op.id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-semibold">{op.operationType || 'Operation'}</span>{' '}
                  for vessel <span className="font-semibold">{op.vesselId}</span>
                  {op.status && (
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${op.status === 'completed' ? 'bg-green-100 text-green-700' : op.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{op.status}</span>
                  )}
                </span>
                <span className="text-gray-500 text-sm mt-1 sm:mt-0">
                  {op.startTime ? new Date(op.startTime).toLocaleString() : 'No time'}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Live Vessel Map</CardTitle>
        </CardHeader>
        <CardContent className="h-[500px]">
          <LiveMap />
        </CardContent>
      </Card>
    </div>
  );
} 
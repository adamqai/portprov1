"use client";

import dynamic from 'next/dynamic';
import { useStats } from '@/hooks/use-stats';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export function LiveMap() {
  const { vessels, loading, error } = useStats();

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Failed to load map</div>;

  return <MapComponent vessels={vessels} />;
}
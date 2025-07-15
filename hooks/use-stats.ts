import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ensureArray(data: any) {
  return Array.isArray(data) ? data : [];
}

export function useStats() {
  const { data: vessels, error: vesselsError } = useSWR('/api/vessels', fetcher);
  const { data: operations, error: operationsError } = useSWR('/api/operations', fetcher);
  const { data: berths, error: berthsError } = useSWR('/api/berths', fetcher);

  const loading = !vessels && !operations && !berths;
  const error = vesselsError || operationsError || berthsError;

  return {
    vessels: ensureArray(vessels),
    operations: ensureArray(operations),
    berths: ensureArray(berths),
    loading,
    error,
  };
}
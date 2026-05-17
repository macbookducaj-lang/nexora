import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../lib/products';

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: Boolean(id),
  });
}

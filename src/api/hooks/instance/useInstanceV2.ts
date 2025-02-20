import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useApi } from 'soapbox/hooks';
import { InstanceV2, instanceV2Schema } from 'soapbox/schemas/instance';

interface Opts extends Pick<UseQueryOptions<unknown>, 'enabled' | 'retryOnMount' | 'staleTime'> {
  /** The base URL of the instance. */
  baseUrl?: string;
}

/** Get the Instance for the current backend. */
export function useInstanceV2(opts: Opts = {}) {
  const api = useApi();

  const { baseUrl } = opts;

  const { data: instance, ...rest } = useQuery<InstanceV2>({
    queryKey: ['instance', baseUrl ?? api.baseUrl, 'v2'],
    queryFn: async () => {
      const response = await api.get('/api/v2/instance');
      const data = await response.json();
      return instanceV2Schema.parse(data);
    },
    ...opts,
  });

  return { instance, ...rest };
}

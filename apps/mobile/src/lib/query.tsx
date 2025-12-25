import { PropsWithChildren, useState } from 'react'
import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function ReactQueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient)
  void useReactQueryDevTools(queryClient)

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

function createQueryClient() {
  return new QueryClient()
}

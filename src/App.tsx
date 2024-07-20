import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
  },
  basepath: import.meta.env.VITE_BASE_URL,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
      />
      {/* <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
        position="top"
      /> */}
    </QueryClientProvider>
  );
}

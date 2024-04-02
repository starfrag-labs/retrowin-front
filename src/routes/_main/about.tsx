import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/about')({
  component: HomeComponent,
});

function HomeComponent() {
  const router = useRouter();

  const handleHome = () => {
    router.navigate({ to: '/' });
  };

  return (
    <div>
      <button onClick={handleHome}>home22222</button>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/enroll')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      enroll page
    </div>
  );
}

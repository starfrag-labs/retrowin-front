import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_main/cloud')({
  component: CloudComponent,
  
});

function CloudComponent() {
  return (
    <div>
      <h1>Folder</h1>
      <p>This is the folder page.</p>
    </div>
  );
}
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_mLayout/m/$folderKey')({
  component: () => <div>Hello /_m/$folderKey!</div>
})
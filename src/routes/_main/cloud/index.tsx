import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/cloud/')({
  beforeLoad: async () => {
    throw redirect({
      to: '/cloud/$folderKey',
      params: { folderKey: 'home' }, 
    })
  }
})
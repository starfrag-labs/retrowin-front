import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    </div>
  )
}
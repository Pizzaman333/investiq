import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../features/auth/authContext'
import { DemoDataProvider } from '../features/demo/DemoDataContext'
import { router } from './router'

function App() {
  return (
    <AuthProvider>
      <DemoDataProvider>
        <RouterProvider router={router} />
      </DemoDataProvider>
    </AuthProvider>
  )
}

export default App

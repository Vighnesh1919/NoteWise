import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/common/ProtectedRoute'
import LoginPage     from '../pages/Auth/LoginPage'
import RegisterPage  from '../pages/Auth/RegisterPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import EditorPage    from '../pages/Editor/EditorPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/editor/:id" element={
            <ProtectedRoute><EditorPage /></ProtectedRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
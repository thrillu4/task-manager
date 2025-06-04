import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import TasksPage from './pages/Tasks'
import RegisterPage from './pages/Register'
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tasks" element={<TasksPage />} />
    </Routes>
  )
}

export default App

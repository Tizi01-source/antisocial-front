import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import NotFound from './pages/NotFound'

export default function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          {/* Rutas públicas */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="post/:id" element={<PostDetail />} />

          {/* Rutas protegidas: solo con usuario logueado */}
          <Route element={<ProtectedRoute />}>
            <Route path="perfil" element={<Profile />} />
            <Route path="crear-post" element={<CreatePost />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  )
}
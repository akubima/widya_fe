import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { UserListPage } from './pages/UserListPage';
import { UserDetailPage } from './pages/UserDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            {/* Root path reservation: langsung redirect ke /dashboard/users */}
            <Route path="/" element={<Navigate to="/dashboard/users" replace />} />

            {/* Halaman Daftar Pengguna */}
            <Route path="/dashboard/users" element={<UserListPage />} />

            {/* Halaman Detail Pengguna Spesifik */}
            <Route path="/dashboard/users/:id" element={<UserDetailPage />} />

            {/* Fallback jika route tidak ditemukan */}
            <Route path="*" element={<Navigate to="/dashboard/users" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

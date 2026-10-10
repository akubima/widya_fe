import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { User } from '../types/user';
import { useFetch } from '../hooks/useFetch';
import { ErrorAlert } from '../components/ErrorAlert';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Menggunakan Custom Hook useFetch yang sama dengan halaman list
  const { data: user, loading, error, refetch } = useFetch<User>(
    id ? `https://jsonplaceholder.typicode.com/users/${id}` : null
  );

  return (
    <div className="space-y-6">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          to="/dashboard/users"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          &larr; Kembali ke Daftar Pengguna
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorAlert message={error} onRetry={refetch} />
      )}

      {/* Konten Detail Pengguna */}
      {user && !loading && !error && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          {/* Header Profil */}
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-medium">
                  ID #{user.id}
                </span>
              </div>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Grid Informasi Lengkap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Bagian Kontak */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
              <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-2">
                Informasi Kontak
              </h2>
              <div className="space-y-1.5 text-gray-700 text-xs">
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </p>
                <p>
                  <span className="font-medium">Telepon:</span> {user.phone}
                </p>
                <p>
                  <span className="font-medium">Website:</span>{' '}
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.website}
                  </a>
                </p>
              </div>
            </div>

            {/* Bagian Perusahaan */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
              <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-2">
                Informasi Perusahaan
              </h2>
              <div className="space-y-1.5 text-gray-700 text-xs">
                <p>
                  <span className="font-medium">Nama:</span> {user.company.name}
                </p>
                <p>
                  <span className="font-medium">Slogan:</span> &ldquo;{user.company.catchPhrase}&rdquo;
                </p>
                <p>
                  <span className="font-medium">Bidang Bisnis:</span> {user.company.bs}
                </p>
              </div>
            </div>

            {/* Bagian Alamat Lengkap */}
            <div className="md:col-span-2 rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
              <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-2">
                Alamat Lengkap
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700 text-xs">
                <p>
                  <span className="font-medium">Jalan:</span> {user.address.street}, {user.address.suite}
                </p>
                <p>
                  <span className="font-medium">Kota:</span> {user.address.city}
                </p>
                <p>
                  <span className="font-medium">Kode Pos:</span> {user.address.zipcode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

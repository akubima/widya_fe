import React, { useState } from 'react';
import type { User } from '../types/user';
import { useFetch } from '../hooks/useFetch';
import { SearchBar } from '../components/SearchBar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import { UserCard } from '../components/UserCard';

export const UserListPage: React.FC = () => {
  // 1. Menggunakan Custom Hook untuk mengambil data (DRY & aman dari memory leak)
  const { data: users, loading, error, refetch } = useFetch<User[]>(
    'https://jsonplaceholder.typicode.com/users'
  );

  const [search, setSearch] = useState<string>('');

  // 2. Realtime client-side search (filter berdasarkan nama atau email)
  const userList = users || [];
  const filteredUsers = userList.filter((user) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengguna</h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar pengguna dari API publik JSONPlaceholder.
        </p>
      </div>

      {/* Input Pencarian & Counter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari berdasarkan nama atau email..."
        />

        <div className="text-xs text-gray-500 self-start sm:self-center">
          {!loading && !error && (
            <span>
              Menampilkan {filteredUsers.length} dari {userList.length} pengguna
            </span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <ErrorAlert message={error} onRetry={refetch} />
      )}

      {/* Loading State */}
      {loading && <LoadingSkeleton count={6} />}

      {/* Empty State */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          <p className="text-sm font-medium">
            Tidak ada pengguna yang cocok dengan &ldquo;{search}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-3 text-xs text-blue-600 hover:underline"
          >
            Bersihkan pencarian
          </button>
        </div>
      )}

      {/* Grid Card List */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

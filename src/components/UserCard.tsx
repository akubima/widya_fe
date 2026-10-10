import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types/user';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-base">{user.name}</h2>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
          <p>
            <span className="font-medium text-gray-700">Email:</span>{' '}
            <a
              href={`mailto:${user.email}`}
              className="text-blue-600 hover:underline"
            >
              {user.email}
            </a>
          </p>
          <p>
            <span className="font-medium text-gray-700">Telepon:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium text-gray-700">Perusahaan:</span>{' '}
            {user.company.name}
          </p>
          <p>
            <span className="font-medium text-gray-700">Kota:</span>{' '}
            {user.address.city}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <Link
          to={`/dashboard/users/${user.id}`}
          className="rounded bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Lihat Detail &rarr;
        </Link>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'Stock' | 'VIN' | 'Name'>('Stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchName, setSearchName] = useState('');
  const [vinInput, setVinInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let q = '';
    if (searchMode === 'Stock') {
      q = searchQuery.trim();
      if (q) {
        router.push(`/vehicle/${q}`);
      }
    } else if (searchMode === 'VIN') {
      q = vinInput.trim().slice(0, 11);
      if (q) {
        router.push(`/search?vin=${q}`);
      }
    } else {
      q = searchName.trim();
      if (q) {
        const parts = q.split(/\s+/);
        if (parts.length >= 3 && /^\d{4}$/.test(parts[2])) {
          const [make, model, year] = parts;
          router.push(`/search?make=${make}&model=${model}&year=${year}`);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-200 rounded-full p-1">
          {['Stock', 'VIN', 'Name'].map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setSearchMode(mode as any);
                setSearchQuery('');
                setSearchName('');
                setVinInput('');
              }}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                searchMode === mode
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        {searchMode === 'VIN' ? (
          <div className="relative w-full max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={24}
            />
            <input
              type="text"
              placeholder="Enter VIN"
              className="w-full rounded-full py-3 pl-14 pr-4 text-gray-800 placeholder-gray-500 shadow-lg"
              value={vinInput}
              onChange={e => setVinInput(e.target.value.toUpperCase())}
            />
          </div>
        ) : (
          <div className="relative w-full max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={24}
            />
            <input
              type="text"
              placeholder={
                searchMode === 'Stock'
                  ? 'Enter Stock Number...'
                  : 'Make Model Year...'
              }
              className="w-full rounded-full py-3 pl-14 pr-4 text-gray-800 placeholder-gray-500 shadow-lg"
              value={searchMode === 'Name' ? searchName : searchQuery}
              onChange={e =>
                searchMode === 'Name'
                  ? setSearchName(e.target.value)
                  : setSearchQuery(e.target.value)
              }
            />
          </div>
        )}
      </div>
    </form>
  );
} 

import React, { useState } from 'react';
import Button from './Button';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false, placeholder = "Enter keyword, hashtag, or topic...", initialValue = '' }) => {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-2xl mx-auto">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="px-6 py-3">
        Analyze
      </Button>
    </form>
  );
};

export default SearchBar;

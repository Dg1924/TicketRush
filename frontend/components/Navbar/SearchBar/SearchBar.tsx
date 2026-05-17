"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:flex items-center bg-white/8 border rounded-full px-4 py-2 w-80 gap-2"
    >
      <Search className="w-4 h-4 text-gray-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent text-white outline-none w-full"
      />
    </form>
  );
};

export default SearchBar;

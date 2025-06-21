import { Input } from "../ui/input";
import { Search, UserSearch } from "lucide-react";
import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative mb-4 dark:text-white">
      <UserSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};

export default SearchBar;
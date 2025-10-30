"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BasicSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onToggleAdvanced: () => void;
  showAdvanced: boolean;
}

export function BasicSearch({
  searchValue,
  onSearchChange,
  onSearch,
  onToggleAdvanced,
  showAdvanced,
}: BasicSearchProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
      <div className="flex-1 relative min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Tìm kiếm sản phẩm theo tên..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 w-full"
        />
      </div>
      <Button onClick={onSearch} className="px-4 sm:px-6 w-full sm:w-auto">
        <Search className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Tìm kiếm</span>
        <span className="sm:hidden">Tìm</span>
      </Button>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, RefreshCw, Settings, Monitor } from "lucide-react";
import { CategoryResponse, PcBuildResponse } from "@/types";
import { useCategories, usePcBuildsInfinite } from "@/hooks";

interface PcBuildSelectorInfiniteProps {
  onPcBuildSelect: (pcBuild: PcBuildResponse | null) => void;
  selectedPcBuild: PcBuildResponse | null;
  title?: string;
  description?: string;
}

export function PcBuildSelectorInfinite({
  onPcBuildSelect,
  selectedPcBuild,
  title = "Chọn cấu hình máy tính",
  description = "Tìm kiếm và chọn cấu hình máy tính để quản lý linh kiện",
}: PcBuildSelectorInfiniteProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();
  const {
    pcBuilds,
    loading: pcBuildsLoading,
    loadingMore,
    hasMore,
    totalItems,
    fetchPcBuilds,
    loadMorePcBuilds,
    reset,
  } = usePcBuildsInfinite();

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load PC builds when category or search changes
  useEffect(() => {
    const filters: any = {};

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    if (selectedCategoryId && selectedCategoryId !== "all") {
      filters.categoryId = selectedCategoryId;
    }

    fetchPcBuilds(filters);
  }, [debouncedSearchTerm, selectedCategoryId, fetchPcBuilds]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore || pcBuildsLoading || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMorePcBuilds();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, pcBuildsLoading, loadMorePcBuilds, isOpen]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm("");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handlePcBuildSelect = useCallback((pcBuild: PcBuildResponse) => {
    onPcBuildSelect(pcBuild);
    setIsOpen(false);
  }, [onPcBuildSelect]);

  const handleClearSelection = useCallback(() => {
    onPcBuildSelect(null);
  }, [onPcBuildSelect]);

  const handleRefresh = useCallback(() => {
    reset();
    setSearchTerm("");
    setSelectedCategoryId("all");
  }, [reset]);

  // Filter PC builds by selected category (client-side filtering)
  const filteredPcBuilds = useMemo(() => {
    if (selectedCategoryId === "all") return pcBuilds;
    return pcBuilds.filter(pcBuild => pcBuild.categoryId === selectedCategoryId);
  }, [pcBuilds, selectedCategoryId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={pcBuildsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${pcBuildsLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Selection */}
        {selectedPcBuild ? (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{selectedPcBuild.productName}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedPcBuild.categoryName}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedPcBuild.subCategoryName}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {selectedPcBuild.price?.toLocaleString()} VND
                  </Badge>
                  <Badge variant={selectedPcBuild.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                    {selectedPcBuild.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? 'Đóng' : 'Thay đổi'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg border-2 border-dashed">
            <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">Chưa chọn cấu hình nào</p>
            <Button onClick={() => setIsOpen(true)}>
              Chọn cấu hình
            </Button>
          </div>
        )}

        {/* PC Build Selection Modal */}
        {isOpen && (
          <div className="space-y-4 p-4 border rounded-lg bg-background">
            {/* Filters */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo tên cấu hình..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* PC Builds List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Cấu hình máy tính</h4>
                <Badge variant="secondary" className="text-xs">
                  {filteredPcBuilds.length} / {totalItems} cấu hình
                </Badge>
              </div>

              <ScrollArea className="h-64 w-full border rounded-md">
                <div className="p-4 space-y-2">
                  {pcBuildsLoading && filteredPcBuilds.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Đang tải cấu hình...</span>
                    </div>
                  ) : filteredPcBuilds.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Không tìm thấy cấu hình phù hợp</p>
                    </div>
                  ) : (
                    <>
                      {filteredPcBuilds.map((pcBuild) => (
                        <div
                          key={pcBuild.id}
                          className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handlePcBuildSelect(pcBuild)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{pcBuild.productName}</h5>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {pcBuild.categoryName}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {pcBuild.subCategoryName}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {pcBuild.price?.toLocaleString()} VND
                                </Badge>
                                <Badge variant={pcBuild.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                                  {pcBuild.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Load More Trigger */}
                      {hasMore && (
                        <div 
                          ref={loadMoreRef} 
                          className="flex items-center justify-center py-4"
                        >
                          {loadingMore && (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm text-muted-foreground">
                                Đang tải thêm...
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
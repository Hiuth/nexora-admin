"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        {/* Main Hero Card */}
        <div className="bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="h-8 w-32 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-12 w-64 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-6 w-96 bg-gray-200 rounded-lg mb-6"></div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="w-72 h-72 relative">
                <div className="absolute inset-0 bg-gray-300 rounded-3xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-gray-200 rounded-3xl transform -rotate-6 opacity-20"></div>
                <div className="absolute inset-6 bg-white rounded-full shadow-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-100"
            >
              <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-gray-100"
          >
            {/* Icon placeholder */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-3 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-gray-200 h-1.5 rounded-full w-3/4"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gray-100"></div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gray-50"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-32 bg-gray-200 rounded"></div>
                          <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-6 w-24 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div>
                  <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Primary Actions */}
              <div className="space-y-3">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                <div className="grid gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="w-full p-4 bg-gray-200 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 w-24 bg-gray-300 rounded mb-1"></div>
                          <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 bg-gray-100 rounded-2xl">
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div>
                          <div className="h-4 w-16 bg-gray-200 rounded mb-1 mx-auto"></div>
                          <div className="h-3 w-20 bg-gray-200 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div>
                  <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 bg-gray-200 rounded-full absolute -top-2 -left-2 z-10"></div>
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                      {i < 3 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-200 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-12 bg-gray-200 rounded"></div>
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

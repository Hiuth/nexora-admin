"use client";

import { Calendar, Activity, TrendingUp, Users, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Main Hero Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              Dashboard Admin
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Nexora
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Admin
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl">
              Hệ thống quản lý thông minh cho cửa hàng máy tính của bạn. Theo
              dõi, phân tích và tối ưu hóa mọi hoạt động kinh doanh.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Hoạt động bình thường
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="w-72 h-72 relative">
              {/* Background decorations */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl transform -rotate-6 opacity-20"></div>

              {/* Main circle */}
              <div className="absolute inset-6 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Nexora</h3>
                  <p className="text-gray-500 text-sm">Management System</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-900">99.9%</div>
          <div className="text-sm text-gray-500">Uptime</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-green-600">+24%</div>
          <div className="text-sm text-gray-500">Tăng trưởng</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-blue-600">Live</div>
          <div className="text-sm text-gray-500">Real-time</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-purple-600">Pro</div>
          <div className="text-sm text-gray-500">Version</div>
        </div>
      </div>
    </div>
  );
}

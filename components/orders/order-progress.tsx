"use client";

import {
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  FileText,
  Package,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OrderStep = "cart" | "order" | "processing" | "completed";

interface OrderProgressProps {
  currentStep: OrderStep;
  cartItemsCount: number;
}

const steps = [
  {
    id: "cart",
    title: "Thêm Sản Phẩm",
    description: "Chọn sản phẩm và thêm vào giỏ hàng",
    icon: ShoppingCart,
    color: "blue",
  },
  {
    id: "order",
    title: "Thông Tin Đơn Hàng",
    description: "Nhập thông tin khách hàng và tạo đơn hàng",
    icon: FileText,
    color: "green",
  },
  {
    id: "processing",
    title: "Xử Lý Đơn Hàng",
    description: "Tạo chi tiết đơn hàng cho từng sản phẩm",
    icon: Package,
    color: "orange",
  },
  {
    id: "completed",
    title: "Hoàn Thành",
    description: "Đơn hàng đã được tạo thành công",
    icon: CheckCircle2,
    color: "emerald",
  },
];

export function OrderProgress({
  currentStep,
  cartItemsCount,
}: OrderProgressProps) {
  const getProgress = () => {
    switch (currentStep) {
      case "cart":
        return cartItemsCount > 0 ? 25 : 0;
      case "order":
        return 50;
      case "processing":
        return 75;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case "cart":
        return 1;
      case "order":
        return 2;
      case "processing":
        return 3;
      case "completed":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tạo Đơn Hàng Mới</h1>
            <p className="text-indigo-100 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="text-right">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 mb-2"
            >
              Bước {getCurrentStepNumber()}/4
            </Badge>
            <div className="text-sm text-indigo-100">
              {steps.find((step) => step.id === currentStep)?.title}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-xl">Tiến Trình Tạo Đơn Hàng</CardTitle>
          <CardDescription>
            Theo dõi tiến độ tạo đơn hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Tiến độ hoàn thành</span>
              <span>{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-3" />
          </div>

          {/* Steps Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > index;

              return (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    isCompleted
                      ? `border-${step.color}-200 bg-${step.color}-50`
                      : isActive
                      ? `border-${step.color}-300 bg-${step.color}-100 shadow-md`
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? `bg-${step.color}-500 text-white`
                          : isActive
                          ? `bg-${step.color}-600 text-white`
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <p className="text-xs text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="absolute -right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

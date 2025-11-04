"use client";

import { ArrowRight, Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ContinueOrderButtonProps {
  cartItemsCount: number;
  totalAmount: number;
  onContinue: () => void;
  disabled?: boolean;
}

export function ContinueOrderButton({
  cartItemsCount,
  totalAmount,
  onContinue,
  disabled = false,
}: ContinueOrderButtonProps) {
  if (cartItemsCount === 0) return null;

  return (
    <Card className="border-0 shadow-xl bg-blue-50 border-blue-200 overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <ShoppingCart className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Sẵn sàng tạo đơn hàng!
            </h3>
            <p className="text-gray-600">
              Bạn đã có {cartItemsCount} sản phẩm trong giỏ hàng
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {cartItemsCount}
                </div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalAmount.toLocaleString("vi-VN")} ₫
                </div>
                <div className="text-sm text-gray-600">Tổng giá trị</div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            disabled={disabled}
            size="lg"
            className="group bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
            Tiếp Tục Tạo Đơn Hàng
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>

          {/* Subtitle */}
          <p className="text-sm text-gray-500">
            Bước tiếp theo: Nhập thông tin khách hàng và hoàn tất đơn hàng
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Package, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import {
  CreateOrderCart,
  CartItem,
} from "@/components/orders/create-order-cart";
import { AddToCartDialog } from "@/components/orders/add-to-cart-dialog";
import { CreateOrderForm } from "@/components/orders/create-order-form";
import { OrderProgress } from "@/components/orders/order-progress";
import { ContinueOrderButton } from "@/components/orders/continue-order-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useOrders } from "@/hooks/use-orders";
import { useOrderDetails } from "@/hooks/use-order-details";
import { CreateOrderRequest, OrderResponse } from "@/types";
import { toast } from "@/hooks/use-toast";

type OrderStep = "cart" | "order" | "processing" | "completed";

interface OrderFlowState {
  step: OrderStep;
  cartItems: CartItem[];
  orderData: CreateOrderRequest | null;
  createdOrder: OrderResponse | null;
}

export default function CreateOrderPage() {
  // Hooks
  const { creating: creatingOrder, createOrder } = useOrders();
  const { creating: creatingOrderDetails, createOrderDetail } =
    useOrderDetails();

  // State
  const [flowState, setFlowState] = useState<OrderFlowState>({
    step: "cart",
    cartItems: [],
    orderData: null,
    createdOrder: null,
  });
  const [addToCartDialogOpen, setAddToCartDialogOpen] = useState(false);

  // Calculate progress
  const getProgress = () => {
    switch (flowState.step) {
      case "cart":
        return flowState.cartItems.length > 0 ? 25 : 0;
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

  const getTotalAmount = () => {
    return flowState.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  };

  // Cart operations
  const handleAddToCart = (item: Omit<CartItem, "id">) => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      ...item,
    };

    setFlowState((prev) => ({
      ...prev,
      cartItems: [...prev.cartItems, newItem],
    }));

    toast({
      title: "✅ Đã thêm vào giỏ hàng",
      description: `${item.product.productName} x${item.quantity}`,
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setFlowState((prev) => ({
      ...prev,
      cartItems: prev.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setFlowState((prev) => ({
      ...prev,
      cartItems: prev.cartItems.filter((item) => item.id !== itemId),
    }));

    toast({
      title: "🗑️ Đã xóa sản phẩm",
      description: "Sản phẩm đã được xóa khỏi giỏ hàng",
    });
  };

  const handleClearCart = () => {
    setFlowState((prev) => ({
      ...prev,
      cartItems: [],
    }));

    toast({
      title: "🧹 Đã xóa toàn bộ giỏ hàng",
      description: "Tất cả sản phẩm đã được xóa khỏi giỏ hàng",
    });
  };

  // Order creation flow
  const handleCreateOrder = async (orderData: CreateOrderRequest) => {
    setFlowState((prev) => ({ ...prev, step: "processing", orderData }));

    try {
      // Step 1: Create Order
      const orderResult = await createOrder(orderData);
      if (!orderResult) {
        setFlowState((prev) => ({ ...prev, step: "order" }));
        return false;
      }

      // Get the created order ID from the API response
      const createdOrderId = orderResult.id; // Use actual order ID from response

      // Step 2: Create Order Details for each cart item
      let allDetailsCreated = true;
      for (const cartItem of flowState.cartItems) {
        const detailResult = await createOrderDetail(
          createdOrderId,
          cartItem.product.id,
          {
            quantity: cartItem.quantity,
            unitPrice: cartItem.unitPrice,
          }
        );

        if (!detailResult) {
          allDetailsCreated = false;
          break;
        }
      }

      if (allDetailsCreated) {
        setFlowState((prev) => ({
          ...prev,
          step: "completed",
          createdOrder: orderResult, // Store the full order response
        }));

        toast({
          title: "🎉 Tạo đơn hàng thành công!",
          description: `Đơn hàng với ${flowState.cartItems.length} sản phẩm đã được tạo.`,
        });

        return true;
      } else {
        throw new Error("Không thể tạo chi tiết đơn hàng");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      setFlowState((prev) => ({ ...prev, step: "order" }));

      toast({
        variant: "destructive",
        title: "❌ Lỗi tạo đơn hàng",
        description: "Không thể tạo đơn hàng. Vui lòng thử lại.",
      });

      return false;
    }
  };

  const handleNextStep = () => {
    if (flowState.step === "cart" && flowState.cartItems.length > 0) {
      setFlowState((prev) => ({ ...prev, step: "order" }));
    }
  };

  const handleBackToCart = () => {
    setFlowState((prev) => ({ ...prev, step: "cart" }));
  };

  const handleStartNewOrder = () => {
    setFlowState({
      step: "cart",
      cartItems: [],
      orderData: null,
      createdOrder: null,
    });
  };

  const isProcessing = creatingOrder || creatingOrderDetails;

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Progress Component */}
        <OrderProgress
          currentStep={flowState.step}
          cartItemsCount={flowState.cartItems.length}
        />

        {/* Step Content */}
        {flowState.step === "cart" && (
          <div className="space-y-6">
            <CreateOrderCart
              cartItems={flowState.cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onAddProduct={() => setAddToCartDialogOpen(true)}
              disabled={isProcessing}
            />

            <ContinueOrderButton
              cartItemsCount={flowState.cartItems.length}
              totalAmount={getTotalAmount()}
              onContinue={handleNextStep}
              disabled={isProcessing}
            />
          </div>
        )}

        {flowState.step === "order" && (
          <div className="space-y-6">
            <CreateOrderForm
              cartItems={flowState.cartItems}
              onCreateOrder={handleCreateOrder}
              onBackToCart={handleBackToCart}
              loading={isProcessing}
              disabled={isProcessing}
            />
          </div>
        )}

        {flowState.step === "processing" && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Đang Xử Lý Đơn Hàng...
              </h3>
              <p className="text-gray-600 mb-6">
                Vui lòng đợi trong khi chúng tôi tạo đơn hàng và chi tiết sản
                phẩm
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={75} className="h-2 mb-2" />
                <p className="text-sm text-gray-500">
                  Đang tạo chi tiết cho {flowState.cartItems.length} sản phẩm...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {flowState.step === "completed" && (
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Tạo Đơn Hàng Thành Công!
              </h3>
              <p className="text-gray-600 mb-6">
                Đơn hàng với {flowState.cartItems.length} sản phẩm đã được tạo
                thành công.
                <br />
                Tổng giá trị: {getTotalAmount().toLocaleString("vi-VN")} VND
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleStartNewOrder}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Tạo Đơn Hàng Mới
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add to Cart Dialog */}
        <AddToCartDialog
          isOpen={addToCartDialogOpen}
          onOpenChange={setAddToCartDialogOpen}
          onAddToCart={handleAddToCart}
          cartItems={flowState.cartItems}
          loading={isProcessing}
        />
      </div>
    </AdminLayout>
  );
}

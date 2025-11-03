"use client";

import { useState } from "react";
import {
  Plus,
  Package,
  ShoppingCart,
  Save,
  CheckCircle2,
  ArrowRight,
  User,
  Calendar,
  TrendingUp,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { OrderDialog } from "@/components/orders/order-dialog";
import { OrderDetailDialog } from "@/components/orders/order-detail-dialog";
import { OrderDetailTable } from "@/components/orders/order-detail-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/use-orders";
import { useOrderDetails } from "@/hooks/use-order-details";
import { useProducts } from "@/hooks/use-products";
import { CreateOrderRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function CreateOrderPage() {
  const { creating, createOrder } = useOrders();

  const {
    orderDetails,
    loading: orderDetailsLoading,
    creating: creatingOrderDetail,
    deleting: deletingOrderDetails,
    createOrderDetail,
    deleteOrderDetails,
    loadOrderDetails,
  } = useOrderDetails();

  const { products } = useProducts();

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetailDialogOpen, setOrderDetailDialogOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState<CreateOrderRequest | null>(null);

  const progress = orderCreated ? (orderDetails.length > 0 ? 100 : 50) : 0;
  const currentStep = orderCreated ? (orderDetails.length > 0 ? 3 : 2) : 1;

  const handleCreateOrder = () => {
    setOrderDialogOpen(true);
  };

  const handleSubmitOrder = async (data: CreateOrderRequest) => {
    const success = await createOrder(data);
    if (success) {
      setOrderData(data);
      setCurrentOrderId("temp-order-id");
      setOrderCreated(true);
      toast({
        title: "🎉 Tạo đơn hàng thành công!",
        description: "Bây giờ bạn có thể thêm sản phẩm vào đơn hàng.",
      });
    }
    return success;
  };

  const handleAddProduct = () => {
    if (currentOrderId) {
      setOrderDetailDialogOpen(true);
    }
  };

  const handleSubmitOrderDetail = async (
    orderId: string,
    productId: string,
    data: any
  ) => {
    const success = await createOrderDetail(orderId, productId, data);
    if (success && currentOrderId) {
      // Reload order details after adding
      await loadOrderDetails(currentOrderId);
    }
    return success;
  };

  const handleDeleteOrderDetails = async (orderId: string) => {
    const success = await deleteOrderDetails(orderId);
    if (success && currentOrderId) {
      // Reload order details after deleting
      await loadOrderDetails(currentOrderId);
    }
    return success;
  };

  const handleFinishOrder = () => {
    toast({
      title: "🎊 Hoàn thành đơn hàng!",
      description: "Đơn hàng đã được tạo thành công và sẵn sàng xử lý.",
    });
    setCurrentOrderId(null);
    setOrderCreated(false);
    setOrderData(null);
    window.location.href = "/orders";
  };

  const steps = [
    {
      id: 1,
      title: "Thông tin đơn hàng",
      description: "Nhập thông tin khách hàng",
      icon: User,
      completed: orderCreated,
      active: currentStep === 1,
    },
    {
      id: 2,
      title: "Thêm sản phẩm",
      description: "Chọn sản phẩm cho đơn hàng",
      icon: ShoppingCart,
      completed: orderDetails.length > 0,
      active: currentStep === 2,
    },
    {
      id: 3,
      title: "Hoàn thành",
      description: "Xác nhận và lưu đơn hàng",
      icon: CheckCircle2,
      completed: false,
      active: currentStep === 3,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tạo Đơn Hàng Mới
              </h1>
              <p className="text-muted-foreground">
                Theo dõi quy trình tạo đơn hàng từng bước một cách dễ dàng
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date().toLocaleDateString("vi-VN")}
          </Badge>
        </div>

        {/* Progress Section */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tiến độ tạo đơn hàng</CardTitle>
              <Badge variant="secondary">
                {Math.round(progress)}% hoàn thành
              </Badge>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                      relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                      ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white shadow-lg"
                          : step.active
                          ? "bg-blue-500 border-blue-500 text-white shadow-lg animate-pulse"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }
                    `}
                    >
                      <step.icon className="w-6 h-6" />
                      {step.completed && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-medium ${
                          step.active
                            ? "text-blue-600"
                            : step.completed
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className={`mx-4 w-5 h-5 ${
                        step.completed ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Create Order */}
          <Card
            className={`relative overflow-hidden transition-all duration-300 ${
              orderCreated
                ? "border-green-200 bg-green-50 dark:bg-green-950 shadow-lg"
                : "border-blue-200 bg-blue-50 dark:bg-blue-950 hover:shadow-lg"
            }`}
          >
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                {orderCreated ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Hoàn thành
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 border-blue-200"
                  >
                    Bước 1
                  </Badge>
                )}
              </div>
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    orderCreated ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  <User className="h-5 w-5 text-white" />
                </div>
                <span>Thông tin đơn hàng</span>
              </CardTitle>
              <CardDescription className="text-base">
                {orderCreated
                  ? `Đã tạo đơn hàng cho khách hàng: ${orderData?.customerName}`
                  : "Nhập thông tin khách hàng và tạo đơn hàng cơ bản"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderCreated && orderData && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Khách hàng:
                      </span>
                      <p className="font-semibold">{orderData.customerName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Số điện thoại:
                      </span>
                      <p className="font-semibold">{orderData.phoneNumber}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Địa chỉ:
                    </span>
                    <p className="text-sm mt-1">{orderData.address}</p>
                  </div>
                </div>
              )}
              <Button
                onClick={handleCreateOrder}
                className={`w-full h-12 text-base font-medium transition-all duration-300 ${
                  orderCreated
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={creating}
              >
                {orderCreated ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Đã tạo đơn hàng
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    {creating ? "Đang tạo..." : "Tạo đơn hàng"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Add Products */}
          <Card
            className={`relative overflow-hidden transition-all duration-300 ${
              orderDetails.length > 0
                ? "border-green-200 bg-green-50 dark:bg-green-950 shadow-lg"
                : orderCreated
                ? "border-orange-200 bg-orange-50 dark:bg-orange-950 hover:shadow-lg"
                : "border-gray-200 bg-gray-50 dark:bg-gray-900"
            }`}
          >
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                {orderDetails.length > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {orderDetails.length} sản phẩm
                  </Badge>
                ) : orderCreated ? (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 border-orange-200"
                  >
                    Bước 2
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-500 border-gray-200"
                  >
                    Chờ
                  </Badge>
                )}
              </div>
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    orderDetails.length > 0
                      ? "bg-green-500"
                      : orderCreated
                      ? "bg-orange-500"
                      : "bg-gray-400"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <span>Thêm sản phẩm</span>
              </CardTitle>
              <CardDescription className="text-base">
                {orderDetails.length > 0
                  ? `Đã thêm ${orderDetails.length} sản phẩm vào đơn hàng`
                  : orderCreated
                  ? "Thêm sản phẩm vào đơn hàng đã tạo"
                  : "Cần tạo đơn hàng trước khi thêm sản phẩm"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleAddProduct}
                className={`w-full h-12 text-base font-medium transition-all duration-300 ${
                  orderDetails.length > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : orderCreated
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-gray-400"
                }`}
                disabled={!orderCreated || creatingOrderDetail}
              >
                {orderDetails.length > 0 ? (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Thêm sản phẩm khác
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {creatingOrderDetail ? "Đang thêm..." : "Thêm sản phẩm"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        {orderCreated && currentOrderId && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Chi Tiết Đơn Hàng
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-1">
                    {orderDetails.length === 0
                      ? "Chưa có sản phẩm nào trong đơn hàng"
                      : `${orderDetails.length} sản phẩm • Tổng: ${orderDetails
                          .reduce(
                            (sum, item) => sum + item.quantity * item.unitPrice,
                            0
                          )
                          .toLocaleString("vi-VN")} VND`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleAddProduct}
                    disabled={creatingOrderDetail}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleFinishOrder}
                    disabled={orderDetails.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Hoàn thành đơn hàng
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {orderDetails.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <ShoppingCart className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Đơn hàng trống
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Hãy thêm sản phẩm vào đơn hàng để tiếp tục
                  </p>
                  <Button
                    onClick={handleAddProduct}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm đầu tiên
                  </Button>
                </div>
              ) : (
                <OrderDetailTable
                  orderDetails={orderDetails}
                  loading={orderDetailsLoading}
                  onDeleteAll={handleDeleteOrderDetails}
                  orderId={currentOrderId}
                  deleting={deletingOrderDetails}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {orderCreated && orderDetails.length > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Tổng Kết Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Items */}
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {orderDetails.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Số lượng sản phẩm
                  </div>
                </div>

                {/* Total Quantity */}
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {orderDetails.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Tổng số lượng
                  </div>
                </div>

                {/* Total Amount */}
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {orderDetails
                      .reduce(
                        (sum, item) => sum + item.quantity * item.unitPrice,
                        0
                      )
                      .toLocaleString("vi-VN")}{" "}
                    VND
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Tổng giá trị
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-center">
                <Button
                  onClick={handleFinishOrder}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Hoàn Thành Đơn Hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Order Dialog */}
        <OrderDialog
          isOpen={orderDialogOpen}
          onOpenChange={setOrderDialogOpen}
          onSubmit={handleSubmitOrder}
          onUpdate={() => Promise.resolve(false)} // Không cần update trong trang tạo
          loading={creating}
        />

        {/* Add Product Dialog */}
        {currentOrderId && (
          <OrderDetailDialog
            isOpen={orderDetailDialogOpen}
            onOpenChange={setOrderDetailDialogOpen}
            orderId={currentOrderId}
            products={products}
            onSubmit={handleSubmitOrderDetail}
            loading={creatingOrderDetail}
          />
        )}
      </div>
    </AdminLayout>
  );
}

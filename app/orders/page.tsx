"use client";

import { useState } from "react";
import { Package, ShoppingCart } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { OrderTabs } from "@/components/orders/order-tabs";
import { OrderOverview } from "@/components/orders/order-overview";
import { OrderDialog } from "@/components/orders/order-dialog";
import { OrderDetailTable } from "@/components/orders/order-detail-table";
import { OrderDetailEditor } from "@/components/orders/order-detail-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrders } from "@/hooks/use-orders";
import { useOrderDetails } from "@/hooks/use-order-details";
import { OrderResponse, UpdateOrderRequest } from "@/types";
import { toast } from "sonner";

const getStatusText = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "Chờ xử lý";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPED":
      return "Đã gửi hàng";
    case "DELIVERED":
      return "Đã giao hàng";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

export default function OrdersPage() {
  const {
    orders,
    loading,
    updating,
    deleting,
    updateOrder,
    deleteOrder,
    loadAllOrders,
  } = useOrders();

  const {
    orderDetails,
    loading: orderDetailsLoading,
    deleting: deletingOrderDetails,
    deleteOrderDetails,
    loadOrderDetails,
  } = useOrderDetails();

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [orderDetailEditorOpen, setOrderDetailEditorOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderResponse | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleEditOrder = (order: OrderResponse) => {
    setEditingOrder(order);
    setOrderDialogOpen(true);
  };

  const handleViewOrderDetails = async (order: OrderResponse) => {
    setSelectedOrder(order);
    await loadOrderDetails(order.id);
    setOrderDetailsModalOpen(true);
  };

  const handleEditOrderDetails = async (order: OrderResponse) => {
    setSelectedOrder(order);
    await loadOrderDetails(order.id);
    setOrderDetailEditorOpen(true);
  };

  const handleConfirmOrder = async (order: OrderResponse) => {
    setConfirming(order.id);
    try {
      // Simply update order status to CONFIRMED
      const success = await updateOrder(order.id, { status: "CONFIRMED" });
      if (success) {
        toast.success("Xác nhận đơn hàng thành công");
        return true;
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xác nhận đơn hàng");
    } finally {
      setConfirming(null);
    }
    return false;
  };

  const handleOrderUpdated = async () => {
    if (selectedOrder) {
      await loadOrderDetails(selectedOrder.id);
      // Refresh orders list without reloading the page
      await loadAllOrders();
    }
  };

  const handleUpdateOrder = async (
    orderId: string,
    data: UpdateOrderRequest
  ) => {
    return await updateOrder(orderId, data);
  };

  const handleDeleteOrder = async (orderId: string) => {
    return await deleteOrder(orderId);
  };

  const handleDeleteOrderDetails = async (orderId: string) => {
    const success = await deleteOrderDetails(orderId);
    if (success && selectedOrder) {
      // Reload order details after deleting
      await loadOrderDetails(selectedOrder.id);
    }
    return success;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quản Lý Đơn Hàng</h1>
            <p className="text-muted-foreground">
              Xem và quản lý tất cả đơn hàng từ khách hàng
            </p>
          </div>
        </div>

        {/* Order Overview Cards */}
        <OrderOverview orders={orders} />

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Danh Sách Đơn Hàng</CardTitle>
              <CardDescription>
                Quản lý đơn hàng theo trạng thái
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <OrderTabs
              orders={orders}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onViewDetails={handleViewOrderDetails}
              onEditDetails={handleEditOrderDetails}
              onConfirmOrder={handleConfirmOrder}
              loading={loading}
              deleting={deleting}
              confirming={confirming}
            />
          </CardContent>
        </Card>

        {/* Edit Order Dialog */}
        <OrderDialog
          isOpen={orderDialogOpen}
          onOpenChange={setOrderDialogOpen}
          order={editingOrder}
          onUpdate={handleUpdateOrder}
          loading={updating}
        />

        {/* Order Detail Editor */}
        {selectedOrder && (
          <OrderDetailEditor
            key={`order-detail-editor-${selectedOrder.id}`}
            isOpen={orderDetailEditorOpen}
            onOpenChange={setOrderDetailEditorOpen}
            order={selectedOrder}
            orderDetails={orderDetails}
            onOrderUpdated={handleOrderUpdated}
          />
        )}

        {/* Order Details Modal */}
        <Dialog
          open={orderDetailsModalOpen}
          onOpenChange={setOrderDetailsModalOpen}
        >
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Chi Tiết Đơn Hàng
              </DialogTitle>
              <DialogDescription>
                {selectedOrder &&
                  `Đơn hàng ${selectedOrder.id} - ${selectedOrder.customerName}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {selectedOrder && (
                <div className="grid grid-cols-2 gap-6 p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin đơn hàng</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Mã:</span>{" "}
                        {selectedOrder.id}
                      </p>
                      <p>
                        <span className="font-medium">Ngày:</span>{" "}
                        {new Date(selectedOrder.orderDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {getStatusText(selectedOrder.status)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tên:</span>{" "}
                        {selectedOrder.customerName}
                      </p>
                      <p>
                        <span className="font-medium">SĐT:</span>{" "}
                        {selectedOrder.phoneNumber}
                      </p>
                      <p>
                        <span className="font-medium">Địa chỉ:</span>{" "}
                        {selectedOrder.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <h4 className="font-medium">Sản phẩm trong đơn hàng</h4>
              </div>

              <OrderDetailTable
                orderDetails={orderDetails}
                loading={orderDetailsLoading}
                onDeleteAll={handleDeleteOrderDetails}
                orderId={selectedOrder?.id}
                deleting={deletingOrderDetails}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

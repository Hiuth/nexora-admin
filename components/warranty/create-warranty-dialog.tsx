"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderDetailList } from "./order-detail-list";
import { ProductUnitList } from "./product-unit-list";
import {
  OrderDetailResponse,
  ProductUnitResponse,
  WarrantyRecordResponse,
} from "@/types";

interface CreateWarrantyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails: OrderDetailResponse[];
  existingWarranties: WarrantyRecordResponse[];
  onCreateWarranty: (productId: string, productUnitId: string) => Promise<void>;
  onCreateWarrantyForNonSerial: (productId: string) => Promise<void>;
  creating: boolean;
}

export function CreateWarrantyDialog({
  open,
  onOpenChange,
  orderDetails,
  existingWarranties,
  onCreateWarranty,
  onCreateWarrantyForNonSerial,
  creating,
}: CreateWarrantyDialogProps) {
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<OrderDetailResponse | null>(null);
  const [selectedProductUnit, setSelectedProductUnit] =
    useState<ProductUnitResponse | null>(null);

  // Get productIds that already have warranties
  const existingWarrantyProductIds = existingWarranties.map((w) => w.productId);

  const handleCreateWarrantyForNonSerial = async () => {
    if (!selectedOrderDetail) return;

    try {
      await onCreateWarrantyForNonSerial(selectedOrderDetail.productId);
      // Reset selections after successful creation
      setSelectedOrderDetail(null);
      setSelectedProductUnit(null);
    } catch (error) {
      // Error is handled in parent component
    }
  };

  const handleCreateWarranty = async () => {
    if (!selectedOrderDetail || !selectedProductUnit) return;

    try {
      await onCreateWarranty(
        selectedOrderDetail.productId,
        selectedProductUnit.id
      );
      // Reset selections after successful creation
      setSelectedOrderDetail(null);
      setSelectedProductUnit(null);
    } catch (error) {
      // Error is handled in parent component
    }
  };

  const handleOrderDetailSelect = (orderDetail: OrderDetailResponse) => {
    setSelectedOrderDetail(orderDetail);
    setSelectedProductUnit(null); // Reset product unit selection when order detail changes
  };

  const handleClose = () => {
    setSelectedOrderDetail(null);
    setSelectedProductUnit(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">Tạo bảo hành mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[60vh]">
          {/* Left Side - Order Details */}
          <div className="flex flex-col border-r md:border-r border-b md:border-b-0 pb-4 md:pb-0 pr-0 md:pr-4">
            <div className="overflow-y-auto max-h-[60vh]">
              <OrderDetailList
                orderDetails={orderDetails}
                existingWarranties={existingWarrantyProductIds}
                selectedOrderDetail={selectedOrderDetail}
                onSelectOrderDetail={handleOrderDetailSelect}
              />
            </div>
          </div>

          {/* Right Side - Product Units */}
          <div className="flex flex-col pl-0 md:pl-4">
            <div className="overflow-y-auto max-h-[60vh]">
              <ProductUnitList
                selectedOrderDetail={selectedOrderDetail}
                selectedProductUnit={selectedProductUnit}
                onSelectProductUnit={setSelectedProductUnit}
                onCreateWarranty={handleCreateWarranty}
                onCreateWarrantyForNonSerial={handleCreateWarrantyForNonSerial}
                creating={creating}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={creating}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

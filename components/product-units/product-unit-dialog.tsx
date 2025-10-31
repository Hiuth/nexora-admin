"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductUnitResponse } from "@/types";
import { productUnitService } from "@/lib/api";

const formSchema = z.object({
  serialNumber: z.string().optional(),
  imei: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

interface ProductUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productUnit?: ProductUnitResponse | null;
  stockQuantity?: number;
  currentUnitsCount?: number;
  onSuccess: () => void;
}

const statusOptions = [
  { value: "available", label: "Có Sẵn" },
  { value: "sold", label: "Đã Bán" },
  { value: "reserved", label: "Đã Đặt" },
  { value: "damaged", label: "Hỏng" },
];

export function ProductUnitDialog({
  open,
  onOpenChange,
  productId,
  productUnit,
  stockQuantity = 0,
  currentUnitsCount = 0,
  onSuccess,
}: ProductUnitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!productUnit;
  const canCreate = !isEditing && currentUnitsCount < stockQuantity;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: productUnit?.serialNumber || "",
      imei: productUnit?.imei || "",
      status: productUnit?.status || "available",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isEditing && !canCreate) {
      toast({
        variant: "destructive",
        title: "Không Thể Tạo Đơn Vị",
        description: `Không thể tạo thêm đơn vị. Hiện tại: ${currentUnitsCount}, Giới hạn: ${stockQuantity}`,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        // Chỉ gửi các field đã thay đổi
        const updateData: any = {};

        if (values.serialNumber !== productUnit?.serialNumber) {
          updateData.serialNumber = values.serialNumber || undefined;
        }

        if (values.imei !== productUnit?.imei) {
          updateData.imei = values.imei || undefined;
        }

        if (values.status !== productUnit?.status) {
          updateData.status = values.status;
        }

        // Chỉ cập nhật nếu có thay đổi
        if (Object.keys(updateData).length > 0) {
          await productUnitService.update(productUnit.id, updateData);
          toast({
            title: "Thành Công",
            description: "Đã cập nhật đơn vị sản phẩm",
          });
          onSuccess();
        } else {
          toast({
            title: "Thông Báo",
            description: "Không có thay đổi nào để cập nhật",
          });
          onOpenChange(false); // Đóng dialog nếu không có thay đổi
        }
      } else {
        await productUnitService.create(productId, {
          serialNumber: values.serialNumber || undefined,
          imei: values.imei || undefined,
          status: values.status,
        });
        toast({
          title: "Thành Công",
          description: "Đã tạo đơn vị sản phẩm mới",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa Đơn Vị Sản Phẩm" : "Tạo Đơn Vị Sản Phẩm"}
          </DialogTitle>
          {!isEditing && (
            <p className="text-sm text-muted-foreground">
              Đơn vị hiện tại: {currentUnitsCount}/{stockQuantity}
              {!canCreate && (
                <span className="text-red-500 ml-2">
                  ⚠️ Đã đạt giới hạn tồn kho
                </span>
              )}
            </p>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số Serial</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số serial (tùy chọn)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMEI</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số IMEI (tùy chọn)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng Thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading || (!isEditing && !canCreate)}
              >
                {isLoading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

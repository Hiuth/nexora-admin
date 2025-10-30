"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"send-otp" | "verify-otp">("send-otp");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.sendOtpForgotPassword();
      if (response.Code === 1000) {
        toast.success("OTP đã được gửi đến email của bạn");
        setStep("verify-otp");
      } else {
        setError(response.Message || "Có lỗi xảy ra khi gửi OTP");
      }
    } catch (error: any) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate inputs
      if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
        setError("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }

      if (formData.newPassword.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      const response = await authAPI.resetPassword(
        formData.otp,
        formData.newPassword
      );

      if (response.Code === 1000) {
        toast.success("Đổi mật khẩu thành công!");
        router.push("/login");
      } else {
        setError(response.Message || "Có lỗi xảy ra khi đổi mật khẩu");
      }
    } catch (error: any) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              {step === "send-otp" ? (
                <Mail className="w-6 h-6 text-primary-foreground" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "send-otp" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </CardTitle>
          <CardDescription>
            {step === "send-otp"
              ? "Chúng tôi sẽ gửi mã OTP đến email của bạn"
              : "Nhập mã OTP và mật khẩu mới"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "send-otp" ? (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Nhấn nút bên dưới để gửi mã OTP đến email đã đăng ký
                </p>
                <Button
                  onClick={handleSendOtp}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Gửi mã OTP
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Nhập mã OTP từ email"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đặt lại...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

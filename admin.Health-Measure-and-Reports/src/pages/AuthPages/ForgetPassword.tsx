import PageMeta from "../../components/common/PageMeta";
import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useChangePasswordWithTokenMutation,
} from "../../redux/features/auth/forgetPasswordApi";
import { toast } from "react-toastify";
import OtpInput from "../../components/ui/OtpInput";

interface ForgetPasswordFormValues {
  email: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ForgetPassword = () => {
  const [form] = Form.useForm<ForgetPasswordFormValues>();
  const navigate = useNavigate();
  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [changePasswordWithToken, { isLoading: isChangingPassword }] =
    useChangePasswordWithTokenMutation();

  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (emailValue: string) => {
    try {
      const res = await forgotPassword({ email: emailValue }).unwrap();

      if (res?.success) {
        setEmail(emailValue);
        setCurrentStep(1);
        setTimeRemaining(60); // 60 seconds
        toast.success(res?.message || "OTP has been sent to your email");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message ||
          error?.data?.errors ||
          "Failed to send OTP. Please try again."
      );
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (otpValue: string) => {
    try {
      const res = await verifyOtp({ email, otp: otpValue }).unwrap();

      if (res?.success && res?.data?.resetToken) {
        setResetToken(res.data.resetToken);
        setTimeRemaining(res.data.expiresIn || 60); // 60 seconds from response
        setCurrentStep(2);
        toast.success(res?.message || "OTP verified successfully");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.errors ||
        "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Step 3: Change Password
  const handleChangePassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (timeRemaining === 0) {
      toast.error("Reset token has expired. Please start again.");
      return;
    }

    try {
      const res = await changePasswordWithToken({
        resetToken,
        newPassword: values.newPassword,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Password changed successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.errors ||
        "Failed to change password. Please try again.";
      toast.error(errorMessage);

      // If token expired, reset to step 1
      if (errorMessage.includes("expired")) {
        setCurrentStep(0);
        setResetToken("");
        setTimeRemaining(0);
        form.resetFields();
      }
    }
  };

  const handleChangeEmail = () => {
    setCurrentStep(0);
    setEmail("");
    setResetToken("");
    setTimeRemaining(0);
    form.resetFields();
  };

  const handleResendOtp = async () => {
    if (email) {
      await handleSendOtp(email);
    }
  };

  const onFinish = async (values: ForgetPasswordFormValues) => {
    if (currentStep === 0) {
      // Step 1: Send OTP
      await handleSendOtp(values.email);
    } else if (currentStep === 1) {
      // Step 2: Verify OTP (handled by OTP input onComplete)
      if (values.otp && values.otp.length === 6) {
        await handleVerifyOtp(values.otp);
      }
    } else if (currentStep === 2) {
      // Step 3: Change Password
      await handleChangePassword({
        newPassword: values.newPassword || "",
        confirmPassword: values.confirmPassword || "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <PageMeta
        title="Forgot Password | Airduino Health Monitor"
        description="Reset your password using OTP"
      />
      <div className="w-full max-w-md">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep === 0 && "Enter your email address to receive an OTP"}
            {currentStep === 1 && "Enter the OTP code sent to your email"}
            {currentStep === 2 && "Set your new password"}
          </p>
        </div>

        <Form
          form={form}
          name="forgetPassword"
          requiredMark={false}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="space-y-6"
        >
            {/* Step 1: Email */}
            {currentStep === 0 && (
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Email address
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email"
                  disabled={currentStep > 0 && timeRemaining > 0}
                  suffix={
                    currentStep > 0 && timeRemaining > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">
                          {formatTime(timeRemaining)}
                        </span>
                        <Button
                          type="link"
                          onClick={handleChangeEmail}
                          className="!px-0 text-xs !text-primary hover:!opacity-80 h-auto py-0"
                        >
                          Change
                        </Button>
                      </div>
                    ) : null
                  }
                />
              </Form.Item>
            )}

            {/* Step 2: OTP */}
            {currentStep === 1 && (
              <>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      OTP Code
                    </span>
                  }
                  name="otp"
                  rules={[
                    { required: true, message: "Please enter the OTP!" },
                    {
                      len: 6,
                      message: "OTP must be 6 digits!",
                    },
                  ]}
                >
                  <OtpInput
                    length={6}
                    onChange={(value) => {
                      form.setFieldsValue({ otp: value });
                      if (value.length === 6) {
                        handleVerifyOtp(value);
                      }
                    }}
                  />
                </Form.Item>

                {timeRemaining === 0 && (
                  <div className="flex justify-end -mt-4">
                    <Button
                      type="link"
                      onClick={handleResendOtp}
                      loading={isSendingOtp}
                      className="!px-0 text-sm h-auto py-0"
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Step 3: New Password */}
            {currentStep === 2 && (
              <>
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      New Password
                    </span>
                  }
                  name="newPassword"
                  rules={[
                    { required: true, message: "Please input your new password!" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Enter your new password"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </span>
                  }
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm your new password"
                  />
                </Form.Item>
              </>
            )}

            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={
                  isSendingOtp || isVerifyingOtp || isChangingPassword
                }
                className="w-fit !px-5"
              >
                {currentStep === 0
                  ? "Send OTP"
                  : currentStep === 1
                  ? "Verify OTP"
                  : "Reset Password"}
              </Button>
              <Button
                type="link"
                onClick={() => navigate("/login")}
                className="!px-0 text-sm text-gray-600 hover:text-gray-900 w-fit"
              >
                ← Back to Login
              </Button>
            </div>
          </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;

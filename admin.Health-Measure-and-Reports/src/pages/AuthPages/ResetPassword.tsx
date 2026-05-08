import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../components/ui/PageHeader";
import { Button, Card, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Save } from "lucide-react";
import { useChangePasswordMutation } from "../../redux/features/auth/changePasswordApi";
import { toast } from "react-toastify";

interface ResetPasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onFinish = async (values: ResetPasswordFormValues) => {
    try {
      const payload = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      const res = await changePassword(payload).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Password changed successfully!");
        form.resetFields();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message ||
          error?.data?.errors ||
          "Failed to change password. Please try again."
      );
    }
  };

  return (
    <div>
      <PageMeta
        title="Change Password | Airduino Health Monitor"
        description="Change your account password"
      />
      <PageHeader
        title="Change Password"
        subtitle="Change your account password by providing your old password and setting a new one"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Change Password" },
        ]}
      />

      <div className="max-w-2xl">
        <Card>
          <Form
            form={form}
            name="changePassword"
            requiredMark={false}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-6"
          >
            <Form.Item
              label={
                <span className="text-sm font-medium text-gray-700">
                  Old Password
                </span>
              }
              name="oldPassword"
              rules={[
                { required: true, message: "Please input your old password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your old password"
              />
            </Form.Item>

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

            <div className="flex justify-end pt-4">
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save className="w-4 h-4" />}
                size="large"
                loading={isLoading}
              >
                Update Password
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;


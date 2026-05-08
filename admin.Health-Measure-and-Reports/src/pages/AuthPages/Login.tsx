import PageMeta from "../../components/common/PageMeta";

import { Button, Checkbox, Form, Input, Typography } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setUser } from "../../redux/features/auth/authSlice";
import { useAppDispatch } from "../../redux/features/hooks";

const { Link } = Typography;

// Define form input shape
interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  console.log("🔧 Login component loaded/rendered");
  
  const [form] = Form.useForm<LoginFormValues>();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("🔧 Login hook initialized - isLoading:", isLoading);
  
  // Debug config values
  const config = {
    api_url: import.meta.env.VITE_PUBLIC_API_URL,
    server_url: import.meta.env.VITE_PUBLIC_SERVER_URL,
  };
  console.log("🔧 Environment config:", config);

  const from = "/dashboard"; // Navigate to the main dashboard

  const onFinish = async (values: LoginFormValues) => {
    console.log("🚀 Login form submitted with:", values);
    
    try {
      console.log("📡 Calling login API...");
      const res = await login(values).unwrap();
      console.log("✅ Login API response:", res);

      if (res?.success) {
        console.log("🎉 Login successful, setting token and user...");
        console.log("🔑 Token to store:", res?.data?.token?.substring(0, 50) + "...");
        console.log("👤 User data:", res?.data?.user);
        
        localStorage.setItem("token", res?.data?.token);
        console.log("💾 Token stored in localStorage");
        
        dispatch(setUser({ user: res?.data?.user, token: res?.data?.token }));
        console.log("🔄 User data dispatched to Redux store");
        
        // Check Redux state immediately after dispatch using useSelector
        // Force a re-render to check if Redux state is updated
        window.setTimeout(() => {
          console.log("🔍 Checking if navigation should proceed...");
          // Let's navigate after a longer delay to ensure Redux is updated
          navigate(from, { replace: true });
        }, 200);
        
        console.log("🧭 Navigation target:", from);
        console.log("🔄 Attempting navigation...");
        
        toast.success("Login successful!");
      } else {
        console.log("❌ Login failed - success flag is false");
        toast.error("Login failed - invalid response");
      }
    } catch (err: unknown) {
      console.error("💥 Login error:", err);
      const errorMessage = err && typeof err === 'object' && 'data' in err
        ? (err as { data?: { errors?: string; message?: string } }).data?.errors ||
          (err as { data?: { errors?: string; message?: string } }).data?.message ||
          "Something went wrong. Please try again later."
        : "Something went wrong. Please try again later.";
      
      console.error("📝 Error message:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <PageMeta
        title="Sign In | Airduino Health Monitor"
        description="Sign in to Airduino Health Monitor Dashboard"
      />
      <div className="w-full max-w-md">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <Form
          form={form}
          name="login"
          requiredMark={false}
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => console.log("🚫 Form validation failed:", errorInfo)}
          layout="vertical"
          size="large"
          className="space-y-6"
        >
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
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item
              name="remember"
              valuePropName="checked"
              className="!mb-0"
            >
              <Checkbox className="text-sm text-gray-600">Remember me</Checkbox>
            </Form.Item>
            <Link
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-fit !px-5"
            onClick={() => console.log("🖱️ Login button clicked!")}
          >
            Sign in
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;

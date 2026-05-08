import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Upload,
  message,
} from "antd";
import { LucideCamera, Save, User } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PageMeta from "../../components/common/PageMeta";
import { config } from "../../components/config";
import Loading from "../../components/shared/Loading";
import PageHeader from "../../components/ui/PageHeader";
import { setProfile } from "../../redux/features/auth/authSlice";
import { useUploadImageMutation } from "../../redux/features/media/mediaApi";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/features/user/userApi";
import formatLastLogin from "../../utils/formatLastLogin";

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const { data, isLoading: isLoadingUser } = useMyProfileQuery(undefined);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const user = data?.data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.name,
        email: user?.email,
        phone: user?.phone || "",
        company: "Smart Recruit",
        position: user?.role || "",
        bio: user?.bio || "Write something about yourself",
      });
    }
  }, [user, form]);
  if (isLoadingUser) {
    return <Loading />;
  }

  // Form submit
  const onFinish = async (values: Record<string, unknown>) => {
    try {
      const res = await updateProfile(values).unwrap();
      if (res?.success) {
        dispatch(setProfile(res.data));
        message.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      message.error("Profile update failed");
    }
  };

  // Handle file select in Upload
  const handleBeforeUpload = async (file: File) => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImage(formData).unwrap();

        if (res?.success && res?.data?.path) {
          const profileRes = await updateProfile({
            profile_photo: res.data.path,
          }).unwrap();

          if (profileRes?.success) {
            dispatch(setProfile(res.data.path));
            toast.success("Image uploaded successfully");
          }
        }

        return false;
      }
    } catch (error) {
      console.error(error);
      message.error("Image upload failed");
      return false;
    }
  };

  return (
    <div>
      <PageMeta title="User Profile" description="Manage your profile" />
      <PageHeader
        title="User Profile"
        subtitle="Manage your personal information and settings"
        breadcrumbs={[{ title: "Dashboard", path: "/" }, { title: "Profile" }]}
      />

      <Row gutter={24}>
        {/* Left Side */}
        <Col xs={24} lg={8}>
          <Card>
            <div className="text-center">
              <div className="relative w-fit mx-auto">
                <Avatar
                  size={120}
                  src={
                    user?.profile_photo
                      ? config.image_access_url + user.profile_photo
                      : undefined
                  }
                  icon={!user?.profile_photo ? <User /> : undefined}
                  className="mb-4"
                />
                <Upload
                  name="avatar"
                  listType="text"
                  showUploadList={false}
                  beforeUpload={handleBeforeUpload}
                  className="absolute bottom-5 -right-2"
                >
                  <Button
                    icon={<LucideCamera className="w-4 h-4" />}
                    type="primary"
                    size="middle"
                    loading={isUploading}
                    className="!rounded-full"
                  />
                </Upload>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Last login: {formatLastLogin(user?.last_login)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="!mt-4" title="Account Statistics">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Role</span>
                <span className="font-medium">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium px-4 py-0.5 rounded-full ${
                    user?.is_active
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Side */}
        <Col xs={24} lg={16}>
          <Card title="Personal Information">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter name" }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input disabled size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Phone Number" name="phone">
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Company" name="company">
                    <Input disabled size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Position" name="position">
                <Input disabled size="large" />
              </Form.Item>

              <Form.Item label="Bio" name="bio">
                <Input.TextArea rows={4} />
              </Form.Item>

              <div className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<Save className="w-4 h-4" />}
                  size="large"
                  loading={isUpdating}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;

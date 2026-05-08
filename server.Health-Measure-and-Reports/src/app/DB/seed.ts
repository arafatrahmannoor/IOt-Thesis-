import { UserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";

const adminUser = {
  email: "superadmin@smartrecruit.com",
  password: "password134",
  name: "Super Admin",
  role: UserRole.SUPER_ADMIN,
  profile_photo: "",
  clientInfo: {
    device: "Desktop",
    browser: "Chrome",
    ipAddress: "127.0.0.1",
    pcName: "DESKTOP",
    os: "Windows",
    userAgent: "Mozilla/5.0",
  },
};

const seedAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isAdminExist = await User.findOne({
      role: UserRole.SUPER_ADMIN,
    });

    if (!isAdminExist) {
      await User.create(adminUser);
      console.log("✅ Super Admin user created successfully.");
      console.log("📧 Email: superadmin@smartrecruit.com");
      console.log("🔑 Password: password134");
    } else {
      console.log("ℹ️  Super Admin user already exists.");
      console.log("📧 Existing Email:", isAdminExist.email);
      console.log("🔍 Use existing credentials for login");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

export default seedAdmin;

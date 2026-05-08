import { Modal } from "antd";
import { blogPosts } from "../../data";

interface BlogModalProps {
  visible: boolean;
  onClose: () => void;
  blogId: string | null;
}

const BlogModal: React.FC<BlogModalProps> = ({ visible, onClose, blogId }) => {
  if (!blogId) return null;

  const blog = blogPosts.find((b) => b._id === blogId);

  if (!blog) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      bodyStyle={{ padding: "20px" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-2xl shadow-md"
          />
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Author:</span> {blog.author}
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Published:</span>{" "}
              {new Date(blog.date).toDateString()}
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Category:</span> {blog.category}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              <span className="font-semibold">Tags:</span>{" "}
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full mr-2"
                >
                  #{tag}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">{blog.title}</h2>
          <p className="text-gray-600">{blog.description}</p>

          {/* Sections */}
          {blog.sections.map((section, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800">
                {section.title}
              </h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default BlogModal;

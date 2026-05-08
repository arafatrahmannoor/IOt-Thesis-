import { Button, Card, Col, Modal, Row, Tag } from "antd";
import { Award, BookOpen, DollarSign, Edit, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { config } from "../config";
import { ICourse } from "../../types/interfaces";

interface CourseDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: ICourse | null;
}

const CourseDetailsModal = ({ open, setOpen, data }: CourseDetailsModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b">
          <img
            src={
              data?.image ? config.image_access_url + data?.image : undefined
            }
            alt={data?.banner.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {data?.banner.title}
            </h3>
            <p className="text-sm text-gray-500">
              {data?.category} •{" "}
              {data?.instructor?.map((i: any) => i?.name).join(", ") ||
                "No Instructor"}
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <div className="flex items-center gap-2 justify-end">
          <Button key="close" onClick={() => setOpen(false)}>
            Close
          </Button>

          <Link to={`/edit-course/${data?.slug}`}>
            <Button key="edit" icon={<Edit className="w-4 h-4" />}>
              Edit Course
            </Button>
          </Link>

          <Button
            key="enroll"
            type="primary"
            icon={<Users className="w-4 h-4" />}
          >
            View Enrollments
          </Button>
        </div>,
      ]}
      width={900}
    >
      <div className="pt-4 space-y-6">
        <Row gutter={24}>
          {/* Course Information */}
          <Col xs={24} md={12}>
            <Card size="small" className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Information
              </h4>
              <div className="space-y-3">
                <p className="text-gray-700 text-sm">{data?.description}</p>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium">
                    {data?.instructor?.map((i: any) => i?.name).join(", ") ||
                      "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{data?.details.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-medium">{data?.details.schedule}</span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Pricing & Requirements */}
          <Col xs={24} md={12}>
            <Card size="small" className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pricing & Requirements
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Fee:</span>
                  <span className="font-medium text-green-600">
                    ${data?.details.course_fee.amount}{" "}
                    {data?.details.course_fee.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Requirement:</span>
                  <Tag color="orange">{data?.details.age_requirement}</Tag>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Tag color={data?.is_deleted ? "red" : "green"}>
                    {data?.is_deleted ? "Inactive" : "Active"}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Course Modules */}
        <Card size="small">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Course Modules ({data?.overview.modules.length})
          </h4>
          <div className="space-y-3">
            {data?.overview.modules.map((module: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">
                  {module.title}
                </h5>
                <p className="text-sm text-gray-600">{module.content}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Training Approach */}
        <Card size="small">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Training Approach
          </h4>
          <h5 className="font-medium text-gray-800 mb-3">
            {data?.training_approach.title}
          </h5>
          <div className="grid gap-3 md:grid-cols-2">
            {data?.training_approach.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h6 className="font-medium text-gray-900">{item.title}</h6>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Social Links */}
        {data?.details.social_links.length > 0 && (
          <Card size="small">
            <h4 className="font-medium text-gray-900 mb-3">Social Links</h4>
            <div className="flex flex-wrap gap-2">
              {data?.details.social_links.map((link: any, index: number) => (
                <Tag key={index} color="blue" className="cursor-pointer">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                  </a>
                </Tag>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default CourseDetailsModal;

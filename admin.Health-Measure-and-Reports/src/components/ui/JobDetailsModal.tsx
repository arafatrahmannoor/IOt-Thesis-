import { Button, Modal, Space, Tag } from "antd";
import { Calendar, MapPin } from "lucide-react";
import React from "react";
import { IJob } from "../../types/interfaces";
import NextImage from "../shared/NextImage";
import TextEditorContentPreview from "../shared/TextEditorContentPreview";

type JobDetailsModalProps = {
  open: boolean;
  job: any;
  onClose: () => void;
  onEdit?: (job: IJob) => void;
  width?: number;
};

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  open,
  job,
  onClose,
  onEdit,
  width = 900,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      destroyOnClose
      width={width}
      className="rounded-xl overflow-hidden"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-gray-500">
            {job ? `ID: ${job._id}` : ""}
          </div>
          <Space>
            <Button onClick={onClose}>Close</Button>
            {job && onEdit && (
              <Button type="primary" onClick={() => onEdit(job)}>
                Edit Job
              </Button>
            )}
          </Space>
        </div>
      }
    >
      {job && (
        <div className="space-y-8">
          {/* Cover Image */}
          {job.thumbnail && (
            <NextImage
              accessurl
              src={job.thumbnail}
              alt={job.location.country}
              className="object-cover h-72 w-full rounded-lg"
            />
          )}

          {/* Header Info */}
          <div className="flex items-center gap-4">
            {job.country_flag && (
              <NextImage
                accessurl
                src={job.country_flag}
                alt={job.location.country}
                className="object-cover size-14 rounded-full shadow"
              />
            )}
            <div>
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location.city}, {job.location.country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Posted {job.posted_date}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Expires {job.expiration_date}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Tag color="blue">{job.employment_type}</Tag>
            <Tag>{job.experience_required}</Tag>
            <Tag color="green" className="flex items-center gap-1">
              {job.salary.min} - {job.salary.max} / {job.salary.period}
            </Tag>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="font-medium mb-2">Short Description</h3>
                <p className="text-sm text-gray-700">{job.sort_description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Full Description</h3>
                <TextEditorContentPreview content={job.description} />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <div className="border rounded-lg p-5 shadow-sm space-y-3 bg-gray-50">
                <h3 className="font-medium mb-2">Job Summary</h3>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {job.location.city}, {job.location.country}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Posted {job.posted_date}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Expires {job.expiration_date}
                </div>
                <div className="text-sm text-gray-700">
                  Type: {job.employment_type}
                </div>
                <div className="text-sm text-gray-700">
                  Experience: {job.experience_required}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  {job.salary.currency} {job.salary.min} - {job.salary.max} /{" "}
                  {job.salary.period}
                </div>
              </div>

              {job.support?.length > 0 && (
                <div className="border rounded-lg p-5 shadow-sm bg-gray-50">
                  <h3 className="font-medium mb-2">Support</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.support.map((s: any, idx: number) => (
                      <Tag key={idx} color="green" className="text-xs">
                        {s}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default JobDetailsModal;

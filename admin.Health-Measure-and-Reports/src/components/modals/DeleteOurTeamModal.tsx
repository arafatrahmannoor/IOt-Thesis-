import { Button, Modal, message } from "antd";
import { AlertTriangle, Trash2 } from "lucide-react";
import React from "react";

interface DeleteOurTeamModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  loading?: boolean;
}

const DeleteOurTeamModal: React.FC<DeleteOurTeamModalProps> = ({
  open,
  onClose,
  onConfirm,
  memberName,
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>Delete Team Member</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={480}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          icon={<Trash2 className="w-4 h-4" />}
          onClick={handleConfirm}
          loading={loading}
        >
          {loading ? "Deleting..." : "Delete Team Member"}
        </Button>,
      ]}
    >
      <div className="py-4">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this team member?
            </h3>
            <p className="text-gray-600 mb-4">
              You are about to delete <strong>"{memberName}"</strong> from your
              team. This action will remove them from the team page and cannot
              be undone.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a soft delete. The team member
                will be marked as deleted but can be restored if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteOurTeamModal;

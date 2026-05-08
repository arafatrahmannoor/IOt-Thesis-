import { Table, TableProps } from "antd";
import { useState } from "react";
import "./AntTable.css";

interface AntTableProps extends Omit<TableProps, 'dataSource'> {
  data?: Record<string, unknown>[] | { data?: Record<string, unknown>[]; count?: number; length?: number };
  columns?: any[];
  rowKey?: string;
  currentPage?: number;
  total?: number;
  limit?: number;
  setLimit?: (limit: number) => void;
  setCurrentPage?: (page: number) => void;
  selectRow?: boolean;
  isPaginate?: boolean;
  showHeader?: boolean;
  onSelectRowsChange?: (selectedRowKeys: React.Key[], selectedRows: Record<string, unknown>[]) => void;
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: Record<string, unknown>[]) => void;
}

export default function AntTable(props: AntTableProps) {
  const {
    data,
    columns,
    rowKey,
    currentPage,
    setLimit,
    setCurrentPage,
    selectRow = false,
    isPaginate,
    showHeader,
    total,
    limit,
    loading = false,
    onSelectRowsChange,
    className = "border rounded-lg",
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Handle row selection change
  const handleRowSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: Record<string, unknown>[]
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    if (onSelectRowsChange) {
      onSelectRowsChange(selectedRowKeys, selectedRows);
    }
  };

  // rowSelection object for row selection features
  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record: Record<string, unknown>) => {
      return { 
        disabled: record.name === "Disabled User", 
        name: typeof record.name === 'string' ? record.name : '' 
      };
    },
  };

  // Get data source and total count
  const getDataSource = () => {
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data || [];
  };

  const getTotalCount = () => {
    if (Array.isArray(data)) {
      return data.length;
    }
    return (data as any)?.count || (data as any)?.length || 0;
  };

  return (
    <Table
      loading={loading}
      className={`${className}  !overflow-hidden`}
      rowKey={rowKey ? rowKey : "_id"}
      rowSelection={selectRow ? rowSelection : undefined}
      dataSource={getDataSource()}
      columns={columns}
      scroll={{ x: true }}
      pagination={
        isPaginate
          ? {
              pageSize: limit || 20,
              total: total || getTotalCount(),
              current: currentPage,
              // onChange: handlePageChange,
              onChange: (page) => {
                // handlePageChange(page);
                setCurrentPage?.(page);
              },
              showSizeChanger: false,
              pageSizeOptions: ["10", "25", "50", "100"],
              onShowSizeChange: (_current, newSize) => {
                setLimit?.(newSize);
                setCurrentPage?.(1);
              },
              showQuickJumper: true,
            }
          : false
      }
      showHeader={showHeader}
    />
  );
}

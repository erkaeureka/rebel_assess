import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

export interface Artist {
  key: React.Key;
  id: React.Key;
  name: string;
  streams: number;
  rate: number;
  createdDate: string;
}

const columns: ColumnsType<Artist> = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Rate",
    dataIndex: "rate",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.rate - b.rate,
  },
  {
    title: "Streams",
    dataIndex: "streams",
    // onFilter: (value: string, record) => record.address.indexOf(value) === 0,
  },
];

const onChange: TableProps<Artist>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  //   console.log("params", pagination, filters, sorter, extra);
};

type Props = {
  data?: Artist[];
};

const MyTable = (props: Props) => {
  return (
    <Table
      style={{ flex: 1 }}
      columns={columns}
      dataSource={props.data}
      onChange={onChange}
    />
  );
};

export default MyTable;

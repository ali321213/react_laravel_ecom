import React from "react";

// Generic column definition for any type T.
export type Column<T> = {
  // Key used for default rendering (row[key]) and React key.
  key: string;
  // Column header label.
  header: string;
  // Optional custom cell renderer.
  render?: (row: T) => React.ReactNode;
  // Optional flag to control alignment or width if you extend later.
  align?: "left" | "center" | "right";
};

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

// Simple, reusable table component you can reuse for any CRUD list.
// Usage example:
// <DataTable
//   data={products}
//   columns={[
//     { key: "id", header: "ID" },
//     { key: "name", header: "Name" },
//     { key: "price", header: "Price", render: (row) => `$${row.price}` },
//   ]}
// />
export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;


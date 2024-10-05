import React from "react";
import { useTable, Column } from "react-table";

// Define your ClothingProduct type
interface ClothingProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  isAvailable: boolean;
}

// Sample product data
const products: ClothingProduct[] = [
  { id: 1, name: "T-Shirt", brand: "Brand A", price: 25.99, isAvailable: true },
  { id: 2, name: "Jeans", brand: "Brand B", price: 49.99, isAvailable: true },
  {
    id: 3,
    name: "Sneakers",
    brand: "Brand C",
    price: 89.99,
    isAvailable: false,
  },
  { id: 4, name: "Jacket", brand: "Brand D", price: 99.99, isAvailable: true },
  { id: 5, name: "Hat", brand: "Brand E", price: 19.99, isAvailable: true },
  {
    id: 6,
    name: "Sweater",
    brand: "Brand F",
    price: 34.99,
    isAvailable: false,
  },
  { id: 7, name: "Shorts", brand: "Brand G", price: 29.99, isAvailable: true },
  { id: 8, name: "Scarf", brand: "Brand H", price: 14.99, isAvailable: true },
  { id: 9, name: "Belt", brand: "Brand I", price: 18.99, isAvailable: false },
  { id: 10, name: "Gloves", brand: "Brand J", price: 12.99, isAvailable: true },
  { id: 11, name: "Socks", brand: "Brand K", price: 5.99, isAvailable: true },
  {
    id: 12,
    name: "Tank Top",
    brand: "Brand L",
    price: 21.99,
    isAvailable: true,
  },
  { id: 13, name: "Blazer", brand: "Brand M", price: 89.99, isAvailable: true },
  { id: 14, name: "Dress", brand: "Brand N", price: 59.99, isAvailable: true },
  { id: 15, name: "Skirt", brand: "Brand O", price: 39.99, isAvailable: true },
  { id: 16, name: "Boots", brand: "Brand P", price: 99.99, isAvailable: false },
  {
    id: 17,
    name: "Flip Flops",
    brand: "Brand Q",
    price: 24.99,
    isAvailable: true,
  },
  {
    id: 18,
    name: "Pajamas",
    brand: "Brand R",
    price: 34.99,
    isAvailable: true,
  },
  {
    id: 19,
    name: "Overalls",
    brand: "Brand S",
    price: 54.99,
    isAvailable: true,
  },
  {
    id: 20,
    name: "Cardigan",
    brand: "Brand T",
    price: 49.99,
    isAvailable: true,
  },
];

// Define columns
const columns: Column<ClothingProduct>[] = [
  {
    Header: "Product Name",
    accessor: "name",
  },
  {
    Header: "Brand",
    accessor: "brand",
  },
  {
    Header: "Price",
    accessor: "price",
    Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`,
  },
  {
    Header: "Available",
    accessor: "isAvailable",
    Cell: ({ value }: { value: boolean }) => (value ? "Yes" : "No"),
  },
];

const AdminProducts: React.FC = () => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: products,
    });

  return (
    <div className="container">
      <div className="mb-12 md:mb-5">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
          Products
        </h2>
      </div>
      <table
        {...getTableProps()}
        className="min-w-full bg-white rounded-lg overflow-hidden shadow-md"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="bg-gray-200 text-gray-700"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="p-4 text-left border-b"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="text-gray-600">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-50">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="p-4 border-b">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;

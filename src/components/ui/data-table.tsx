
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

interface DataTableProps<T> {
  columns: {
    accessorKey: string;
    header: string;
    cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
  }[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  searchColumn?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Search...",
  searchColumn,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    if (!searchColumn || !searchQuery) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item: any) => {
      const value = item[searchColumn];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }

      // Handle objects like { en: string, sr: string }
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return false;
    });

    setFilteredData(filtered);
  }, [searchQuery, data, searchColumn]);

  return (
    <div className="space-y-4">
      {searchColumn && (
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : (row as any)[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

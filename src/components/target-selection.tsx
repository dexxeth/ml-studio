"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const TargetSelection = () => {
    const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const fileName = searchParams.get("file");

    useEffect(() => {
        const fetchFileData = async () => {
            if (!fileName) return;

            // 🔹 Fetch file from Supabase database
            const { data, error } = await supabase
                .from("files")
                .select("*")
                .eq("file_name", fileName)
                .single();

            if (error) {
                console.error("Fetch error:", error.message);
                return;
            }

            // 🔹 Fetch actual CSV file
            const response = await fetch(
                `https://your-supabase-url.supabase.co/storage/v1/object/public/uploads/${data.file_url}`
            );
            const text = await response.text();
            const rows = text.split("\n").map((row) => row.split(",")); // Simple CSV parsing

            if (rows.length > 0) {
                // Create columns from CSV headers
                const headers = rows[0].map((header, index) => ({
                    accessorKey: `col${index}`,
                    header: header.trim(),
                }));

                // Prepare table data
                const dataRows = rows.slice(1).map((row) =>
                    row.reduce((acc, value, index) => {
                        acc[`col${index}`] = value.trim();
                        return acc;
                    }, {} as Record<string, string>)
                );

                setColumns(headers);
                setTableData(dataRows);
            }
        };

        fetchFileData();
    }, [fileName]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Target Selection</h2>
            {columns.length > 0 && tableData.length > 0 ? (
                <DataTable columns={columns} data={tableData} />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default TargetSelection;

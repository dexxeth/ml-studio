"use client";

import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Dataset {
	columns: string[];
	data: (string | number)[][];
}

interface ColumnStats {
	column: string;
	isNumerical: boolean;
	min: number;
	max: number;
	mean: number;
	stdDev: number;
}

export default function DatasetPage() {
	const [dataset, setDataset] = useState<Dataset | null>(null);
	const [filteredRows, setFilteredRows] = useState<(string | number)[][]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;
	const [statistics, setStatistics] = useState<ColumnStats[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch dataset from Firestore
	useEffect(() => {
		const fetchDataset = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "datasets"));
				if (!querySnapshot.empty) {
					const rawData = querySnapshot.docs.map((doc) => doc.data());

					if (!Array.isArray(rawData) || rawData.length === 0) {
						console.error("Invalid dataset structure:", rawData);
						return;
					}

					// Extract column names dynamically
					const columns = Object.keys(rawData[0]);

					// Convert object array into a 2D array
					const data = rawData.map((row) =>
						columns.map((col) => row[col]?.toString() || "-")
					);

					setDataset({ columns, data });
					setFilteredRows(data);
					calculateStatistics(columns, data);
				} else {
					console.warn("No dataset found in Firestore.");
				}
			} catch (error) {
				console.error("Error fetching dataset:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDataset();
	}, []);

	// Search functionality
	useEffect(() => {
		if (!dataset) return;
		const filtered = dataset.data.filter((row) =>
			row.some((cell) =>
				cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
		setFilteredRows(filtered);
		setCurrentPage(1); // Reset to first page on search
	}, [searchTerm, dataset]);

	// Pagination logic
	const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
	const paginatedRows = filteredRows.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	// Calculate statistics
	const calculateStatistics = (
		columns: string[],
		data: (string | number)[][]
	) => {
		const stats = columns.map((col, index) => {
			const columnData = data.map((row) => row[index]);
			const numericalValues = columnData.filter(
				(val) => !isNaN(Number(val))
			) as number[];

			if (numericalValues.length === 0) {
				return {
					column: col,
					isNumerical: false,
					min: 0,
					max: 0,
					mean: 0,
					stdDev: 0,
				};
			}

			const min = Math.min(...numericalValues);
			const max = Math.max(...numericalValues);
			const mean =
				numericalValues.reduce((sum, val) => sum + val, 0) /
				numericalValues.length;
			const stdDev = Math.sqrt(
				numericalValues.reduce(
					(sum, val) => sum + (val - mean) ** 2,
					0
				) / numericalValues.length
			);

			return { column: col, isNumerical: true, min, max, mean, stdDev };
		});
		setStatistics(stats);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">Dataset Viewer</h1>

			{/* Search Bar */}
			<div className="mb-4">
				<Input
					type="search"
					placeholder="Search dataset..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Data Table */}
			<div className="border rounded-md overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							{dataset?.columns.map((col, i) => (
								<TableHead key={i}>{col}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedRows.map((row, i) => (
							<TableRow key={i}>
								{row.map((cell, j) => (
									<TableCell key={j}>{cell}</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<Pagination className="mt-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setCurrentPage((prev) =>
										Math.max(prev - 1, 1)
									)
								}
								disabled={currentPage === 1}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => (
							<PaginationItem key={i}>
								<PaginationLink
									onClick={() => setCurrentPage(i + 1)}
									isActive={i + 1 === currentPage}>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setCurrentPage((prev) =>
										Math.min(prev + 1, totalPages)
									)
								}
								disabled={currentPage === totalPages}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			{/* Basic Dataset Statistics */}
			<div className="mt-8">
				<h2 className="text-2xl font-semibold mb-4">
					Dataset Statistics
				</h2>
				<div className="border rounded-md overflow-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Column</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Min</TableHead>
								<TableHead>Max</TableHead>
								<TableHead>Mean</TableHead>
								<TableHead>Std. Dev.</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{statistics.map((stat, i) => (
								<TableRow key={i}>
									<TableCell>{stat.column}</TableCell>
									<TableCell>
										{stat.isNumerical
											? "Numerical"
											: "Categorical"}
									</TableCell>
									<TableCell>
										{stat.isNumerical
											? stat.min.toFixed(2)
											: "-"}
									</TableCell>
									<TableCell>
										{stat.isNumerical
											? stat.max.toFixed(2)
											: "-"}
									</TableCell>
									<TableCell>
										{stat.isNumerical
											? stat.mean.toFixed(2)
											: "-"}
									</TableCell>
									<TableCell>
										{stat.isNumerical
											? stat.stdDev.toFixed(2)
											: "-"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

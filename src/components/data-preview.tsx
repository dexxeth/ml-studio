"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { ArrowRight, BarChart2, FileSpreadsheet, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Dataset {
	columns: string[];
	data: any[][];
}

export default function DatasetPreview() {
	const [dataset, setDataset] = useState<Dataset | null>(null);
	const [datasetName, setDatasetName] = useState<string>("");
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const rowsPerPage = 10;

	//   useEffect(() => {
	//     // Load dataset from localStorage
	//     const storedDataset = localStorage.getItem("dataset")
	//     const storedDatasetName = localStorage.getItem("datasetName")

	//     if (!storedDataset) {
	//       router.push("/upload")
	//       return
	//     }

	//     try {
	//       const parsedDataset = JSON.parse(storedDataset) as Dataset
	//       setDataset(parsedDataset)
	//       setDatasetName(storedDatasetName || "Unnamed Dataset")
	//     } catch (error) {
	//       console.error("Error parsing dataset:", error)
	//       router.push("/upload")
	//     }

	//     setLoading(false)
	//   }, [router])

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
						columns.map((col) => {
							const value = row[col];
							return typeof value === "number" || !isNaN(Number(value))
								? Number(value)
								: String(value ?? "-");
						})
					);

					setDataset({ columns, data });
					// setFilteredRows(data);
					// calculateStatistics(columns, data);
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

	if (loading || !dataset) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<div className="container mx-auto py-10 px-4">
					<div className="flex justify-center items-center h-64">
						<div className="text-center">
							<h2 className="text-xl font-medium">
								Loading dataset...
							</h2>
							<p className="text-muted-foreground">
								Please wait while we prepare your data
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const filteredRows = dataset.data.filter((row) =>
		row.some((cell) =>
			cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

	const paginatedRows = filteredRows.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	// Calculate basic statistics for numerical columns
	const statistics = dataset.columns.map((column, colIndex) => {
		// Check if column is numerical by examining the first few values
		const sampleValues = dataset.data
			.slice(0, 10)
			.map((row) => row[colIndex]);
		const isNumerical = sampleValues.every((val) => !isNaN(Number(val)));

		if (!isNumerical) {
			return { column, isNumerical: false };
		}

		const values = dataset.data.map((row) => Number(row[colIndex]));
		const min = Math.min(...values);
		const max = Math.max(...values);
		const sum = values.reduce((acc, val) => acc + val, 0);
		const mean = sum / values.length;

		// Calculate standard deviation
		const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
		const variance =
			squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
		const stdDev = Math.sqrt(variance);

		return {
			column,
			isNumerical: true,
			min,
			max,
			mean,
			stdDev,
		};
	});

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="container mx-auto py-10 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								{datasetName}
							</h1>
							<p className="text-muted-foreground">
								{dataset.data.length} rows,{" "}
								{dataset.columns.length} columns
							</p>
						</div>
						<Link href="/features">
							<Button>
								Continue to Feature Selection{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>

					<Card className="mb-8 border-border/40 bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileSpreadsheet className="h-5 w-5" />
								Dataset Preview
							</CardTitle>
							<CardDescription>
								Review your dataset before proceeding to feature
								selection
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
								<div className="relative w-full max-w-sm">
									<Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="search"
										placeholder="Search data..."
										className="w-full pl-8"
										value={searchTerm}
										onChange={(e) =>
											setSearchTerm(e.target.value)
										}
									/>
								</div>
							</div>

							<div className="border rounded-md overflow-auto">
								<Table>
									<TableHeader>
										<TableRow>
											{dataset.columns.map(
												(column, i) => (
													<TableHead key={i}>
														{column}
													</TableHead>
												)
											)}
										</TableRow>
									</TableHeader>
									<TableBody>
										{paginatedRows.map((row, i) => (
											<TableRow key={i}>
												{row.map((cell, j) => (
													<TableCell key={j}>
														{cell.toString()}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							<div className="mt-4">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													setCurrentPage((prev) =>
														Math.max(prev - 1, 1)
													)
												}
												className={
													currentPage === 1
														? "pointer-events-none opacity-50"
														: ""
												}
											/>
										</PaginationItem>
										{Array.from(
											{ length: Math.min(totalPages, 5) },
											(_, i) => {
												// Show pages around current page
												let pageNum = i + 1;
												if (totalPages > 5) {
													if (currentPage > 3) {
														pageNum =
															currentPage - 3 + i;
													}
													if (
														pageNum >
															totalPages - 4 &&
														i < 5
													) {
														pageNum =
															totalPages - 4 + i;
													}
												}
												return (
													<PaginationItem
														key={pageNum}>
														<PaginationLink
															isActive={
																pageNum ===
																currentPage
															}
															onClick={() =>
																setCurrentPage(
																	pageNum
																)
															}>
															{pageNum}
														</PaginationLink>
													</PaginationItem>
												);
											}
										)}
										<PaginationItem>
											<PaginationNext
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(
															prev + 1,
															totalPages
														)
													)
												}
												className={
													currentPage === totalPages
														? "pointer-events-none opacity-50"
														: ""
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
							<div className="text-sm text-muted-foreground">
								Showing {paginatedRows.length} of{" "}
								{filteredRows.length} rows
							</div>
							<div className="flex gap-2">
								<Link href="/features">
									<Button>
										Feature Selection{" "}
										<ArrowRight className="ml-1 h-3 w-3" />
									</Button>
								</Link>
							</div>
						</CardFooter>
					</Card>

					<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart2 className="h-5 w-5" />
								Data Statistics
							</CardTitle>
							<CardDescription>
								Basic statistics for numerical columns
							</CardDescription>
						</CardHeader>
						<CardContent className="overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Column</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Min</TableHead>
										<TableHead>Max</TableHead>
										<TableHead>Mean</TableHead>
										<TableHead>Std Dev</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{statistics.map((stat, i) => (
										<TableRow key={i}>
											<TableCell className="font-medium">
												{stat.column}
											</TableCell>
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
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

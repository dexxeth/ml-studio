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
import { ArrowRight, BarChart2, FileSpreadsheet, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Dataset {
	columns: string[];
	data: any[][];
}

export default function PreviewDataset() {
	const [dataset, setDataset] = useState<Dataset | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [fileName, setFileName] = useState<string>("");
	const searchParams = useSearchParams();
	const collection = searchParams?.get("collection");
	const filenameParam = searchParams?.get("file_name");
	const router = useRouter();

	useEffect(() => {
		if (!collection) {
			router.push("/upload-dataset");
			return;
		}

		if (filenameParam) {
			setFileName(filenameParam);
		}

		const fetchDataset = async (collectionName: string) => {
			try {
				setLoading(true);
				const response = await fetch(
					`http://127.0.0.1:8000/dataset/${collectionName}`
				);
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Error response:", errorText);
					return;
				}
				const result = await response.json();
				console.log("Fetched data:", result);
				console.log("File name:", filenameParam);
				console.log("Collection name:", collectionName);

				if (!Array.isArray(result?.dataset)) {
					console.error("Invalid dataset structure:", result);
					return;
				}

				const columns = Object.keys(result.dataset[0]);
				const data = result.dataset.map((row: Record<string, any>) =>
					columns.map((col) => {
						const value = row[col];
						return typeof value === "number" ||
							!isNaN(Number(value))
							? Number(value)
							: String(value ?? "-");
					})
				);

				setDataset({ columns, data });
				setFileName(filenameParam || "Dataset Preview");
			} catch (error) {
				console.error("Error fetching dataset:", error);
			} finally {
				setLoading(false);
			}
		};

		if (collection) {
			fetchDataset(collection as string);
		}
	}, [collection, filenameParam]);

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

	const totalPages = Math.ceil(filteredRows.length / pageSize);

	const paginatedRows = filteredRows.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const visiblePageNumbers = () => {
		const maxButtons = 5;
		let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
		let end = start + maxButtons - 1;
		if (end > totalPages) {
			end = totalPages;
			start = Math.max(1, end - maxButtons + 1);
		}
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const statistics = dataset.columns.map((column, colIndex) => {
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
								{fileName}
							</h1>
							<p className="text-muted-foreground">
								{dataset.data.length} rows,{" "}
								{dataset.columns.length} columns
							</p>
						</div>
						<Link
							href={`/features-selection?collection=${collection}&file_name=${fileName}`}>
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
										onChange={(e) => {
											setSearchTerm(e.target.value);
											setCurrentPage(1);
										}}
									/>
								</div>
							</div>

							<div className="flex items-center gap-2 ml-auto mb-4">
								<Label
									htmlFor="rows-per-page"
									className="text-sm font-medium">
									Rows per page
								</Label>
								<Select
									onValueChange={(val) => {
										setPageSize(parseInt(val));
										setCurrentPage(1);
									}}
									value={pageSize.toString()}>
									<SelectTrigger className="w-20">
										<SelectValue placeholder="Rows" />
									</SelectTrigger>
									<SelectContent>
										{[10, 25, 50, 100].map((num) => (
											<SelectItem
												key={num}
												value={num.toString()}>
												{num}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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

							<div className="mt-6 flex flex-wrap gap-2 justify-center">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(1)}
									disabled={currentPage === 1}>
									{"<<"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage((prev) =>
											Math.max(prev - 1, 1)
										)
									}
									disabled={currentPage === 1}>
									{"<"}
								</Button>

								{visiblePageNumbers().map((pageNum) => (
									<Button
										key={pageNum}
										variant={
											pageNum === currentPage
												? "default"
												: "outline"
										}
										size="sm"
										onClick={() => setCurrentPage(pageNum)}>
										{pageNum}
									</Button>
								))}
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage((prev) =>
											Math.min(prev + 1, totalPages)
										)
									}
									disabled={currentPage === totalPages}>
									{">"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(totalPages)}
									disabled={currentPage === totalPages}>
									{">>"}
								</Button>
							</div>
						</CardContent>
						<CardFooter className="flex sm:flex-row justify-between border-t pt-6 gap-4">
							<p className=" text-sm text-muted-foreground">
								Showing {paginatedRows.length} of{" "}
								{filteredRows.length} rows
							</p>
							<p className="text-sm text-muted-foreground">
								Page {currentPage} of {totalPages}
							</p>
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
													? (stat.min ?? 0).toFixed(2)
													: "-"}
											</TableCell>
											<TableCell>
												{stat.isNumerical
													? (stat.max ?? 0).toFixed(2)
													: "-"}
											</TableCell>
											<TableCell>
												{stat.isNumerical
													? (stat.mean ?? 0).toFixed(
															2
													  )
													: "-"}
											</TableCell>
											<TableCell>
												{stat.isNumerical
													? (
															stat.stdDev ?? 0
													  ).toFixed(2)
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

"use client";

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
import { FileSpreadsheet, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

interface Dataset {
	columns: string[];
	data: any[][];
}

interface DatasetPreviewCardProps {
	dataset: Dataset;
	fileName: string;
	collection: string;
}

export const DatasetPreviewCard: React.FC<DatasetPreviewCardProps> = ({
	dataset,
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");

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

	return (
		<Card className="mb-8 bg-card/50 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileSpreadsheet className="h-5 w-5" />
					Dataset Preview
				</CardTitle>
				<CardDescription>
					Review your dataset before proceeding to feature selection
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col sm:flex-row gap-4 mb-4">
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
				</div>

				<div className="border rounded-md overflow-auto">
					<Table>
						<TableHeader>
							<TableRow>
								{dataset.columns.map((column, i) => (
									<TableHead key={i}>{column}</TableHead>
								))}
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
							setCurrentPage((prev) => Math.max(prev - 1, 1))
						}
						disabled={currentPage === 1}>
						{"<"}
					</Button>
					{visiblePageNumbers().map((pageNum) => (
						<Button
							key={pageNum}
							variant={
								pageNum === currentPage ? "default" : "outline"
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
				<Button asChild>
					<Link href={"/upload-dataset"}>Back to Upload</Link>
				</Button>
				<p className="text-sm text-muted-foreground">
					Showing {paginatedRows.length} of {filteredRows.length} rows
				</p>
				<p className="text-sm text-muted-foreground">
					Page {currentPage} of {totalPages}
				</p>
			</CardFooter>
		</Card>
	);
};

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileSpreadsheet, BarChart2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Dataset {
	columns: string[];
	data: any[][];
}

export function DatasetStatisticsCard({ columns, data }: Dataset) {
	const statistics = columns.map((column, colIndex) => {
		const sampleValues = data.slice(0, 10).map((row) => row[colIndex]);
		const isNumerical = sampleValues.every((val) => !isNaN(Number(val)));

		if (!isNumerical) {
			return { column, isNumerical: false };
		}

		const values = data.map((row) => Number(row[colIndex]));
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
		<Card className="g-card/50 backdrop-blur-sm">
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
										? (stat.mean ?? 0).toFixed(2)
										: "-"}
								</TableCell>
								<TableCell>
									{stat.isNumerical
										? (stat.stdDev ?? 0).toFixed(2)
										: "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

"use client";

import { useEffect, useState } from "react";

type DatasetRow = Record<string, string>;

export default function DatasetViewer1() {
	const [dataset, setDataset] = useState<DatasetRow[]>([]);

	useEffect(() => {
		fetch("http://127.0.0.1:5000/getDataset")
			.then((res) => res.json())
			.then((data) => {
				if (data.dataset) setDataset(data.dataset);
			})
			.catch((err) => console.error("Error fetching dataset:", err));
	}, []);

	return (
		<div>
			<h2>Dataset Preview</h2>
			{dataset.length === 0 ? (
				<p>No data found.</p>
			) : (
				<table border="1">
					<thead>
						<tr>
							{Object.keys(dataset[0]).map((key) => (
								<th key={key}>{key}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{dataset.map((row, index) => (
							<tr key={index}>
								{Object.values(row).map((value, idx) => (
									<td key={idx}>{value}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

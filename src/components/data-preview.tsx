"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FetchFile({ filePath }: { filePath: string }) {
	const [fileUrl, setFileUrl] = useState<string | null>(null);

	useEffect(() => {
		const fetchFile = async () => {
			const { data, error } = await supabase.storage
				.from("datasets")
				.createSignedUrl(filePath, 60);

			if (error) {
				console.error("Error fetching file:", error);
			} else {
				setFileUrl(data.signedUrl);
			}
		};

		fetchFile();
	}, [filePath]);

	return (
		<div>
			{fileUrl ? <a href={fileUrl}>Download File</a> : "Loading..."}
		</div>
	);
}

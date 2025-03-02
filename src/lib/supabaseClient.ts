import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadDataset(file: File) {
	try {
		const filePath = `datasets/${Date.now()}_${file.name}`;

		// Upload file to Supabase Storage
		const { data, error } = await supabase.storage
			.from("datasets")
			.upload(filePath, file);

		if (error) throw error;

		// Store file info in Supabase Database
		const { error: insertError } = await supabase
			.from("datasets")
			.insert([{ name: file.name, path: filePath }]);

		if (insertError) throw insertError;

		console.log("Upload successful");
	} catch (err) {
		console.error("Upload failed:", err);
	}
}

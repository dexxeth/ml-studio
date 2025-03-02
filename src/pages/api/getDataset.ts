import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebaseAdmin";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	try {
		const datasetRef = db.collection("datasets").doc("your-dataset-id");
		const doc = await datasetRef.get();

		if (!doc.exists) {
			return res.status(404).json({ error: "Dataset not found" });
		}

		return res.status(200).json(doc.data());
	} catch (error) {
		console.error("Error fetching dataset:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
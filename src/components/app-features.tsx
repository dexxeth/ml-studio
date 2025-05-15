"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";

const Features = () => {
	const router = useRouter();
	return (
		<div className="relative flex flex-col items-center justify-center px-4 py-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
				{[
					"Train ML Model",
					"Data Preprocessing",
					"Feature Engineering",
				].map((feature, index) => (
					<Card
						onClick={() => router.push("/upload-dataset")}
						key={index}
						className="w-full h-52 flex items-center justify-center
                        transition duration-300 shadow-lg
                        hover:shadow-2xl hover:shadow-violet-500">
						<CardContent className="text-center text-lg font-semibold p-6">
							{feature}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default Features;

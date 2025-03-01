"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Home = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push("/upload-dataset");
	};

	return (
		<main className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<div className="flex flex-col gap-8 row-start-2 items-center text-white">
				ML Studio
				<div>
					<Button
						onClick={handleClick}
						className="bg-blue-600 hover:bg-white hover:text-black cursor-pointer">
						Start Training
					</Button>
				</div>
			</div>
		</main>
	);
};

export default Home;

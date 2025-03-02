"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const GetStartedButton = () => {
	const router = useRouter();
	return (
		<div>
			<Button onClick={()=>router.push("/upload")} size="lg" className="gap-2 px-8 py-6 text-lg cursor-pointer bg-violet-500 text-white hover:text-black">
				Get Started
				<ArrowRight className="h-5 w-5" />
			</Button>
		</div>
	);
};

export default GetStartedButton;

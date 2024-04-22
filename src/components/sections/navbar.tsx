import { JSX, SVGProps } from "react";
import Link from "next/link";
import { EQIcon } from "@/components/svg";

export default function NavBar() {
    return (
        <div className="h-12 w-full bg-gray-100/50 shadow fixed top-0 font-jersey">
            <div className="container flex h-12 px-4 items-center justify-between md:px-6">
                <Link className="flex items-center" href="#">
                    <EQIcon className="h-10 w-10" />
                    <span className="ml-2 text-xl font-semibold">Audio Glow</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <Link className="text-md font-medium transition-colors hover:underline" href="https://www.github.com/stunnas/audioglow" target="_blank">
                        Source Code
                    </Link>
                </div>
            </div>
        </div>
    );
}

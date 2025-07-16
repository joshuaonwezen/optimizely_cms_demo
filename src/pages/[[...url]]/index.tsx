import VisualBuilder from "@/components/content/VisualBuilder";
import { parseCurrentUrl } from "@/utils/urlParser";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

/**
 * Main page component for Optimizely CMS demo
 * Handles different URL patterns and renders appropriate content
 */
export default function Home() {
    // Parse URL to determine what content to load
    const pageParams = parseCurrentUrl();
    
    return (
        <main className={`flex min-h-screen flex-col items-center px-12 justify-between ${inter.className}`}>
            <VisualBuilder {...pageParams} />
        </main>
    );
}



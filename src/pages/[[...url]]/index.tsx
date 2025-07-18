import VisualBuilder from "@/components/content/VisualBuilder";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

/**
 * Main page component for Optimizely CMS demo
 * Handles different URL patterns and renders appropriate content
 */
export default function Home() {
    const router = useRouter();
    
    // Parse URL parameters using Next.js router (works on both server and client)
    const pageParams = useMemo(() => {
        const { query, asPath } = router;
        
        // Handle search queries
        if (query.query) {
            return { searchQuery: query.query as string };
        }
        
        // Handle preview mode
        if (query.key) {
            return {
                contentKey: query.key as string,
                version: query.ver as string | undefined,
            };
        }
        
        // Handle regular page URLs
        const url = asPath === '/' ? '/en/' : asPath;
        return { url: url.endsWith('/') ? url : url + '/' };
    }, [router.query, router.asPath]);
    
    return (
        <main className={`flex min-h-screen flex-col items-center px-12 justify-between ${inter.className}`}>
            <VisualBuilder {...pageParams} />
        </main>
    );
}



import VisualBuilderComponent from "@/components/base/VisualBuilderComponent";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    let version: string | undefined;
    let key: string | undefined;
    let url: string | undefined;

    if (typeof window !== "undefined" && window.location !== undefined) {
        let locationUrl = window.location.toString();
        if (locationUrl.indexOf("/CMS/Content") !== -1 && locationUrl.indexOf(",,") !== -1) {
            const pathArray = window?.location?.pathname?.split('/')
            const contentId = pathArray[pathArray.length - 1]

            const contentIdArray = contentId.split('_')
            if (contentIdArray.length > 1) {
                version = contentIdArray[contentIdArray.length - 1]
            }
        } else if (locationUrl.indexOf("/preview?key") !== -1) {
            const url = new URL(locationUrl);
            try {
                const urlKey = url.searchParams.get("key");
                if (urlKey) {
                    key = urlKey;
                }
            } catch {
                key = undefined;   
            }
            
            try {
                const urlVer = url.searchParams.get("ver");
                if (urlVer) {
                    version = urlVer;
                }
            } catch {
                version = undefined;   
            }
        } else {
            const contentId = window?.location?.pathname || "";
            url = contentId.endsWith("/") ? contentId : contentId + "/";
        }
    }
    
    return (
        <main className={`flex min-h-screen flex-col items-center px-12 justify-between ${inter.className}`}>
            <VisualBuilderComponent version={version} contentKey={key} url={url}/>
        </main>
        // </>
    );
}



/**
 * Simple URL parsing utilities for Optimizely CMS demo
 * Extracts different types of content identifiers from URLs
 */

export interface PageParams {
    version?: string;
    contentKey?: string;
    url?: string;
    searchQuery?: string;
}

/**
 * Parse the current URL to determine what content to load
 * Handles 3 main scenarios:
 * 1. CMS Preview mode (with version)
 * 2. Preview with key/version params
 * 3. Search queries
 * 4. Regular page URLs
 */
export function parseCurrentUrl(): PageParams {
    // Server-side rendering guard
    if (typeof window === "undefined") {
        return {};
    }

    const currentUrl = window.location.toString();
    const pathname = window.location.pathname;

    // 1. CMS Content editing mode
    if (currentUrl.includes("/CMS/Content") && currentUrl.includes(",,")) {
        return parseCmsEditingUrl(pathname);
    }

    // 2. Preview mode with parameters
    if (currentUrl.includes("/preview?key")) {
        return parsePreviewUrl();
    }

    // 3. Search mode
    if (currentUrl.includes("/search?")) {
        return parseSearchUrl();
    }

    // 4. Regular page URL
    return parseRegularUrl(pathname);
}

function parseCmsEditingUrl(pathname: string): PageParams {
    const pathArray = pathname.split('/');
    const contentId = pathArray[pathArray.length - 1];
    const contentIdArray = contentId.split('_');

    return {
        version: contentIdArray.length > 1 ? contentIdArray[contentIdArray.length - 1] : undefined
    };
}

function parsePreviewUrl(): PageParams {
    const urlParams = new URLSearchParams(window.location.search);

    return {
        contentKey: urlParams.get("key") || undefined,
        version: urlParams.get("ver") || undefined
    };
}

function parseSearchUrl(): PageParams {
    const urlParams = new URLSearchParams(window.location.search);

    return {
        searchQuery: urlParams.get("query") || undefined
    };
}

function parseRegularUrl(pathname: string): PageParams {
    const cleanUrl = pathname.endsWith("/") ? pathname : pathname + "/";

    return {
        url: cleanUrl
    };
}
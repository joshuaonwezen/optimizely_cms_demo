interface PropertySaved {
    name: string;
    successful: boolean;
}

interface ContentSavedEventArgs {
    contentLink: string;
    previewUrl: string;
    isIndexed: boolean;
    properties: PropertySaved[];
    parentId?: string;
    sectionId?: string;
}

export function getPreviewToken() {
    if (typeof window !== "undefined" && window.location !== undefined) {
        const queryString = window?.location?.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('preview_token');
    } else {
        return undefined;
    }
}

function isInEditMode() {
    return !!getPreviewToken();
}

export function onContentSaved(callback: (message: ContentSavedEventArgs) => void) {
    if (!isInEditMode()) {
        return () => {};
    }

    const handler = (event: any) => {
        // Logging for demo purposes
        console.log(event);
        callback(event.detail);
    };

    window.addEventListener("optimizely:cms:contentSaved", handler);

    return () => {
        window.removeEventListener("optimizely:cms:contentSaved", handler);
    };
}

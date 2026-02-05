/**
 * Code Sharing Manager
 * Compresses code into URL hash using LZ-String
 */

export class ShareManager {
    constructor() {
        this.baseUrl = window.location.href.split('?')[0];
    }

    async generateLink(code) {
        // Simple base64 for MVP (LZ-String recommended for production)
        const encoded = btoa(unescape(encodeURIComponent(code)));
        return `${this.baseUrl}?code=${encoded}`;
    }

    loadFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get('code');
        if (encoded) {
            try {
                return decodeURIComponent(escape(atob(encoded)));
            } catch (e) {
                console.error("Failed to decode URL code", e);
            }
        }
        return null;
    }
}

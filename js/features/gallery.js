/**
 * Remix Gallery UI
 * Displays shared projects grid
 */

export class GalleryUI {
    constructor(backendUrl) {
        this.backendUrl = backendUrl;
    }

    async render(containerId) {
        // Stub data for MVP
        const projects = [
            { title: "Spiral Art", author: "CodeWizard", id: 1 },
            { title: "Chatbot", author: "PyFan", id: 2 }
        ];

        const html = projects.map(p => `
            <div class="gallery-card">
                <div class="preview"></div>
                <h4>${p.title}</h4>
                <p>by ${p.author}</p>
                <button onclick="loadProject(${p.id})">Remix 🔁</button>
            </div>
        `).join('');

        document.getElementById(containerId).innerHTML = `<div class="gallery-grid">${html}</div>`;
    }
}

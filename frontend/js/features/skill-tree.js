/**
 * Skill Tree Renderer
 * Visualizes progression graph using SVG
 */

export class SkillTree {
    constructor() {
        this.skills = [
            { id: 'basics', x: 50, y: 50, label: 'Basics', unlocked: true },
            { id: 'loops', x: 150, y: 50, label: 'Loops', unlocked: false, parent: 'basics' },
            { id: 'logic', x: 150, y: 150, label: 'Logic', unlocked: false, parent: 'basics' },
            { id: 'funcs', x: 250, y: 100, label: 'Functions', unlocked: false, parent: 'loops' }
        ];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let svg = `<svg width="400" height="200" style="background:#1e1e1e; border-radius:8px;">`;
        
        // Draw Lines
        this.skills.forEach(skill => {
            if (skill.parent) {
                const parent = this.skills.find(s => s.id === skill.parent);
                svg += `<line x1="${parent.x}" y1="${parent.y}" x2="${skill.x}" y2="${skill.y}" stroke="#555" stroke-width="2" />`;
            }
        });

        // Draw Nodes
        this.skills.forEach(skill => {
            const color = skill.unlocked ? '#10b981' : '#4b5563';
            svg += `
                <circle cx="${skill.x}" cy="${skill.y}" r="20" fill="${color}" stroke="#fff" stroke-width="2" />
                <text x="${skill.x}" y="${skill.y + 35}" fill="#fff" text-anchor="middle" font-size="12">${skill.label}</text>
            `;
        });

        svg += `</svg>`;
        container.innerHTML = `<h3>Skill Tree</h3>${svg}`;
    }
    
    unlock(id) {
        const skill = this.skills.find(s => s.id === id);
        if (skill) skill.unlocked = true;
    }
}

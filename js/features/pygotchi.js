/**
 * PyGotchi Engine
 * Programmable Virtual Pet
 */

export class PyGotchi {
    constructor() {
        this.stats = {
            hunger: 50, // 0-100
            happiness: 50,
            energy: 100
        };
        this.petName = "Py";
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="pygotchi-card">
                <div class="pygotchi-screen">
                    <div class="pet-sprite">🐍</div>
                    <div class="status-bars">
                        <div>Hunger: <progress value="${this.stats.hunger}" max="100"></progress></div>
                        <div>Fun: <progress value="${this.stats.happiness}" max="100"></progress></div>
                    </div>
                </div>
                <div class="pygotchi-code-hint">
                    Try: <code>pet.feed()</code> or <code>pet.play()</code>
                </div>
            </div>
        `;
    }

    // API exposed to Python/Pyodide
    feed(amount = 10) {
        this.stats.hunger = Math.max(0, this.stats.hunger - amount);
        this.updateUI();
        return `${this.petName} ate the food! Hunger is now ${this.stats.hunger}.`;
    }

    play(duration = 5) {
        if (this.stats.energy < duration) return `${this.petName} is too tired!`;
        this.stats.happiness = Math.min(100, this.stats.happiness + duration * 2);
        this.stats.energy -= duration;
        this.updateUI();
        return `${this.petName} played for ${duration} minutes!`;
    }

    updateUI() {
        // Re-render logic would go here
    }
}

/**
 * Boss Battle System
 * Gamified Quiz Engine
 */

export class BossBattle {
    constructor() {
        this.boss = {
            name: "Syntax Serpent",
            hp: 100,
            maxHp: 100
        };
    }

    startBattle(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="boss-arena">
                <div class="boss-hud">
                    <h3>${this.boss.name}</h3>
                    <progress class="boss-hp" value="${this.boss.hp}" max="${this.boss.maxHp}"></progress>
                </div>
                <div class="boss-sprite">🐉</div>
                <div class="code-console">
                    <p>The serpent is attacking! Write a loop to dodge!</p>
                </div>
            </div>
        `;
    }

    attackBoss(damage) {
        this.boss.hp = Math.max(0, this.boss.hp - damage);
        return this.boss.hp === 0 ? "VICTORY!" : `Hit! Boss HP: ${this.boss.hp}`;
    }
}

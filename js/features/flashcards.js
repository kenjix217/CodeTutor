/**
 * Flashcard Manager
 * Simple Spaced Repetition System
 */

export class FlashcardManager {
    constructor() {
        this.cards = [
            { q: "How do you add to a list?", a: ".append(item)" },
            { q: "How to get list length?", a: "len(list)" },
            { q: "Symbol for equality?", a: "==" }
        ];
        this.currentIndex = 0;
    }

    getNextCard() {
        return this.cards[this.currentIndex];
    }

    markResult(correct) {
        // Simple round-robin for MVP
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    }
}

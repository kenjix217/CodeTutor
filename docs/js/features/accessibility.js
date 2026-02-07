/**
 * Accessibility Manager
 * Handles Font Scaling, Dyslexic Fonts, and High Contrast
 */

export class AccessibilityManager {
    constructor() {
        this.settings = {
            dyslexicFont: false,
            highContrast: false,
            fontSize: 100 // Percentage
        };
        this.applySettings();
    }

    toggleDyslexicFont() {
        this.settings.dyslexicFont = !this.settings.dyslexicFont;
        this.applySettings();
        return this.settings.dyslexicFont;
    }

    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        this.applySettings();
        return this.settings.highContrast;
    }

    setFontSize(percentage) {
        this.settings.fontSize = percentage;
        this.applySettings();
    }

    applySettings() {
        const root = document.documentElement;
        
        // Dyslexic Font
        if (this.settings.dyslexicFont) {
            document.body.classList.add('a11y-dyslexic');
        } else {
            document.body.classList.remove('a11y-dyslexic');
        }

        // High Contrast
        if (this.settings.highContrast) {
            document.body.classList.add('a11y-high-contrast');
        } else {
            document.body.classList.remove('a11y-high-contrast');
        }

        // Font Size
        root.style.setProperty('--base-font-size', `${this.settings.fontSize}%`);
    }
}

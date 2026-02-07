/**
 * Zen Mode Controller
 * Toggles distraction-free UI
 */

export class ZenMode {
    constructor() {
        this.isZen = false;
        this.controls = document.querySelectorAll('.app-header, .app-nav, .lesson-list-container, .app-footer');
        this.main = document.querySelector('.app-main');
    }

    toggle() {
        this.isZen = !this.isZen;
        
        if (this.isZen) {
            document.body.classList.add('zen-active');
            // Hide distractions
            this.controls.forEach(el => el.style.display = 'none');
            // Maximize editor area
            if (this.main) {
                this.main.style.padding = '0';
                this.main.style.height = '100vh';
            }
        } else {
            document.body.classList.remove('zen-active');
            this.controls.forEach(el => el.style.display = '');
            if (this.main) {
                this.main.style.padding = '';
                this.main.style.height = '';
            }
        }
        
        // Trigger resize for Monaco
        window.dispatchEvent(new Event('resize'));
        return this.isZen;
    }
}

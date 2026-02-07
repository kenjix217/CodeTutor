/**
 * Code Playback Engine
 * Types code into the editor character-by-character
 */

export class PlaybackEngine {
    constructor(editor) {
        this.editor = editor; // Monaco instance
        this.isPlaying = false;
        this.speed = 50; // ms per char
    }

    async play(code) {
        this.isPlaying = true;
        this.editor.setValue(''); // Clear first
        
        for (let i = 0; i < code.length; i++) {
            if (!this.isPlaying) break;
            
            const char = code[i];
            const current = this.editor.getValue();
            this.editor.setValue(current + char);
            
            // Randomize timing slightly for realism
            const delay = this.speed + (Math.random() * 20 - 10);
            await new Promise(r => setTimeout(r, delay));
        }
        
        this.isPlaying = false;
    }

    stop() {
        this.isPlaying = false;
    }
}

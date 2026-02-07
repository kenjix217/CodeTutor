/**
 * REPL Console
 * Simple Read-Eval-Print Loop interface
 */

export class REPL {
    constructor(pyodide) {
        this.pyodide = pyodide;
        this.history = [];
        this.historyIndex = -1;
    }

    createInterface() {
        const container = document.createElement('div');
        container.className = 'repl-container';
        container.innerHTML = `
            <div class="repl-output" id="repl-output">Python 3.11 (Pyodide) REPL\nType "help", "copyright", "credits" or "license" for more information.\n</div>
            <div class="repl-input-line">
                <span class="repl-prompt">>>></span>
                <input type="text" id="repl-input" class="repl-input" autocomplete="off">
            </div>
        `;
        return container;
    }

    async evaluate(code) {
        try {
            // Redirect stdout
            await this.pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
            `);
            
            // Eval expression
            let result = await this.pyodide.runPythonAsync(code);
            
            // Get stdout
            let stdout = await this.pyodide.runPythonAsync('sys.stdout.getvalue()');
            
            return (stdout + (result !== undefined ? String(result) : '')).trim();
        } catch (e) {
            return `Error: ${e.message}`;
        }
    }
}

/**
 * Tracer Engine
 * Step-by-step execution visualization
 */

export class TracerEngine {
    constructor(pyodide) {
        this.pyodide = pyodide;
    }

    async trace(code) {
        // Instrument user code to yield local variables after every line
        const lines = code.split('\n');
        let instrumented = "import json\n_trace = []\n";
        
        lines.forEach((line, i) => {
            if (line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('def ') && !line.trim().startsWith('class ')) {
                // Add tracking code
                instrumented += `${line}\n`;
                // Capture locals, convert to string safely
                instrumented += `_locals = {k:str(v) for k,v in locals().items() if not k.startswith('_')}\n`;
                instrumented += `_trace.append({'line': ${i+1}, 'vars': _locals})\n`;
            } else {
                instrumented += `${line}\n`;
            }
        });
        
        instrumented += "\njson.dumps(_trace)";

        try {
            const result = await this.pyodide.runPythonAsync(instrumented);
            return JSON.parse(result);
        } catch (e) {
            console.error("Tracing failed", e);
            return [];
        }
    }
}

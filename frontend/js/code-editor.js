/**
 * Code Editor Module
 * Handles in-browser Python code execution and formatting
 */

export class CodeEditor {
  constructor() {
    this.editorElement = document.getElementById('code-editor');
    this.output = document.getElementById('code-output');
    this.pyodide = null;
    this.pyodideLoading = false;
    this.pyodideReady = false;
    this.monacoEditor = null;
    this.monacoLoading = false;
    this.useMonaco = true;  // Try to use Monaco, fall back to textarea if fails
    this.customPackages = this.loadCustomPackages();  // Load saved packages
    
    this.setupEventHandlers();
    this.setupResizableDivider();
    this.setupLibraryManager();
    // Monaco will load lazily when Practice tab is first opened
  }

  /**
   * Set up event handlers for editor controls
   */
  setupEventHandlers() {
    const runButton = document.getElementById('run-code');
    if (runButton) {
      runButton.addEventListener('click', () => this.runCode());
    }
    
    const formatButton = document.getElementById('format-code');
    if (formatButton) {
        formatButton.addEventListener('click', () => this.formatCode());
    }

    const clearButton = document.getElementById('clear-code');
    if (clearButton) {
      clearButton.addEventListener('click', () => this.clearEditor());
    }

    const clearOutputButton = document.getElementById('clear-output');
    if (clearOutputButton) {
      clearOutputButton.addEventListener('click', () => this.clearOutput());
    }

    // Keyboard shortcuts for textarea (Monaco handles its own)
    if (this.editorElement && this.editorElement.tagName === 'TEXTAREA') {
      this.editorElement.addEventListener('keydown', (e) => {
        // Ctrl+Enter or Cmd+Enter to run code
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          this.runCode();
        }

        // Tab key inserts spaces instead of focusing next element
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.editorElement.selectionStart;
          const end = this.editorElement.selectionEnd;
          const value = this.editorElement.value;
          
          // Insert 4 spaces
          this.editorElement.value = value.substring(0, start) + '    ' + value.substring(end);
          this.editorElement.selectionStart = this.editorElement.selectionEnd = start + 4;
        }
      });
    }
  }

  /**
   * Initialize Pyodide (Python runtime in browser)
   * Loads asynchronously on first use
   * Pre-loads common libraries for advanced lessons
   */
  async initializePyodide() {
    if (this.pyodideReady) return true;
    if (this.pyodideLoading) return false;
    
    this.pyodideLoading = true;
    
    try {
      this.displayOutput('🔄 Loading Python runtime...\nThis may take a few seconds on first use.\n\n(Python + libraries loading in your browser via WebAssembly)');
      
      // Load Pyodide
      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      });
      
      // Redirect stdout to capture print() output
      await this.pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      
      // Load micropip for package installation
      await this.pyodide.loadPackage('micropip');
      
      // Pre-load common libraries (for advanced lessons)
      this.displayOutput('🔄 Loading Python runtime + libraries...\nFirst time: 10-15 seconds\nAfter: Instant!\n\n(Loading: numpy, pandas, matplotlib, black...)');
      
      // Load commonly used packages available in Pyodide
      const packagesToLoad = [
        'numpy',      // For data science (L13, L18)
        'pandas',     // For data analysis (L18)
        'matplotlib', // For visualization (L18)
        'black'       // For auto-formatting
      ];
      
      for (const pkg of packagesToLoad) {
        try {
          await this.pyodide.loadPackage(pkg);
          console.log(`✅ Loaded: ${pkg}`);
        } catch (err) {
          console.warn(`⚠️ Could not load ${pkg}:`, err);
        }
      }
      
      this.pyodideReady = true;
      this.pyodideLoading = false;
      
      console.log('✅ Pyodide loaded with common libraries');
      console.log('📦 Available: numpy, pandas, matplotlib (for visualizations)');
      console.log('ℹ️ Note: sqlite3 and turtle not available in browser. Use real Python for databases and turtle graphics.');
      
      // Auto-install previously installed custom packages
      if (this.customPackages.length > 0) {
        console.log('📦 Re-installing custom packages:', this.customPackages);
        await this.reinstallCustomPackages();
      }
      
      return true;
      
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      this.pyodideLoading = false;
      this.displayError('Failed to load Python runtime. Falling back to simulation mode.\n\n' + error.message);
      return false;
    }
  }


  /**
   * Load custom packages from localStorage
   */
  loadCustomPackages() {
    try {
      const saved = localStorage.getItem('python-custom-packages');
      if (saved) {
        const packages = JSON.parse(saved);
        console.log('📦 Loaded custom packages from storage:', packages);
        return packages;
      }
    } catch (e) {
      console.warn('Could not load custom packages:', e);
    }
    return [];
  }

  /**
   * Save custom packages to localStorage
   */
  saveCustomPackages() {
    try {
      localStorage.setItem('python-custom-packages', JSON.stringify(this.customPackages));
      console.log('💾 Saved custom packages:', this.customPackages);
    } catch (e) {
      console.warn('Could not save custom packages:', e);
    }
  }

  /**
   * Re-install custom packages (on Pyodide reload)
   */
  async reinstallCustomPackages() {
    for (const pkg of this.customPackages) {
      try {
        console.log(`📦 Re-installing ${pkg}...`);
        await this.pyodide.runPythonAsync(`
import micropip
await micropip.install('${pkg}')
        `);
        console.log(`✅ Re-installed: ${pkg}`);
      } catch (error) {
        console.warn(`⚠️ Could not re-install ${pkg}:`, error);
      }
    }
    
    // Update UI
    this.updateCustomPackagesList();
  }
  
  /**
   * Format Code using Black
   */
  async formatCode() {
      const code = this.getCode();
      if (!code.trim()) return;
      
      if (!this.pyodideReady) {
          this.displayOutput('⏳ Loading formatter...');
          await this.initializePyodide();
      }
      
      try {
          // Note: black package must be loaded
          const formatted = await this.pyodide.runPythonAsync(`
import black
try:
    formatted = black.format_str(${JSON.stringify(code)}, mode=black.Mode())
    formatted
except Exception as e:
    str(e)
          `);
          
          if (formatted.startsWith('error:')) {
              this.displayError('Formatting failed: ' + formatted);
          } else {
              this.setCode(formatted);
              this.displayOutput('✨ Code formatted successfully!');
          }
      } catch (e) {
          this.displayError('Formatter Error: ' + e.message);
      }
  }

  /**
   * Setup library manager controls
   */
  setupLibraryManager() {
    const toggleBtn = document.getElementById('toggle-library-panel');
    const panel = document.getElementById('library-panel');
    const installBtn = document.getElementById('install-package');
    const packageInput = document.getElementById('package-name');

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = panel.style.display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? 'Hide Libraries' : 'Manage Libraries';
      });
    }

    if (installBtn && packageInput) {
      installBtn.addEventListener('click', () => this.installPackageUI());
      packageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.installPackageUI();
        }
      });
    }
  }

  /**
   * Install package from UI
   */
  async installPackageUI() {
    const packageInput = document.getElementById('package-name');
    if (!packageInput) return;

    const packageName = packageInput.value.trim();
    if (!packageName) {
      alert('Please enter a package name');
      return;
    }

    const success = await this.installPackage(packageName);
    
    if (success) {
      // Add to custom packages list
      if (!this.customPackages.includes(packageName)) {
        this.customPackages.push(packageName);
        this.saveCustomPackages();  // Persist to localStorage
        this.updateCustomPackagesList();
      }
      packageInput.value = '';
    }
  }

  /**
   * Update custom packages display
   */
  updateCustomPackagesList() {
    const container = document.getElementById('custom-packages');
    if (!container) return;

    if (this.customPackages.length === 0) {
      container.innerHTML = '<p class="library-empty">No custom packages installed yet.</p>';
      return;
    }

    let html = '';
    this.customPackages.forEach(pkg => {
      html += `
        <div class="library-item installed">
          <span class="library-name">${pkg}</span>
          <span class="library-status">✅ Installed (saved)</span>
          <button class="btn-remove-pkg" data-package="${pkg}" title="Remove ${pkg}">✕</button>
        </div>
      `;
    });

    container.innerHTML = html;
    
    // Add remove button handlers
    container.querySelectorAll('.btn-remove-pkg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkg = e.target.getAttribute('data-package');
        this.removeCustomPackage(pkg);
      });
    });
  }

  /**
   * Remove custom package
   */
  removeCustomPackage(packageName) {
    const index = this.customPackages.indexOf(packageName);
    if (index > -1) {
      this.customPackages.splice(index, 1);
      this.saveCustomPackages();
      this.updateCustomPackagesList();
      console.log(`🗑️ Removed ${packageName} from saved list (will not auto-install on next reload)`);
    }
  }

  /**
   * Install additional package on-demand using micropip
   */
  async installPackage(packageName) {
    if (!this.pyodideReady) {
      const statusMsg = document.getElementById('custom-packages');
      if (statusMsg) {
        statusMsg.innerHTML = '<p style="color: #f59e0b;">⏳ Loading Python runtime first...</p>';
      }
      await this.initializePyodide();
    }

    try {
      // Show status in custom packages area
      const statusMsg = document.getElementById('custom-packages');
      if (statusMsg) {
        statusMsg.innerHTML = `<p style="color: #3b82f6;">📦 Installing ${packageName}...</p>`;
      }
      
      await this.pyodide.runPythonAsync(`
import micropip
await micropip.install('${packageName}')
      `);
      
      console.log(`✅ Installed: ${packageName}`);
      
      // Show success message
      if (statusMsg) {
        statusMsg.innerHTML = `<p style="color: #10b981;">✅ ${packageName} installed! You can now use it.</p>`;
        setTimeout(() => this.updateCustomPackagesList(), 2000);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to install ${packageName}:`, error);
      
      const statusMsg = document.getElementById('custom-packages');
      if (statusMsg) {
        statusMsg.innerHTML = `<p style="color: #ef4444;">❌ Failed to install ${packageName}<br>${error.message}<br><br>💡 Not all packages work in browser. Try in real Python.</p>`;
      }
      
      return false;
    }
  }

  /**
   * Run the Python code in the editor
   */
  async runCode() {
    const code = this.getCode().trim();
    if (!code) {
      this.displayOutput('No code to run. Please write some Python code first.');
      return;
    }

    // Quick syntax validation (catches common beginner errors before running)
    const validationError = this.validatePythonSyntax(code);
    if (validationError) {
      this.displayOutput(validationError);
      return;
    }

    // Initialize Pyodide if not already loaded
    if (!this.pyodideReady) {
      const loaded = await this.initializePyodide();
      if (!loaded) {
        // Fallback to mock execution
        const result = this.executePythonMock(code);
        this.displayOutput(result);
        return;
      }
    }

    try {
      // Execute real Python code
      await this.executePythonReal(code);
      
    } catch (error) {
      this.displayError(error.message);
    }
  }

  /**
   * Execute Python code using Pyodide (real Python!)
   * Supports text output AND matplotlib visualizations
   */
  async executePythonReal(code) {
    try {
      // Clear previous output (including any images)
      if (this.output) {
        this.output.innerHTML = '';
        this.output.classList.remove('error', 'success');
      }
      
      // Clear stdout
      await this.pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      
      // Check if code uses matplotlib
      const usesMatplotlib = code.includes('matplotlib') || code.includes('plt.');
      
      if (usesMatplotlib) {
        // Set up matplotlib for browser display
        await this.setupMatplotlib();
      }
      
      // Run user code
      await this.pyodide.runPythonAsync(code);
      
      // Try to get and display matplotlib plots FIRST
      let plotHTML = '';
      if (usesMatplotlib) {
        plotHTML = await this.captureMatplotlibPlots();
      }
      
      // Get text output
      const textOutput = await this.pyodide.runPythonAsync('sys.stdout.getvalue()');
      
      // Build complete output HTML
      let fullHTML = '';
      
      // Add plots first (if any)
      if (plotHTML) {
        fullHTML += plotHTML;
      }
      
      // Add text output
      if (textOutput) {
        fullHTML += `<div style="color: #86efac; margin-top: 1rem;">`;
        fullHTML += `<strong>✅ Code executed successfully!</strong><br><br>`;
        fullHTML += `<strong>📤 Output:</strong><br>`;
        fullHTML += `<pre style="color: #e2e8f0; background: none; padding: 0; margin: 0.5rem 0;">${this.escapeHtml(textOutput)}</pre>`;
        fullHTML += `</div>`;
      } else if (!plotHTML) {
        fullHTML += `<div style="color: #86efac;">✅ Code executed successfully!<br><br>(No output - did you use print()?)</div>`;
      }
      
      // Set output HTML directly
      if (this.output) {
        this.output.innerHTML = fullHTML;
        this.output.classList.add('success');
      }
      
    } catch (error) {
      // Display Python error
      this.displayError('Python Error:\n\n' + error.message);
    }
  }

  /**
   * Escape HTML for safe display
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Set up matplotlib for browser display
   */
  async setupMatplotlib() {
    try {
      await this.pyodide.runPythonAsync(`
import matplotlib
matplotlib.use('AGG')  # Use non-interactive backend
import matplotlib.pyplot as plt
      `);
    } catch (error) {
      console.warn('Could not set up matplotlib:', error);
    }
  }


  /**
   * Capture matplotlib plots and return HTML
   * Returns HTML string with embedded images
   */
  async captureMatplotlibPlots() {
    try {
      // Get all figures and convert to base64 images
      const imageData = await this.pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

images = []
fig_nums = plt.get_fignums()

if len(fig_nums) > 0:
    for fig_num in fig_nums:
        try:
            fig = plt.figure(fig_num)
            buf = io.BytesIO()
            fig.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
            buf.seek(0)
            img_bytes = buf.read()
            img_base64 = base64.b64encode(img_bytes).decode('utf-8')
            images.append(img_base64)
            plt.close(fig)
        except Exception as e:
            print(f"Error saving figure {fig_num}: {e}")

import json
json.dumps(images)
      `);
      
      const images = JSON.parse(imageData);
      
      if (images && images.length > 0) {
        console.log(`✅ Captured ${images.length} plot(s), total size: ${JSON.stringify(images).length} chars`);
        
        // Create visualization HTML
        let html = '<div style="background: white; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border: 2px solid #3b82f6;">';
        html += '<h4 style="color: #3b82f6; margin: 0 0 1rem 0; font-size: 1.1rem;">📊 Visualization:</h4>';
        
        images.forEach((imgData, index) => {
          html += `<div style="margin: 1rem 0;">`;
          html += `<img src="data:image/png;base64,${imgData}" alt="Plot ${index + 1}" style="max-width: 100%; height: auto; display: block; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />`;
          html += `</div>`;
        });
        
        html += '</div>';
        
        return html;
      }
      
      console.log('ℹ️ No matplotlib figures found');
      return '';
      
    } catch (error) {
      console.error('Error capturing matplotlib plots:', error);
      return `<div style="color: #f59e0b; padding: 1rem;">⚠️ Could not capture plot: ${error.message}</div>`;
    }
  }

  /**
   * Mock Python execution with basic syntax validation
   * Provides beginner-friendly error messages
   */
  executePythonMock(code) {
    // Validate basic Python syntax and provide helpful errors
    const validationError = this.validatePythonSyntax(code);
    
    if (validationError) {
      return validationError;
    }
    
    // Code looks good! Provide positive feedback
    return this.generateMockOutput(code);
  }

  /**
   * Generate mock output with positive feedback
   * Simulates basic Python execution by tracking variables
   */
  generateMockOutput(code) {
    let output = '✅ Your code looks good!\n\n';
    
    // Parse and track variable assignments
    const variables = this.parseVariables(code);
    
    // Try to simulate print statements
    const printMatches = code.match(/print\(([^)]+)\)/g);
    
    if (printMatches) {
      output += '📤 Expected output when Python runs:\n';
      printMatches.forEach(match => {
        // Extract what's being printed
        const content = match.match(/print\(([^)]+)\)/)[1];
        
        // Handle multiple arguments separated by commas
        const parts = this.splitPrintArguments(content);
        const outputParts = [];
        
        parts.forEach(part => {
          const trimmed = part.trim();
          
          // String literal
          if (trimmed.match(/^['"](.+?)['"]$/)) {
            const text = trimmed.match(/^['"](.+?)['"]$/)[1];
            outputParts.push(text);
          }
          // Variable we know about
          else if (variables[trimmed] !== undefined) {
            outputParts.push(variables[trimmed]);
          }
          // Unknown - show placeholder
          else {
            outputParts.push(`[${trimmed}]`);
          }
        });
        
        // Join with space (Python's default separator)
        output += outputParts.join(' ') + '\n';
      });
      output += '\n';
    }
    
    output += '📝 Note: Python runtime (Pyodide) will be integrated in Phase 1.\n';
    output += 'For now, this is a simulated preview.\n\n';
    output += 'Your code is syntactically correct and ready to run! ✨';
    
    return output;
  }

  /**
   * Split print() arguments by comma, respecting quotes
   * Handles: print("Name:", name) -> ["Name:", "name"]
   */
  splitPrintArguments(content) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      // Handle quotes
      if ((char === '"' || char === "'") && (i === 0 || content[i-1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = '';
        }
        current += char;
      }
      // Handle comma outside quotes
      else if (char === ',' && !inQuotes) {
        if (current.trim()) {
          parts.push(current.trim());
        }
        current = '';
      }
      // Regular character
      else {
        current += char;
      }
    }
    
    // Add last part
    if (current.trim()) {
      parts.push(current.trim());
    }
    
    return parts;
  }

  /**
   * Parse variable assignments from code
   * Returns an object mapping variable names to their values
   */
  parseVariables(code) {
    const variables = {};
    const lines = code.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      // Match simple variable assignments: name = value
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const value = assignMatch[2].trim();
        
        // Parse the value
        variables[varName] = this.parseValue(value);
      }
    }
    
    return variables;
  }

  /**
   * Parse a value from Python code
   * Handles strings, numbers, booleans
   */
  parseValue(value) {
    // String literal (single or double quotes)
    if (value.match(/^['"](.*)['"]$/)) {
      return value.match(/^['"](.*)['"]$/)[1];
    }
    
    // Boolean
    if (value === 'True') return 'True';
    if (value === 'False') return 'False';
    
    // Number (int or float)
    if (!isNaN(value)) {
      return value;
    }
    
    // Default: return as-is
    return value;
  }

  /**
   * Validate basic Python syntax and provide beginner-friendly error messages
   * @param {string} code - The Python code to validate
   * @returns {string|null} Error message or null if valid
   */
  validatePythonSyntax(code) {
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;
      
      if (!line || line.startsWith('#')) continue; // Skip empty lines and comments
      
      // Check for common beginner mistakes
      
      // 1. Check for "Python" or "python" at start of line (not in string)
      if (/^(Python|python)\s+/.test(line)) {
        return `❌ Syntax Error on line ${lineNum}:

"${line}"

You don't need to write "Python" or "python" at the beginning.
Just write your code directly.

Try:
${line.replace(/^(Python|python)\s+/, '')}`;
      }
      
      // 2. Check for capitalized Print/Input instead of print/input
      if (/\bPrint\s*\(/.test(line)) {
        return `❌ Syntax Error on line ${lineNum}:

"${line}"

In Python, it's "print" (lowercase), not "Print".
Python is case-sensitive!

Try:
${line.replace(/\bPrint\(/g, 'print(')}`;
      }
      
      if (/\bInput\s*\(/.test(line)) {
        return `❌ Syntax Error on line ${lineNum}:

"${line}"

In Python, it's "input" (lowercase), not "Input".

Try:
${line.replace(/\bInput\(/g, 'input(')}`;
      }
      
      // 3. Check for variable name inconsistency (only if truly inconsistent)
      const varMatch = line.match(/^([A-Z][a-z_A-Z0-9]*)\s*=/);
      if (varMatch) {
        const varName = varMatch[1];
        
        // Skip if it's a common abbreviation or acronym
        if (varName === 'True' || varName === 'False' || varName === 'None') {
          continue;
        }
        
        const lowerVarName = varName.toLowerCase();
        
        // Check if this capitalized variable is used elsewhere in lowercase
        const restOfCode = lines.slice(i + 1).join('\n');
        const lowerUsageRegex = new RegExp(`\\b${lowerVarName}\\b`);
        const upperUsageRegex = new RegExp(`\\b${varName}\\b`);
        
        // Only flag if lowercase version is used AND uppercase version is NOT consistently used
        if (lowerUsageRegex.test(restOfCode) && !upperUsageRegex.test(restOfCode)) {
          return `❌ Variable Name Error on line ${lineNum}:

You created a variable "${varName}" but might be using "${lowerVarName}" later.

In Python, variable names are case-sensitive:
- "${varName}" and "${lowerVarName}" are DIFFERENT variables

Best practice: Use lowercase with underscores
Example: favorite_color, lucky_number

Try changing line ${lineNum} to:
${line.replace(varName, lowerVarName)}`;
        }
      }
      
      // 4. Check for missing quotes in print
      if (/print\s*\(\s*[A-Za-z][A-Za-z0-9_]*\s*\)/.test(line)) {
        // This is actually okay - printing a variable
        continue;
      }
      
      // 5. Check for "python" in middle of code
      if (i > 0 && /\bpython\b/.test(line.toLowerCase()) && !line.includes('"') && !line.includes("'")) {
        return `❌ Syntax Error on line ${lineNum}:

"${line}"

It looks like you have the word "python" in your code.
You don't need to write "python" in your Python code!

Did you mean to:
- Start a new line of code?
- Write a comment? Use # for comments

Try removing "python" from this line.`;
      }
      
      // 6. Check for common spacing issues around =
      if (/\w+\s*=\s*[A-Z][a-z]+/.test(line) && !/["']/.test(line)) {
        const match = line.match(/(\w+)\s*=\s*([A-Z][a-z]+)/);
        if (match && match[2] !== 'True' && match[2] !== 'False') {
          return `❌ Possible Error on line ${lineNum}:

"${line}"

It looks like you're assigning a word that starts with a capital letter.
Did you forget quotes around text?

If "${match[2]}" is meant to be text, add quotes:
${match[1]} = "${match[2]}"

If it's a variable, make sure it's defined first.`;
        }
      }
    }
    
    return null; // No errors found
  }

  /**
   * Display output in the output area
   */
  displayOutput(text) {
    if (this.output) {
      this.output.textContent = text;
      
      // Remove all styling classes first
      this.output.classList.remove('error', 'success');
      
      // Add appropriate styling
      if (text.startsWith('❌')) {
        this.output.classList.add('error');
      } else if (text.startsWith('✅')) {
        this.output.classList.add('success');
      }
    }
  }

  /**
   * Display error in the output area
   */
  displayError(errorMessage) {
    if (this.output) {
      this.output.textContent = `❌ Error:\n${errorMessage}`;
      this.output.classList.add('error');
    }
  }

  /**
   * Clear the code editor
   */
  clearEditor() {
    this.setCode('');
    this.focus();
  }

  /**
   * Clear the output area
   */
  clearOutput() {
    if (this.output) {
      this.output.textContent = 'Output will appear here...';
      this.output.classList.remove('error');
    }
  }

  /**
   * Initialize Monaco Editor (lazy load)
   */
  async initializeMonaco() {
    if (this.monacoEditor || this.monacoLoading) return;
    if (!this.useMonaco) return;
    
    this.monacoLoading = true;
    
    try {
      // Configure Monaco loader
      require.config({ 
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
      });
      
      // Load Monaco
      await new Promise((resolve, reject) => {
        require(['vs/editor/editor.main'], resolve, reject);
      });
      
      // Get current code from textarea
      const currentCode = this.editorElement.value || '# Write your Python code here...\nprint("Hello, Python!")';
      
      // Hide textarea
      this.editorElement.style.display = 'none';
      
      // Create Monaco container
      const container = document.createElement('div');
      container.id = 'monaco-container';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.flex = '1';
      container.style.border = '1px solid var(--color-border)';
      container.style.borderRadius = 'var(--border-radius)';
      this.editorElement.parentNode.insertBefore(container, this.editorElement);
      
      // Create Monaco editor with aggressive autocomplete
      this.monacoEditor = monaco.editor.create(container, {
        value: currentCode,
        language: 'python',
        theme: 'vs-dark',
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        // Aggressive autocomplete configuration
        quickSuggestions: {
          other: 'on',      // Changed from true to 'on' for more aggressive
          comments: 'off',
          strings: 'off'
        },
        quickSuggestionsDelay: 0,  // No delay - instant suggestions
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        wordBasedSuggestions: 'allDocuments',
        // Enhanced suggest widget configuration
        suggest: {
          showWords: true,
          showKeywords: true,
          showSnippets: true,
          snippetsPreventQuickSuggestions: false,
          localityBonus: true,
          shareSuggestSelections: true,
          showIcons: true,
          maxVisibleSuggestions: 12,
          insertMode: 'insert',
          filterGraceful: true
        },
        // Language-specific settings
        'semanticHighlighting.enabled': true
      });
      
      // Register Python keywords and built-in functions as completion items
      monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: (model, position) => {
          // Python keywords and common built-ins
          const pythonKeywords = [
            'print', 'input', 'def', 'return', 'if', 'elif', 'else',
            'for', 'while', 'break', 'continue', 'pass', 'import', 'from',
            'class', 'try', 'except', 'finally', 'with', 'as', 'in',
            'is', 'and', 'or', 'not', 'True', 'False', 'None',
            'len', 'range', 'str', 'int', 'float', 'list', 'dict',
            'set', 'tuple', 'sum', 'min', 'max', 'abs', 'round',
            'open', 'type', 'isinstance', 'enumerate', 'zip'
          ];
          
          const suggestions = pythonKeywords.map(keyword => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            detail: 'Python keyword/built-in',
            sortText: '0' + keyword  // Sort to top
          }));
          
          return { suggestions };
        }
      });
      
      // Add keyboard shortcuts
      this.monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        this.runCode();
      });
      
      // Add Ctrl+Space to manually trigger autocomplete
      this.monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
        this.monacoEditor.trigger('keyboard', 'editor.action.triggerSuggest', {});
      });
      
      this.monacoLoading = false;
      console.log('✅ Monaco Editor loaded with Python keywords');
      console.log('💡 Autocomplete: Type "pr" → see "print" | Press Ctrl+Space for manual trigger');
      
    } catch (error) {
      console.error('Failed to load Monaco Editor:', error);
      this.useMonaco = false;
      this.monacoLoading = false;
      // Fall back to textarea
      this.editorElement.style.display = 'block';
    }
  }

  /**
   * Initialize Monaco if needed (called when Practice tab opened)
   */
  async initializeIfNeeded() {
    if (!this.monacoEditor && !this.monacoLoading && this.useMonaco) {
      await this.initializeMonaco();
    }
    this.focus();
  }

  /**
   * Focus the editor
   */
  focus() {
    if (this.monacoEditor) {
      this.monacoEditor.focus();
    } else if (this.editorElement) {
      this.editorElement.focus();
    }
  }

  /**
   * Set editor content
   */
  setCode(code) {
    if (this.monacoEditor) {
      this.monacoEditor.setValue(code);
    } else if (this.editorElement) {
      this.editorElement.value = code;
    }
  }

  /**
   * Get editor content
   */
  getCode() {
    if (this.monacoEditor) {
      return this.monacoEditor.getValue();
    }
    return this.editorElement ? this.editorElement.value : '';
  }

  /**
   * Setup independent resize handles for editor and output
   */
  setupResizableDivider() {
    setTimeout(() => {
      this.setupEditorResize();
      this.setupOutputResize();
    }, 100);
  }

  /**
   * Setup editor resize handle (independent)
   */
  setupEditorResize() {
    const handle = document.getElementById('editor-resize-handle');
    const container = document.getElementById('editor-container');
    
    if (!handle || !container) {
      console.warn('Editor resize not found');
      return;
    }
    
    console.log('✅ Editor resize handle attached');
    
    const self = this;
    
    handle.onmousedown = (e) => {
      let isResizing = true;
      const startY = e.clientY;
      const startHeight = container.offsetHeight;
      
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      
      const onMove = (e) => {
        if (!isResizing) return;
        
        const diff = e.clientY - startY;
        const newHeight = startHeight + diff;
        
        // Min 200px, NO MAX (unlimited)
        if (newHeight >= 200) {
          container.style.height = newHeight + 'px';
          
          if (self.monacoEditor) {
            self.monacoEditor.layout();
          }
        }
      };
      
      const onUp = () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        
        if (self.monacoEditor) {
          self.monacoEditor.layout();
        }
      };
      
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    };
  }

  /**
   * Setup output resize handle (independent)
   */
  setupOutputResize() {
    const handle = document.getElementById('output-resize-handle');
    const container = document.getElementById('output-container');
    
    if (!handle || !container) {
      console.warn('Output resize not found');
      return;
    }
    
    console.log('✅ Output resize handle attached');
    
    handle.onmousedown = (e) => {
      let isResizing = true;
      const startY = e.clientY;
      const startHeight = container.offsetHeight;
      
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      
      const onMove = (e) => {
        if (!isResizing) return;
        
        const diff = e.clientY - startY;
        const newHeight = startHeight + diff;
        
        // Min 150px, NO MAX (unlimited)
        if (newHeight >= 150) {
          container.style.height = newHeight + 'px';
        }
      };
      
      const onUp = () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    };
  }
}

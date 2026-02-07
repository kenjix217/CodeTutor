/**
 * Launchpad
 * Generates Starter Kit ZIP for Learners
 */

export class Launchpad {
    async generateStarterKit() {
        if (!window.JSZip) {
            await this.loadJSZip();
        }

        const zip = new JSZip();
        
        // 1. Cheatsheet
        zip.file("Python_Cheatsheet.txt", `PYTHON CHEATSHEET
=================
PRINTING
print("Hello")

VARIABLES
name = "Alice"
age = 25

LOOPS
for i in range(5):
    print(i)

CONDITIONS
if age > 18:
    print("Adult")
`);

        // 2. Setup Scripts
        zip.file("setup_windows.bat", `@echo off
echo Installing Python...
start https://www.python.org/downloads/
echo Installing VS Code...
start https://code.visualstudio.com/
pause`);

        zip.file("setup_mac.sh", `#!/bin/bash
echo "Opening Python download..."
open https://www.python.org/downloads/
`);

        // 3. Projects Folder
        const projects = zip.folder("my_projects");
        projects.file("hello.py", `print("Welcome to your first local Python program!")`);
        
        // Generate
        const content = await zip.generateAsync({type:"blob"});
        
        // Trigger Download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Python_Starter_Kit.zip";
        link.click();
    }

    async loadJSZip() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

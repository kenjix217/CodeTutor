/**
 * Tooltip Provider
 * Adds context-aware definitions to Monaco Editor hover
 */

export class TooltipProvider {
    constructor() {
        this.definitions = {
            'def': '🔑 Defines a new function. The code inside won\'t run until you call it.',
            'return': '🔙 Exits the function and passes a value back to where it was called.',
            'print': '🖨️ Displays text or variables to the output screen.',
            'import': '📦 Loads external code modules so you can use their features.',
            'for': '🔄 Starts a loop to repeat code for each item in a sequence.',
            'while': '🔄 Repeats code as long as a condition is True.',
            'if': '❓ Checks a condition. If True, runs the indented code block.',
            'else': '❓ Runs this code if the "if" condition was False.',
            'range': '🔢 Generates a sequence of numbers (e.g., 0, 1, 2, 3, 4).',
            'len': '📏 Returns the length (number of items) of a list or string.'
        };
    }

    register(monaco) {
        monaco.languages.registerHoverProvider('python', {
            provideHover: (model, position) => {
                const word = model.getWordAtPosition(position);
                if (!word) return null;

                const definition = this.definitions[word.word];
                if (definition) {
                    return {
                        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                        contents: [
                            { value: `**Python Keyword: ${word.word}**` },
                            { value: definition }
                        ]
                    };
                }
                return null;
            }
        });
    }
}

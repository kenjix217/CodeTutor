/**
 * Homework Validator Module
 * Handles automated homework checking and validation
 */

export class HomeworkValidator {
  constructor() {
    this.testCases = this.loadTestCases();
  }

  /**
   * Load test cases for all homework assignments
   * Following AI_TUTOR_RULES.md - validate logic, not just output
   */
  loadTestCases() {
    return {
      'lesson-01': {
        title: 'Display Three Sentences',
        description: 'Display exactly three lines about yourself',
        testCases: [
          {
            name: 'Uses print() function',
            check: (code) => {
              const printCount = (code.match(/print\(/g) || []).length;
              return {
                pass: printCount >= 3,
                message: printCount >= 3 
                  ? '✅ Uses print() statements' 
                  : `❌ Expected at least 3 print() statements, found ${printCount}`
              };
            }
          },
          {
            name: 'Has three separate statements',
            check: (code) => {
              const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
              return {
                pass: lines.length >= 3,
                message: lines.length >= 3
                  ? '✅ Has multiple statements'
                  : `❌ Expected at least 3 lines of code, found ${lines.length}`
              };
            }
          }
        ]
      },

      'lesson-02': {
        title: 'Five Variables About Yourself',
        description: 'Create at least 5 variables and print them',
        testCases: [
          {
            name: 'Creates at least 5 variables',
            check: (code) => {
              const assignments = (code.match(/\w+\s*=/g) || []).length;
              return {
                pass: assignments >= 5,
                message: assignments >= 5
                  ? '✅ Creates 5 or more variables'
                  : `❌ Expected at least 5 variables, found ${assignments}`
              };
            }
          },
          {
            name: 'Prints variables with labels',
            check: (code) => {
              const printCount = (code.match(/print\(/g) || []).length;
              return {
                pass: printCount >= 5,
                message: printCount >= 5
                  ? '✅ Prints all variables'
                  : `❌ Expected to print all 5 variables`
              };
            }
          }
        ]
      },

      'lesson-03': {
        title: 'Three Questions Program',
        description: 'Ask three questions and display summary',
        testCases: [
          {
            name: 'Uses input() function',
            check: (code) => {
              const inputCount = (code.match(/input\(/g) || []).length;
              return {
                pass: inputCount >= 3,
                message: inputCount >= 3
                  ? '✅ Asks at least 3 questions'
                  : `❌ Expected 3 input() statements, found ${inputCount}`
              };
            }
          },
          {
            name: 'Stores answers in variables',
            check: (code) => {
              const varWithInput = (code.match(/\w+\s*=\s*input\(/g) || []).length;
              return {
                pass: varWithInput >= 3,
                message: varWithInput >= 3
                  ? '✅ Stores answers in variables'
                  : `❌ Expected to store 3 answers, found ${varWithInput}`
              };
            }
          },
          {
            name: 'Displays a summary',
            check: (code) => {
              // Check for print with concatenation or f-string
              const hasSummary = code.includes('print') && (code.includes('+') || code.includes('f"') || code.includes("f'"));
              return {
                pass: hasSummary,
                message: hasSummary
                  ? '✅ Displays summary combining answers'
                  : '💡 Remember to combine the answers in your output'
              };
            }
          }
        ]
      },

      'lesson-04': {
        title: 'Movie Age Restriction',
        description: 'Check age and permission for movie viewing',
        testCases: [
          {
            name: 'Gets user age',
            check: (code) => {
              const hasAgeInput = /age.*=.*int\(input\(/i.test(code);
              return {
                pass: hasAgeInput,
                message: hasAgeInput
                  ? '✅ Gets age from user'
                  : '💡 Remember to get age using input() and convert to int()'
              };
            }
          },
          {
            name: 'Checks permission',
            check: (code) => {
              const hasPermission = /permission|allowed|permit/i.test(code);
              return {
                pass: hasPermission,
                message: hasPermission
                  ? '✅ Checks for parental permission'
                  : '💡 Don\'t forget to check parental permission'
              };
            }
          },
          {
            name: 'Uses if/elif/else',
            check: (code) => {
              const hasIf = code.includes('if');
              const hasElse = code.includes('else');
              return {
                pass: hasIf && hasElse,
                message: hasIf && hasElse
                  ? '✅ Uses conditional logic'
                  : '💡 Use if/elif/else to check conditions'
              };
            }
          },
          {
            name: 'Uses and operator',
            check: (code) => {
              const hasAnd = code.includes(' and ');
              return {
                pass: hasAnd,
                message: hasAnd
                  ? '✅ Combines conditions with and'
                  : '💡 Use "and" to check age AND permission together'
              };
            }
          }
        ]
      },

      'lesson-05': {
        title: 'Sum of Numbers 1 to 100',
        description: 'Calculate sum using a loop',
        testCases: [
          {
            name: 'Uses a loop',
            check: (code) => {
              const hasFor = code.includes('for');
              const hasWhile = code.includes('while');
              return {
                pass: hasFor || hasWhile,
                message: hasFor || hasWhile
                  ? '✅ Uses a loop (for or while)'
                  : '❌ Must use a loop (for or while) to solve this'
              };
            }
          },
          {
            name: 'Uses range() correctly',
            check: (code) => {
              const hasRange = code.includes('range(');
              const hasCorrectRange = /range\(1,\s*101\)/.test(code);
              return {
                pass: hasRange,
                message: hasCorrectRange
                  ? '✅ Uses range(1, 101) correctly'
                  : hasRange
                    ? '💡 Make sure range goes from 1 to 100 (range(1, 101))'
                    : '💡 Use range() to generate numbers'
              };
            }
          },
          {
            name: 'Accumulates total',
            check: (code) => {
              const hasTotal = /total|sum/i.test(code);
              const hasAddition = code.includes('+') || code.includes('+=');
              return {
                pass: hasTotal && hasAddition,
                message: hasTotal && hasAddition
                  ? '✅ Accumulates running total'
                  : '💡 Create a variable to store the running total and add to it in the loop'
              };
            }
          }
        ]
      },

      'lesson-06': {
        title: 'Rectangle Area Calculator',
        description: 'Create function to calculate rectangle areas',
        testCases: [
          {
            name: 'Defines a function',
            check: (code) => {
              const hasDef = code.includes('def ');
              const hasRectangleArea = /def\s+rectangle_area/i.test(code);
              return {
                pass: hasDef && hasRectangleArea,
                message: hasRectangleArea
                  ? '✅ Defines rectangle_area function'
                  : hasDef
                    ? '💡 Make sure function is named rectangle_area'
                    : '❌ Must define a function using def'
              };
            }
          },
          {
            name: 'Function takes two parameters',
            check: (code) => {
              const hasParams = /def\s+rectangle_area\s*\(\s*\w+\s*,\s*\w+\s*\)/i.test(code);
              return {
                pass: hasParams,
                message: hasParams
                  ? '✅ Function takes two parameters (width, height)'
                  : '💡 Function should take two parameters: width and height'
              };
            }
          },
          {
            name: 'Function returns a value',
            check: (code) => {
              const hasReturn = code.includes('return');
              return {
                pass: hasReturn,
                message: hasReturn
                  ? '✅ Function returns the calculated area'
                  : '💡 Use return to send back the calculated area'
              };
            }
          },
          {
            name: 'Calls function multiple times',
            check: (code) => {
              const functionCalls = (code.match(/rectangle_area\s*\(/gi) || []).length;
              // Subtract 1 for the def statement
              const actualCalls = functionCalls - 1;
              return {
                pass: actualCalls >= 3,
                message: actualCalls >= 3
                  ? '✅ Calls function at least 3 times'
                  : `💡 Call the function at least 3 times (found ${actualCalls} calls)`
              };
            }
          }
        ]
      },

      'lesson-07': {
        title: 'Contact List Manager',
        description: 'Create list of dictionaries for contacts',
        testCases: [
          {
            name: 'Creates a list',
            check: (code) => {
              const hasList = code.includes('[');
              const hasContacts = /contacts|people|list/i.test(code);
              return {
                pass: hasList && hasContacts,
                message: hasList
                  ? '✅ Creates a list'
                  : '💡 Use square brackets [] to create a list'
              };
            }
          },
          {
            name: 'List contains dictionaries',
            check: (code) => {
              const hasDictInList = /\[\s*\{/.test(code) || /\{\s*["']name["']/.test(code);
              return {
                pass: hasDictInList,
                message: hasDictInList
                  ? '✅ List contains dictionaries'
                  : '💡 Each contact should be a dictionary with curly braces {}'
              };
            }
          },
          {
            name: 'Defines a function',
            check: (code) => {
              const hasDef = code.includes('def ');
              const hasPrintFunction = /def\s+print_contacts|def\s+display|def\s+show/i.test(code);
              return {
                pass: hasDef,
                message: hasPrintFunction
                  ? '✅ Defines a function to print contacts'
                  : hasDef
                    ? '✅ Defines a function'
                    : '💡 Create a function to print the contacts'
              };
            }
          },
          {
            name: 'Loops through the list',
            check: (code) => {
              const hasFor = code.includes('for ');
              return {
                pass: hasFor,
                message: hasFor
                  ? '✅ Uses a loop to go through contacts'
                  : '💡 Use a for loop to go through each contact in the list'
              };
            }
          }
        ]
      },

      'lesson-08': {
        title: 'Task List File System',
        description: 'Save and load tasks from a file',
        testCases: [
          {
            name: 'Creates a list of tasks',
            check: (code) => {
              const hasList = /tasks?\s*=\s*\[/.test(code);
              return {
                pass: hasList,
                message: hasList
                  ? '✅ Creates a list of tasks'
                  : '💡 Create a list to store your tasks'
              };
            }
          },
          {
            name: 'Writes to a file',
            check: (code) => {
              const hasWrite = /open\(.+,\s*["']w["']\)|\.write\(/.test(code);
              return {
                pass: hasWrite,
                message: hasWrite
                  ? '✅ Writes tasks to a file'
                  : '💡 Use open() with mode "w" to write to a file'
              };
            }
          },
          {
            name: 'Reads from a file',
            check: (code) => {
              const hasRead = /open\(.+,\s*["']r["']\)|\.read\(/.test(code);
              return {
                pass: hasRead,
                message: hasRead
                  ? '✅ Reads tasks from a file'
                  : '💡 Use open() with mode "r" to read from a file'
              };
            }
          },
          {
            name: 'Uses with statement',
            check: (code) => {
              const hasWith = code.includes('with ');
              return {
                pass: hasWith,
                message: hasWith
                  ? '✅ Uses with statement (recommended)'
                  : '💡 Use "with" statement for safer file handling'
              };
            }
          }
        ]
      },

      'lesson-09': {
        title: 'Safe Calculator',
        description: 'Calculator with error handling',
        testCases: [
          {
            name: 'Uses try-except block',
            check: (code) => {
              const hasTry = code.includes('try');
              const hasExcept = code.includes('except');
              return {
                pass: hasTry && hasExcept,
                message: hasTry && hasExcept
                  ? '✅ Uses try-except for error handling'
                  : '💡 Use try-except blocks to handle errors'
              };
            }
          },
          {
            name: 'Handles ValueError',
            check: (code) => {
              const hasValueError = /except\s+ValueError/.test(code);
              return {
                pass: hasValueError,
                message: hasValueError
                  ? '✅ Handles ValueError (invalid input)'
                  : '💡 Add except ValueError to handle invalid number input'
              };
            }
          },
          {
            name: 'Handles ZeroDivisionError',
            check: (code) => {
              const hasZeroError = /except\s+ZeroDivisionError/.test(code);
              return {
                pass: hasZeroError,
                message: hasZeroError
                  ? '✅ Handles ZeroDivisionError (divide by zero)'
                  : '💡 Add except ZeroDivisionError to handle division by zero'
              };
            }
          },
          {
            name: 'Performs calculation',
            check: (code) => {
              const hasOperation = /[+\-*/]/.test(code) && /operation|operator|op/.test(code);
              return {
                pass: hasOperation,
                message: hasOperation
                  ? '✅ Performs arithmetic operations'
                  : '💡 Don\'t forget to perform the calculation based on the operation'
              };
            }
          }
        ]
      },

      'lesson-10': {
        title: 'Book Library System',
        description: 'Create Book class and library list',
        testCases: [
          {
            name: 'Defines a class',
            check: (code) => {
              const hasClass = code.includes('class ');
              const hasBookClass = /class\s+Book/.test(code);
              return {
                pass: hasClass && hasBookClass,
                message: hasBookClass
                  ? '✅ Defines Book class'
                  : hasClass
                    ? '💡 Make sure the class is named Book'
                    : '❌ Must define a class using class keyword'
              };
            }
          },
          {
            name: 'Has __init__ method',
            check: (code) => {
              const hasInit = /__init__/.test(code);
              return {
                pass: hasInit,
                message: hasInit
                  ? '✅ Has __init__ method for initialization'
                  : '💡 Add __init__ method to initialize book attributes'
              };
            }
          },
          {
            name: 'Creates multiple objects',
            check: (code) => {
              const bookCreations = (code.match(/Book\s*\(/g) || []).length;
              return {
                pass: bookCreations >= 3,
                message: bookCreations >= 3
                  ? '✅ Creates at least 3 Book objects'
                  : `💡 Create at least 3 Book objects (found ${bookCreations})`
              };
            }
          },
          {
            name: 'Stores books in a list',
            check: (code) => {
              const hasList = /library|books\s*=\s*\[/.test(code);
              return {
                pass: hasList,
                message: hasList
                  ? '✅ Stores books in a list'
                  : '💡 Create a list to store the Book objects'
              };
            }
          },
          {
            name: 'Calculates total pages',
            check: (code) => {
              const hasTotal = /total.*pages|sum.*pages/i.test(code);
              const hasLoop = code.includes('for ');
              return {
                pass: hasTotal && hasLoop,
                message: hasTotal && hasLoop
                  ? '✅ Calculates total pages across all books'
                  : '💡 Loop through books and sum their pages'
              };
            }
          }
        ]
      },

      'lesson-11': {
        title: 'Sales Data Analyzer',
        description: 'Use json library to analyze sales data',
        testCases: [
          {
            name: 'Imports json library',
            check: (code) => {
              const hasImport = /import json|from json import/.test(code);
              return {
                pass: hasImport,
                message: hasImport
                  ? '✅ Imports json library'
                  : '💡 Import the json library to work with JSON data'
              };
            }
          },
          {
            name: 'Creates data structure',
            check: (code) => {
              const hasData = /sales.*data|data.*=.*\[/.test(code);
              return {
                pass: hasData,
                message: hasData
                  ? '✅ Creates sales data structure'
                  : '💡 Create a list of dictionaries for sales data'
              };
            }
          },
          {
            name: 'Uses json.dumps',
            check: (code) => {
              const hasJsonDumps = /json\.dumps/.test(code);
              return {
                pass: hasJsonDumps,
                message: hasJsonDumps
                  ? '✅ Converts to JSON with json.dumps'
                  : '💡 Use json.dumps() to convert data to JSON string'
              };
            }
          },
          {
            name: 'Performs calculations',
            check: (code) => {
              const hasCalc = /sum\(|total|average|max\(/i.test(code);
              return {
                pass: hasCalc,
                message: hasCalc
                  ? '✅ Calculates statistics from data'
                  : '💡 Calculate total sales, averages, or find best month'
              };
            }
          }
        ]
      },

      'lesson-12': {
        title: 'Currency Data Analyzer',
        description: 'Simulate API response and currency conversion',
        testCases: [
          {
            name: 'Imports json library',
            check: (code) => {
              const hasImport = /import json/.test(code);
              return {
                pass: hasImport,
                message: hasImport
                  ? '✅ Imports json library'
                  : '💡 Import json to work with API data'
              };
            }
          },
          {
            name: 'Creates exchange rate data',
            check: (code) => {
              const hasRates = /rates|exchange/i.test(code);
              return {
                pass: hasRates,
                message: hasRates
                  ? '✅ Creates exchange rate data'
                  : '💡 Create a dictionary with currency exchange rates'
              };
            }
          },
          {
            name: 'Defines conversion function',
            check: (code) => {
              const hasFunction = /def\s+convert/.test(code);
              return {
                pass: hasFunction,
                message: hasFunction
                  ? '✅ Defines currency conversion function'
                  : '💡 Create a function to convert currencies'
              };
            }
          },
          {
            name: 'Performs multiple conversions',
            check: (code) => {
              const functionCalls = (code.match(/convert\w*\(/g) || []).length;
              return {
                pass: functionCalls >= 3,
                message: functionCalls >= 3
                  ? '✅ Performs at least 3 currency conversions'
                  : `💡 Convert $100 to at least 3 currencies (found ${functionCalls - 1} calls)`
              };
            }
          }
        ]
      },

      'lesson-13': {
        title: 'Sales Report Generator',
        description: 'Process CSV sales data',
        testCases: [
          {
            name: 'Imports csv library',
            check: (code) => {
              const hasImport = /import csv/.test(code);
              return {
                pass: hasImport,
                message: hasImport
                  ? '✅ Imports csv library'
                  : '💡 Import the csv library'
              };
            }
          },
          {
            name: 'Creates CSV data',
            check: (code) => {
              const hasData = /sales.*data|transactions/.test(code);
              const hasRows = (code.match(/\[.*,.*,.*\]/g) || []).length >= 5;
              return {
                pass: hasData && hasRows,
                message: hasData && hasRows
                  ? '✅ Creates sales data (10+ transactions)'
                  : '💡 Create at least 10 sales transactions'
              };
            }
          },
          {
            name: 'Writes to CSV file',
            check: (code) => {
              const hasWrite = /csv\.writer|writerows?/.test(code);
              return {
                pass: hasWrite,
                message: hasWrite
                  ? '✅ Writes data to CSV file'
                  : '💡 Use csv.writer to write data to file'
              };
            }
          },
          {
            name: 'Reads and analyzes CSV',
            check: (code) => {
              const hasRead = /csv\.reader|csv\.DictReader/.test(code);
              const hasAnalysis = /total|sum|average|max|best/i.test(code);
              return {
                pass: hasRead && hasAnalysis,
                message: hasRead && hasAnalysis
                  ? '✅ Reads CSV and calculates statistics'
                  : '💡 Read the CSV file and calculate summary statistics'
              };
            }
          }
        ]
      }
    };
  }

  /**
   * Validate homework for a specific lesson
   * @param {string} lessonId - The lesson identifier
   * @param {string} code - Student's code
   * @returns {object} Validation results
   */
  validateHomework(lessonId, code) {
    const homework = this.testCases[lessonId];
    
    if (!homework) {
      return {
        valid: false,
        message: 'No homework validation available for this lesson yet.',
        results: []
      };
    }

    // Run all test cases
    const results = homework.testCases.map(test => {
      const result = test.check(code);
      return {
        name: test.name,
        pass: result.pass,
        message: result.message
      };
    });

    // Calculate overall pass
    const passedTests = results.filter(r => r.pass).length;
    const totalTests = results.length;
    const allPassed = passedTests === totalTests;

    return {
      valid: allPassed,
      title: homework.title,
      description: homework.description,
      passedTests,
      totalTests,
      percentage: Math.round((passedTests / totalTests) * 100),
      results,
      message: allPassed
        ? '🎉 Great work! Your homework passes all checks!'
        : `📝 ${passedTests}/${totalTests} checks passed. Review the feedback below.`
    };
  }

  /**
   * Format validation results for display
   * @param {object} validation - Validation results
   * @returns {string} Formatted HTML
   */
  formatResults(validation) {
    let html = `<div class="homework-results">`;
    
    html += `<h3>${validation.title}</h3>`;
    html += `<p>${validation.description}</p>`;
    html += `<div class="results-summary ${validation.valid ? 'success' : 'partial'}">`;
    html += `<strong>${validation.message}</strong><br>`;
    html += `Progress: ${validation.passedTests}/${validation.totalTests} (${validation.percentage}%)`;
    html += `</div>`;
    
    html += `<ul class="test-results">`;
    validation.results.forEach(result => {
      html += `<li class="${result.pass ? 'pass' : 'hint'}">`;
      html += `<strong>${result.name}:</strong> ${result.message}`;
      html += `</li>`;
    });
    html += `</ul>`;
    
    if (!validation.valid) {
      html += `<p class="encouragement">💪 You're close! Review the hints above and try again.</p>`;
    } else {
      html += `<p class="success-message">✨ Excellent work! You've mastered this concept. Ready for the next lesson!</p>`;
    }
    
    html += `</div>`;
    
    return html;
  }

  /**
   * Quick validation - just check basics
   * @param {string} lessonId - The lesson identifier  
   * @param {string} code - Student's code
   * @returns {boolean} True if basic requirements met
   */
  quickValidate(lessonId, code) {
    const validation = this.validateHomework(lessonId, code);
    return validation.valid;
  }
}


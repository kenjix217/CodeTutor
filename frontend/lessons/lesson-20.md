# Testing and Code Quality

## Goal

Learn to write tests for your code and ensure quality through testing practices.

## Explanation

**Testing** means writing code that checks if your code works correctly. Professional developers write tests for everything.

**Why test?**
- Catch bugs before users do
- Confidence when changing code
- Documentation (tests show how code should work)
- Professional standard

**Types of tests:**
- **Unit tests:** Test individual functions
- **Integration tests:** Test multiple parts together
- **End-to-end tests:** Test complete workflows

**Python's unittest:**

```python
import unittest

def add(a, b):
    return a + b

class TestMath(unittest.TestCase):
    def test_add_positive(self):
        self.assertEqual(add(2, 3), 5)
    
    def test_add_negative(self):
        self.assertEqual(add(-1, 1), 0)

if __name__ == '__main__':
    unittest.main()
```

## Example

Testing a calculator class:

```python
import unittest

class Calculator:
    def add(self, a, b):
        return a + b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()
    
    def test_add(self):
        self.assertEqual(self.calc.add(5, 3), 8)
    
    def test_divide(self):
        self.assertEqual(self.calc.divide(10, 2), 5)
    
    def test_divide_by_zero(self):
        with self.assertRaises(ValueError):
            self.calc.divide(10, 0)
```

## Homework

Write tests for your previous homework assignments:
- Test rectangle_area function (Lesson 6)
- Test data validation function
- Test at least 5 different scenarios
- All tests should pass

## Reflection

1. What is unit testing?
2. Why write tests?
3. What does assertEqual do?
4. When should you write tests?
5. What is test-driven development?

**Excellent!** Testing is professional programming!





# Automation and Scripting

## Goal

Learn to automate repetitive tasks using Python scripts.

## Explanation

**Automation** means making the computer do repetitive work for you. Instead of manually copying files, renaming documents, or processing data, you write a script once and run it anytime.

**Common automation tasks:**
- File organization (sort downloads folder)
- Data processing (convert formats)
- Report generation (daily/weekly reports)
- Backup systems
- Email sending
- Web scraping (extract data from websites)

## Example

File organizer script:

```python
import os
from pathlib import Path
import shutil

def organize_files(directory):
    """Organize files by extension"""
    path = Path(directory)
    
    # Get all files
    files = [f for f in path.iterdir() if f.is_file()]
    
    for file in files:
        # Get extension
        ext = file.suffix[1:]  # Remove dot
        if not ext:
            continue
        
        # Create folder for extension
        folder = path / ext
        folder.mkdir(exist_ok=True)
        
        # Move file
        shutil.move(str(file), str(folder / file.name))
        print(f"Moved {file.name} to {ext}/")

# organize_files('/path/to/downloads')
```

## Guided Practice

```python
from datetime import datetime
import json

# Automated report generator
def generate_report(data):
    report = {
        "generated_at": datetime.now().isoformat(),
        "total_items": len(data),
        "summary": data
    }
    
    with open(f"report_{datetime.now().strftime('%Y%m%d')}.json", 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"Report generated: {len(data)} items")

# Test
generate_report([{"item": "test", "value": 100}])
```

## Homework

Build an **automated file backup script**:
- List all files in a directory
- Create backup folder with timestamp
- Copy files to backup
- Generate log file with backup details
- Print summary (files backed up, total size)

## Reflection

1. What is automation?
2. What tasks are good candidates for automation?
3. How do you work with file system in Python?
4. What libraries help with automation?
5. Why automate instead of doing manually?

**Fantastic!** Automation saves time and prevents errors!





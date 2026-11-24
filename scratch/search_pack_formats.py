import os, re

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.next', '.git']):
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx', '.json')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
                content = fh.read()
                if 'retailSizes' in content or 'Retail Packaging Formats' in content:
                    print(path)

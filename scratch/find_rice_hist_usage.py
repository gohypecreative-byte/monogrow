import os

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.next', '.git']):
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
                if 'RiceHistorySection' in fh.read():
                    print(path)

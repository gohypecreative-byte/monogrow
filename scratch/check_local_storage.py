import os

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.next', '.git']):
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                c = fh.read()
                if 'localStorage' in c:
                    print('localStorage found in:', p)

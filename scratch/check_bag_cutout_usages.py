import os

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.next', '.git']):
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx', '.json')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                c = fh.read()
                for item in ['cashews-bag-cutout', 'almonds-bag-cutout', 'walnuts-bag-cutout', 'pistachios-bag-cutout', 'raisins-bag-cutout']:
                    if item in c:
                        print(f"Found {item} in {p}")

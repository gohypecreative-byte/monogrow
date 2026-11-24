import os

for root, dirs, files in os.walk('app'):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                c = fh.read()
                if 'getProductsByCategory' in c or 'dry-fruits' in c or 'dryfruits' in c:
                    print('Route with dry fruits:', p)

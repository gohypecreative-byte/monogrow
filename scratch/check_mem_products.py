import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    adminStore = json.load(f)

for p in adminStore['products']:
    if p.get('categoryKey') == 'dry-fruits':
        print(p['id'], p['name'], p['packImg'])

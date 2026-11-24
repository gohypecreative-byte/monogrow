import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for p in d['products']:
    if p.get('categoryKey') == 'dry-fruits':
        print(f"Product: {p['id']} -> {p['name']}")
        print(f"  packImg: {p['packImg']}")

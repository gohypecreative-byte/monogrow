import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data['products']:
    if p.get('id') == 'basmati-rice':
        print(json.dumps(p, indent=2))
        break

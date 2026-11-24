import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data['products']:
    if p.get('categoryKey') == 'dry-fruits':
        print(f"ID: {p['id']}, Name: {p['name']}")
        print(f"  packImg: {p.get('packImg')}")
        print(f"  bowlImg: {p.get('bowlImg')}")
        print(f"  packAlt: {p.get('packAlt')}")

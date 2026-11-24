import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("=== Rice products in admin-store.json ===")
for p in d['products']:
    if p.get('categoryKey') == 'rice':
        print(f"ID: {p['id']} | Name: {p['name']} | PackImg: {p['packImg']}")

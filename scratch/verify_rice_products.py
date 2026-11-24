import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    admin_store = json.load(f)

rice_in_admin = [p for p in admin_store['products'] if p['categoryKey'] == 'rice']
print('Rice products count in admin-store:', len(rice_in_admin))
for p in rice_in_admin:
    print(f"ID: {p['id']} | Name: {p['name']} | PackImg: {p['packImg']}")

import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for p in d['products']:
    if p.get('categoryKey') == 'dry-fruits':
        print('=== ' + p['id'] + ' ===')
        print('Name:', p['name'])
        print('Tagline:', p.get('tagline'))
        print('packImg:', p.get('packImg'))
        print('packAlt:', p.get('packAlt'))
        print('retailSizes:', [v['weight'] for v in p.get('variations', []) if not v.get('bulk', False)])
        print('bulkSizes:', [v['weight'] for v in p.get('variations', []) if v.get('bulk', False)])

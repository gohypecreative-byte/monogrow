import json
import re
import datetime

# 1. Update data/admin-store.json
with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    admin_data = json.load(f)

img_map = {
    "royal-mixed-dryfruits": "/assets/monagrow-mix-dryfruits-packaging-v2.png",
    "royal-cashews": "/assets/monagrow-cashews-pouch-v2.png",
    "california-almonds": "/assets/monagrow-almonds-pouch-v2.png",
    "kashmiri-walnuts": "/assets/monagrow-walnuts-pouch-v2.png",
    "roasted-pistachios": "/assets/monagrow-pistachios-pouch-v2.png",
    "golden-raisins": "/assets/monagrow-raisins-pouch-v2.png",
}

for p in admin_data.get('products', []):
    if p.get('id') in img_map:
        old = p.get('packImg')
        p['packImg'] = img_map[p['id']]
        print(f"admin-store: updated {p['id']} packImg from {old} -> {p['packImg']}")

admin_data['updatedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()

with open('data/admin-store.json', 'w', encoding='utf-8') as f:
    json.dump(admin_data, f, indent=2, ensure_ascii=False)

print("Saved data/admin-store.json")

# 2. Update data/commodityData.ts
with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    commodity_code = f.read()

# Replace packImg for each in commodityData
replacements = [
    ('/assets/monagrow-mix-dryfruits-packaging.png', '/assets/monagrow-mix-dryfruits-packaging-v2.png'),
    ('/assets/monagrow-cashews-pouch-new.png', '/assets/monagrow-cashews-pouch-v2.png'),
    ('/assets/monagrow-almonds-pouch-new.png', '/assets/monagrow-almonds-pouch-v2.png'),
    ('/assets/monagrow-walnuts-pouch-new.png', '/assets/monagrow-walnuts-pouch-v2.png'),
    ('/assets/monagrow-pistachios-pouch-new.png', '/assets/monagrow-pistachios-pouch-v2.png'),
    ('/assets/monagrow-raisins-pouch-new.png', '/assets/monagrow-raisins-pouch-v2.png'),
    # Also handle legacy cutout paths if any were still present
    ('/assets/monagrow-cashews-bag-cutout.png', '/assets/monagrow-cashews-pouch-v2.png'),
    ('/assets/monagrow-almonds-bag-cutout.png', '/assets/monagrow-almonds-pouch-v2.png'),
    ('/assets/monagrow-walnuts-bag-cutout.png', '/assets/monagrow-walnuts-pouch-v2.png'),
    ('/assets/monagrow-pistachios-bag-cutout.png', '/assets/monagrow-pistachios-pouch-v2.png'),
    ('/assets/monagrow-raisins-bag-cutout.png', '/assets/monagrow-raisins-pouch-v2.png'),
]

for old, new in replacements:
    if old in commodity_code:
        commodity_code = commodity_code.replace(old, new)
        print(f"commodityData.ts: replaced {old} -> {new}")

with open('data/commodityData.ts', 'w', encoding='utf-8') as f:
    f.write(commodity_code)

print("Saved data/commodityData.ts")

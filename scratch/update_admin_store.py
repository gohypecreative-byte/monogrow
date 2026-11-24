import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Update existing rice products to include 500gm, 1 kg, 2 kg, 5 kg, 10 kg, 20 kg, 25 kg, 50 kg
rice_variations_template = [
    {"weight": "500gm", "unit": "gm", "price_mult": 0.55, "type": "Aroma Seal Retail Pouch", "bulk": False},
    {"weight": "1 kg", "unit": "kg", "price_mult": 1.0, "type": "Aroma-Lock Standup Pouch", "bulk": False},
    {"weight": "2 kg", "unit": "kg", "price_mult": 1.9, "type": "Premium Standup Zipper Pouch", "bulk": False},
    {"weight": "5 kg", "unit": "kg", "price_mult": 4.4, "type": "Standup Box Bag with Handle", "bulk": False},
    {"weight": "10 kg", "unit": "kg", "price_mult": 8.2, "type": "Heavy BOPP Moisture Bag", "bulk": True},
    {"weight": "20 kg", "unit": "kg", "price_mult": 15.8, "type": "Heavy-Duty Woven Sack", "bulk": True},
    {"weight": "25 kg", "unit": "kg", "price_mult": 19.5, "type": "Woven Polypropylene Sacks", "bulk": True},
    {"weight": "50 kg", "unit": "kg", "price_mult": 37.0, "type": "Lined Ocean Export Sacks", "bulk": True},
]

for p in data['products']:
    if p.get('categoryKey') == 'rice':
        # base price from existing 1kg or first variation
        base_price = 4.0
        for v in p.get('variations', []):
            if '1' in v.get('weight', '') and 'kg' in v.get('weight', ''):
                base_price = v.get('price', 4.0)
                break
        
        new_vars = []
        for idx, vt in enumerate(rice_variations_template):
            new_vars.append({
                "id": f"var-{p['id']}-{idx+1}",
                "weight": vt["weight"],
                "unit": vt["unit"],
                "price": round(base_price * vt["price_mult"], 2),
                "currency": "USD",
                "sku": f"MNG-RIC-{p['id'][:6].upper()}-{vt['weight'].replace(' ', '').upper()}",
                "packageType": vt["type"],
                "inStock": True,
                "minOrderQty": 5 if vt["bulk"] else 1,
                "sortOrder": idx
            })
        p['variations'] = new_vars

# 2. Add the two new Sona Masoori products if not already present
existing_ids = [p['id'] for p in data['products']]

prod_premium_sona = {
  "id": "premium-sona-masoori-rice",
  "categoryKey": "rice",
  "category": "Grains & Rice",
  "name": "Premium Sona Masoori Rice",
  "kicker": "Delicate Medium Grain · Lightweight & Aromatic",
  "quoteName": "Premium Sona Masoori Rice",
  "tagline": "Silky, lightweight medium grain with delicate aroma.",
  "description": "Aged to perfection, Premium Sona Masoori Rice is a lightweight, aromatic medium-grain variety cherished for its delicate texture and low starch content. Naturally easy to digest and fluffy upon cooking, it is the ideal choice for everyday family meals, South Indian culinary classics, and aromatic rice preparations.",
  "originBadge": "Average Grain Length: 5.2 MM · 100% Sortex Clean",
  "packImg": "/assets/monagrow-premium-sona-masoori-bag-cutout.png",
  "bowlImg": "/assets/hero-center-rice.png",
  "bowlAlt": "Full ceramic bowl of Premium Sona Masoori Rice",
  "packAlt": "Monagrow Premium Sona Masoori Rice Pack",
  "specs": [
    { "label": "Grain Length", "value": "5.2 MM" },
    { "label": "Processing", "value": "Silky Raw / Steam Sortex" },
    { "label": "Energy", "value": "356 kcal / 100g" },
    { "label": "Protein", "value": "7.8 g" },
    { "label": "Carbohydrates", "value": "78.5 g" },
    { "label": "Purity", "value": "100% Sortex Clean" }
  ],
  "keyHighlights": [
    "Lightweight & Easy to Digest: Naturally low in starch with delicate, non-heavy grains",
    "Aged Medium Grain: Specially aged to ensure fluffy, separate grains that never turn mushy",
    "Versatile Culinary Use: Perfect for sambar rice, lemon rice, puliyogare, and everyday meals",
    "Standardized Grading: Multi-stage sortex cleaning guaranteeing pure, uniform grains"
  ],
  "variations": [
    {
      "id": "var-premium-sona-masoori-rice-1",
      "weight": "500gm",
      "unit": "gm",
      "price": 2.25,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-500GM",
      "packageType": "Aroma Seal Retail Pouch",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 0
    },
    {
      "id": "var-premium-sona-masoori-rice-2",
      "weight": "1 kg",
      "unit": "kg",
      "price": 4.2,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-1KG",
      "packageType": "Aroma-Lock Standup Pouch",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 1
    },
    {
      "id": "var-premium-sona-masoori-rice-3",
      "weight": "2 kg",
      "unit": "kg",
      "price": 8.0,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-2KG",
      "packageType": "Premium Standup Zipper Pouch",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 2
    },
    {
      "id": "var-premium-sona-masoori-rice-4",
      "weight": "5 kg",
      "unit": "kg",
      "price": 17.5,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-5KG",
      "packageType": "Standup Box Bag with Handle",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 3
    },
    {
      "id": "var-premium-sona-masoori-rice-5",
      "weight": "10 kg",
      "unit": "kg",
      "price": 32.0,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-10KG",
      "packageType": "Heavy BOPP Moisture Bag",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 4
    },
    {
      "id": "var-premium-sona-masoori-rice-6",
      "weight": "20 kg",
      "unit": "kg",
      "price": 60.0,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-20KG",
      "packageType": "Heavy-Duty Woven Sack",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 5
    },
    {
      "id": "var-premium-sona-masoori-rice-7",
      "weight": "25 kg",
      "unit": "kg",
      "price": 72.0,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-25KG",
      "packageType": "Woven Polypropylene Sacks",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 6
    },
    {
      "id": "var-premium-sona-masoori-rice-8",
      "weight": "50 kg",
      "unit": "kg",
      "price": 138.0,
      "currency": "USD",
      "sku": "MNG-RIC-PSONA-50KG",
      "packageType": "Lined Ocean Export Sacks",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 7
    }
  ],
  "isActive": True,
  "isFeatured": True,
  "updatedAt": "2026-11-23T10:00:00.000Z"
}

prod_rozana_sona = {
  "id": "rozana-sona-masoori-rice",
  "categoryKey": "rice",
  "category": "Grains & Rice",
  "name": "Rozana Sona Masoori Rice",
  "kicker": "Daily Essential Grains · Low Starch & Wholesome",
  "quoteName": "Rozana Sona Masoori Rice",
  "tagline": "Daily essential rice for wholesome, fluffy meals.",
  "description": "Milled for daily family wellness, Rozana Sona Masoori Rice delivers wholesome everyday nutrition with a clean, pleasant taste and fluffy separation. Its naturally balanced starch profile and tender grain make it an indispensable staple for dal-rice, sambar rice, pulao, and wholesome regional delicacies.",
  "originBadge": "Average Grain Length: 5.0 MM · 100% Sortex Clean",
  "packImg": "/assets/monagrow-rozana-sona-masoori-bag-cutout.png",
  "bowlImg": "/assets/hero-center-rice.png",
  "bowlAlt": "Full ceramic bowl of Rozana Sona Masoori Rice",
  "packAlt": "Monagrow Rozana Sona Masoori Rice Pack",
  "specs": [
    { "label": "Grain Length", "value": "5.0 MM" },
    { "label": "Processing", "value": "Steam Milled" },
    { "label": "Energy", "value": "350 kcal / 100g" },
    { "label": "Protein", "value": "7.5 g" },
    { "label": "Carbohydrates", "value": "79.0 g" },
    { "label": "Purity", "value": "100% Sortex Clean" }
  ],
  "keyHighlights": [
    "Everyday Fluffy Separation: Steam-milled grains that cook evenly without stickiness",
    "Wholesome Daily Staple: Low glycemic load and light digestion for healthy daily consumption",
    "Ideal for Family Cooking: Excellent absorption for dal, rasam, curd rice, and curries",
    "Strict Quality Control: Triple-cleaned and sortex inspected for uncompromised grain purity"
  ],
  "variations": [
    {
      "id": "var-rozana-sona-masoori-rice-1",
      "weight": "500gm",
      "unit": "gm",
      "price": 2.1,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-500GM",
      "packageType": "Aroma Seal Retail Pouch",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 0
    },
    {
      "id": "var-rozana-sona-masoori-rice-2",
      "weight": "1 kg",
      "unit": "kg",
      "price": 3.9,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-1KG",
      "packageType": "Aroma-Lock Standup Pouch",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 1
    },
    {
      "id": "var-rozana-sona-masoori-rice-3",
      "weight": "2 kg",
      "unit": "kg",
      "price": 7.5,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-2KG",
      "packageType": "Premium Standup Zipper Pouch",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 2
    },
    {
      "id": "var-rozana-sona-masoori-rice-4",
      "weight": "5 kg",
      "unit": "kg",
      "price": 16.2,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-5KG",
      "packageType": "Standup Box Bag with Handle",
      "inStock": True,
      "minOrderQty": 1,
      "sortOrder": 3
    },
    {
      "id": "var-rozana-sona-masoori-rice-5",
      "weight": "10 kg",
      "unit": "kg",
      "price": 30.0,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-10KG",
      "packageType": "Heavy BOPP Moisture Bag",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 4
    },
    {
      "id": "var-rozana-sona-masoori-rice-6",
      "weight": "20 kg",
      "unit": "kg",
      "price": 56.0,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-20KG",
      "packageType": "Heavy-Duty Woven Sack",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 5
    },
    {
      "id": "var-rozana-sona-masoori-rice-7",
      "weight": "25 kg",
      "unit": "kg",
      "price": 68.0,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-25KG",
      "packageType": "Woven Polypropylene Sacks",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 6
    },
    {
      "id": "var-rozana-sona-masoori-rice-8",
      "weight": "50 kg",
      "unit": "kg",
      "price": 130.0,
      "currency": "USD",
      "sku": "MNG-RIC-RSONA-50KG",
      "packageType": "Lined Ocean Export Sacks",
      "inStock": True,
      "minOrderQty": 5,
      "sortOrder": 7
    }
  ],
  "isActive": True,
  "isFeatured": True,
  "updatedAt": "2026-11-23T10:00:00.000Z"
}

if 'premium-sona-masoori-rice' not in existing_ids:
    data['products'].append(prod_premium_sona)

if 'rozana-sona-masoori-rice' not in existing_ids:
    data['products'].append(prod_rozana_sona)

with open('data/admin-store.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('Updated data/admin-store.json successfully!')
print(f"Total products now: {len(data['products'])}")
rice_count = len([p for p in data['products'] if p.get('categoryKey') == 'rice'])
print(f"Total rice products now: {rice_count}")

with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update toCommodityProduct regex to support gm
old_to_comm = """function toCommodityProduct(p: any): CommodityProduct {
  const variations = p.variations || [];
  const retailSizes = variations
    .filter((v: any) => {
      const match = v.weight?.match(/(\d+)\s*(kg|g)/i);
      if (!match) return true;
      const num = parseInt(match[1]);
      const unit = match[2]?.toLowerCase();
      if (unit === "g") return true;
      return num <= 5;
    })
    .map((v: any) => v.weight);

  const bulkSizes = variations
    .filter((v: any) => {
      const match = v.weight?.match(/(\d+)\s*kg/i);
      if (!match) return false;
      return parseInt(match[1]) > 5;
    })
    .map((v: any) => v.weight);"""

new_to_comm = """function toCommodityProduct(p: any): CommodityProduct {
  const variations = p.variations || [];
  const retailSizes = variations
    .filter((v: any) => {
      const match = v.weight?.match(/(\d+)\s*(kg|g|gm)/i);
      if (!match) return true;
      const num = parseInt(match[1]);
      const unit = match[2]?.toLowerCase();
      if (unit === "g" || unit === "gm") return true;
      return num <= 5;
    })
    .map((v: any) => v.weight);

  const bulkSizes = variations
    .filter((v: any) => {
      const match = v.weight?.match(/(\d+)\s*(kg|g|gm)/i);
      if (!match) return false;
      const num = parseInt(match[1]);
      const unit = match[2]?.toLowerCase();
      if (unit === "g" || unit === "gm") return false;
      return num > 5;
    })
    .map((v: any) => v.weight);"""

if old_to_comm in text:
    text = text.replace(old_to_comm, new_to_comm)
    print("Replaced toCommodityProduct successfully!")
else:
    print("Warning: old_to_comm not found exactly!")

# 2. Add Sona Masoori products into STATIC_PRODUCTS right after traditional-basmati-rice
sona_products_code = """  {
    id: "premium-sona-masoori-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Premium Sona Masoori Rice",
    kicker: "Delicate Medium Grain · Lightweight & Aromatic",
    quoteName: "Premium Sona Masoori Rice",
    tagline: "Silky, lightweight medium grain with delicate aroma.",
    description:
      "Aged to perfection, Premium Sona Masoori Rice is a lightweight, aromatic medium-grain variety cherished for its delicate texture and low starch content. Naturally easy to digest and fluffy upon cooking, it is the ideal choice for everyday family meals, South Indian culinary classics, and aromatic rice preparations.",
    originBadge: "Average Grain Length: 5.2 MM · 100% Sortex Clean",
    packImg: "/assets/monagrow-premium-sona-masoori-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Premium Sona Masoori Rice",
    packAlt: "Monagrow Premium Sona Masoori Rice Pack",
    retailSizes: ["500gm", "1 kg", "2 kg", "5 kg"],
    bulkSizes: ["10 kg", "20 kg", "25 kg", "50 kg"],
    specs: [
      { label: "Grain Length", value: "5.2 MM" },
      { label: "Processing", value: "Silky Raw / Steam Sortex" },
      { label: "Energy", value: "356 kcal / 100g" },
      { label: "Protein", value: "7.8 g" },
      { label: "Carbohydrates", value: "78.5 g" },
      { label: "Purity", value: "100% Sortex Clean" },
    ],
    keyHighlights: [
      "Lightweight & Easy to Digest: Naturally low in starch with delicate, non-heavy grains",
      "Aged Medium Grain: Specially aged to ensure fluffy, separate grains that never turn mushy",
      "Versatile Culinary Use: Perfect for sambar rice, lemon rice, puliyogare, and everyday meals",
      "Standardized Grading: Multi-stage sortex cleaning guaranteeing pure, uniform grains",
    ],
  },
  {
    id: "rozana-sona-masoori-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Rozana Sona Masoori Rice",
    kicker: "Daily Essential Grains · Low Starch & Wholesome",
    quoteName: "Rozana Sona Masoori Rice",
    tagline: "Daily essential rice for wholesome, fluffy meals.",
    description:
      "Milled for daily family wellness, Rozana Sona Masoori Rice delivers wholesome everyday nutrition with a clean, pleasant taste and fluffy separation. Its naturally balanced starch profile and tender grain make it an indispensable staple for dal-rice, sambar rice, pulao, and wholesome regional delicacies.",
    originBadge: "Average Grain Length: 5.0 MM · 100% Sortex Clean",
    packImg: "/assets/monagrow-rozana-sona-masoori-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Rozana Sona Masoori Rice",
    packAlt: "Monagrow Rozana Sona Masoori Rice Pack",
    retailSizes: ["500gm", "1 kg", "2 kg", "5 kg"],
    bulkSizes: ["10 kg", "20 kg", "25 kg", "50 kg"],
    specs: [
      { label: "Grain Length", value: "5.0 MM" },
      { label: "Processing", value: "Steam Milled" },
      { label: "Energy", value: "350 kcal / 100g" },
      { label: "Protein", value: "7.5 g" },
      { label: "Carbohydrates", value: "79.0 g" },
      { label: "Purity", value: "100% Sortex Clean" },
    ],
    keyHighlights: [
      "Everyday Fluffy Separation: Steam-milled grains that cook evenly without stickiness",
      "Wholesome Daily Staple: Low glycemic load and light digestion for healthy daily consumption",
      "Ideal for Family Cooking: Excellent absorption for dal, rasam, curd rice, and curries",
      "Strict Quality Control: Triple-cleaned and sortex inspected for uncompromised grain purity",
    ],
  },
"""

trad_target = '    keyHighlights: [\n      "Parboiled Rice Variety: Practical parboiling benefits for everyday efficiency",\n      "Separate Grain Texture: Stays light and fluffy without sticking",\n      "Suitable for Everyday Meals: Perfect for high-volume family and institutional cooking",\n    ],\n  },'

if trad_target in text and 'premium-sona-masoori-rice' not in text:
    text = text.replace(trad_target, trad_target + '\n' + sona_products_code)
    print("Added sona products to STATIC_PRODUCTS successfully!")
else:
    print("Warning: trad_target not found or already added!")

with open('data/commodityData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved data/commodityData.ts")

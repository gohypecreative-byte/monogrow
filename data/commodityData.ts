import adminStore from "@/data/admin-store.json";

export interface CommodityProduct {
  id: string;
  categoryKey: "rice" | "coffee" | "sugar" | "dry-fruits";
  category: "Grains & Rice" | "Specialty Estate" | "Select Dry Fruits" | "Refined Sugar";
  name: string;
  kicker: string;
  quoteName: string;
  tagline: string;
  description: string;
  originBadge: string;
  packImg: string;
  bowlImg: string;
  bowlAlt: string;
  packAlt: string;
  retailSizes: string[];
  bulkSizes: string[];
  specs: { label: string; value: string }[];
  keyHighlights: string[];
}

export interface CategoryMeta {
  key: "rice" | "coffee" | "sugar" | "dry-fruits";
  slug: string;
  navName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  heroMetrics: { value: string; label: string; sub: string }[];
  qualityBullets: { title: string; desc: string }[];
}

export const COMMODITY_CATEGORIES: Record<string, CategoryMeta> = {
  rice: {
    key: "rice",
    slug: "rice",
    navName: "Rice",
    eyebrow: "The Monagrow Basmati Rice Collection",
    title: "Premium, Classic & Rozana Basmati Rice",
    subtitle:
      "Carefully steam-processed and parboiled to support better grain separation, distinctive aroma, and consistent cooking results. Export-quality Basmati rice across three quality tiers in Steam and Sella varieties.",
    heroMetrics: [
      { value: "8.40 mm", label: "Average Grain Length", sub: "Slender Long Grains" },
      { value: "3 Tiers", label: "Quality Categories", sub: "Premium, Classic, Rozana" },
      { value: "100% Sortex", label: "Quality Inspection", sub: "Zero Foreign Matter" },
      { value: "Steam & Sella", label: "Processing Methods", sub: "Fluffy & Separate Grains" },
    ],
    qualityBullets: [
      {
        title: "Better Grain Separation",
        desc: "Carefully steam-processed and parboiled to support non-sticky, distinct grains that cook evenly every time.",
      },
      {
        title: "Distinctive Natural Aroma",
        desc: "Celebrated Himalayan Basmati aroma that elevates biryanis, pulao, and everyday culinary creations.",
      },
      {
        title: "Standardized Quality Grading",
        desc: "Rigorous quality inspection at every stage catering to exact requirements for grain size, moisture, and packaging.",
      },
      {
        title: "Export-Ready Packaging",
        desc: "Available in 1 kg, 5 kg, 10 kg, and 25 kg multi-wall and woven moisture-barrier bags for global distribution.",
      },
    ],
  },
  coffee: {
    key: "coffee",
    slug: "coffee",
    navName: "Coffee",
    eyebrow: "The Monagrow Specialty Estate Collection",
    title: "High-Altitude Estate Arabica & Artisan Drum Roast",
    subtitle:
      "Cultivated at 1,450 to 1,850 meters MSL under natural rainforest shade canopies. Hand-harvested at peak brix, wet-processed, and roasted in slow artisan drum batches with one-way aroma-lock degassing valves.",
    heroMetrics: [
      { value: "84+ SCA", label: "Specialty Cupping Grade", sub: "Certified Origin Quality" },
      { value: "1,450m+ MSL", label: "Estate Altitude", sub: "Slow-Matured Arabica" },
      { value: "Slow Drum Roast", label: "Artisan Dark Profile", sub: "Cocoa, Pecan & Caramel" },
      { value: "Degassing Valve", label: "One-Way Aroma Lock", sub: "24-Month Peak Freshness" },
    ],
    qualityBullets: [
      {
        title: "Single-Estate High Elevation",
        desc: "Grown between 1,450m and 1,850m above sea level where cool mountain temperatures slow cherry maturation, creating dense beans with deep sweetness.",
      },
      {
        title: "Hand-Selective Selective Picking",
        desc: "Only fully ripe cherries are harvested by experienced estate workers, ensuring uniform density and zero green astringency.",
      },
      {
        title: "Batch Drum Roasting",
        desc: "Roasted in cast-iron batch drums to slowly caramelize natural sugars, producing notes of dark cocoa, toasted pecan, and warm caramel.",
      },
      {
        title: "Hermetic Aroma Foil Packaging",
        desc: "Equipped with one-way degassing valves and multi-layer oxygen-barrier foil to preserve peak aromatic volatiles for wholesale and retail.",
      },
    ],
  },
  sugar: {
    key: "sugar",
    slug: "sugar",
    navName: "Sugar",
    eyebrow: "The Monagrow Refined Sugar Collection",
    title: "Sugar",
    subtitle:
      "Refined from fresh-harvest sugarcane, Monagrow ICUMSA 45 represents the highest purity grade in international commodity trade. Free-flowing, sparkling white crystals with 99.85% minimum polarization.",
    heroMetrics: [
      { value: "ICUMSA 45", label: "Color Index RBU Max", sub: "Sparkling White Purity" },
      { value: "99.85% Min", label: "Sucrose Polarization", sub: "Ultra-High Purity" },
      { value: "< 0.04%", label: "Moisture Content", sub: "Certified Anti-Caking" },
      { value: "100% Instant", label: "Dissolution Rate", sub: "Food-Grade Clean" },
    ],
    qualityBullets: [
      {
        title: "Ultra-Low ICUMSA 45 Rating",
        desc: "Conforms strictly to international ICUMSA 45 standards with sparkling white crystallization, ideal for high-end confectionery and beverage manufacturing.",
      },
      {
        title: "Continuous Lab Polarization Checks",
        desc: "Every outgoing lot is tested with refractometric polarimeters to ensure sucrose concentration consistently exceeds 99.85%.",
      },
      {
        title: "Under 0.04% Moisture Standard",
        desc: "Engineered with ultra-low residual moisture to completely eliminate caking, lump formation, and color discoloration during sea transit.",
      },
      {
        title: "Export Poly-Lined Packaging",
        desc: "Shipped in 25kg multi-wall paper bags, 50kg woven PP bags with heavy-duty PE inner liners, and 1 MT industrial sling bags.",
      },
    ],
  },
  "dry-fruits": {
    key: "dry-fruits",
    slug: "dry-fruits",
    navName: "Dry Fruits",
    eyebrow: "The Monagrow Select Dry Fruits Collection",
    title: "Royal Mixed Dry Fruits & Select Nuts",
    subtitle:
      "A royal harvest of selected Whole W240 Cashews, California almonds, rich Kashmiri walnuts, and crunchy green pistachios. Sealed in nitrogen-flushed barrier packaging to lock in farmgate freshness.",
    heroMetrics: [
      { value: "4-in-1 Mix", label: "Selected Blend", sub: "Cashew, Almond, Walnut, Pista" },
      { value: "1st Quality White", label: "Color & Cleanliness", sub: "Zero Blemishes or Spots" },
      { value: "< 4.5%", label: "Moisture Content", sub: "Crisp Butter Crunch" },
      { value: "Nitrogen Flush", label: "Oxygen-Free Barrier", sub: "Long-Term Freshness" },
    ],
    qualityBullets: [
      {
        title: "Rigid W240 Size Grading",
        desc: "Sorted by precision mesh sizing to maintain a strict count of 220 to 240 whole kernels per pound, ensuring generous visual presentation.",
      },
      {
        title: "First Quality White Grade (Zero Blemish)",
        desc: "Cashews are hand-inspected under high-lumen inspection tables to eliminate spotted, discolored, or broken kernels.",
      },
      {
        title: "Nitrogen Gas Flushing",
        desc: "Oxygen is completely purged from retail pouches and vacuum tins using high-purity food-grade nitrogen, preventing rancidity and oil oxidation.",
      },
      {
        title: "International Phytosanitary Certification",
        desc: "Full SGS inspection, fumigation certification, and phytosanitary clearance documents provided with every export container.",
      },
    ],
  },
};

const STATIC_PRODUCTS: CommodityProduct[] = [
  {
    id: "basmati-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Premium Basmati Steam Rice",
    kicker: "Aromatic Grains · Export Quality",
    quoteName: "Premium Basmati Steam Rice",
    tagline: "Aromatic Grains | Premium Quality",
    description:
      "Carefully steam-processed to support better grain separation and consistent cooking results, Premium Basmati Steam Rice is an excellent choice for flavourful biryanis, pulao, and everyday meals. A versatile option for households and professional kitchens seeking premium quality basmati rice.",
    originBadge: "Average Grain Length: 8.35 MM · 100% Sortex Clean",
    packImg: "/assets/monagrow-rice-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Premium Basmati Steam Rice",
    packAlt: "Monagrow Premium Basmati Steam Rice Pack",
    retailSizes: ["1 kg", "5 kg"],
    bulkSizes: ["10 kg", "25 kg", "50 kg Export Sack"],
    specs: [
      { label: "Grain Length", value: "8.35 MM" },
      { label: "Processing", value: "Steam Processed" },
      { label: "Energy", value: "362.13 kcal" },
      { label: "Protein", value: "8.82 g" },
    ],
    keyHighlights: [
      "Better Grain Separation: Steam-processed to ensure non-sticky, separate grains",
      "Distinctive Natural Aroma: Rich Basmati aroma that enhances biryanis and pulao",
      "Standardized grading with quality inspection at every stage",
    ],
  },
  {
    id: "katarni-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Classic Basmati Steam Rice",
    kicker: "Everyday Flavour · Export Quality",
    quoteName: "Classic Basmati Steam Rice",
    tagline: "Everyday Flavour | Consistent Quality",
    description:
      "Classic Basmati Steam Rice brings together the convenience of steam processing and the versatility of Basmati rice. Suitable for daily meals, family favourites, and food-service applications, it is a dependable choice for those seeking the best rice to use.",
    originBadge: "Average Grain Length: 8.40 MM · Consistent Quality",
    packImg: "/assets/monagrow-katarni-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Classic Basmati Steam Rice",
    packAlt: "Monagrow Classic Basmati Steam Rice Pack",
    retailSizes: ["1 kg", "5 kg"],
    bulkSizes: ["10 kg", "25 kg", "50 kg Export Sack"],
    specs: [
      { label: "Grain Length", value: "8.40 MM" },
      { label: "Processing", value: "Steam Processed" },
      { label: "Energy", value: "364.03 kcal" },
      { label: "Protein", value: "8.79 g" },
    ],
    keyHighlights: [
      "Consistent Cooking Quality: Dependable performance across daily home & food-service recipes",
      "Aromatic Rice Grains: Naturally fragrant Basmati character",
      "Everyday Versatility: Perfect pairing for gravies, curries, and fried rice",
    ],
  },
  {
    id: "sella-basmati-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Premium Basmati Sella Rice",
    kicker: "Golden Grains · Fluffy Perfection",
    quoteName: "Premium Basmati Sella Rice",
    tagline: "Golden Grains | Fluffy Perfection",
    description:
      "Premium Basmati Sella Rice undergoes parboiling, giving the grains their characteristic golden colour and helping them retain their structure during cooking. With its separate, fluffy grain texture, it is an excellent choice for biryanis, festive meals, and elaborate rice preparations. An appealing option for consumers seeking premium quality basmati rice.",
    originBadge: "Average Grain Length: 8.35 MM · Parboiled Sella",
    packImg: "/assets/monagrow-golden-sella-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Premium Basmati Sella Rice",
    packAlt: "Monagrow Premium Basmati Sella Rice Pack",
    retailSizes: ["1 kg", "5 kg"],
    bulkSizes: ["10 kg", "25 kg", "50 kg Export Sack"],
    specs: [
      { label: "Grain Length", value: "8.35 MM" },
      { label: "Processing", value: "Golden / Creamy Sella" },
      { label: "Energy", value: "350 kcal" },
      { label: "Protein", value: "7.5 g" },
    ],
    keyHighlights: [
      "Distinctive Golden Colour: Parboiling locks in nutrients and gives an appetizing golden hue",
      "Fluffy, Separate Grains: Retains grain structure without breaking during vigorous cooking",
      "Ideal for Biryani: The gold standard for royal dum biryani and festive catering",
    ],
  },
  {
    id: "jeera-masino-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Classic Basmati Sella Rice",
    kicker: "Parboiled Rice Grains · Balanced Quality",
    quoteName: "Classic Basmati Sella Rice",
    tagline: "Balanced Quality | Versatile Cooking",
    description:
      "Classic Basmati Sella Rice provides a reliable and versatile parboiled rice option. Its firm grain texture and balanced qualities make it well-suited for everyday cooking and food-service needs, offering dependable results across a range of recipes.",
    originBadge: "Average Grain Length: 8.40 MM · Balanced Parboiled",
    packImg: "/assets/monagrow-jeera-masino-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Classic Basmati Sella Rice",
    packAlt: "Monagrow Classic Basmati Sella Rice Pack",
    retailSizes: ["1 kg", "5 kg"],
    bulkSizes: ["10 kg", "25 kg", "50 kg Export Sack"],
    specs: [
      { label: "Grain Length", value: "8.40 MM" },
      { label: "Processing", value: "Parboiled Sella" },
      { label: "Energy", value: "355 kcal" },
      { label: "Protein", value: "7.0 g" },
    ],
    keyHighlights: [
      "Parboiled Rice Grains: Balanced cooking qualities with high thermal tolerance",
      "Everyday Adaptability: Reliable performance across diverse regional cuisines",
      "Firm Non-Breaking Kernels: Remains separate and intact in commercial food service",
    ],
  },

  {
    id: "estate-coffee",
    categoryKey: "coffee",
    category: "Specialty Estate",
    name: "Specialty Estate Dark Arabica",
    kicker: "Dark Roast Arabica · High-Elevation Single Estate",
    quoteName: "Specialty Estate Coffee (Arabica Dark Roast)",
    tagline: "Dark roast with cocoa and caramel notes.",
    description:
      "Cultivated at 1,450 to 1,850 meters above sea level under natural shade canopies. Hand-picked at peak ripeness, wet-processed, and slow roasted in artisan batch drums to bring forth rich body, low acidity, and aromatic complexity.",
    originBadge: "1,450m+ MSL Altitude · 84+ Specialty Grade",
    packImg: "/assets/monagrow-coffee-bag-cutout.png",
    bowlImg: "/assets/hero-center-coffee.png",
    bowlAlt: "Full ceramic bowl of roasted dark Arabica coffee beans",
    packAlt: "Monagrow Specialty Estate Dark Arabica 2.5kg Pack",
    retailSizes: ["500g Aroma Pouch with Valve", "2.5 kg Multi-Ply Box Bag with Valve"],
    bulkSizes: ["25 kg GrainPro Hermetic Liners", "60 kg Jute Sacks", "Direct Container Loads"],
    specs: [
      { label: "Specialty Grade", value: "84+ SCA Cupping Score" },
      { label: "Estate Altitude", value: "1,450m - 1,850m MSL" },
      { label: "Roast Profile", value: "Artisan Slow Drum Dark" },
      { label: "Barrier Technology", value: "One-Way Degassing Valve Foil" },
      { label: "Varietal Lineage", value: "100% Arabica Bourbon & Typica" },
      { label: "Flavor Palette", value: "Dark Cocoa, Roasted Pecan, Caramel" },
    ],
    keyHighlights: [
      "Packed with one-way degassing valves locking in freshly roasted aroma for up to 24 months",
      "Ethically procured through direct estate agreements supporting fair farmer living wages",
      "Available as whole roasted bean, custom ground, or green unroasted export lots",
    ],
  },
  {
    id: "medium-roast-arabica",
    categoryKey: "coffee",
    category: "Specialty Estate",
    name: "Monagrow Premium Roasted Coffee Beans",
    kicker: "100% Arabica Beans · Medium Roast · Sustainably Sourced",
    quoteName: "Monagrow Premium Roasted Coffee Beans (Medium Roast)",
    tagline: "Rich aroma, smooth taste & balanced flavor.",
    description:
      "Expertly crafted from 100% sustainably sourced high-elevation Arabica beans, Monagrow Premium Roasted Coffee Beans are slow drum-roasted to a velvety medium roast. Delivers a rich captivating aroma, delicate sweetness, and a remarkably smooth, balanced finish perfect for everyday pour-over, espresso, and french press brewing.",
    originBadge: "100% Arabica · Medium Roast Balanced",
    packImg: "/assets/monagrow-roasted-coffee-beans-cutout.png",
    bowlImg: "/assets/hero-center-coffee.png",
    bowlAlt: "Ceramic bowl of golden roasted medium Arabica beans",
    packAlt: "Monagrow Premium Roasted Coffee Beans 12oz Pouch",
    retailSizes: ["12 oz (340 g) Standup Pouch", "500g Aroma Zip Bag", "1 kg Valve Pack"],
    bulkSizes: ["15 kg Multi-Wall Kraft Bags", "25 kg GrainPro Valve Sacks", "Full Container Direct Lots"],
    specs: [
      { label: "Bean Type", value: "100% Single Origin Arabica" },
      { label: "Roast Profile", value: "Medium Roast Balanced Flavor" },
      { label: "Aroma Profile", value: "Rich Roasted Cocoa & Caramel" },
      { label: "Sourcing", value: "100% Sustainably Sourced Estates" },
      { label: "Packaging", value: "12 oz (340g) Resealable Zip Bag" },
      { label: "Processing", value: "Fully Washed & Natural Sun-Dried" },
    ],
    keyHighlights: [
      "Crafted with 100% hand-picked Arabica beans for rich aroma and zero bitterness",
      "Artisan medium roast engineered for an exceptionally smooth and balanced cup",
      "Resealable moisture-barrier zipper pouch keeping whole beans fresh at peak flavor",
    ],
  },
  {
    id: "monsooned-malabar",
    categoryKey: "coffee",
    category: "Specialty Estate",
    name: "Highland Monsooned Malabar AA",
    kicker: "Monsoon Cured · Ultra-Low Acidity & Dense Crema",
    quoteName: "Highland Monsooned Malabar AA Coffee",
    tagline: "Rich golden cured beans with spicy dark chocolate body.",
    description:
      "Exposed to ocean monsoon winds along coastal curing yards for 12 to 16 weeks, swelling the beans into a pale golden hue and stripping sharp acidity. Produces a velvety, thick crema with notes of cardamom, toasted walnut, and dark bakers chocolate.",
    originBadge: "Monsoon Cured · Grade AA Super Bold",
    packImg: "/assets/monagrow-monsooned-malabar-bag-cutout-v3.png",
    bowlImg: "/assets/hero-center-coffee.png",
    bowlAlt: "Ceramic bowl of golden roasted Monsooned Malabar AA beans",
    packAlt: "Monagrow Monsooned Malabar AA Coffee 12oz Pouch",
    retailSizes: ["12 oz (340g) Valve Pouch", "500g Aroma Zip Bag", "1 kg Valve Pack"],
    bulkSizes: ["15 kg Multi-Wall Bags", "25 kg GrainPro Valve Sacks", "Full Container Direct Lots"],
    specs: [
      { label: "Grade Index", value: "Grade AA Super Bold" },
      { label: "Curing Process", value: "12-16 Weeks Monsoon Winds" },
      { label: "Acidity Profile", value: "Ultra-Low Natural Acidity" },
      { label: "Roast Style", value: "Medium-Dark Espresso" },
    ],
    keyHighlights: [
      "Legendary ocean monsoon curing process creating uniquely mellow, non-acidic extraction",
      "Celebrated worldwide as the supreme secret ingredient for creamy Italian espresso blends",
      "100% sortex sorted to select only uniform super-bold AA golden kernels",
    ],
  },
  {
    id: "himalayan-peaberry",
    categoryKey: "coffee",
    category: "Specialty Estate",
    name: "Himalayan Peaberry Reserve Arabica",
    kicker: "Rare Single Oval Bean · Concentrated Floral Aroma",
    quoteName: "Himalayan Peaberry Reserve Arabica",
    tagline: "Rare oval beans with intense floral and dark honey notes.",
    description:
      "Formed when only a single round seed matures inside the coffee cherry instead of two flat beans, naturally concentrating sugars and volatile aromatic oils. Hand-sieved from less than 5% of our highest elevation Himalayan harvest.",
    originBadge: "Rare Peaberry Reserve · 1,600m MSL",
    packImg: "/assets/monagrow-peaberry-coffee-bag-cutout-v3.png",
    bowlImg: "/assets/hero-center-coffee.png",
    bowlAlt: "Ceramic bowl of roasted round peaberry coffee beans",
    packAlt: "Monagrow Himalayan Peaberry Reserve Arabica 12oz Pouch",
    retailSizes: ["12 oz (340g) Valve Pouch", "500g Aroma Zip Bag", "1 kg Valve Pack"],
    bulkSizes: ["10 kg Vacuum Cartons", "25 kg GrainPro Bags", "Direct Air Cargo Lots"],
    specs: [
      { label: "Bean Morphology", value: "100% Natural Peaberry (Round)" },
      { label: "Harvest Yield", value: "Under 5% of Total Crop" },
      { label: "Aroma Complexity", value: "Intense Floral & Honey" },
      { label: "Roast Profile", value: "City+ Medium Light Roast" },
    ],
    keyHighlights: [
      "Spherical bean structure roasts exceptionally uniformly in artisan drum batches",
      "Rare high-elevation botanical anomaly yielding higher density and flavor concentration",
      "Strictly limited micro-lot production with numbered harvest certificates",
    ],
  },
  {
    id: "royal-mixed-dryfruits",
    categoryKey: "dry-fruits",
    category: "Select Dry Fruits",
    name: "Royal Mixed Dry Fruits (4-in-1)",
    kicker: "Curated 4-in-1 Selection · Cashews, Almonds, Walnuts, Pistachios",
    quoteName: "Royal Mixed Dry Fruits",
    tagline: "Cashews, almonds, walnuts and pistachios.",
    description:
      "A royal harvest of selected Whole W240 Cashews, California almonds, rich Kashmiri walnuts, and crunchy green pistachios. Sorted to perfection, nitrogen flushed to seal in freshness, and packaged for premium wholesale markets worldwide.",
    originBadge: "Royal 4-in-1 Selection · First Quality Grade",
    packImg: "/assets/monagrow-mix-dryfruits-packaging-v2.png",
    bowlImg: "/assets/hero-center-dryfruit.png",
    bowlAlt: "Full wooden bowl of royal mixed dry fruits",
    packAlt: "Monagrow Royal Mixed Dry Fruits packaging",
    retailSizes: ["1 kg Nitrogen-Flushed Pouch", "2.5 kg Resealable Standup Bag"],
    bulkSizes: ["10 kg Vacuum Tins (2 x 10kg Carton)", "20 kg Export Cartons", "Full Pallet Shipments"],
    specs: [
      { label: "Blend Composition", value: "25% Cashew · 25% Almond · 25% Walnut · 25% Pistachio" },
      { label: "Quality Grade", value: "First Quality White & Select Whole" },
      { label: "Moisture Threshold", value: "Under 4.5% Butter Crunch" },
      { label: "Gas Packaging", value: "Nitrogen Flushed Oxygen-Free" },
      { label: "Defect Tolerance", value: "Under 0.05% Strict Threshold" },
      { label: "Shelf Life", value: "24 Months Sealed" },
    ],
    keyHighlights: [
      "Rigid vacuum-sealed nitrogen enclosure preventing oxidation and moisture absorption",
      "Zero oil additives, salt preservatives, or artificial blanching agents",
      "Phytosanitary certified and cleared for immediate import at international deepwater ports",
    ],
  },
  {
    id: "royal-cashews",
    categoryKey: "dry-fruits",
    category: "Select Dry Fruits",
    name: "Royal King Cashews W240",
    kicker: "King Size Whole W240 · Butter Crunch Purity",
    quoteName: "Royal King Cashews (W240 Whole)",
    tagline: "Jumbo whole white cashews with sweet buttery crunch.",
    description:
      "Meticulously steam-cracked and hand-graded to the internationally celebrated W240 specification (220-240 whole kernels per pound). Pristine ivory-white kernels with zero scorch marks, high natural oil sweetness, and vacuum nitrogen protection.",
    originBadge: "W240 King Size Whole · 100% Unblemished",
    packImg: "/assets/monagrow-cashews-pouch-v2.png",
    bowlImg: "/assets/hero-center-cashew.png",
    bowlAlt: "Wooden bowl of golden whole curved royal cashews",
    packAlt: "Monagrow Royal King Cashews W240 Standup Bag",
    retailSizes: ["250g Zip Pouch", "500g Standup Aroma Bag", "1 kg Resealable Pouch"],
    bulkSizes: ["10 kg Vacuum Tins (2 x 10kg Export Carton)", "20 kg Hermetic Cartons", "Palletized Air & Sea Lots"],
    specs: [
      { label: "Grade Standard", value: "W240 Jumbo Whole White" },
      { label: "Kernel Count", value: "220 - 240 Kernels / lb" },
      { label: "Moisture Content", value: "Under 4.5% Maximum" },
      { label: "Defect Tolerance", value: "Under 0.05% Strict Threshold" },
      { label: "Color Class", value: "First Quality White (Zero Scorch)" },
      { label: "Preservation", value: "Nitrogen Gas Flushed" },
    ],
    keyHighlights: [
      "Hand-selected whole kernels without broken pieces, splits, or surface freckles",
      "Naturally rich in plant protein, magnesium, and heart-healthy monounsaturated fats",
      "Vacuum nitrogen flush packaging preserves oven-fresh butter crunch across ocean voyages",
    ],
  },
  {
    id: "california-almonds",
    categoryKey: "dry-fruits",
    category: "Select Dry Fruits",
    name: "California Select Royal Almonds",
    kicker: "Whole Nonpareil Kernel · High Vitamin E & Sweet Crunch",
    quoteName: "California Select Royal Almonds",
    tagline: "Plump golden whole kernels with natural sweet snap.",
    description:
      "Harvested from premier orchards, Monagrow California Select Royal Almonds are graded to supreme nonpareil whole kernel standards. Uniform in size with smooth golden skin, rich natural crunch, and high dietary fiber and Vitamin E content.",
    originBadge: "Supreme Nonpareil · Zero Blemish Grade",
    packImg: "/assets/monagrow-almonds-pouch-v2.png",
    bowlImg: "/assets/hero-center-dryfruit.png",
    bowlAlt: "Wooden bowl of whole plump golden almonds",
    packAlt: "Monagrow California Select Royal Almonds 500g Bag",
    retailSizes: ["250g Snack Pouch", "500g Standup Box Pouch", "1 kg Resealable Zip Bag"],
    bulkSizes: ["10 kg Vacuum Cartons", "25 kg Poly-Lined Multi-Wall Bags", "Full Container Direct Ocean Loads"],
    specs: [
      { label: "Variety & Type", value: "California Nonpareil Supreme" },
      { label: "Count per Ounce", value: "23 - 25 Kernels / oz" },
      { label: "Moisture Level", value: "Under 5.0% Crunch" },
      { label: "Purity Index", value: "99.9% Clean Sortex" },
      { label: "Nutrient Profile", value: "High Vitamin E & Plant Protein" },
      { label: "Processing", value: "Raw Natural Whole (Unblanched)" },
    ],
    keyHighlights: [
      "Uniform kernel size and smooth skin ideal for gourmet confectionery and retail snacking",
      "Triple laser sorted to eliminate chipped, scratched, or bitter kernels",
      "Certified phytosanitary compliance for swift customs clearance across all destination ports",
    ],
  },
  {
    id: "kashmiri-walnuts",
    categoryKey: "dry-fruits",
    category: "Select Dry Fruits",
    name: "Kashmiri Snow White Walnuts",
    kicker: "Extra Light Halves · Rich in Omega-3 DHA & Buttery Finish",
    quoteName: "Kashmiri Snow White Walnuts",
    tagline: "Snow white walnut halves with buttery non-bitter finish.",
    description:
      "Cultivated in high-altitude Himalayan valleys, Monagrow Kashmiri Snow White Walnuts are revered for their pristine light-amber to snow-white color and sweet, buttery finish without the astringent bitterness typical of commercial crops.",
    originBadge: "Himalayan Snow White · Extra Light Halves",
    packImg: "/assets/monagrow-walnuts-pouch-v2.png",
    bowlImg: "/assets/hero-center-dryfruit.png",
    bowlAlt: "Wooden bowl of fresh snow white walnut halves",
    packAlt: "Monagrow Kashmiri Snow White Walnuts 500g Pouch",
    retailSizes: ["250g Nitrogen Pouch", "500g Standup Box Bag", "1 kg Aroma Seal Pouch"],
    bulkSizes: ["5 kg Vacuum Box", "10 kg Nitrogen-Flushed Master Carton", "Palletized Air Cargo Lots"],
    specs: [
      { label: "Color Grading", value: "Extra Light Snow White (Top Tier)" },
      { label: "Halves Proportion", value: "Over 85% Whole Halves" },
      { label: "Omega-3 (ALA)", value: "Over 9.0g / 100g" },
      { label: "Processing Method", value: "Hand-Cracked & Cleaned" },
      { label: "Foreign Material", value: "0.0% Shell Free Certified" },
      { label: "Shelf Life", value: "18 Months in Nitrogen Pack" },
    ],
    keyHighlights: [
      "Hand-cracked by artisanal valley cooperatives to preserve intact half-kernel geometry",
      "Naturally rich in plant-based Omega-3 alpha-linolenic acid (ALA) for cardiovascular health",
      "Strict cold-chain storage and oxygen-barrier packaging prevents rancidity",
    ],
  },
  {
    id: "roasted-pistachios",
    categoryKey: "dry-fruits",
    category: "Select Dry Fruits",
    name: "Roasted Salted Jumbo Pistachios",
    kicker: "Naturally Opened Jumbo · Light Himalayan Rock Salt",
    quoteName: "Roasted Salted Jumbo Pistachios",
    tagline: "Jumbo open-shell pistachios with light sea-salt crunch.",
    description:
      "Naturally sun-ripened on the tree until the shells split naturally. Roasted in gentle hot-air artisan drums with a delicate touch of Himalayan pink rock salt, delivering vibrant emerald-green kernels, unmatched crunch, and effortless opening.",
    originBadge: "Naturally Tree-Opened · Jumbo 18/20 Count",
    packImg: "/assets/monagrow-pistachios-pouch-v2.png",
    bowlImg: "/assets/hero-center-dryfruit.png",
    bowlAlt: "Wooden bowl of open-shell roasted salted green pistachios",
    packAlt: "Monagrow Roasted Salted Jumbo Pistachios 500g Pouch",
    retailSizes: ["250g Zip Pouch", "500g Standup Bag", "1 kg Resealable Party Pouch"],
    bulkSizes: ["10 kg Vacuum Boxes", "25 kg Poly Sacks", "Full Container Direct Lots"],
    specs: [
      { label: "Kernel Size", value: "Jumbo 18 - 20 Count / oz" },
      { label: "Opening Status", value: "100% Naturally Tree-Opened" },
      { label: "Closed Shells", value: "Under 0.5% Maximum" },
      { label: "Salt Concentration", value: "Under 1.5% Mild Himalayan Salt" },
      { label: "Roast Method", value: "Convection Hot Air (No Oil)" },
      { label: "Purity Grade", value: "First Grade Select Clean" },
    ],
    keyHighlights: [
      "Naturally split on the bough—zero mechanical cracking for effortless opening",
      "Roasted with dry hot air without frying oils or artificial flavor enhancers",
      "Vibrant purple-green inner skin and emerald kernel signaling maximum freshness and antioxidant potency",
    ],
  },
  {
    id: "golden-raisins",
    categoryKey: "dry-fruits",
    category: "Select Dry Fruits",
    name: "Golden Long Seedless Raisins",
    kicker: "Sun-Cured Afghan Amber · Natural Honey Glaze & High Iron",
    quoteName: "Golden Long Seedless Raisins",
    tagline: "Slender golden raisins with natural honey sweetness.",
    description:
      "Derived from premium seedless green grapes and naturally cured under arid sun conditions. Slender elongated berries with a glowing amber-golden hue, soft chewy bite, and deep natural grape honey sweetness without added sugar or syrups.",
    originBadge: "Long Slender Kernel · Sun-Cured Amber",
    packImg: "/assets/monagrow-raisins-pouch-v2.png",
    bowlImg: "/assets/hero-center-dryfruit.png",
    bowlAlt: "Wooden bowl of glowing long amber seedless raisins",
    packAlt: "Monagrow Golden Long Seedless Raisins 500g Pouch",
    retailSizes: ["250g Zip Pouch", "500g Standup Pouch", "1 kg Resealable Bag"],
    bulkSizes: ["10 kg Export Master Cartons", "12.5 kg Food-Service Boxes", "Direct FCL Shipments"],
    specs: [
      { label: "Berry Length", value: "12 mm - 16 mm Slender Long" },
      { label: "Seed Status", value: "100% Naturally Seedless" },
      { label: "Moisture Range", value: "13.0% - 15.5% Tender Chew" },
      { label: "Added Sugar", value: "0.0% Zero Added Sugar or Syrups" },
      { label: "Color Uniformity", value: "First Grade Golden Amber" },
      { label: "Sulfur Dioxide (SO2)", value: "Strict International Food Safety Limits" },
    ],
    keyHighlights: [
      "Extra-long slender berry geometry preferred by luxury bakeries and festive pilafs",
      "Washed, double-stemmed, and laser sorted to ensure zero grit or foreign debris",
      "Packed in nitrogen-blanketed moisture-barrier bags to preserve tenderness",
    ],
  },
  {
    id: "cane-sugar",
    categoryKey: "sugar",
    category: "Refined Sugar",
    name: "Sugar",
    kicker: "Refined Sugar · 99.85% Minimum Polarization",
    quoteName: "Pure Refined Sugar (ICUMSA 45)",
    tagline: "Fine white crystals for everyday use.",
    description:
      "Refined from fresh-harvest sugarcane, Monagrow ICUMSA 45 represents the highest purity grade in international commodity trade. Free-flowing, sparkling white crystals with 99.85% minimum polarization, engineered for premium food manufacturing, confectionery, and retail distribution.",
    originBadge: "ICUMSA 45 RBU Max · 99.85% Minimum Pol",
    packImg: "/assets/monagrow-sugar-bag-cutout.png",
    bowlImg: "/assets/hero-center-sugar.png",
    bowlAlt: "Full ceramic bowl of sparkling sugar crystals",
    packAlt: "Monagrow Pure Sugar pouch",
    retailSizes: ["1 kg Retail Pack", "5 kg Heavy-Duty Poly Pouch"],
    bulkSizes: ["25 kg Multi-Wall Paper Bags", "50 kg Woven PP with PE Inner Liner", "1 MT Jumbo Sling Bags"],
    specs: [
      { label: "Color Index", value: "ICUMSA 45 RBU Maximum" },
      { label: "Sucrose Polarization", value: "99.85% Minimum Pure" },
      { label: "Moisture Content", value: "Under 0.04% Dry Crystals" },
      { label: "Dissolution Rate", value: "100% Instant Clean Dissolve" },
      { label: "Granulation", value: "Fine to Medium Uniform" },
      { label: "Conductivity Ash", value: "Under 0.04% Maximum" },
    ],
    keyHighlights: [
      "Ultra-low moisture specification prevents clumping during ocean transit and warehouse storage",
      "Food-grade polyethylene-lined sacks safeguard crystal cleanliness from humidity",
      "Continuous third-party lab inspection verification seals on every outgoing container lot",
    ],
  },
  {
    id: "natural-brown-sugar",
    categoryKey: "sugar",
    category: "Refined Sugar",
    name: "Natural Brown Cane Sugar",
    kicker: "100% Natural · Unrefined Minerals · Pure & Wholesome",
    quoteName: "Natural Brown Sugar",
    tagline: "Naturally Retained Molasses & Rich Golden Aroma",
    description:
      "Naturally derived from premium freshly harvested sugarcane, Monagrow Natural Brown Sugar retains its wholesome golden molasses goodness, deep aromatic sweetness, and vital trace minerals. Free from artificial bleaching, chemical additives, or preservatives—crafted for coffee, tea, artisan baking, and premium hospitality tables.",
    originBadge: "100% Natural Cane · Retained Molasses Minerals",
    packImg: "/assets/monagrow-brown-sugar-box-cutout.png",
    bowlImg: "/assets/hero-center-brown-sugar.png",
    bowlAlt: "Wooden bowl of golden amber natural brown sugar crystals",
    packAlt: "Monagrow Natural Brown Sugar 350g Retail Dispenser Box",
    retailSizes: ["350g Sachet Dispenser Box", "1 kg Standup Zipper Pouch"],
    bulkSizes: ["25 kg Multi-Wall Kraft Paper Bags", "50 kg Woven PP with Food-Grade Inner Liner", "Palletized Export Loads"],
    specs: [
      { label: "Purity & Form", value: "100% Natural Brown Cane" },
      { label: "Molasses Content", value: "Naturally Retained" },
      { label: "Additive Level", value: "Zero Additives & Preservative Free" },
      { label: "Granulation", value: "Golden Sparkling Demerara" },
      { label: "Retail Pack", value: "350g Sachet Dispenser Box" },
      { label: "Certification", value: "Non-GMO & Food Grade Purity" },
    ],
    keyHighlights: [
      "Retains natural sugarcane molasses, rich caramel notes, and essential trace minerals",
      "100% unbleached and additive-free with verified non-GMO food-grade purity",
      "Convenient 350g retail dispenser box with portion-controlled single-serve sachets ideal for premium cafe and hospitality use",
    ],
  },

];

export const RICE_ADDITIONAL_PRODUCTS: CommodityProduct[] = [
  {
    id: "basmati-brown-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Rozana Basmati Steam Rice",
    kicker: "Daily Essential · Steam Processed",
    quoteName: "Rozana Basmati Steam Rice",
    tagline: "Daily Essential | Delicious Meals",
    description:
      "Designed for everyday cooking, Rozana Basmati Steam Rice offers a practical choice for preparing satisfying meals at home or in commercial kitchens. Its steam-processing method supports grain separation, making it suitable for a variety of traditional rice dishes.",
    originBadge: "Average Grain Length: 7.65 MM · Daily Essential",
    packImg: "/assets/monagrow-brown-rice-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Rozana Basmati Steam Rice",
    packAlt: "Monagrow Rozana Basmati Steam Rice Pack",
    retailSizes: ["1 kg", "5 kg"],
    bulkSizes: ["10 kg", "25 kg", "50 kg Export Sack"],
    specs: [
      { label: "Grain Length", value: "7.65 MM" },
      { label: "Processing", value: "Steam Processed" },
      { label: "Energy", value: "366.42 kcal" },
      { label: "Protein", value: "8.91 g" },
    ],
    keyHighlights: [
      "Ideal for Daily Cooking: Practical, high-value choice for regular household meals",
      "Easy Meal Pairing: Complements dals, vegetable curries, and regional side dishes",
      "Steam Processing: Supports grain separation and prevents clumping",
    ],
  },
  {
    id: "traditional-basmati-rice",
    categoryKey: "rice",
    category: "Grains & Rice",
    name: "Rozana Basmati Sella Rice",
    kicker: "Everyday Convenience · Parboiled Variety",
    quoteName: "Rozana Basmati Sella Rice",
    tagline: "Everyday Convenience | Reliable Performance",
    description:
      "Rozana Basmati Sella Rice combines the practical benefits of parboiled rice with versatility for everyday cooking. Its light grains are suitable for a variety of rice-based meals, offering a convenient option for households and food-service kitchens.",
    originBadge: "Average Grain Length: 7.65 MM · Parboiled Rozana",
    packImg: "/assets/monagrow-traditional-basmati-bag-cutout.png",
    bowlImg: "/assets/hero-center-rice.png",
    bowlAlt: "Full ceramic bowl of Rozana Basmati Sella Rice",
    packAlt: "Monagrow Rozana Basmati Sella Rice Pack",
    retailSizes: ["1 kg", "5 kg"],
    bulkSizes: ["10 kg", "25 kg", "50 kg Export Sack"],
    specs: [
      { label: "Grain Length", value: "7.65 MM" },
      { label: "Processing", value: "Parboiled Sella" },
      { label: "Energy", value: "344 kcal" },
      { label: "Protein", value: "6.7 g" },
    ],
    keyHighlights: [
      "Parboiled Rice Variety: Practical parboiling benefits for everyday efficiency",
      "Separate Grain Texture: Stays light and fluffy without sticking",
      "Suitable for Everyday Meals: Perfect for high-volume family and institutional cooking",
    ],
  },
  {
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
    packImg: "/assets/monagrow-premium-sona-masoori-bag-v2.png",
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
    packImg: "/assets/monagrow-rozana-sona-masoori-bag-v2.png",
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


];

function toCommodityProduct(p: any): CommodityProduct {
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
    .map((v: any) => v.weight);

  return {
    id: p.id,
    categoryKey: p.categoryKey,
    category:
      p.category ||
      (p.categoryKey === "rice"
        ? "Grains & Rice"
        : p.categoryKey === "coffee"
        ? "Specialty Estate"
        : p.categoryKey === "sugar"
        ? "Refined Sugar"
        : "Select Dry Fruits"),
    name: p.name,
    kicker: p.kicker || "",
    quoteName: p.quoteName || p.name,
    tagline: p.tagline || "",
    description: p.description || "",
    originBadge: p.originBadge || "",
    packImg: p.packImg || "/assets/monagrow-rice-bag-cutout.png",
    bowlImg: p.bowlImg || "/assets/hero-center-rice.png",
    bowlAlt: p.bowlAlt || p.name,
    packAlt: p.packAlt || p.name,
    retailSizes: retailSizes.length > 0 ? retailSizes : ["1 kg", "5 kg"],
    bulkSizes: bulkSizes.length > 0 ? bulkSizes : ["10 kg", "25 kg", "50 kg"],
    specs: p.specs || [],
    keyHighlights: p.keyHighlights || [],
  };
}

// Live active products from admin database store (falls back to static defaults if empty)
const storeProducts: CommodityProduct[] = ((adminStore as any)?.products || [])
  .filter((p: any) => p.isActive !== false)
  .map(toCommodityProduct);

export const PRODUCTS: CommodityProduct[] =
  storeProducts.length > 0 ? storeProducts : STATIC_PRODUCTS;

export const RICE_PAGE_PRODUCTS: CommodityProduct[] = PRODUCTS.filter(
  (p) => p.categoryKey === "rice"
);

export function getRicePageProducts(): CommodityProduct[] {
  return RICE_PAGE_PRODUCTS;
}

export const SUGAR_ADDITIONAL_PRODUCTS: CommodityProduct[] = [];
export const SUGAR_PAGE_PRODUCTS: CommodityProduct[] = PRODUCTS.filter(
  (p) => p.categoryKey === "sugar"
);

export function getSugarPageProducts(): CommodityProduct[] {
  return SUGAR_PAGE_PRODUCTS;
}

export function getProductsByCategory(categoryKey: string): CommodityProduct[] {
  return PRODUCTS.filter((p) => p.categoryKey === categoryKey);
}

export function getProductById(id: string): CommodityProduct | undefined {
  return (
    PRODUCTS.find((p) => p.id === id) ||
    STATIC_PRODUCTS.find((p) => p.id === id)
  );
}


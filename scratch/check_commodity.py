import re

with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find products in COMMODITY_PRODUCTS
products = re.findall(r'id:\s*"([^"]+)",\s*categoryKey:\s*"([^"]+)",(?:.*?packImg:\s*"([^"]+)",)?', content, re.DOTALL)
print("Found products:")
for p in products:
    if p[1] == 'dry-fruits':
        print(f"ID: {p[0]}, Category: {p[1]}, PackImg: {p[2]}")

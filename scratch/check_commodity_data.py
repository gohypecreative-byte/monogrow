import re

with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'id:\s*"([^"]+)",\s*categoryKey:\s*"rice"', text)
print('Rice product IDs in STATIC_PRODUCTS:', matches)

import re

with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

products = re.findall(r'id:\s*"([^"]+)",\s*categoryKey:\s*"([^"]+)",(?:.*?packImg:\s*"([^"]+)",)?', content, re.DOTALL)
for p in products:
    if 'sona' in p[0]:
        print(f"ID: {p[0]}, Category: {p[1]}, PackImg: {p[2]}")

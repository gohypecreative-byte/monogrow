import re

with open('components/ProductSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)"', text)
for m in matches:
    print(m)

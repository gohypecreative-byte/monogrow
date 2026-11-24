with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'id:\s*"([^"]+)",\s*categoryKey:\s*"rice"', text))
for m in matches:
    start = max(0, m.start() - 30)
    end = min(len(text), m.end() + 150)
    print(text[start:end])
    print('='*50)

with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*"([^"]+)",\s*categoryKey:\s*"dry-fruits"[\s\S]*?packImg:\s*"([^"]+)"', text)
for m in matches:
    print(m)

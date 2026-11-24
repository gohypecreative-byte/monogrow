with open('components/WholesaleCalculator.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line for line in text.split('\n') if 'rice' in line.lower() or 'sona' in line.lower()]
print('WholesaleCalculator rice lines:', len(matches))
for m in matches[:10]:
    print(m)

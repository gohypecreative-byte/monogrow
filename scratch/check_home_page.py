with open('app/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<[A-Z][A-Za-z0-9]+', text)
print('Components on home page (app/page.tsx):', matches)

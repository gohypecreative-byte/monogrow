with open('components/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'href=["\']([^"\']+)["\']', text)
print('Navbar hrefs:', sorted(set(matches)))

for line in text.split('\n'):
    if 'dry' in line.lower() or 'fruit' in line.lower():
        print('Navbar line:', line.strip())

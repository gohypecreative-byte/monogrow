with open('app/admin/products/[id]/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'/assets/[^"\']+', text)
print('Assets in admin product page:', set(matches))

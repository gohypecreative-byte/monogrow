with open('app/categories/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Print how products are rendered in categories page
idx = text.find('filteredProducts.map')
if idx != -1:
    print(text[idx-200:idx+800])
else:
    print('filteredProducts.map not found')

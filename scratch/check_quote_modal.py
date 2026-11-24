with open('components/QuoteModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
commodities = re.findall(r'\"([^\"]*(?:Rice|rice|Coffee|Sugar|Dry)[^\"]*)\"', text)
print('QuoteModal options:', commodities[:15])

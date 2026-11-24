with open('components/ProductDetailModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.split('\n'):
    if 'retailSizes' in line or 'bulkSizes' in line or 'Packaging' in line:
        print(line)

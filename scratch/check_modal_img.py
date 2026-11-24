with open('components/ProductDetailModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.split('\n')):
    if 'packImg' in line or 'bowlImg' in line or 'Image' in line:
        print(f"{i+1}: {line}")

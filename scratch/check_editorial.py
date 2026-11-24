import re

with open('data/categoryEditorial.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'/assets/[^"]+', text):
    print('categoryEditorial.ts:', m.group(0))

with open('components/CategoryGuide.tsx', 'r', encoding='utf-8') as f:
    text2 = f.read()

for m in re.finditer(r'/assets/[^"]+', text2):
    print('CategoryGuide.tsx:', m.group(0))

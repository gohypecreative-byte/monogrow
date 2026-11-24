import json

with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.split('\n')):
    if 'cashews-bag-cutout' in line or 'almonds-bag-cutout' in line or 'walnuts-bag-cutout' in line:
        print(f"Line {i+1}: {line}")

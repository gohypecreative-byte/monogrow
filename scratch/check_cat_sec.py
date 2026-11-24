with open('components/CategorySection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.split('\n'):
    if 'dry' in line.lower() or 'fruit' in line.lower() or 'pack' in line.lower():
        print(line[:120])

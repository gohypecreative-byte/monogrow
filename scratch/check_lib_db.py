with open('lib/db.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.split('\n')[:80]:
    print(line)

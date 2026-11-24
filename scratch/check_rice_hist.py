with open('components/RiceHistorySection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print('RiceHistorySection length:', len(text))
for line in text.split('\n')[:40]:
    print(line)

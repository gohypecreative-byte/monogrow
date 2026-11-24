with open('components/PremiumCommodityPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(50, min(len(lines), 160)):
    print(f"{i+1}: {lines[i]}", end='')

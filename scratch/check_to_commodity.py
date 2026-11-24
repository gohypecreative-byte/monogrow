with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(718, 745):
    print(f"{i+1}: {lines[i]}", end='')

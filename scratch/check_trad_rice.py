with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'id: "traditional-basmati-rice"' in l:
        for j in range(i, min(len(lines), i+45)):
            print(f"{j+1}: {lines[j]}", end='')
        break

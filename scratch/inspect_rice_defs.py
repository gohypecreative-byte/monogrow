with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_rice = False
count = 0
for i, line in enumerate(lines):
    if 'categoryKey: "rice"' in line:
        print(f"--- Line {i+1} ---")
        for j in range(max(0, i-3), min(len(lines), i+35)):
            print(lines[j], end='')
        count += 1
        if count >= 2:
            break

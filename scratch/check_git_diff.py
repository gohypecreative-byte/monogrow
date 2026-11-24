import subprocess

try:
    diff = subprocess.check_output('git diff HEAD data/commodityData.ts', shell=True).decode()
    for line in diff.split('\n'):
        if 'packImg' in line or 'pouch' in line or 'dryfruit' in line:
            print(line)
except Exception as e:
    print('Error:', e)

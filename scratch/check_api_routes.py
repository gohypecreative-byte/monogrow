import os

for root, dirs, files in os.walk('app/api'):
    print(root, files)

import subprocess

try:
    log = subprocess.check_output('git log -n 5 --stat -- public/assets/monagrow*dryfruit*', shell=True).decode()
    print('Git log for dry fruits:\n', log)
except Exception as e:
    print('Error:', e)

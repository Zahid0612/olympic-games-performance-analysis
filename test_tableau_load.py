import os
import time
import json
import subprocess

log_path = os.path.expanduser(r'~\Documents\My Tableau Repository\Logs\log.txt')
with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    start_lines = len(f.readlines())

exe_path = r'C:\Program Files\Tableau\Tableau Public 2025.2\bin\tabpublic.exe'
twbx_path = r'c:\Users\Hp\Desktop\olympic\olympic_analytics_repaired.twbx'

print(f"Launching Tableau Public with {twbx_path}...")
proc = subprocess.Popen([exe_path, twbx_path])

print("Waiting 35 seconds for document parsing and validation...")
time.sleep(35)

print("Checking log file...")
with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    all_lines = f.readlines()

new_lines = all_lines[start_lines:]
print(f"Total new lines written by Tableau: {len(new_lines)}")

errors_found = []
for line in new_lines:
    try:
        data = json.loads(line)
        sev = data.get('sev', '')
        k = data.get('k', '')
        if sev in ['error', 'fatal'] or 'error' in k.lower():
            errors_found.append(data)
    except Exception:
        if 'error' in line.lower() or 'd2e8da72' in line.lower():
            errors_found.append(line)

print(f"Total errors found: {len(errors_found)}")
for err in errors_found:
    print(err)

print("Terminating test process...")
proc.terminate()
try:
    proc.wait(timeout=5)
except subprocess.TimeoutExpired:
    proc.kill()
print("Test completed.")

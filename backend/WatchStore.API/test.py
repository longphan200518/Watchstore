def simulate_mojibake(s, times):
    for i in range(times):
        s = s.encode('utf-8').decode('cp1252')
    return s

def fix_mojibake(s, times):
    for i in range(times):
        s = s.encode('cp1252').decode('utf-8')
    return s

orig = 'Đồng hồ Nam'
m1 = simulate_mojibake(orig, 1)
m2 = simulate_mojibake(orig, 2)
m3 = simulate_mojibake(orig, 3)

print('M1:', repr(m1))
print('M2:', repr(m2))
print('M3:', repr(m3))

import io
with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'r', encoding='utf-8') as f:
    text = f.read()

import re
match = re.search(r'.+Nam', text)
if match:
    print('Found in file:', repr(match.group(0)))

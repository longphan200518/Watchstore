import io

def fix_mojibake(t):
    # Try decoding up to 3 times
    for i in range(3):
        try:
            t = t.encode('windows-1252').decode('utf-8')
        except:
            break
    return t

with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'r', encoding='utf-8') as f:
    text = f.read()

fixed_text = fix_mojibake(text)

with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'w', encoding='utf-8-sig') as f:
    f.write(fixed_text)

print('Done!')

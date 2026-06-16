import io
import re

def fix_mojibake(text):
    # Try decoding using latin1
    for _ in range(5):
        try:
            new_text = text.encode('latin1').decode('utf-8')
            if new_text != text:
                text = new_text
            else:
                break
        except Exception as e:
            break
    return text

with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'r', encoding='utf-8') as f:
    text = f.read()

fixed = fix_mojibake(text)

with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'w', encoding='utf-8-sig') as f:
    f.write(fixed)

print('Done')

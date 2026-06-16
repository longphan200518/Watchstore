import io

def to_byte(char):
    try:
        return char.encode('cp1252')
    except UnicodeEncodeError:
        if ord(char) < 256:
            return bytes([ord(char)])
        raise

def fix_mojibake(text):
    for i in range(5):
        try:
            b = b''.join(to_byte(c) for c in text)
            new_text = b.decode('utf-8')
            if new_text != text:
                text = new_text
            else:
                break
        except Exception as e:
            print("Stop at", i, type(e))
            break
    return text

with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'r', encoding='utf-8') as f:
    text = f.read()

fixed = fix_mojibake(text)

with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'w', encoding='utf-8-sig') as f:
    f.write(fixed)

print('Done')

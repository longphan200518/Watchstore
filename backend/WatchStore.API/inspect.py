import io
with io.open(r'..\WatchStore.API\Data\DatabaseSeeder.cs', 'r', encoding='utf-8') as f:
    text = f.read()

for i, c in enumerate(text):
    try:
        c.encode('cp1252')
    except UnicodeEncodeError:
        if ord(c) > 255:
            print(f"Index {i}, Char {repr(c)}, Ord {ord(c)}")

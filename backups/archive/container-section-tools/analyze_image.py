import numpy as np
from PIL import Image

img_path = r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png'
img = Image.open(img_path).convert('L')
arr = np.array(img)

# Binary mask of dark pixels (strokes/outlines in the reference image)
# The image appears to be line art on white background
stroke_mask = arr < 220

# Let's inspect row sums to separate Anchor Emblem from Wordmark
row_counts = stroke_mask.sum(axis=1)

print("Row indices with content:")
rows_with_content = np.where(row_counts > 0)[0]
print(f"Top row: {rows_with_content.min()}, Bottom row: {rows_with_content.max()}")

# Find the gap between Anchor emblem and Wordmark
in_content = False
sections = []
start = 0
for y in range(rows_with_content.min(), rows_with_content.max() + 1):
    if row_counts[y] > 0 and not in_content:
        in_content = True
        start = y
    elif row_counts[y] == 0 and in_content:
        in_content = False
        sections.append((start, y - 1))
if in_content:
    sections.append((start, rows_with_content.max()))

print("Sections (Y ranges):", sections)

for idx, (y1, y2) in enumerate(sections):
    sec_mask = stroke_mask[y1:y2+1, :]
    cols_with_content = np.where(sec_mask.sum(axis=0) > 0)[0]
    x1, x2 = cols_with_content.min(), cols_with_content.max()
    print(f"Section {idx}: Y=[{y1}, {y2}] (h={y2-y1+1}), X=[{x1}, {x2}] (w={x2-x1+1})")

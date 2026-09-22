import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Wordmark Y range: 550 to 670
wm_crop = arr[550:670, 200:810]
dark_wm = wm_crop > 100

# Let's find column ranges for each character in #HashHarbour!
col_counts = dark_wm.sum(axis=0)
x_coords = np.where(col_counts > 0)[0] + 200

# Find gaps between characters
char_bounds = []
in_char = False
start_x = 0

for x in range(200, 810):
    cnt = (arr[550:670, x] > 100).sum()
    if cnt > 0 and not in_char:
        in_char = True
        start_x = x
    elif cnt == 0 and in_char:
        in_char = False
        char_bounds.append((start_x, x - 1))

if in_char:
    char_bounds.append((start_x, 809))

print("=== WORDMARK CHARACTERS FOUND ===")
text = "#HashHarbour"
print(f"Expected characters: {len(text)} ({text})")
print(f"Found character clusters: {len(char_bounds)}")

for i, (x1, x2) in enumerate(char_bounds):
    char_crop = arr[550:670, x1:x2+1] > 100
    cy, cx = np.where(char_crop)
    y1, y2 = cy.min() + 550, cy.max() + 550
    print(f"Char {i:2d} | X=[{x1:3d}..{x2:3d}] (w={x2-x1+1:2d}) | Y=[{y1:3d}..{y2:3d}] (h={y2-y1+1:2d})")

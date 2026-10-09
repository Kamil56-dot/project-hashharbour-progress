import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Let's inspect column counts across Y=100..550 (anchor height) to see where the actual anchor sits vs any border lines!
anchor_zone = arr[100:550, :] < 200
col_sums = anchor_zone.sum(axis=0)

print("Non-zero columns in anchor zone:")
cols_with_pixels = np.where(col_sums > 0)[0]
print(f"Col min: {cols_with_pixels.min()}, Col max: {cols_with_pixels.max()}")

# Let's print column sums across X range to see spikes (e.g. outer border vs anchor)
for x in range(0, 1024, 32):
    print(f"X {x:4d}..{x+31:4d}: sum={col_sums[x:x+32].sum()}")

# Let's also check row sums across Y range
row_sums = (arr < 200).sum(axis=1)
for y in range(0, 1024, 32):
    print(f"Y {y:4d}..{y+31:4d}: sum={row_sums[y:y+32].sum()}")

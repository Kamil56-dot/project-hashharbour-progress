import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Print rows from Y=0 to Y=200 that have pixels > 100
for y in range(0, 200):
    row_pixels = np.where(arr[y, :] > 100)[0]
    if len(row_pixels) > 0:
        print(f"Y={y:3d}: count={len(row_pixels):3d}, X min={row_pixels.min():3d}, X max={row_pixels.max():3d}")

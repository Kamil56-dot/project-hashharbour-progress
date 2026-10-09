import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Let's inspect column counts for X=0 to 1023 for Y=150..540
# We count how many pixels per column are dark (< 150)
col_counts = (arr[150:540, :] < 150).sum(axis=0)

# Print columns where there are dark pixels
for x in range(0, 1024):
    if col_counts[x] > 0:
        print(f"X={x}: count={col_counts[x]}")

import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Binary mask of the artwork (> 100)
mask = (arr > 100)

# Filter out margin artifacts (X outside [20..1000] or Y outside [20..1000])
clean_mask = np.zeros_like(mask, dtype=bool)
clean_mask[20:1000, 20:1000] = mask[20:1000, 20:1000]

# Separate Anchor Emblem (Y 100 to 550) vs Wordmark (Y 550 to 700)
emblem_mask = np.zeros_like(clean_mask, dtype=bool)
emblem_mask[100:550, :] = clean_mask[100:550, :]

wm_mask = np.zeros_like(clean_mask, dtype=bool)
wm_mask[550:700, :] = clean_mask[550:700, :]

print(f"Emblem mask pixels: {emblem_mask.sum()}")
print(f"Wordmark mask pixels: {wm_mask.sum()}")

# Boundary pixel extraction for Emblem
# We trace outer and inner contours of the emblem
def get_contours_from_mask(m):
    # Find boundary pixels of mask m
    from scipy.ndimage import binary_erosion
    eroded = binary_erosion(m)
    boundary = m & (~eroded)
    return boundary

try:
    from scipy.ndimage import binary_erosion
    b_emblem = get_contours_from_mask(emblem_mask)
    b_wm = get_contours_from_mask(wm_mask)
    print(f"Emblem boundary pixels: {b_emblem.sum()}")
    print(f"Wordmark boundary pixels: {b_wm.sum()}")
except Exception as e:
    print("Error:", e)

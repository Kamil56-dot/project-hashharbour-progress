import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Artwork pixels are white/gray lines (> 100)
artwork = arr > 100
ay, ax = np.where(artwork)

print("=== TOTAL ARTWORK BOUNDS (Value > 100) ===")
print(f"Y min: {ay.min()}, Y max: {ay.max()}, Height: {ay.max() - ay.min() + 1}")
print(f"X min: {ax.min()}, X max: {ax.max()}, Width: {ax.max() - ax.min() + 1}")
print(f"Global Center X: {(ax.min() + ax.max()) / 2.0:.2f}")

# Separate Emblem (top half) vs Wordmark (bottom half)
emblem_mask = artwork & (np.arange(1024)[:, None] <= 550)
ey, ex = np.where(emblem_mask)

print("\n=== ANCHOR EMBLEM BOUNDS ===")
print(f"Y min: {ey.min()}, Y max: {ey.max()}, Height: {ey.max() - ey.min() + 1}")
print(f"X min: {ex.min()}, X max: {ex.max()}, Width: {ex.max() - ex.min() + 1}")
print(f"Anchor Center X: {(ex.min() + ex.max()) / 2.0:.2f}")

wm_mask = artwork & (np.arange(1024)[:, None] > 550)
wy, wx = np.where(wm_mask)

print("\n=== WORDMARK BOUNDS ===")
print(f"Y min: {wy.min()}, Y max: {wy.max()}, Height: {wy.max() - wy.min() + 1}")
print(f"X min: {wx.min()}, X max: {wx.max()}, Width: {wx.max() - wx.min() + 1}")
print(f"Wordmark Center X: {(wx.min() + wx.max()) / 2.0:.2f}")

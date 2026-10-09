import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Ignore border noise: take inner region [20..1000, 20..1000]
inner = arr[20:1004, 20:1004]

# The background inside the image is WHITE (~255).
# The outlines of the logo are DARK lines (< 150).
dark_lines = inner < 150
iy, ix = np.where(dark_lines)

# Real Y and X in full image coordinates
real_y = iy + 20
real_x = ix + 20

print("=== REAL LOGO OUTLINE BOUNDS (DARK LINES < 150) ===")
print(f"Total Y range: {real_y.min()} to {real_y.max()} (Height: {real_y.max() - real_y.min() + 1})")
print(f"Total X range: {real_x.min()} to {real_x.max()} (Width: {real_x.max() - real_x.min() + 1})")
print(f"Global Center X: {(real_x.min() + real_x.max()) / 2.0:.2f}")

# Separate Anchor Emblem (Y: 100..560) vs Wordmark (Y: 565..700)
emblem_indices = (real_y <= 560)
ey = real_y[emblem_indices]
ex = real_x[emblem_indices]

print("\n=== ANCHOR EMBLEM REAL BOUNDS ===")
print(f"Anchor Y: {ey.min()} to {ey.max()} (Height: {ey.max() - ey.min() + 1})")
print(f"Anchor X: {ex.min()} to {ex.max()} (Width: {ex.max() - ex.min() + 1})")
print(f"Anchor Center X: {(ex.min() + ex.max()) / 2.0:.2f}")

wm_indices = (real_y > 560) & (real_y < 700)
wy = real_y[wm_indices]
wx = real_x[wm_indices]

print("\n=== WORDMARK REAL BOUNDS ===")
print(f"Wordmark Y: {wy.min()} to {wy.max()} (Height: {wy.max() - wy.min() + 1})")
print(f"Wordmark X: {wx.min()} to {wx.max()} (Width: {wx.max() - wx.min() + 1})")
print(f"Wordmark Center X: {(wx.min() + wx.max()) / 2.0:.2f}")

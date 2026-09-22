import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Filter out margin noise: X in 20..1000, Y in 20..1000
mask = (arr > 100)
mask[:, :20] = False
mask[:, 1000:] = False
mask[:20, :] = False
mask[1000:, :] = False

# Anchor Emblem (Y < 550)
ay, ax = np.where(mask & (np.arange(1024)[:, None] < 550))
print("=== ANCHOR EMBLEM PRECISE BOUNDS ===")
print(f"Top Y: {ay.min()}, Bottom Y: {ay.max()} (Height: {ay.max() - ay.min() + 1})")
print(f"Left X: {ax.min()}, Right X: {ax.max()} (Width: {ax.max() - ax.min() + 1})")
print(f"Center X: {(ax.min() + ax.max()) / 2.0:.2f}")

# Wordmark (Y >= 550)
wy, wx = np.where(mask & (np.arange(1024)[:, None] >= 550))
print("\n=== WORDMARK PRECISE BOUNDS ===")
print(f"Top Y: {wy.min()}, Bottom Y: {wy.max()} (Height: {wy.max() - wy.min() + 1})")
print(f"Left X: {wx.min()}, Right X: {wx.max()} (Width: {wx.max() - wx.min() + 1})")
print(f"Center X: {(wx.min() + wx.max()) / 2.0:.2f}")

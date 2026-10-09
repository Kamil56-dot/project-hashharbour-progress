import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Let's zero out the border lines!
# Let's see where the border lines are:
clean = arr.copy()
# If a row or column has continuous dark line across the edge, zero it out:
clean[:100, :] = 255
clean[700:, :] = 255
clean[:, :200] = 255
clean[:, 820:] = 255

dark = clean < 150
iy, ix = np.where(dark)

print("=== ANCHOR EMBLEM INSIDE MARGINS (200..820, 100..700) ===")
print(f"Anchor Y: {iy.min()} to {iy.max()} (Height: {iy.max() - iy.min() + 1})")
print(f"Anchor X: {ix.min()} to {ix.max()} (Width: {ix.max() - ix.min() + 1})")
print(f"Center X: {(ix.min() + ix.max()) / 2.0:.2f}")

# Save clean artwork mask
Image.fromarray((clean < 150).astype(np.uint8)*255).save('clean_artwork.png')

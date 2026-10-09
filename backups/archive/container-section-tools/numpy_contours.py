import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Binary mask of artwork (> 100)
mask = (arr > 100)
mask[:, :20] = False
mask[:, 1000:] = False
mask[:20, :] = False
mask[1000:, :] = False

# Pure numpy binary erosion
def erod(m):
    e = np.zeros_like(m)
    e[1:-1, 1:-1] = m[1:-1, 1:-1] & m[:-2, 1:-1] & m[2:, 1:-1] & m[1:-1, :-2] & m[1:-1, 2:]
    return e

boundary = mask & (~erod(mask))

emblem_b = boundary & (np.arange(1024)[:, None] < 550)
wm_b = boundary & (np.arange(1024)[:, None] >= 550)

print(f"Emblem boundary pixels: {emblem_b.sum()}")
print(f"Wordmark boundary pixels: {wm_b.sum()}")

# Let's save boundary images
Image.fromarray(emblem_b.astype(np.uint8)*255).save('emblem_boundary.png')
Image.fromarray(wm_b.astype(np.uint8)*255).save('wm_boundary.png')
print("Saved emblem_boundary.png and wm_boundary.png")

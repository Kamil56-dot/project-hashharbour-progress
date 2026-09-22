import numpy as np
from PIL import Image

def ramer_douglas_peucker(points, epsilon):
    if len(points) < 3:
        return points
    
    # Find the point with maximum distance from line between first and last point
    p1 = np.array(points[0])
    p2 = np.array(points[-1])
    
    line_vec = p2 - p1
    line_len = np.linalg.norm(line_vec)
    if line_len == 0:
        dists = np.linalg.norm(np.array(points) - p1, axis=1)
    else:
        line_unit = line_vec / line_len
        vecs = np.array(points) - p1
        proj = np.outer(np.dot(vecs, line_unit), line_unit)
        perp = vecs - proj
        dists = np.linalg.norm(perp, axis=1)
    
    max_idx = np.argmax(dists)
    max_d = dists[max_idx]
    
    if max_d > epsilon:
        left = ramer_douglas_peucker(points[:max_idx+1], epsilon)
        right = ramer_douglas_peucker(points[max_idx:], epsilon)
        return left[:-1] + right
    else:
        return [points[0], points[-1]]

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Binary artwork mask (> 100)
mask = (arr > 100)
mask[:, :20] = False
mask[:, 1000:] = False
mask[:20, :] = False
mask[1000:, :] = False

# Separate Emblem and Wordmark
e_mask = mask.copy()
e_mask[550:, :] = False

wm_mask = mask.copy()
wm_mask[:550, :] = False

print(f"Emblem pixels: {e_mask.sum()}")
print(f"Wordmark pixels: {wm_mask.sum()}")

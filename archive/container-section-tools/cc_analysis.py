import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# White stroke pixels (> 100)
strokes = arr > 100

# Remove small corner artifacts near margins if any
# Let's inspect connected components of strokes
import cv2
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(strokes.astype(np.uint8))

print(f"Total connected components found: {num_labels - 1}")

# Print stats for components sorted by area
areas = stats[1:, cv2.CC_STAT_AREA]
sorted_indices = np.argsort(areas)[::-1]

for i in range(min(10, len(sorted_indices))):
    idx = sorted_indices[i] + 1
    x = stats[idx, cv2.CC_STAT_LEFT]
    y = stats[idx, cv2.CC_STAT_TOP]
    w = stats[idx, cv2.CC_STAT_WIDTH]
    h = stats[idx, cv2.CC_STAT_HEIGHT]
    area = stats[idx, cv2.CC_STAT_AREA]
    cx, cy = centroids[idx]
    print(f"Comp {i}: ID={idx}, X=[{x}..{x+w-1}] (w={w}), Y=[{y}..{y+h-1}] (h={h}), Area={area}, Center=({cx:.1f}, {cy:.1f})")

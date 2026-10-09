import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Threshold for line strokes: gray < 200
# Mask out outer border lines (keep Y 120..680, X 200..820)
mask = np.zeros_like(arr, dtype=bool)
mask[120:680, 200:820] = arr[120:680, 200:820] < 200

# Let's locate the ring at the top
top_rows = np.where(mask[:250, :].sum(axis=1) > 0)[0]
ring_y_min = top_rows.min()
ring_y_max = 210  # approximate ring bottom before crossbar
ring_mask = mask[ring_y_min:ring_y_max, :]
ry, rx = np.where(ring_mask)
print(f"Top Ring Y: {ry.min()+ring_y_min} to {ry.max()+ring_y_min} (Center Y: {(ry.min()+ry.max())/2.0 + ring_y_min:.2f})")
print(f"Top Ring X: {rx.min()} to {rx.max()} (Center X: {(rx.min()+rx.max())/2.0:.2f}, Diameter: {rx.max()-rx.min()+1})")

# Center of symmetry X
center_x = (rx.min() + rx.max()) / 2.0
print(f"Symmetry Center X = {center_x}")

# Let's trace all horizontal scanlines of the logo to find precise key Y levels and X widths!
y_levels = []
for y in range(ring_y_min, 580):
    row_xs = np.where(mask[y, :])[0]
    if len(row_xs) > 0:
        y_levels.append((y, row_xs.min(), row_xs.max(), len(row_xs), row_xs))

print(f"\nTotal active Y rows: {len(y_levels)}")
print(f"Top Y: {y_levels[0][0]}, Bottom Y: {y_levels[-1][0]}")

# Print key Y levels every 10px to map out the structure
print("\n--- Key Y Level Measurements ---")
for y, xmin, xmax, count, row_xs in y_levels[::10]:
    left_dist = center_x - xmin
    right_dist = xmax - center_x
    print(f"Y={y:3d} | X=[{xmin:3d}..{xmax:3d}] | Width={xmax-xmin+1:3d} | L_dist={left_dist:6.2f} | R_dist={right_dist:6.2f}")

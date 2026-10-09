import numpy as np
from PIL import Image

# Load boundary images
e_img = Image.open('emblem_boundary.png').convert('L')
e_arr = np.array(e_img) > 100

wm_img = Image.open('wm_boundary.png').convert('L')
wm_arr = np.array(wm_img) > 100

def extract_polygons(binary_arr):
    # Find loops in 2D binary grid
    visited = np.zeros_like(binary_arr, dtype=bool)
    h, w = binary_arr.shape
    loops = []
    
    # 8-neighbor directions
    dirs = [(-1,0), (-1,1), (0,1), (1,1), (1,0), (1,-1), (0,-1), (-1,-1)]
    
    for y in range(h):
        for x in range(w):
            if binary_arr[y, x] and not visited[y, x]:
                # Trace loop starting at (y,x)
                loop = []
                cy, cx = y, x
                loop.append((cx, cy))
                visited[cy, cx] = True
                
                found_next = True
                while found_next:
                    found_next = False
                    for dy, dx in dirs:
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and binary_arr[ny, nx] and not visited[ny, nx]:
                            cy, cx = ny, nx
                            loop.append((cx, cy))
                            visited[cy, cx] = True
                            found_next = True
                            break
                if len(loop) > 10:
                    loops.append(loop)
    return loops

e_loops = extract_polygons(e_arr)
wm_loops = extract_polygons(wm_arr)

print(f"Emblem loops found: {len(e_loops)}")
print(f"Wordmark loops found: {len(wm_loops)}")

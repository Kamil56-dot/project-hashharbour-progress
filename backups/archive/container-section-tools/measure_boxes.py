import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)
dark = arr < 180

row_counts = dark.sum(axis=1)
valid_rows = np.where(row_counts > 5)[0]

anchor_rows = [r for r in valid_rows if 130 <= r <= 550]
anchor_sub = dark[anchor_rows, :]
col_counts_a = anchor_sub.sum(axis=0)
valid_cols_a = np.where(col_counts_a > 2)[0]

print('Anchor Y:', min(anchor_rows), 'to', max(anchor_rows), 'h=', max(anchor_rows)-min(anchor_rows)+1)
print('Anchor X:', min(valid_cols_a), 'to', max(valid_cols_a), 'w=', max(valid_cols_a)-min(valid_cols_a)+1)
print('Anchor Center X:', (min(valid_cols_a)+max(valid_cols_a))/2.0)

wm_rows = [r for r in valid_rows if 560 <= r <= 670]
wm_sub = dark[wm_rows, :]
col_counts_w = wm_sub.sum(axis=0)
valid_cols_w = np.where(col_counts_w > 2)[0]

print('Wordmark Y:', min(wm_rows), 'to', max(wm_rows), 'h=', max(wm_rows)-min(wm_rows)+1)
print('Wordmark X:', min(valid_cols_w), 'to', max(valid_cols_w), 'w=', max(valid_cols_w)-min(valid_cols_w)+1)
print('Wordmark Center X:', (min(valid_cols_w)+max(valid_cols_w))/2.0)

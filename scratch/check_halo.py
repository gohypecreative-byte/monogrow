from PIL import Image
import numpy as np

for name in ["premium", "rozana"]:
    cutout = Image.open(f"scratch/test_cutout_{name}.png")
    arr = np.array(cutout)
    
    # Check pixels where alpha is between 1 and 250 (the edge)
    edge = (arr[:, :, 3] > 0) & (arr[:, :, 3] < 250)
    edge_rgb = arr[edge, :3]
    # Check if edge pixels are dark blue / gold (good) or bright white (halo)
    # Bright white would have min(r,g,b) > 230
    bright_edges = (edge_rgb[:, 0] > 230) & (edge_rgb[:, 1] > 230) & (edge_rgb[:, 2] > 230)
    print(f"{name}: total edge pixels={len(edge_rgb)}, bright halo pixels={bright_edges.sum()} ({bright_edges.mean():.2%})")

import numpy as np
from PIL import Image
import cv2 # Check if cv2 or scipy or just PIL/numpy is available

try:
    import cv2
    print("cv2 available")
except ImportError:
    print("cv2 not available")

try:
    import scipy
    print("scipy available")
except ImportError:
    print("scipy not available")

"""Direct u2net ONNX cutout — no rembg import."""
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

SRC = Path(
    r"C:\Users\abdur\.cursor\projects\c-Users-abdur-OneDrive-Desktop-rasul-dev"
    r"\assets\c__Users_abdur_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"empty-window_images_photo_2026-07-20_23-25-40-6dbbf978-24b4-4cb9-9ffd-29681f745c53.png"
)
OUT = Path(r"C:\Users\abdur\OneDrive\Desktop\rasul-dev\public\hero-portrait.png")
MODEL = Path.home() / ".u2net" / "u2net.onnx"

print("model", MODEL, MODEL.exists(), flush=True)
img = Image.open(SRC).convert("RGB")
orig_w, orig_h = img.size
print("image", orig_w, orig_h, flush=True)

# preprocess like rembg/u2net
size = (320, 320)
resized = img.resize(size, Image.Resampling.LANCZOS)
arr = np.array(resized).astype(np.float32) / 255.0
mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
arr = (arr - mean) / std
tensor = arr.transpose(2, 0, 1)[None, ...]  # 1,3,320,320

print("running onnx…", flush=True)
sess = ort.InferenceSession(str(MODEL), providers=["CPUExecutionProvider"])
inp_name = sess.get_inputs()[0].name
outs = sess.run(None, {inp_name: tensor})
pred = outs[0][0][0]  # 320x320
# sigmoid
pred = 1.0 / (1.0 + np.exp(-pred))
pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-8)

mask = Image.fromarray((pred * 255).astype(np.uint8), mode="L").resize(
    (orig_w, orig_h), Image.Resampling.LANCZOS
)

# slight dilate to protect sleeves/arms from being eaten
from PIL import ImageFilter

mask = mask.filter(ImageFilter.MaxFilter(5))
mask = mask.filter(ImageFilter.GaussianBlur(1.2))

rgba = img.convert("RGBA")
rgba.putalpha(mask)

bbox = rgba.getbbox()
print("bbox", bbox, flush=True)
if bbox:
    rgba = rgba.crop(bbox)

pad = 24
final = Image.new("RGBA", (rgba.width + pad * 2, rgba.height + pad * 2), (0, 0, 0, 0))
final.paste(rgba, (pad, pad), rgba)
final.save(OUT, optimize=True)
print("saved", OUT, final.size, flush=True)

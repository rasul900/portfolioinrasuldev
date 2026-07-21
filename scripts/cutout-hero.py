"""Remove background from hero portrait using rembg."""
from pathlib import Path

from PIL import Image
from rembg import remove

src = Path(
    r"C:\Users\abdur\.cursor\projects\c-Users-abdur-OneDrive-Desktop-rasul-dev"
    r"\assets\c__Users_abdur_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"empty-window_images_photo_2026-07-20_23-25-40-6dbbf978-24b4-4cb9-9ffd-29681f745c53.png"
)
out = Path(r"C:\Users\abdur\OneDrive\Desktop\rasul-dev\public\hero-portrait.png")

print("loading", src)
img = Image.open(src).convert("RGBA")
print("size", img.size, "removing bg…")
result = remove(img, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10, alpha_matting_erode_size=5)
bbox = result.getbbox()
if bbox:
    result = result.crop(bbox)
pad = 20
padded = Image.new("RGBA", (result.width + pad * 2, result.height + pad * 2), (0, 0, 0, 0))
padded.paste(result, (pad, pad), result)
padded.save(out, optimize=True)
print("saved", out, padded.size)

import qrcode
from PIL import Image

# Data to store in QR
data = "https://forms.gle/krYC6mRSbPx7Tk4s5"

# Create QR code
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # High correction for logo
    box_size=10,
    border=1,  # Minimal border (1 is the minimum recommended)
)

qr.add_data(data)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

# Load the center image
logo = Image.open("logo2-.png")

# Resize logo with high-quality resampling for better clarity
qr_width, qr_height = qr_img.size
logo_size = qr_width // 3   # logo will be 1/3 of QR size
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)

# Position logo at center
pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)

# Paste logo into QR
qr_img.paste(logo, pos, mask=logo if logo.mode == 'RGBA' else None)

# Save QR code
qr_img.save("qr_with_logo.png")

print("QR code generated successfully!")

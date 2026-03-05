from PIL import Image, ImageDraw

# Create a simple logo image (a circle)
size = 200
img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# Draw a blue circle
draw.ellipse([20, 20, 180, 180], fill=(0, 120, 215, 255), outline=(0, 80, 180, 255), width=5)

# Save the logo
img.save('logo.png')
print("Sample logo created successfully!")

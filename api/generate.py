from flask import Flask, request, jsonify
import qrcode
from PIL import Image
import io
import base64

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handler():
    try:
        data = request.json
        qr_data = data.get('data', '')
        logo_data = data.get('logo', None)
        
        if not qr_data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Create QR code
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=1,
        )
        
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
        
        # If logo is provided, add it to the center
        if logo_data:
            try:
                # Decode base64 logo
                logo_bytes = base64.b64decode(logo_data.split(',')[1] if ',' in logo_data else logo_data)
                logo = Image.open(io.BytesIO(logo_bytes))
                
                # Resize logo with high-quality resampling
                qr_width, qr_height = qr_img.size
                logo_size = qr_width // 3
                logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
                
                # Position logo at center
                pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)
                
                # Paste logo into QR
                qr_img.paste(logo, pos, mask=logo if logo.mode == 'RGBA' else None)
            except Exception as e:
                print(f"Error processing logo: {e}")
        
        # Convert to base64
        img_io = io.BytesIO()
        qr_img.save(img_io, 'PNG', quality=95)
        img_io.seek(0)
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

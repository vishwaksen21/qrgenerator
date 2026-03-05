from http.server import BaseHTTPRequestHandler
import json
import qrcode
from PIL import Image
import io
import base64

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            qr_data = data.get('data', '')
            logo_data = data.get('logo', None)
            
            if not qr_data:
                self.send_error(400, 'No data provided')
                return
            
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
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps({
                'success': True,
                'image': f'data:image/png;base64,{img_base64}'
            })
            self.wfile.write(response.encode())
            
        except Exception as e:
            print(f"Error: {str(e)}")
            import traceback
            traceback.print_exc()
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = json.dumps({
                'success': False,
                'error': str(e)
            })
            self.wfile.write(error_response.encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

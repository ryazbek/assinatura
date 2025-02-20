import qrcode
from PIL import Image
import json
import os
usuarios_json = "usuarios.json"
qr_color = "#9F9F9F"
logo_path = "logo_y.png"
os.makedirs("qrcodes", exist_ok=True)
with open(usuarios_json, "r", encoding="utf-8") as file:
    usuarios = json.load(file)
for email, usuario in usuarios.items():
    qr_data = f"https://ryazbek.github.io/assinatura/qrcode.html?user={email.split('@')[0]}"
    qr = qrcode.QRCode(version=5, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color=qr_color, back_color="white").convert("RGBA")
    if logo_path:
        logo = Image.open(logo_path)
        logo_size = (qr_img.size[0] // 4, qr_img.size[1] // 4)
        logo = logo.resize(logo_size, Image.LANCZOS)
        pos = ((qr_img.size[0] - logo_size[0]) // 2, (qr_img.size[1] - logo_size[1]) // 2)
        qr_img.paste(logo, pos, mask=logo)
    user_filename = f"qrcodes/{email.split('@')[0]}.png"
    qr_img.save(user_filename)
    print(f"QR Code gerado para {usuario['nome']} em {user_filename}")
print("✅ Todos os QR Codes foram gerados com sucesso!")

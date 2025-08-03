PORTost http.server
import socketserver

PORT = 8080

html_content = """<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مذكرة إلكترونية</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .login-box, .note-box {
            background: #fff; padding: 20px; width: 300px; margin: auto; border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        input { width: 100%; padding: 8px; margin: 5px 0; }
        button { width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>تسجيل الدخول</h2>
        <input type="text" id="username" placeholder="اسم المستخدم">
        <input type="password" id="password" placeholder="كلمة المرور">
        <button onclick="login()">دخول</button>
    </div>

    <div class="note-box" style="display:none;">
        <h2>📒 المذكرة</h2>
        <p><strong>النوع:</strong> <span id="note-type">تعليمية</span></p>
        <p><strong>المحتوى:</strong> <span id="note-content">ملاحظات عن الدرس</span></p>
    </div>

    <script>
        function login() {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user === 'admin' && pass === '1234') {
                document.querySelector('.login-box').style.display = 'none';
                document.querySelector('.note-box').style.display = 'block';
            } else {
                alert('خطأ في اسم المستخدم أو كلمة المرور');
            }
        }
    </script>
</body>
</html>"""

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(html_content.encode('utf-8'))
        else:
            self.send_error(404, "الصفحة غير موجودة")

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"🚀 الخادم يعمل على https://nexora-t.github.io/AIPCOIN-aindrop:{PORT}")
    httpd.serve_forever()

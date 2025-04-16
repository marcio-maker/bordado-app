from flask import Flask, request, jsonify, render_template
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import logging

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
csrf = CSRFProtect(app)
CORS(app)  # Permite requisições de diferentes origens

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ... (restante do código de configuração de email permanece igual)

@app.route('/submit_quote', methods=['POST'])
@csrf.exempt
def submit_quote():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Nenhum dado recebido"}), 400

        required_fields = ['name', 'email', 'phone', 'details']
        if not all(field in data for field in required_fields):
            return jsonify({"status": "error", "message": "Campos obrigatórios faltando"}), 400

        # Corpo do email formatado
        email_body = f"""
        <h2>Nova solicitação de orçamento</h2>
        <p><strong>Nome:</strong> {data['name']}</p>
        <p><strong>Email:</strong> {data['email']}</p>
        <p><strong>Telefone:</strong> {data['phone']}</p>
        <p><strong>Detalhes:</strong> {data['details']}</p>
        """
        
        send_email("Novo Orçamento - Sirleia Bordados", email_body, "contato@sirleiabordados.com.br")
        
        logger.info(f"Orçamento recebido de: {data['email']}")
        return jsonify({
            "status": "success",
            "message": "Sua solicitação foi recebida com sucesso! Entraremos em contato em breve."
        }), 200
        
    except smtplib.SMTPException as e:
        logger.error(f"Erro ao enviar email: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Erro ao enviar sua mensagem. Por favor, tente novamente mais tarde."
        }), 500
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Ocorreu um erro inesperado. Por favor, tente novamente."
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
    def send_email(subject, body, to_email):
    try:
        msg = MIMEText(body, 'html')
        msg['Subject'] = subject
        msg['From'] = os.getenv('EMAIL_USER')
        msg['To'] = to_email
        
        with smtplib.SMTP(os.getenv('SMTP_SERVER'), int(os.getenv('SMTP_PORT'))) as server:
            server.starttls()
            server.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASS'))
            server.send_message(msg)
    except Exception as e:
        logger.error(f"Erro ao enviar email: {str(e)}")
        raise

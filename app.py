from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/submit_quote', methods=['POST'])
def submit_quote():
    try:
        data = request.json
        
        # Aqui você pode adicionar a lógica para processar os dados
        # Por exemplo, salvar em um banco de dados ou enviar por email
        
        print("Dados recebidos:", data)
        
        return jsonify({
            "status": "success",
            "message": "Sua solicitação foi recebida com sucesso! Entraremos em contato em breve."
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
    
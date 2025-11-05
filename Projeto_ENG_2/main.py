from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend React Native

# Simulação de banco de dados em memória
transactions = [
    {
        "id": "1",
        "description": "Salário",
        "amount": 3000.0,
        "category": "Salário",
        "date": "2025-10-01"
    },
    {
        "id": "2", 
        "description": "Compra no supermercado",
        "amount": -150.0,
        "category": "Alimentação",
        "date": "2025-10-15"
    },
    {
        "id": "3",
        "description": "Combustível", 
        "amount": -80.0,
        "category": "Transporte",
        "date": "2025-10-20"
    },
    {
        "id": "4",
        "description": "Restaurante",
        "amount": -45.0,
        "category": "Alimentação", 
        "date": "2025-10-25"
    },
    {
        "id": "5",
        "description": "Freelance",
        "amount": 500.0,
        "category": "Trabalho Extra",
        "date": "2025-10-30"
    }
]

# Rota para obter todas as transações
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    return jsonify(transactions)

# Rota para criar uma nova transação
@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    required_fields = ['description', 'amount', 'category']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Campo {field} é obrigatório'}), 400
    
    new_transaction = {
        'id': str(uuid.uuid4()),
        'description': data['description'],
        'amount': float(data['amount']),
        'category': data['category'],
        'date': data.get('date', datetime.now().strftime('%Y-%m-%d'))
    }
    
    transactions.append(new_transaction)
    return jsonify(new_transaction), 201

# Rota para atualizar uma transação
@app.route('/api/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    transaction = next((t for t in transactions if t['id'] == transaction_id), None)
    if not transaction:
        return jsonify({'error': 'Transação não encontrada'}), 404
    
    # Atualizar campos fornecidos
    for field in ['description', 'amount', 'category', 'date']:
        if field in data:
            if field == 'amount':
                transaction[field] = float(data[field])
            else:
                transaction[field] = data[field]
    
    return jsonify(transaction)

# Rota para deletar uma transação
@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = next((t for t in transactions if t['id'] == transaction_id), None)
    if not transaction:
        return jsonify({'error': 'Transação não encontrada'}), 404
    
    transactions.remove(transaction)
    return jsonify({'message': 'Transação deletada com sucesso'})

# Rota para obter resumo financeiro
@app.route('/api/summary', methods=['GET'])
def get_financial_summary():
    revenues = sum(t['amount'] for t in transactions if t['amount'] > 0)
    expenses = sum(abs(t['amount']) for t in transactions if t['amount'] < 0)
    balance = revenues - expenses
    
    # Despesas por categoria
    categories = {}
    for t in transactions:
        if t['amount'] < 0:
            category = t['category']
            categories[category] = categories.get(category, 0) + abs(t['amount'])
    
    return jsonify({
        'revenues': revenues,
        'expenses': expenses,
        'balance': balance,
        'categories': categories
    })

# Rota para autenticação (simulada)
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400
    
    # Simulação de autenticação
    if data['email'] and data['password']:
        return jsonify({
            'token': 'fake-jwt-token',
            'user': {
                'id': '1',
                'email': data['email'],
                'name': 'Usuário Teste'
            }
        })
    
    return jsonify({'error': 'Credenciais inválidas'}), 401

# Rota de status da API
@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        'status': 'online',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'augebit',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Pool de conexões
const pool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Teste de conexão na inicialização
pool.getConnection((err, connection) => {
  if (err) {
    console.error('ERRO: Não foi possível conectar ao banco de dados!');
    console.error('Detalhes:', err.message);
    console.log('VERIFICAÇÕES NECESSÁRIAS:');
    console.log('1. XAMPP está rodando?');
    console.log('2. MySQL está ativo no XAMPP?');
    console.log('3. Banco "augebit" existe?');
    console.log('4. Tabelas necessárias existem?');
  } else {
    console.log('Conexão com banco de dados estabelecida!');
    connection.release();
  }
});

// Middleware de conexão
app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Erro ao obter conexão:', err);
      return res.status(500).json({
        success: false,
        error: 'Erro de conexão com o banco de dados',
        details: err.message
      });
    }
    
    req.dbConnection = connection;
    res.on('finish', () => connection.release());
    next();
  });
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando corretamente!',
    timestamp: new Date().toISOString()
  });
});

// Rota de teste do banco
app.get('/test-db', (req, res) => {
  const query = 'SELECT COUNT(*) as total FROM cadastrof';
  
  req.dbConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao consultar banco',
        details: err.message
      });
    }
    
    res.json({
      success: true,
      message: 'Conexão com banco OK!',
      totalFuncionarios: results[0].total
    });
  });
});

// Rota para listar todos os funcionários (para debug)
app.get('/cadastrof', (req, res) => {
  const query = 'SELECT id, email, senha, nome FROM cadastrof';
  
  req.dbConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao consultar funcionários',
        details: err.message
      });
    }
    
    res.json({
      success: true,
      funcionarios: results
    });
  });
});

// Rota de login
app.post('/login', (req, res) => {
  console.log('Tentativa de login recebida:', { email: req.body.email });
  
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    console.log('Dados incompletos');
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }
  
  const query = 'SELECT id, email, nome, telefone, setor FROM cadastrof WHERE email = ? AND senha = ?';
  
  req.dbConnection.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro no banco:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor',
        details: err.message
      });
    }
    
    console.log(`Consulta executada. Resultados encontrados: ${results.length}`);
    
    if (results.length > 0) {
      const user = { ...results[0] };
      
      console.log('Login bem-sucedido para:', email);
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: user
      });
    } else {
      console.log('Credenciais inválidas para:', email);
      res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }
  });
});

// Rota para agendamentos
app.post('/agendamentos', (req, res) => {
  console.log('Recebendo agendamento:', req.body);
  
  const { nome, cpf, telefone, email, data, horario, profissional } = req.body;
  
  if (!nome || !cpf || !telefone || !email || !data || !horario || !profissional) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios'
    });
  }

  const query = 'INSERT INTO agendamentos (nome, cpf, telefone, email, data, horario, profissional) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  req.dbConnection.query(query, [nome, cpf, telefone, email, data, horario, profissional], (err, results) => {
    if (err) {
      console.error('Erro ao inserir agendamento:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao agendar consulta',
        details: err.message
      });
    }
    
    res.json({
      success: true,
      message: 'Agendamento realizado com sucesso!',
      agendamentoId: results.insertId
    });
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('SERVIDOR INICIADO COM SUCESSO!');
  console.log(`Porta: ${PORT}`);
  console.log(`IP Local: http://localhost:${PORT}`);
  console.log(`IP Rede: http://192.168.15.136:${PORT}`);
  console.log('TESTES DISPONÍVEIS:');
  console.log(`• API Status: http://192.168.15.136:${PORT}/`);
  console.log(`• Teste DB: http://192.168.15.136:${PORT}/test-db`);
  console.log(`• Funcionários: http://192.168.15.136:${PORT}/cadastrof`);
});

process.on('uncaughtException', (error) => {
  console.error('Erro não tratado:', error);
});

process.on('SIGINT', () => {
  console.log('Encerrando servidor...');
  pool.end(err => {
    if (err) console.error('Erro ao encerrar pool:', err);
    console.log('Servidor encerrado');
    process.exit(0);
  });
});
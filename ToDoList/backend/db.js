const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); //instalado para nao haver conflito de dominios no navegador, por seguranca

// opcoes de conexao com o MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'lista_tarefas'
});

const app = new express();
app.listen(3000, () => {
    console.log('Servidor iniciado.');
})

app.use(cors());
app.use(express.json());

// rotas
// ----------------------------------------so teste do servidor
app.get("/", (req, res) => {
    connection.query("SELECT * FROM usuarios", (err, results) => {
        if(err){
            res.send("MYSQL ERRO");
        }

        res.send("teste do servidor");
    })
});
// ----------------------------------------so teste do servidor




//------------------------------------------------------------------------------------------ login aqui
app.get("/user/:id", (req, res)=>{
    connection.query("SELECT id_usuario, nome FROM usuarios WHERE id_usuario=?", [req.params.id], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
        res.json(results);
    })
})

//------------------------------------------------------------------------------------------- retorna as tarefas, ordenadas pelo status
app.get("/user/:id/tasks/:status", (req, res)=>{
    if(req.params.status!=="Todas"){
        connection.query("SELECT * FROM tarefas WHERE id_usuario=? AND status = ?"
        + "ORDER BY CASE WHEN status = 'Nova' THEN 1 WHEN status = 'Pendente' THEN 2 WHEN status = 'Cancelada'"
        + "THEN 3 WHEN status = 'Concluída' THEN 4 ELSE 5 END;", [req.params.id, req.params.status], (err, results)=>{
            if(err){
                res.send('MYSQL erro');
            }
            res.json(results);
        })
    }else{
        connection.query("SELECT * FROM tarefas WHERE id_usuario=?"
        + "ORDER BY CASE WHEN status = 'Nova' THEN 1 WHEN status = 'Pendente' THEN 2 WHEN status = 'Cancelada'"
        + "THEN 3 WHEN status = 'Concluída' THEN 4 ELSE 5 END;", [req.params.id], (err, results)=>{
            if(err){
                res.send('MYSQL erro');
            }
            res.json(results);
    })
    }

});

//------------------------------------------------------------------------------------------- atualiza status
app.post("/user/tasks/update_status/", (req, res)=>{
    connection.query("UPDATE tarefas SET status=?, data_atualizada = NOW() WHERE id_tarefa=?", [req.body.status, req.body.id_tarefa], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
    })
        res.json('ok');
})

//------------------------------------------------------------------------------------------- nova tarefa
app.post("/user/tasks/newtask/", (req, res)=>{
    //id_tarefa, descricao, data_criada, data_atualizada, status, id_usuario
    connection.query("INSERT INTO tarefas values(0, ?, NOW(), NOW(), 'Nova', ?)", [req.body.descricao, req.body.id_usuario], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
    })
    res.json('ok');
})

//-------------------------------------------------------------------------------------------recebe os id da tarefa, para atualizar futuramente
app.get("/user/tasks/get_task/:id_task", (req, res)=>{
    connection.query("SELECT * FROM tarefas WHERE id_tarefa=?", [req.params.id_task], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
        res.json(results);
})
});

//------------------------------------------------------------------------------------------- atualizar a descricao da tarefa
app.post("/user/tasks/update_task/", (req, res)=>{
    //id_tarefa, descricao, data_criada, data_atualizada, status, id_usuario
    connection.query("UPDATE tarefas SET descricao = ?, data_atualizada = NOW() WHERE id_tarefa=?", [req.body.descricao, req.body.id_tarefa], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
    })
    res.json('ok');
})


//-------------------------------------------------------------------------------------------
// Rota para obter informações detalhadas da tarefa, incluindo dados do usuário associado usando Inner Join
app.get("/user/tasks/get_detailed_task/:id_task", (req, res) => {
    const id_task = req.params.id_task;

    const query = `
        SELECT tarefas.*, usuarios.email
        FROM tarefas
        RIGHT JOIN usuarios ON tarefas.id_usuario = usuarios.id_usuario
        WHERE tarefas.id_tarefa = ?;
    `;

    connection.query(query, [id_task], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao obter detalhes da tarefa.' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Tarefa não encontrada.' });
        } else {
            res.status(200).json(results);
        }
    });
});

//-------------------------------------------------------------------------------------------
app.get("/user/tasks/delete_task/:id_task", (req, res)=>{
    connection.query("DELETE FROM tarefas WHERE id_tarefa = ?", [req.params.id_task], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
        res.json(results);
})
});

//------------------------------------------------------------------------------------------- retorna a quantidade de tarefas do usuario COUNT(*)
app.get("/user/:id/tasks/:status/total_tasks/", (req, res)=>{
    if(req.params.status!=="Todas"){
    connection.query("SELECT COUNT(*) as total_geral FROM tarefas WHERE id_usuario = ? AND status = ?", [req.params.id, req.params.status], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
        res.json(results);
    })
    }else{
    connection.query("SELECT COUNT(*) as total_geral FROM tarefas WHERE id_usuario = ?", [req.params.id], (err, results)=>{
        if(err){
            res.send('MYSQL erro');
        }
        res.json(results);
    })
    }
});

//-------------------------------------------------------------------------------------------
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    connection.query("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, password], (err, results) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: "Erro no servidor" });
        } else {
            if (results.length > 0) {
                const id_usuario = results[0].id_usuario;
                res.json({ success: true, message: "Login bem-sucedido", id_usuario });
            } else {
                res.json({ success: false, message: "Credenciais inválidas" });
            }
        }
    });
});

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Verifica se o email já está em uso
    connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: "Erro no servidor" });
        } else {
            if (results.length > 0) {
                res.json({ success: false, message: "Email já cadastrado" });
            } else {
                // Insere o novo usuário no banco de dados
                connection.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [name, email, password], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.json({ success: false, message: "Erro no servidor" });
                    } else {
                        res.json({ success: true, message: "Cadastro bem-sucedido" });
                    }
                });
            }
        }
    });
});

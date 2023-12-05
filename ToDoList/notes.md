# LISTA DE TAREFAS

Uma aplicação frontend com HTML, CSS e JS puro para gerir tarefas.
No backend vamos ter uma API NodeJS + Express + MySQL para servir o frontend.

# BASE DE DADOS

        id_usuario - vamos utilizar um usuario unico, predefinido no banco, podendo ser utilizado uma tela de login futura para novos usuarios no sistema
        nome
        email(PK)
        senha
    
    tarefas
        id_tarefas(PK)
        Descrição
        Status(Nova | Em progresso | Cancelada | Conluída)
        email(FK)

# TAREFAS A DESENVOLVER NO PROJETO

    OK> criar a estrutura inicial
    OK    - base do frontend (html css js | bootstrap)
    OK    -base do backend (node + express + mysql)
    
    > no frontend
    OK    - páginas necessárias para a navegação na nossa app.
        - pequenos testes de comunicação entre front e backend - utilização de Ajax (XMLhttprequest | fetch API)
    
    (eliminar será feito com uma modal)
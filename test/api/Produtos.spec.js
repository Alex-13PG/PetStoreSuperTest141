// Bibliotecas e Framework
const supertest = require('supertest');
const massaProduto = require('../../vendors/json/massaProduto'); // Importando a massa de dados de produtos

describe('API ServeRest - Entidade Usuarios e Produtos', () => {

    // Atributos do grupo/describe
    const request = supertest('https://serverest.dev');
    let userId; // Declaração do userId para uso entre os testes
    let produtoIds = []; // Declaração do array de produtoIds para uso entre os testes
    let token; // Declaração do token para uso entre os testes

    // Teste de criação de usuário
    it('POST Usuario', () => {
        return request
            .post('/usuarios')
            .send({
                nome: "willian teste",
                email: "wil@teste.com",
                password: "teste123",
                administrador: "true"
            })
            .then((res) => {
                expect(res.statusCode).toBe(201);
                expect(res.body.message).toBe('Cadastro realizado com sucesso');
                userId = res.body._id; // Atribui o ID do usuário criado à variável userId
                console.log("ID do usuário criado:", userId);
            });
    });

    // Teste de login de usuário
    it('Login de usuário', () => {
        return request
            .post('/login')
            .send({
                email: "wil@teste.com",
                password: "teste123"
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('authorization');
                expect(res.body.message).toBe('Login realizado com sucesso');

                // Extraí o token para usar em outros testes
                token = res.body.authorization;
                console.log("Token recebido:", token);
            });
    });
    
    // Teste de criação de três produtos utilizando a massa de dados
    it.each(massaProduto.array.map(produto => [
        produto.nome,
        produto.preco,
        produto.descricao,
        produto.quantidade
    ]))('Criar produtos', async (nome, preco, descricao, quantidade) => {
        const produtoData = { nome, preco, descricao, quantidade };

        const res = await request
            .post('/produtos')
            .set("Authorization", token) // Usa o token obtido no login
            .send(produtoData);

        // Exibir resposta completa para ajudar no diagnóstico do erro
        console.log(`Resposta de criação do produto ${produtoData.nome}:`, res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Cadastro realizado com sucesso');
        produtoIds.push(res.body._id); // Armazena o ID do produto
        console.log(`ID do produto ${produtoData.nome} criado:`, res.body._id);
    });

    
    // Teste de consulta dos três produtos
    it(`Consultar produto ${produtoIds} `, async () => {
        for (let i = 0; i < produtoIds.length; i++) {
            const produtoId = produtoIds[i];

            const res = await request
                .get(`/produtos/${produtoId}`)
                .set("Authorization", token); // Usa o token para autenticação

            expect(res.statusCode).toBe(200);
            // Verifica os campos do produto
            const produtoData = massaProduto.array[i];
            expect(res.body.nome).toBe(produtoData.nome);
            expect(res.body.preco).toBe(produtoData.preco);
            expect(res.body.descricao).toBe(produtoData.descricao);
            expect(res.body.quantidade).toBe(produtoData.quantidade);
            expect(res.body._id).toBe(produtoId); // Confirma se o ID corresponde ao esperado
            console.log("Produto obtido com sucesso:", res.body);
        }
    });

    // Teste de exclusão dos três produtos
    it(`Excluir os três produtos criados`, async () => {
        for (let i = 0; i < produtoIds.length; i++) {
            const produtoId = produtoIds[i];

            const res = await request
                .delete(`/produtos/${produtoId}`)
                .set("Authorization", token); // Usa o token para autenticação

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Registro excluído com sucesso');
            console.log(`Produto ${produtoId} excluído com sucesso:`, res.body);
        }
    });

    // Teste de exclusão de usuário
    it('Deletar usuário', async () => {
        expect(userId).toBeDefined(); // Verifica se o userId foi atribuído

        const res = await request
            .delete(`/usuarios/${userId}`)
            .set("Authorization", token); // Usa o token para autenticação

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Registro excluído com sucesso');
        console.log("Usuário excluído com sucesso:", res.body);
    });
});

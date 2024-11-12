// Bibliotecas e Framework
const supertest = require('supertest')

describe('API ServeRest - Entidade Usuários', () => {

    const request = supertest('https://serverest.dev') 
    const usuarios = require('../../vendors/json/massaUsuario.js')

    // Função para criar, atualizar, consultar e deletar usuários
    usuarios.array.forEach((usuario, index) => {
        
        let userId; // Variável para armazenar o _id do usuário criado

        // Teste de criação de usuário (POST)
        it(`Criar usuário ${index + 1}`, async () => {
            const res = await request
                .post('/usuarios')
                .send(usuario)

            expect(res.statusCode).toBe(201)
            expect(res.body.message).toBe('Cadastro realizado com sucesso')
            
            userId = res.body._id // Armazena o _id do usuário criado
            console.log(`ID do usuário ${index + 1} criado:`, userId)
        })

        // Teste de atualização de usuário (PUT)
        it(`Editar usuário ${index + 1}`, async () => {
            expect(userId).toBeDefined() // Verifica se o userId foi atribuído

            const dadosAtualizados = {
                nome: `${usuario.nome} - Atualizado`,
                email: `${usuario.email.replace('@', `${index + 1}@`)}`,
                password: "novaSenha123",
                administrador: "true"
            };

            const res = await request
                .put(`/usuarios/${userId}`)
                .send(dadosAtualizados);
                    expect(res.statusCode).toBe(200)
                    expect(res.body.message).toBe('Registro alterado com sucesso')
        })

        // Teste de consulta de usuário (GET)
        it(`Consultar usuário ${index + 1}`, async () => {
            expect(userId).toBeDefined(); // Verifica se o userId foi atribuído

            const res = await request
                .get(`/usuarios/${userId}`)
                    expect(res.statusCode).toBe(200)
                    expect(res.body.nome).toBe(`${usuario.nome} - Atualizado`)
                    expect(res.body.email).toContain(`${index + 1}@`)
                    expect(res.body.password).toBe("novaSenha123")
                    expect(res.body.administrador).toBe('true')
                    expect(res.body._id).toBe(userId)
        })

        // Teste de exclusão de usuário (DELETE)
        it(`Deletar usuário ${index + 1}`, async () => {
            expect(userId).toBeDefined() // Verifica se o userId foi atribuído

            const res = await request
                .delete(`/usuarios/${userId}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe('Registro excluído com sucesso')
        })
    })
})

// bibliotecas e Framework
const supertest = require('supertest')

const petId = 408177001

//  Em JavaScript, classe é opcional, mas pode agrupar em 1 Describe
describe('API petStore Swegger - Entidade Pet', () =>{

    // Atributos do Grupo/Describe
    const request = supertest('https://petstore.swagger.io/v2') //BaseURL

    // Funcões ou Metodos
    it('POST Pet', async () => {
    // Atributos, campos,caracteristicas, Configurações
        const pet = await require('../../vendors/json/pet.json')

        // Função de teste em si
        return request
            .post('/pet')
            .send(pet)
            .then((res) =>{
                expect(res.statusCode).toBe(200)
                expect(res.body.id).toBe(petId)
                expect(res.body.name).toBe('snoopy')
                expect(res.body.category.name).toBe('dog')
                expect(res.body.tags[0].name).toBe('vaccined')
            })
    
})// FInal do metodo post

it('Get Pet', async () => {
    return await request
    // .get('/pet/' = petID)  // Tradicional
    .get(`/pet/${petId}`)  // Moderno: template literals
    .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body.id).toBe(petId)
        expect(res.body.status).toBe('available')
    })

})

    it('PUT Pet', async () => {
        const pet = await require('../../vendors/json/petput.json')

        return await request 
            .put('/pet')
            .send(pet)
            .then((res) => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.status).toEqual('sold')
            })
    })

    it('DELETE Pet', async () => {
        return await request
        .delete(`/pet/${petId}`)
        .then((res) => {
            expect(res.statusCode).toEqual(200)
            expect(res.body.code).toEqual(2020)
            expect(res.body.message).toEqual(petId.toString())
        })
    })


}) // Termina a Describe


// bibliotecas e Framework
const supertest = require('supertest')

const petId = 408177001

//  Em JavaScript, classe é opcional, mas pode agrupar em 1 Describe
describe('API petStore Swegger - Entidade Pet', () =>{

    // Atributos do Grupo/Describe
    const request = supertest('https://petstore.swagger.io/v2') //BaseURL

    // Funcões ou Metodos
    it('POST Pet', () => {

    // Atributos, campos,caracteristicas, Configurações
    
    // Funções de Apoio (Opcional)

    // Funções de Teste em Si

})// FInal do metodo post



}) // Termina a Describe


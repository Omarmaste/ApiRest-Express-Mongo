const debug = require('debug')('app:inicio')
const debugDB = require('debug')('app:db')

const express = require('express')
//const logger = require('./logger')
const config = require('config')
const morgan = require('morgan')
const app = express()
const Joi = require('joi')

/*middwllaers*/
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

/* COnfiguracion de entorno */
console.log('Aplicacion: ' + config.get('nombre'))
console.log('Conexion DB: ' + config.get('configDB.host'))

if(app.get('env') === 'development') {
/*uso de middleware de tercero */
/* registro de las peticiones http npm install morgan*/
    app.use(morgan('tiny'))
    debug('Morgan esta habilitado...')
}

debugDB('Conectando a la base de datos...')


const users = [
    {'id':1, 'name':'omar'},
    {'id':2, 'name':'omar2'},
    {'id':3, 'name':'omar3'}
]
app.get('/', (req, res) => {
    res.send('Hola mundo!!')
})

app.get('/api/users', (req, res) => {
    res.send(users)
})

app.get('/api/users/:id', (req, res) => {
    
    let usuario = existeUsuario(req.params.id)
    if(!usuario) res.status(404).send('usuarios no encontrado!!!')
    res.send(usuario)

})

app.post('/api/users', (req, res) => {
    
    let {error, value } = validarUsuario(req.body.name)

    if(!error)
    {
        let user = {
            id: users.length + 1,
            name: value.name
        }
        users.push(user)
        res.send(user)
    }
    else
    {
        res.status(400).send(error.details[0].message)
    }


    /*if(!req.body.name || req.body.name.length <= 2){
        res.status(400).send('Se requiere nombra, requiere mas de 2 character')
        return
    }*/


})


app.put('/api/users/:id', (req, res) => {
    let usuario =  existeUsuario(req.params.id)
    if(!usuario) {
        res.status(404).send('usuarios no encontrado!!!')
        return
    }

    const {error, value } = validarUsuario(req.body.name)

    if(error)
    {
        res.status(400).send(error.details[0].message)
        return
    }

    usuario.name = value.name
    res.send(usuario)

})

app.delete("/api/users/:id", (req, res) => {
    let usuario =  existeUsuario(req.params.id)
    if(!usuario) {
        res.status(404).send('usuarios no encontrado!!!')
        return
    }

    const index = users.indexOf(usuario)
    users.splice(index, 1)
    res.send('Usuario ${index} borrado!!!')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
     console.log('Escuchando en el puerto ${port} ......')
})




function existeUsuario(id) {
    return (users.find(u => u.id === parseInt(id)))
}

function validarUsuario(nom){
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    })
    return (schema.validate({ name: nom }));
}
/*
app.post()

app.delete()

app.put()
*/
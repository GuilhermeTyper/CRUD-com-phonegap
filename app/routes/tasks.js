var Task = require('../models/task'),
    express = require('express'),
    router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //essa linha é para o app aceitar qualquer req de qualquer link que tem req para o mesmo                                                    
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//essa rota está fazendo um select all no banco de dados
router.route('/tasks').get(function(req, res) {
    Task.find(function(err, tasks) {
        if (err) {
            return res.send(err);
        }

        res.json(tasks);
    });
});

//essa rota está fazendo um select where id é igual ao que estamos passado
router.route('/tasks/:id').get(function(req, res) {
    Task.findOne({ _id: req.params.id}, function(err, task) {
        if (err) {
            return res.send(err);
        }

        res.json(task);
    });
});

// essa rota está fazendo um insert ao banco de dados
router.route('/tasks').post(function(req, res) {
    var task = new Task(req.body);

    task.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.send({ message: 'Task Added' });
    });
});

//essa rota esta fazendo uma atualizanção dos dados no banco de dados
router.route('/tasks/:id').put(function(req,res){
    Task.findOne({ _id: req.params.id }, function(err, task) { //busca o id no banco
        if (err) {
            return res.send(err);
        }

        //atualizando cada chava que veio pelo json
        for (prop in req.body) {
            task[prop] = req.body[prop];
        }

        // salvando o task no banco
        task.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({ message: 'Task updated!' });
        });
    });
});

//se for uma req do tipo delete ira ser removida passando o id fornecido
router.route('/tasks/:id').delete(function(req, res) {
    Task.remove({
        _id: req.params.id
    }, function(err, task) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
});

module.exports = router;

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const STATUSES = ['À faire', 'En cours', 'Terminé'];
let tasks = [];
let nextId = 0;

// Lire toutes les tâches
app.get('/tasks', (req, res) => res.json(tasks));

// Créer une tâche
app.post('/tasks', (req, res) => {
  const assignee = (req.body.assignee || '').trim();
  const description = (req.body.description || '').trim();
  if (!assignee) {
    return res.status(400).json({ error: 'La personne concernée est obligatoire' });
  }
  const task = {
    id: nextId,
    name: `Todo ${nextId}`,
    assignee,
    description,
    status: STATUSES[0],
  };
  nextId++;
  tasks.push(task);
  res.status(201).json(task);
});

// Changer l'état : À faire -> En cours -> Terminé -> À faire
app.patch('/tasks/:id/status', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tâche introuvable' });
  task.status = STATUSES[(STATUSES.indexOf(task.status) + 1) % STATUSES.length];
  res.json(task);
});

// Supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(3000, () => console.log('http://localhost:3000'));

const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.json())

// DB setup connection
const { Sequelize, DataTypes, Op, INTEGER } = require('sequelize')
const sequelize = new Sequelize('work-timer','root','', {
  host: 'localhost',
  dialect: 'mysql'
})

// Models
const Project = sequelize.define('project', {
  projectName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
});

const Log = sequelize.define('log',{
  timeStart: {
    type: DataTypes.INTEGER,
  },
  timeStop: {
    type: DataTypes.INTEGER,
  },
})

Project.hasMany(Log,{
  foreignKey: 'projectId'
})

Log.belongsTo(Project)

// Connect
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
  sequelize.sync();
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

/* Routes */
// Create Project - DONE
app.post('/new/project/:title', async (req, res)=>{
  await Project.create({projectName: req.params.title})
  const projectOne = await Project.findOne({ where: { projectName: req.params.title } });
  if (projectOne === null) {
  console.log('Not found!');
  } else {
  console.log(projectOne instanceof Project); // true
  console.log(projectOne.projectName); // 'My Title'
  }
  res.send(projectOne)
})
// R-Get Projects - DONE
app.get('/projects', async (req, res) => {
  const allProjects = await Project.findAll()
  res.send(allProjects)
})
// R-Get One Project - DONE
app.get('/project/:ID', async (req, res) => {
  const oneProject = await Project.findOne({ where: {id: req.params.ID }})
  res.send(oneProject)
})
// U-Edit project - DONE
app.patch('/u/project/:ID', async (req, res) => {
  const updateTo = req.body
  await Project.update( updateTo, {
    where: {
      id: req.params.ID
    }
  })
  updatedProject = await Project.findOne({ where:{id: req.params.ID} })
  res.send(updatedProject)
})

// Delete Project - DONE
app.delete('/x/project/:ID', async (req, res) => {
  await Project.destroy({
    where: {
      id: req.params.ID
    }
  });
  const deletedProject = await Project.findOne({
    where: {
      id: req.params.ID
    }
  })
  deletedProject ? res.send('Error: project could not be deleted') : res.send('Project deleted')
})

// Get all logs by project - DONE
app.get('/logs/:ID', async (req, res) => {
  const logs = await Log.findAll({ where: { projectId: req.params.ID}})
  res.send(logs)
})

// Create log - DONE
app.post('/log', async (req, res) => {
  const newLog = await Log.create(req.body)
  res.send(newLog)
})

// Update log - DONE
app.patch('/log/:ID', async (req, res) => {
  await Log.update(req.body, {
    where: { id: req.params.ID}
  })
  const updatedLog = await Log.findOne({ where: { id: req.params.ID }})
  res.send(updatedLog)
})

// Delete log - DONE
app.delete('/log/:ID', async (req, res) => {
  const deletedLog = await Log.destroy({ where: {id: req.params.ID}})
  deletedLog ? res.send("log deleted") : res.send("Error: log could not be deleted")
})


app.listen(port, () => {
  console.log(`Work Timer app listening on port ${port}`)
})
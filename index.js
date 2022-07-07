const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));


app.get('/api/games', async (req, res) => {
  try {
    const games = await db.Game.findAll()
    return res.send(games)
  } catch (err) {
    console.error('There was an error querying games', err);
    return res.send(err);
  }
})

app.post('/api/games', async (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***There was an error creating a game', err);
    return res.status(400).send(err);
  }
})

app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await db.Game.findByPk(parseInt(req.params.id))
    await game.destroy({ force: true })
    return res.send({ id: game.id  })
  } catch (err) {
    console.error('***Error deleting game', err);
    return res.status(400).send(err);
  }
});

app.put('/api/games/:id', async (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.findByPk(id)
    await game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***Error updating game', err);
    return res.status(400).send(err);
  }
});

app.post('/api/games/search', async (req, res) => {
  const { name, platform } = req.body;
  const Sequelize = require('sequelize');

  const Op = Sequelize.Op;


  let search_result;
  if (platform !== "") {
    search_result = await db.Game.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        },
        platform: platform
      }
    });
  } else {
    search_result = await db.Game.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
  }
  search_result.forEach(game => {
    console.log(game.name);
  });
  return res.status(200).send(search_result)
})

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;

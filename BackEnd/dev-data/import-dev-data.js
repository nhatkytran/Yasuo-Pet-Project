const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createDB } = require('../utils');

const {
  Subweb,
  Allgames,
  ExploreGames,
  Abilities,
  Skins,
  Ruined,
  Gallery,
  User,
} = require('../models');

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const {
  DATABASE,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_COLLECTION_YASUO,
} = process.env;

const getData = fileName =>
  JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));

const subwebVideosData = getData('subwebVideos.json');
const allGamesData = getData('allgames.json');
const exploreGamesData = getData('exploreGames.json');
const abilitiesData = getData('abilities.json');
const skinsData = getData('skins.json');
const ruinedData = getData('ruined.json');
const galleryData = getData('gallery.json');

async function importData() {
  try {
    await Promise.all([
      Subweb.create(subwebVideosData),
      Allgames.create(allGamesData),
      ExploreGames.create(exploreGamesData),
      Abilities.create(abilitiesData),
      Skins.create(skinsData),
      Ruined.create(ruinedData),
      Gallery.create(galleryData),
    ]);
    console.log('Data import - Successful!');
  } catch (error) {
    console.error('Data import - Failed!');
    console.error(error);
  } finally {
    process.exit();
  }
}

async function deleteData() {
  try {
    await Promise.all([
      Subweb.deleteMany(),
      Allgames.deleteMany(),
      ExploreGames.deleteMany(),
      Abilities.deleteMany(),
      Skins.deleteMany(),
      Ruined.deleteMany(),
      Gallery.deleteMany(),
      User.deleteMany(),
    ]);
    console.log('Data delete - Successful!');
  } catch (error) {
    console.error('Data delete - Failed!');
    console.error(error);
  } finally {
    process.exit();
  }
}

const DB = createDB(DATABASE, {
  '<DATABASE_NAME>': DATABASE_NAME,
  '<DATABASE_PASSWORD>': DATABASE_PASSWORD,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_YASUO,
});

console.log(DB);

mongoose
  .set('strictQuery', true)
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection - Successful');

    switch (process.argv.at(-1)) {
      case '--import':
        importData();
        break;
      case '--delete':
        deleteData();
        break;
      default:
        console.error('Action (--import | --delete) missing!');
        process.exit();
    }
  })
  .catch(error => {
    console.error('Something went wrong!');
    console.error(error);
  });

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const { Subweb, AllGames, ExploreGames } = require('../models');

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const { DATABASE, DATABASE_NAME, DATABASE_PASSWORD } = process.env;

const getData = fileName =>
  JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));

const subwebVideosData = getData('subwebVideos.json');
const allGamesData = getData('allGames.json');
const exploreGamesData = getData('exploreGames.json');

async function importData() {
  try {
    await Promise.all([
      Subweb.create(subwebVideosData),
      AllGames.create(allGamesData),
      ExploreGames.create(exploreGamesData),
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
      AllGames.deleteMany(),
      ExploreGames.deleteMany(),
    ]);
    console.log('Data delete - Successful!');
  } catch (error) {
    console.error('Data delete - Failed!');
    console.error(error);
  } finally {
    process.exit();
  }
}

const DB = DATABASE.replace('<DATABASE_NAME>', DATABASE_NAME).replace(
  '<DATABASE_PASSWORD>',
  DATABASE_PASSWORD
);

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

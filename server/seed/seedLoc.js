const mongoose = require("mongoose");
const County = require("../models/countyModel");
const Municipality = require("../models/municipalityModel");

mongoose.connect("mongodb+srv://elektorAL:kidaloku27@cluster0.hezvfaq.mongodb.net/elektorALdb?retryWrites=true&w=majority");

const data = {
    Berat: ["Berat", "Kuçovë", "Skrapar"],
  Diber: ["Dibër", "Bulqizë", "Mat", "Klos"],
  Durres: ["Durrës", "Shijak", "Krujë"],
  Elbasan: ["Elbasan", "Librazhd", "Peqin", "Gramsh", "Cërrik", "Belsh"],
  Fier: ["Fier", "Lushnjë", "Mallakastër", "Roskovec", "Patos"],
  Gjirokaster: ["Gjirokastër", "Tepelenë", "Përmet", "Këlcyrë", "Libohovë"],
  Korce: ["Korçë", "Pogradec", "Maliq", "Devoll", "Kolonjë"],
  Kukes: ["Kukës", "Has", "Tropojë"],
  Shkoder: ["Shkodër", "Malësi e Madhe", "Vau i Dejës", "Pukë", "Fushë-Arrëz"],
  Tirane: ["Tiranë", "Kamëz", "Vorë", "Rrogozhinë"],
  Vlore: ["Vlorë", "Sarandë", "Delvinë", "Himarë", "Selenicë", "Konispol"],
  Lezhë: ["Mirditë", "Lezhë", "Kurbin"],

};

const seed = async () => {
  try {
    console.log("🌱 Seeding started...");

    await County.deleteMany();
    await Municipality.deleteMany();

    // 1️⃣ Insert Counties
    const countiesArray = Object.keys(data).map(name => ({ name }));
    const counties = await County.insertMany(countiesArray);

    const countyMap = {};
    counties.forEach(c => {
      countyMap[c.name] = c._id;
    });

    // 2️⃣ Insert Municipalities
    const municipalities = [];

    for (const countyName in data) {
      for (const municipalityName of data[countyName]) {
        municipalities.push({
          name: municipalityName,
          county: countyMap[countyName]
        });
      }
    }

    await Municipality.insertMany(municipalities);

    console.log("✅ Counties & Municipalities seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed", error);
    process.exit(1);
  }
};

seed();
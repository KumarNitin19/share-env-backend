const { db } = require("../../firebaseAdmin");

const getENVData = async () => {
  try {
    const collectionRef = db.collection("Projects");
    const finalData = [];
    const projectSnap = await collectionRef.get();
    projectSnap.forEach((project) => {
      finalData.push(project.data());
    });
    return finalData;
  } catch (error) {
    console.log("Error : ", error);
  }
};

module.export = { getENVData };

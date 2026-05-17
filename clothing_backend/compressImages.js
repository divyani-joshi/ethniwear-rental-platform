const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folders = [
  "./uploads/items",
  "./uploads/categories"
];

async function compressImages() {

  for (const folder of folders) {

    const files = fs.readdirSync(folder);

    for (const file of files) {

      const filePath = path.join(folder, file);

      if (
        file.endsWith(".png") ||
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".webp")
      ) {

        try {

          const tempPath = filePath + "_temp";

          await sharp(filePath)
            .resize({ width: 800 })
            .jpeg({ quality: 70 })
            .toFile(tempPath);

          fs.unlinkSync(filePath);

          fs.renameSync(tempPath, filePath);

          console.log("Compressed:", file);

        } catch (err) {

          console.log("Error:", file, err);

        }

      }

    }

  }

}

compressImages();
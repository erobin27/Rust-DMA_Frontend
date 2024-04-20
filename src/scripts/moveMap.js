/* eslint-disable no-undef */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../../public"); // Assuming this script is at the root of your React project

const findFile = (filename, potentialPaths) => {
  for (let i = 0; i < potentialPaths.length; i++) {
    let fullPath = path.join(potentialPaths[i], filename);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
};

const findFilesBeginningWith = (directoryPath, beginsWith, extension) => {
  const files = fs.readdirSync(directoryPath, (err) => {
    if (err) {
      console.error("Error reading the directory", err);
      return;
    }
  });

  const foundFiles = files.filter(
    (file) =>
      file.startsWith(beginsWith) &&
      path.extname(file).toLowerCase() === extension
  );

  if (foundFiles.length > 0) {
    console.log(`Found ${extension} files starting with "${directoryPath}":`);
    foundFiles.forEach((file) => console.log(file));
    return foundFiles;
  } else {
    console.log(
      `No ${extension} files starting with "${directoryPath}" were found.`
    );
    return undefined;
  }
};

const move = (oldPath, newPath) => {
  fs.copyFile(oldPath, newPath, (copyErr, file) => {
    if (copyErr) {
      console.error("Error copying file:", file, copyErr);
      return;
    }

    fs.unlink(oldPath, (unlinkErr, file1) => {
      if (unlinkErr) {
        console.error("Error deleting original file:", file1, unlinkErr);
      } else {
        console.log("Successfully moved:", file1);
      }
    });
  });
};

const execute = () => {
  console.log("\n1: ------------ PUBLIC DIRECTORY ------------");
  console.log(publicPath);

  // Add common installation paths and any paths derived from environment variables
  let commonPaths = [
    "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Rust", // Example of a standard path
    process.env.PROGRAMFILES, // Environment variable for Program Files
    process.env["PROGRAMFILES(X86)"], // Environment variable for Program Files (x86)
    process.env.RUST_CLIENT_PATH,
  ].filter(Boolean); // Filter out undefined values from environment variables

  console.log("\n2: ------------ FIND RUST DIRECTORY ------------");
  const game = "RustClient.exe";
  let executablePath = findFile(game, commonPaths);
  if (!executablePath) {
    console.log("Could not find - ", game);
    return;
  }
  const directoryPath = executablePath.replace("\\RustClient.exe", "");
  if (executablePath) {
    console.log("Executable found at: " + executablePath);
    console.log("Executable folder: " + directoryPath);
  } else {
    console.log("Executable not found.");
  }

  console.log("\n3: ------------ FIND MAP FILE ------------");
  const mapFiles = findFilesBeginningWith(directoryPath, "map_", ".png");

  console.log("\n4: ------------ FIND LABS FILE ------------");
  const labsFiles = findFilesBeginningWith(directoryPath, "labs_", ".png");

  console.log("\n5: ------------ FIND TUNNELS FILE ------------");
  const tunnelsFiles = findFilesBeginningWith(
    directoryPath,
    "tunnels_",
    ".png"
  );

  console.log("\n------------ MOVE FILES ------------");
  if (mapFiles) {
    const filePath = directoryPath + "\\" + mapFiles[0];
    const destinationPath = publicPath + "\\map\\map.png";
    move(filePath, destinationPath);
  } else {
    console.log("NO MAPS FOUND! Run world.renderMap in rust console.");
  }

  if (labsFiles) {
    const filePath = directoryPath + "\\" + labsFiles[0];
    const destinationPath = publicPath + "\\map\\labs.png";
    move(filePath, destinationPath);
  } else {
    console.log("NO LABS FOUND!");
  }

  if (tunnelsFiles) {
    const filePath = directoryPath + "\\" + tunnelsFiles[0];
    const destinationPath = publicPath + "\\map\\tunnels.png";
    move(filePath, destinationPath);
  } else {
    console.log("NO TUNNELS FOUND!");
  }
};

execute();

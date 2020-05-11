const fs = require("fs");
const fsPromises = fs.promises;
const shortid = require("shortid");
const path = require("path");

module.exports = class JSON_Handler {
  constructor(filePath) {
    this._filePath = filePath;
    this._data = [];
  }

  getData() {
    return this._data;
  }

  /**
   * load data from db.json file.
   */
  async init() {
    try {
      if (fs.existsSync(this._filePath)) {
        //read json file
        const dbString = await fsPromises.readFile(this._filePath, "utf-8");
        if (dbString) {
          // load the data.
          this._data = JSON.parse(dbString);
        }
      } else {
        // get directory path to check if directory exists
        const folderPath = path.dirname(this._filePath);
        // if directory not exist create the folder
        // file is not created, since it will be empty file
        // and save function can later create the file while saving data.
        if (!fs.existsSync(folderPath)) {
          await fsPromises.mkdir(folderPath);
        }
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Add new data
   * @param {object} data
   * @return boolean Return true, if adding is success.
   */
  async addNew(data) {
    try {
      //add id to the note
      data.id = shortid.generate();
      //add new note to data
      this._data.push(data);
      //save the data to the db file
      await this.save();
      return true;
    } catch (err) {
      throw err;
    }
    return false;
  }

  /**
   * Delete the note by id
   * @param {string} id
   * @return boolean Return true, if deletion is success.
   */
  async deleteNote(id) {
    try {
      // find index of the object with the given id.
      const index = this._data.findIndex(
        ({ id: noteId }) => noteId.localeCompare(id) === 0
      );
      if (index !== -1) {
        // if found, delete this object
        this._data.splice(index, 1);
        //save to the file again.
        this.save();
        return true;
      }
    } catch (err) {
      throw err;
    }
    return false;
  }

  /**
   * save the data to db.json file
   */
  async save() {
    try {
      //write to file
      await fsPromises.writeFile(
        this._filePath,
        JSON.stringify(this._data),
        "utf-8"
      );
    } catch (err) {
      throw err;
    }
  }
};

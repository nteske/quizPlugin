class SettingsAccess {
    static get TAG() {
        return "settings";
    }
    /**
   * Get Single setting
   * @param {String} id Id of setting to be retreived
   * @param {Function} callback Callback function
   */
  
    static get(callback) {
      buildfire.datastore.get(SettingsAccess.TAG, function (err, result) {
        if (err) return callback(err);
        return callback(null, new Settings(result.data));
      });
    };
  
    static update(callback) {
      buildfire.datastore.onUpdate((error, record) => {
          if (error) return callback(error);
          return callback(null, new Settings(record));
      });
    };
  
    static save(setting, callback) {
      buildfire.datastore.save(setting, SettingsAccess.TAG, function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
      });
    }
  }
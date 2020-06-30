class Questions {
    static get TAG() {
            return "questions";
        }
        /**
         * Get Single setting
         * @param {String} id Id of setting to be retreived
         * @param {Function} callback Callback function
         */

    static get(callback) {
        buildfire.datastore.get(Questions.TAG, function(err, result) {
            if (err) return callback(err);
            return callback(null, new Question(result.data));
        });
    };

    static update(callback) {
        buildfire.datastore.onUpdate((error, record) => {
            if (error) return callback(error);
            return callback(null, new Question(record));
        });
    };

    static save(setting, callback) {
        buildfire.datastore.save(setting, Questions.TAG, function(err, result) {
            if (err) return callback(err);
            return callback(null, result);
        });
    }
}
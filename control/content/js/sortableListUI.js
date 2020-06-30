const sortableListUI = {
    sortableList: null,
    contrainer: null,
    tag: "",
    data: null,
    id: null,
    get items() {
            return sortableListUI.sortableList.items;
        }
        /*
        	This method will call the datastore to pull a single object
        	it needs to have an array property called `items` each item need {title, imgUrl}
         */
        ,
    init(elementId, tag = "content") {
        this.tag = tag;
        this.contrainer = document.getElementById(elementId);
        this.contrainer.innerHTML = "loading...";
        let t = this;

        if (typeof tag === "string") {



            buildfire.datastore.get(this.tag, (e, obj) => {
                if (e) {
                    console.error(e);
                    this.contrainer.innerHTML = "An error has occurred. Please contact your system admin.";
                } else if (obj && obj.data) {
                    this.data = obj.data;
                    this.id = obj.id;
                    if (!obj.data.items)
                        buildfire.datastore.save({ items: [] }, t.tag, () => {
                            t.data.items = [];
                            t.contrainer.innerHTML = "No questions has been added yet.";
                        });
                    else if (obj.data.items.length == 0)
                        this.contrainer.innerHTML = "No questions has been added yet.";
                    else
                        this.contrainer.innerHTML = "";
                    sortableListUI.render(obj.data.items);
                }
            });
        } else {
            if (tag.length == 0) this.contrainer.innerHTML = "No questions has been added yet.";
            else this.contrainer.innerHTML = "";
            sortableListUI.render(tag.answersArray);
        }


    },
    render(items) {
        let t = this;
        if (typeof t.tag === "string") this.sortableList = new buildfire.components.SortableList(this.contrainer, items || [], true);
        else this.sortableList = new buildfire.components.SortableList(this.contrainer, items || [], false);
        this.sortableList.onItemClick = this.onItemClick;
        this.sortableList.onDeleteItem = (item, index, callback) => {
            buildfire.notifications.confirm({
                message: "Are you sure you want to delete '" + item.title + "' ?",
                confirmButton: { text: 'Delete', key: 'y', type: 'danger' },
                cancelButton: { text: 'Cancel', key: 'n', type: 'default' }
            }, function(e, data) {
                if (e) console.error(e);
                if (data.selectedButton.key == "y") {
                    if (typeof t.tag === "string") {
                        sortableListUI.sortableList.items.splice(index, 1);
                        buildfire.datastore.save({ $set: { items: sortableListUI.sortableList.items } }, t.tag, e => {
                            if (e)
                                console.error(e);
                            else
                                callback(item);
                        });
                    } else {
                        buildfire.datastore.get("questions", (err, result) => {
                            if (err) return console.error("no questions found");
                            else if (result && result.data) {

                                let found = result.data.items.find(item => item.id === t.tag.id);
                                found.answersArray.splice(index, 1);
                                sortableListUI.sortableList.items.splice(index, 1);
                                callback(item);
                                buildfire.datastore.update(result.id, result.data, "questions", (err, data) => {
                                        //this.sortableList.onDeleteAnswer(found.id, found)
                                });
                            }
                        });
                    }
                }
            });
        };

        this.sortableList.onOrderChange = (item, oldIndex, newIndex) => {
            if (typeof this.tag === "string") {
                buildfire.datastore.save({ $set: { items: sortableListUI.sortableList.items } }, this.tag, () => {});
            } else {
                buildfire.datastore.get("questions", (err, result) => {
                    if (err) return console.error("no questions found");
                    else if (result && result.data) {
                        let found = result.data.items.find(item => item.id === this.tag.id);
                        let index = result.data.items.indexOf(found);
                        if (found) result.data.items[index].answersArray = sortableListUI.sortableList.items;
                        buildfire.datastore.update(result.id, result.data, "questions", (err, data) => {});
                    }
                });
            }
        };
    },
    /**
     * Updates item in datastore and updates sortable list UI
     * @param {Object} item Item to be updated
     * @param {Number} index Array index of the item you are updating
     * @param {HTMLElement} divRow Html element (div) of the entire row that is being updated
     * @param {Function} callback Optional callback function
     */
    updateItem(item, index, divRow, callback) {
        sortableListUI.sortableList.injectItemElements(item, index, divRow);
        let cmd = { $set: {} };
        cmd.$set['items.' + index] = item;
        buildfire.datastore.save(cmd, this.tag, (err, data) => {
            if (err) {
                console.error(err);
                if (callback) return callback(err);
            }
            if (callback) return callback(null, data);
        });

    },
    /**
     * This function adds item to datastore and updates sortable list UI
     * @param {Object} item Item to be added to datastore
     * @param {Function} callback Optional callback function
     */
    addItem(item, callback) {
        let cmd = {
            $push: { items: item }
        };
        console.log("tip",item);
        if (typeof this.tag === "string") {
            buildfire.datastore.save(cmd, this.tag, (err, data) => {
                if (err) {
                    console.error(err);
                    if (callback) return callback(err);
                }
                if (callback) return callback(null, data);
            });
        } else {
            buildfire.datastore.get("questions", (err, result) => {
                if (err) return console.error(err);
                let found = result.data.items.find(item => item.id === this.tag.id);
                found.answersArray.push(item);
                buildfire.datastore.update(result.id, result.data, "questions", (err, data) => {
                    if (err) console.error(err);
                });
            });
        }

        sortableListUI.sortableList.append(item);
    },
    onItemClick(item, divRow) {
        buildfire.notifications.alert({ message: item.title + " clicked" });
    }


};
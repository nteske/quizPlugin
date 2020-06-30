let questions = {
    items: []
};
let editing = null;
let questionSaved = false;

window.onload = function() {
    buildfire.datastore.get(Questions.TAG, function(err, result) {
        if (err) return console.error(err);
        questions.items = result.data.items;
    });
    buildfire.datastore.onUpdate((event) => {
        questions.items = event.data.items;
    });
    let loadedQuestion = JSON.parse(new URLSearchParams(window.location.search).get('question'));
    if (loadedQuestion == null) {
        editing = null;
        
    } else {
        editing = loadedQuestion.id;
        document.getElementById('questionTitle').value = loadedQuestion.title;
        document.getElementById('questionBody').value = loadedQuestion.body;
        document.getElementById('questionType').value = loadedQuestion.type;
        document.getElementById('questionPoints').value = loadedQuestion.points;
        sortableListUI.init("answers", loadedQuestion);
    }
    tinymce.init({ selector: "textarea" });
};

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

function addAnswer() {
    let answer = {
        id: uuidv4(),
        title: document.getElementById('answerTitle').value,
        checkbox: document.getElementById('correctAnswer').checked
    };
    document.getElementById('answerTitle').value = "";
    if(!editing){
        save(function(question) {
            sortableListUI.init("answers", question);
            sortableListUI.addItem(answer);
            editing = question.id;
            questionSaved = true;
        });
    }   else sortableListUI.addItem(answer);
}

function save(callback) {
    let questionTitle = document.getElementById('questionTitle').value;
    let questionType = document.getElementById('questionType').value;
    let questionPoints = document.getElementById('questionPoints').value;
    let question = new Question();
    question.title = questionTitle;
    question.body = tinymce.activeEditor.getContent();
    question.type = questionType;
    question.points = Number(questionPoints);
    if (!editing) {
        question.id = uuidv4();
        questions.items.push(question);
    } else {
        let found = questions.items.find(item => item.id == editing);
        let index = questions.items.indexOf(found);
        questions.items[index].title = question.title;
        questions.items[index].body = question.body;
        questions.items[index].type = question.type;
        questions.items[index].points = Number(question.points);
    }
    buildfire.datastore.save(questions, Questions.TAG, function(err, result) {
        if (err) return console.error(err);
        let dbQuestion = result.data.items.find(item => item.title === question.title);
        if(callback) return callback(dbQuestion);
        else window.history.back();
    });
}

function cancel() { return window.history.back(); }
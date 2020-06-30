let questionsArray = [];
let settingsData = null;
let currentQuestionIndex = 0;
let userPoints = 0;
let loggedUser;
let finished = false;

window.onload = function () {
    buildfire.datastore.get("settings", function (err, data) {
        if (err) return console.error(err);
        if (data && data.data) settingsData = data.data;
        if (settingsData.useCustomColor && settingsData.Color.colorType === "gradient")
            document.body.setAttribute("style", settingsData.Color.gradient.backgroundCSS);
        else if (settingsData.useCustomColor && settingsData.Color.colorType === "solid")
            document.body.setAttribute("style", settingsData.Color.solid.backgroundCSS);
        buildfire.datastore.get("questions", function (err, result) {
            if (err) return console.error(err);
            if (result && result.data.items && result.data.items.length) {
                questionsArray = result.data.items;
                setupQuestions();
            } else {
                questions.className = "emptyState";
                submitBtn.style.display = "none";
            }
        });
    });
    buildfire.datastore.onUpdate((event) => {
        if (event.tag === "settings") {
            if (event.data.useCustomColor && event.data.Color.colorType === "gradient")
                document.body.setAttribute("style", event.data.Color.gradient.backgroundCSS);
            else if (event.data.useCustomColor && event.data.Color.colorType === "solid")
                document.body.setAttribute("style", event.data.Color.solid.backgroundCSS);
        }
        else if(event.tag === "questions" && event.data.items) {
            if (event && event.data.items && event.data.items.length) {
                questionsArray = event.data.items;
                questions.className = "";
                submitBtn.style.display = "block";
                setupQuestions();
            } else {
                questionsArray = event.data.items;
                questionTitle.innerHTML = "";
                questionBody.innerHTML = "";
                answers.innerHTML = "";
                questions.className = "emptyState";
                submitBtn.style.display = "none";
            }
        }
    });
};

buildfire.messaging.onReceivedMessage = function(data){
    let found = questionsArray.find(item => item.id === data.deletedItem.id);
    let index = questionsArray.indexOf(found);
    questionsArray.splice(index, 1);
    setupQuestions();
 };

function nextQuestion() {
    let answersDiv = document.getElementById("answers");
    if (currentQuestionIndex + 1 == questionsArray.length) {
        questionTitle.innerText = "Points " + userPoints;
        questionBody.innerText = "";
        answersDiv.innerText = "";
        submitBtn.innerText = "Submit";
        if(!finished) finished = true; 
        else {
            setupQuestions();
            finished = false; 
        }
    } else {
        let radios = document.getElementsByTagName('input');
        let allAnswersTrue = true;
        let answeredAnyQuestion = 0;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                answeredAnyQuestion += 1;
                if (!questionsArray[currentQuestionIndex].answersArray[i].checkbox)
                    allAnswersTrue = false;
            } else {
                answeredAnyQuestion += 1;
                if (questionsArray[currentQuestionIndex].answersArray[i].checkbox)
                    allAnswersTrue = false;
            }
        }
        if (allAnswersTrue && answeredAnyQuestion != 0) userPoints = userPoints + questionsArray[currentQuestionIndex].points;
        currentQuestionIndex++;
        questionTitle.innerText = questionsArray[currentQuestionIndex].title;
        questionBody.innerHTML = questionsArray[currentQuestionIndex].body;
        answersDiv.innerText = "";
        displayAnswers(currentQuestionIndex);

    }

}

function displayAnswers(indexInList){
    questionsArray[indexInList].answersArray.map((item, index) => {
        let typeOfInput = "checkbox";
        if (questionsArray[indexInList].questionType == "one") typeOfInput = "radio";
        let li = document.createElement("LI");
        li.innerHTML = (`<input type="${typeOfInput}" name="select" value="${item.title}"  data-index="${index}" id="answer_${item.id}"/> ${item.title}`);
        document.getElementById('answers').appendChild(li);
    });
}

function setupQuestions() {
    currentQuestionIndex = 0;
    userPoints = 0;
    let questionTitle = document.getElementById("questionTitle");
    let questionBody = document.getElementById("questionBody");
    let answersDiv = document.getElementById("answers");
    questionTitle.innerText = questionsArray[0].title;
    questionBody.innerHTML = questionsArray[0].body;
    answersDiv.innerText = "";
    submitBtn.innerText = "Next Question";
    displayAnswers(0);
}

//global variables that correlate to IDs from index
var strButton = document.querySelector("#start");
var homeScreen = document.querySelector("#home");
var questionContainerEl = document.querySelector("#question-container");
var questionEl = document.querySelector("#question");
var answerBtnEl = document.querySelector("#answer-btns");
var submissionEl = document.querySelector("#end");
var submitBtn = document.querySelector("#submit");
var userNameInput = document.querySelector("#initials");
var scoreBoard = document.querySelector("#scoreBoard");
var scoreList = document.querySelector("#scores");
var restartBtn = document.querySelector("#rst");
var result = document.querySelector("#correct");
var timeEl = document.querySelector("#time");
var clrBtn = document.querySelector("#clear");
//empty array to store user object
var users = [];
//question array of objects, objects include question string and array of answer objects(string and boolean)
var questions = [
  {
    question: "Commonly used data types DO NOT include:",
    answers: [
      { text: "Strings", correct: false },
      { text: "Booleans", correct: false },
      { text: "Alerts", correct: true },
      { text: "Numbers", correct: false },
    ],
  },
  {
    question: "The condition of an if/else statement is enlcosed by ___:",
    answers: [
      { text: "Quotes", correct: false },
      { text: "Curly Brackets", correct: false },
      { text: "Parenthesis", correct: true },
      { text: "Square Brackets", correct: false },
    ],
  },
  {
    question: "Arrays in JavaScript can be used to store ____:",
    answers: [
      { text: "Numbers and Strings", correct: false },
      { text: "Other Arrays", correct: false },
      { text: "Booleans", correct: false },
      { text: "All of the above", correct: true },
    ],
  },
  {
    question:
      "String values must be enclosed within ___ when being assigned to variables.",
    answers: [
      { text: "commas", correct: false },
      { text: "curly brackets", correct: false },
      { text: "quotes", correct: true },
      { text: "parentheses", correct: false },
    ],
  },
  {
    question:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: [
      { text: "JavaScript", correct: false },
      { text: "terminal/bash", correct: false },
      { text: "for loops", correct: false },
      { text: "console.log", correct: true },
    ],
  },
];
//function to convert JSON strings to objects and check if any previous users/scores are stored locally
function init() {
  var storedUsers = JSON.parse(localStorage.getItem("Score"));
  if (storedUsers !== null) {
    users = storedUsers;
  }
}
//event listeners to call correlating functions on button click(start, restart, and clear)
strButton.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
clrBtn.addEventListener("click", clearScores);
//global variable used to keep track of current question and last question
var questionIndex;
//function that begins the quiz
function startQuiz() {
  // calls timer function
  timer();
  // adds hide class to element containing scoreBoard and start ids
  scoreBoard.classList.add("hide");
  strButton.classList.add("hide");
  //sets display:none for the element with home id
  document.getElementById("home").style.display = "none";
  //removes hide class for element with question-container id
  questionContainerEl.classList.remove("hide");
  //starts from the beginning of the questions/answers array
  questionIndex = 0;
  //calls function passing in question array at index 0
  showQuestion(questions[questionIndex]);
}
// function to display question and answers
function showQuestion(question) {
  //calls function removePrev
  removePrev();
  //sets text of element with id question to question at index 0 in questions array
  questionEl.innerText = question.question;
  //for each loop to create buttons with answers from questions array at each index of questions.answers array
  question.answers.forEach(function (answer) {
    //creates button
    var button = document.createElement("button");
    //adds answer
    button.innerText = answer.text;
    //adds the btn class to the button created
    button.classList.add("btn");
    //sets the true on the correct answer, making it able to check correct choice
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    //once a button is clicked calls selectAnswer function
    button.addEventListener("click", selectAnswer);
    //adds button created as child to element with answer-btns id
    answerBtnEl.appendChild(button);
  });
}
//while loop to delete buttons inside answer-btns element, if not used previous buttons are in answer choices in questions 2-5
function removePrev() {
  while (answerBtnEl.firstChild) {
    answerBtnEl.removeChild(answerBtnEl.firstChild);
  }
}
var timeLeft;
var timeInterval;
//function to time the quiz and call quit at time = 0
function timer() {
  //strating time
  timeLeft = 60;
  //sets timer actions
  timeInterval = setInterval(function () {
    //at time= 0 stops time, clears text for time, and calls end game function
    if (timeLeft == 0) {
      timeEl.textContent = "";
      clearInterval(timeInterval);
      endGame(timeLeft, timeInterval);
      //subtracts time by one second and displays on screen
    } else {
      timeEl.textContent = timeLeft + " seconds remaining";
      timeLeft--;
    }
  }, 1000);
}
//function takes in answer button taken and the time to evaluate correctness, adjusts time penalty for wrong, displays answer result, calls nextQ function
function selectAnswer(event, time) {
  //variable correlates to button pushed and that buttons data set put on it in showQuestion
  var selectedButton = event.target;
  var correct = selectedButton.dataset.correct;
  time = timeLeft;
  //displays correct or wrong and applys time penalty
  if (correct == "true") {
    result.innerText = "Correct";
  } else {
    result.innerText = "Wrong";
    timeLeft = timeLeft - 10;
  }
  //display message displayed for 2 seconds
  var resTime = 2;
  var resInt = setInterval(function () {
    if (resTime == 0) {
      clearInterval(resInt);
      result.innerText = "";
    } else {
      resTime--;
    }
  }, 1000);
  //calls function
  nextQ();
}
//function to move to next question or end quiz if no more are left
function nextQ() {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    //calls showQuestion at the next index
    showQuestion(questions[questionIndex]);
  } else {
    //calls endGame
    endGame(timeLeft, timeInterval);
  }
}
//stops timer, displays time left as score, hides questions/answers, displays submission page
function endGame(time, timeInt) {
  clearInterval(timeInt);
  timeEl.textContent = "Your score is: " + time;
  questionContainerEl.classList.add("hide");
  submissionEl.classList.remove("hide");
}
//event listener for submit button, collects users name, score, and timestamp. Then adds the new user to scoreboard and sorts it from highest to lowest
submitBtn.addEventListener("click", function (event) {
  var user = { name: userNameInput.value, score: timeLeft, date: Date.now() };
  //exits function if no name is put in
  if (user.name === "") {
    alert("Must input initials to submit");
    return;
  }
  else if(user.name.length>5){
    alert("Username cannot be more than 5 characters");
    return;
  }
  //adds and sorts scores locally stored and new score
  users.unshift(user);
  users.sort(function (a, b) {
    return b.score - a.score;
  });
  //loop to create list element for each name/score/date and add them to ul element with scoreList id
  var list = [];
  for (var x = 0; x < users.length; x++) {
    var list = users[x];
    var li = document.createElement("li");
    li.textContent = list.name + ": " + list.score;
    //adds class new to the current user li, allowing for highlight to be applied based on time stamp
    if (user.date === list.date) {
      li.classList.add("new");
    }
    li.setAttribute("data-index", x);
    scoreList.appendChild(li);
  }
  //clears input field and calls submission function
  userNameInput.value = "";
  submission();
});
//adds the updated scores to local storage as JSON string , hides submit page, and displays scoreboard
function submission() {
  localStorage.setItem("Score", JSON.stringify(users));
  submissionEl.classList.add("hide");
  scoreBoard.classList.remove("hide");
}
//function to restart quiz, deletes score board and li elements, so new users will be sorted accurately and duplicate score won't be displayed
function restartQuiz() {
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild);
  }
  //empties score string
  timeEl.textContent = "";
  //calls quiz to start
  startQuiz();
}
//deletes local storage of users/scores
function clearScores() {
  window.localStorage.removeItem("Score");
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild);
  }
  //sets array of users to blank
  users = [];
}
//calls initializing function
init();

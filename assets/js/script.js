// comment all sections explaining purpose and process
// console.log(window.document);
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
var users = [];

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

function init() {
  var storedUsers = JSON.parse(localStorage.getItem("Score"));
  if (storedUsers !== null) {
    users = storedUsers;
  }
}

strButton.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
clrBtn.addEventListener("click", clearScores);
var questionIndex;

function startQuiz() {
  timer();
  result.innerText = "";

  scoreBoard.classList.add("hide");
  strButton.classList.add("hide");
  document.getElementById("home").style.display = "none";
  //   document.getElementById("end").style.display = "none";
  questionContainerEl.classList.remove("hide");
  questionIndex = 0;

  showQuestion(questions[questionIndex]);
}

function showQuestion(question) {
  removePrev();
  questionEl.innerText = question.question;
  question.answers.forEach(function (answer) {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerBtnEl.appendChild(button);
  });
}
function removePrev() {
  while (answerBtnEl.firstChild) {
    answerBtnEl.removeChild(answerBtnEl.firstChild);
  }
}
var timeLeft;
var timeInterval;
function timer() {
  timeLeft = 60;
  timeInterval = setInterval(function () {
    if (timeLeft == 0) {
      timeEl.textContent = "";
      clearInterval(timeInterval);
      endGame(timeLeft, timeInterval);
    } else {
      timeEl.textContent = timeLeft + " seconds remaining";
      timeLeft--;
    }
  }, 1000);
}

function selectAnswer(event, time) {
  var selectedButton = event.target;
  var correct = selectedButton.dataset.correct;
  time = timeLeft;
  if (correct == "true") {
    result.innerText = "Correct";
  } else {
    result.innerText = "Wrong";
    timeLeft = timeLeft - 10;
  }
  var resTime = 2;
  var resInt = setInterval(function () {
    if (resTime == 0) {
      clearInterval(resInt);
      result.innerText = "";
    } else {
      resTime--;
    }
  }, 1000);
  nextQ();
}
function nextQ() {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    showQuestion(questions[questionIndex]);
  } else {
    endGame(timeLeft, timeInterval);
  }
}
function endGame(time, timeInt) {
  clearInterval(timeInt);
  timeEl.textContent = "Your score is: " + time;
  questionContainerEl.classList.add("hide");
  submissionEl.classList.remove("hide");
}
submitBtn.addEventListener("click", function (event) {
  var user = { name: userNameInput.value, score: timeLeft, date: Date.now() };
  if (user === "") {
    return;
  }
  users.unshift(user);
  users.sort(function (a, b) {
    return b.score - a.score;
  });
  var list = [];
  for (var x = 0; x < users.length; x++) {
    var list = users[x];
    var li = document.createElement("li");
    li.textContent = list.name + ": " + list.score;
    if (user.date === list.date) {
      li.classList.add("new");
    }
    li.setAttribute("data-index", x);
    scoreList.appendChild(li);
  }
  userNameInput.value = "";
  submission();
});
function submission() {
  localStorage.setItem("Score", JSON.stringify(users));
  submissionEl.classList.add("hide");
  scoreBoard.classList.remove("hide");
}
function restartQuiz() {
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild);
  }
  timeEl.textContent ="";
  startQuiz();
}
function clearScores() {
  window.localStorage.removeItem("Score");
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild);
  }
  users = [];
}
init();

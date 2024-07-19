const progressBar = document.querySelector(".progress-bar"),
      progressText = document.querySelector(".progress-text");

const progress = (value) => {//persentage for timer bar
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};
//DOM
const startBtn = document.querySelector(".start"),
      numQuestions = document.querySelector("#num-questions"),
      category = document.querySelector("#category"),
      difficulty = document.querySelector("#difficulty"),
      timePerQuestion = document.querySelector("#time"),
      quiz = document.querySelector(".quiz"),
      startScreen = document.querySelector(".start-screen");

let time = 30,
    score = 0,
    currentQuestion,
    timer;

let selectedQuestions = [];//questions from external file called question.js

const startQuiz = () => {
    const num = parseInt(numQuestions.value, 10);
    selectedQuestions = window.questions.slice(0, num);//window.questions for excess  in all files

    // Shuffle the selected questions
    selectedQuestions.sort(() => Math.random() - 0.5);

    setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(selectedQuestions[0]);
    }, 1000);
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
          answersWrapper = document.querySelector(".answer-wrapper");
    const questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;//add in inner html 

    if (!Array.isArray(question.incorrect_answers)) {//invalid answer in case of blanks
        console.error('Invalid question format: incorrect_answers is not an array', question);
        return;
    }

    const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
    ];
    answersWrapper.innerHTML = "";
    answers.sort(() => Math.random() - 0.5);
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
            <div class="answer">
                <span class="text">${answer}</span>
                <span class="checkbox">
                    <i class="fas fa-check"></i>
                </span>
            </div>
        `;
    });

    questionNumber.innerHTML = ` Question <span class="current">${//increase index of question
        selectedQuestions.indexOf(question) + 1
    }</span>
    <span class="total">/${selectedQuestions.length}</span>`;

    // Add event listener to each answer for checking
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });
                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });
//timer value
    time = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) => {
    timer = setInterval(() => {
        if (time === 3) {
            playAudio("countdown.mp3");
        }
        if (time >= 0) {
            progress(time);
            time--;
        } else {
            checkAnswer();
        }
    }, 1000);
};
//loading if server slow
const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length === 10) {
            startBtn.innerHTML = "Loading";
        } else {
            startBtn.innerHTML += ".";
        }
    }, 500);
};

function defineProperty() {
}

defineProperty();

const submitBtn = document.querySelector(".submit"),
      nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
});
//logic for testing answer
const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        if (answer === selectedQuestions[currentQuestion - 1].correct_answer) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            document.querySelectorAll(".answer").forEach((answer) => {
                if (
                    answer.querySelector(".text").innerHTML ===
                    selectedQuestions[currentQuestion - 1].correct_answer
                ) {
                    answer.classList.add("correct");
                }
            });
        }
    } else {
        document.querySelectorAll(".answer").forEach((answer) => {
            if (
                answer.querySelector(".text").innerHTML ===
                selectedQuestions[currentQuestion - 1].correct_answer
            ) {
                answer.classList.add("correct");
            }
        });
    }

    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.classList.add("checked");
    });

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};
//question lenght logic
const nextQuestion = () => {
    if (currentQuestion < selectedQuestions.length) {
        currentQuestion++;
        showQuestion(selectedQuestions[currentQuestion - 1]);
    } else {
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen"),
      finalScore = document.querySelector(".final-score"),
      totalScore = document.querySelector(".total-score");
//show final score 
const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${selectedQuestions.length}`;
};
//restart btn at end screen
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});
//play audio if timers is less than 4 beep  sound
const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// ===== БЛОКИ ВОПРОСОВ =====
const blocks = [
    {
        title: "Блок 1. Контекст и повод обращения",
        questions: [
            "Что стало основной причиной вашего обращения к специалисту сейчас?",
            "Как давно эта проблема или состояние вас беспокоит?",
            "Был ли конкретный триггер или событие, после которого это усилилось?"
        ]
    },
    {
        title: "Блок 2. Запрос и ожидания",
        questions: [
            "Если коротко – что вы хотели бы изменить или прояснить в результате работы?",
            "В каких сферах жизни это отражается сильнее всего?"
        ]
    },
    {
        title: "Блок 3. Мысли (когнитивный уровень)",
        questions: [
            "Какие мысли чаще всего возникают, когда состояние обостряется?",
            "Есть ли повторяющиеся фразы или убеждения, которые вы ловите у себя в голове?",
            "Какие мысли усиливают тревогу, напряжение или беспомощность?"
        ]
    },
    {
        title: "Блок 4. Телесные ощущения и эмоции",
        questions: [
            "Как это состояние проявляется в теле?",
            "Есть ли изменения сна, аппетита, уровня энергии или хроническое напряжение?",
            "Какие эмоции вы испытываете в связи с этой ситуацией чаще всего?",
            "Какие из этих эмоций самые тяжёлые или неприятные для вас?"
        ]
    },
    {
        title: "Блок 5. Ресурсы и опыт",
        questions: [
            "Что сейчас хоть немного помогает вам справляться или удерживаться?",
            "Был ли у вас ранее опыт работы с психологом или другим специалистом?"
        ]
    }
];

// ===== РЕАКЦИИ =====
const reactions = {
    fear: ["Я слышу, что страх будущего тревожит вас.", "Это действительно может быть тяжело. Спасибо, что делитесь.", "Понимаю, страх даёт о себе знать, и это важно обсудить."],
    anxiety: ["Вижу, что тревога даёт о себе знать. Спасибо, что делитесь этим.", "Тревога забирает много сил, я понимаю вас.", "Слышится, что это состояние вызывает у вас сильное беспокойство."],
    exhaustion: ["Похоже, вы чувствуете сильную усталость и истощение. Это важно обсудить.", "Выгорание – это серьезный сигнал организма. Спасибо, что говорите об этом."],
    default: ["Спасибо, что делитесь этим. Это важно.", "Понимаю, это может быть тяжело.", "Слышится, что вы переживаете непростое состояние.", "Я ценю вашу честность в этом ответе."]
};

const clarifications = [
    "Понимаю, иногда сложно подобрать слова. Расскажите немного больше, чтобы я лучше вас поняла.",
    "Спасибо за попытку. Давайте уточним вместе – попробуйте описать это чуть подробнее?",
    "Похоже, всё ещё трудно сформулировать. Попробуйте подробнее, это важно для нашей работы."
];

// ===== СОСТОЯНИЕ =====
let currentBlockIndex = 0;
let currentQuestionIndex = 0;
let sessionHistory = []; 

// ===== ВЫВОД СООБЩЕНИЙ (БЕЗ ФОНОВЫХ ЦВЕТОВ) =====
function addMessage(text, sender = "ai") {
    const msg = document.createElement("div");
    msg.style.margin = "10px 0";

    if (sender === "ai") {
        msg.innerHTML = `<b>ИИ:</b> ${text}`;
    } else {
        msg.innerHTML = `<b>Вы:</b> ${text}`;
        msg.style.textAlign = "right";
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== ЛОГИКА ЧАТА =====

function startChat() {
    addMessage("Здравствуйте. Это предварительная сессия. Пожалуйста, ответьте на несколько вопросов, чтобы мы могли прояснить ваш запрос.");
    setTimeout(askNextQuestion, 1000);
}

function askNextQuestion() {
    if (currentBlockIndex >= blocks.length) return;

    const block = blocks[currentBlockIndex];
    if (currentQuestionIndex === 0) {
        addMessage(`<i>— ${block.title} —</i>`);
    }
    addMessage(block.questions[currentQuestionIndex]);
}

function handleInput() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // Проверка на содержательность (пункты 1 и 5 твоих правок)
    const stopWords = ["да", "нет", "не знаю", "ок", "угу", "мгм", "нормально", "хз"];
    if (text.length < 4 || stopWords.includes(text.toLowerCase())) {
        setTimeout(() => addMessage(getRandom(clarifications)), 600);
        return;
    }

    // Сохраняем ответ
    sessionHistory.push({
        blockTitle: blocks[currentBlockIndex].title,
        question: blocks[currentBlockIndex].questions[currentQuestionIndex],
        answer: text
    });

    // Динамическая реакция (пункт 1 и 6)
    let reactionText = getRandom(reactions.default);
    const lowText = text.toLowerCase();
    if (lowText.includes("страх") || lowText.includes("боюсь")) reactionText = getRandom(reactions.fear);
    if (lowText.includes("трево") || lowText.includes("беспокой")) reactionText = getRandom(reactions.anxiety);
    if (lowText.includes("устал") || lowText.includes("выгор")) reactionText = getRandom(reactions.exhaustion);
    
    addMessage(reactionText);

    currentQuestionIndex++;

    // Пауза перед следующим вопросом (пункт 2)
    if (currentQuestionIndex < blocks[currentBlockIndex].questions.length) {
        setTimeout(askNextQuestion, 1200);
    } else {
        setTimeout(showBlockSummary, 1000);
    }
}

// Резюме после блока (пункт 3)
function showBlockSummary() {
    const blockTitle = blocks[currentBlockIndex].title;
    const blockAnswers = sessionHistory.filter(item => item.blockTitle === blockTitle);

    let summary = `<b>Резюме ${blockTitle}:</b><br>`;
    blockAnswers.forEach(item => {
        summary += `– ${item.answer}<br>`;
    });
    summary += "<i>Спасибо за честность, это помогает лучше понять ситуацию.</i>";

    addMessage(summary);

    currentBlockIndex++;
    currentQuestionIndex = 0;

    if (currentBlockIndex < blocks.length) {
        setTimeout(askNextQuestion, 2500);
    } else {
        setTimeout(showFinalSummary, 1500);
    }
}

// Финальный результат (пункт 4)
function showFinalSummary() {
    addMessage("<b>Предсессия завершена. Благодарю вас за честные ответы.</b>");

    let finalReport = `<b>ИТОГОВЫЙ РЕЗУЛЬТАТ ПРЕДСЕССИИ:</b><br>---------------------------<br>`;

    blocks.forEach(block => {
        const answers = sessionHistory.filter(item => item.blockTitle === block.title);
        if (answers.length > 0) {
            finalReport += `<br><b>${block.title}</b><br>`;
            answers.forEach(a => {
                finalReport += `<b>В:</b> ${a.question}<br><b>О:</b> ${a.answer}<br><br>`;
            });
            finalReport += `---------------------------<br>`;
        }
    });

    finalReport += `<br>Это описание отражает ваше текущее состояние и станет основой для нашей дальнейшей работы.`;

    addMessage(finalReport);
}

// ===== СОБЫТИЯ =====
sendBtn.addEventListener("click", handleInput);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleInput();
});

startChat();

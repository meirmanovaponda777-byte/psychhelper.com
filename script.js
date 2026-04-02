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

// ===== УНИВЕРСАЛЬНЫЕ ТЕРАПЕВТИЧЕСКИЕ РЕАКЦИИ =====
const reactions = [
    "Я слышу, сколько важного стоит за вашими словами. Спасибо, что доверяете это мне.",
    "Это действительно непросто – признавать такие вещи. Я ценю вашу готовность говорить об этом открыто.",
    "Понимаю, как это состояние может давить. То, что вы его замечаете и описываете – уже огромный шаг.",
    "Слышу, как вам сейчас неспокойно. Это заслуживает большого внимания и бережного отношения.",
    "Спасибо за искренность. Похоже, сейчас вам приходится тратить много сил, чтобы справляться с этим.",
    "Я внимательно читаю то, что вы пишете. В этих словах чувствуется много ценного для нашей работы.",
    "Понимаю, что поднимать такие темы может быть нелегко. Ваша открытость очень важна.",
    "Слышу вас. Ваши слова помогают мне лучше увидеть общую картину того, что с вами происходит.",
    "Это важное признание. Похоже, вы долгое время несли это в себе, и сейчас это наконец находит выход.",
    "Я чувствую, насколько это значимая для вас тема. Спасибо, что находите силы описывать это детально.",
    "Похоже, вы проходите через действительно непростой период. Важно, что вы даете этому место здесь.",
    "Ваши слова звучат очень весомо. Это дает нам хорошую опору для дальнейшего разбора."
];

// ===== СОСТОЯНИЕ =====
let currentBlockIndex = 0;
let currentQuestionIndex = 0;
let sessionHistory = []; 

// ===== ВЫВОД СООБЩЕНИЙ =====
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
    addMessage("Здравствуйте. Это предварительная сессия. Пожалуйста, ответьте на несколько вопросов и опишите ответ от 2-3 предложений, чтобы мы могли прояснить ваш запрос.");
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

    // 1. Список стоп-слов
    const stopWords = [
        "да", "нет", "ок", "окэй", "угу", "мгм", "ага", "хорошо", "понятно", 
        "не знаю", "не помню", "сложно сказать", "трудно ответить", "без понятия", "хз", "не уверен",
        "нормально", "обычно", "как всегда", "как у всех", "по-разному", "ничего особенного", 
        "все плохо", "все хорошо", "стандартно", "средне",
        "эээ", "ну", "типа", "в общем", "как бы"
    ];

    // 2. Глубокая проверка на содержательность
    const isShort = text.length < 15;
    const isGeneric = stopWords.includes(text.toLowerCase());

    if (isShort || isGeneric) {
        setTimeout(() => {
            const deepPrompts = [
                "Я слышу вас, но мне очень важно увидеть чуть больше деталей. Попробуйте описать ваши чувства подробнее?",
                "Это ценное наблюдение. Если попробовать заглянуть чуть глубже – как это состояние откликается в вашей жизни прямо сейчас?",
                "Спасибо за этот ответ. Чтобы я могла лучше прочувствовать вашу ситуацию, добавьте, пожалуйста, еще пару предложений.",
                "Мне важно понять нюансы того, о чём вы говорите. Расскажите чуть больше: что именно вы имеете в виду?",
                "Похоже, об этом непросто говорить. Попробуйте подобрать слова и описать подробнее, что происходит внутри вас?",
                "Я чувствую, что за этими словами стоит нечто большее. Позвольте себе развернуть эту мысль чуть шире.",
                "Ваш ответ важен, но он звучит очень кратко. Расскажите немного о контексте: как это проявляется чаще всего?",
                "Чтобы наше исследование было эффективным, мне нужно больше ваших описаний. Попробуйте дополнить ответ деталями.",
                "Слышу вас. А если попробовать описать это состояние через телесные ощущения или образы? Что приходит в голову?",
                "Кажется, мы коснулись чего-то значимого. Попробуйте не торопиться и описать этот момент чуть детальнее."
            ];
            addMessage(getRandom(deepPrompts));
        }, 600);
        return; 
    }

    // 3. Сохраняем ответ
    sessionHistory.push({
        blockTitle: blocks[currentBlockIndex].title,
        question: blocks[currentBlockIndex].questions[currentQuestionIndex],
        answer: text
    });

    // 4. Универсальная реакция
    const reactionText = getRandom(reactions);
    addMessage(reactionText);

    currentQuestionIndex++;

    // Переход к следующему вопросу
    if (currentQuestionIndex < blocks[currentBlockIndex].questions.length) {
        setTimeout(askNextQuestion, 1200);
    } else {
        setTimeout(showBlockSummary, 1000);
    }
}

// Резюме после блока
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

// Финальный результат
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
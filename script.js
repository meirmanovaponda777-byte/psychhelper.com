const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return;

    // Добавляем сообщение пользователя
    chatBox.innerHTML += `<div class="userMsg">${text}</div>`;
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Временный ответ бота для визуала
    setTimeout(() => {
        chatBox.innerHTML += `<div class="botMsg">Привет! Пока я не ИИ, но скоро буду отвечать.</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
});
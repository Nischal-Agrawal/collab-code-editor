const colors = ["#ff6b6b", "#6bcB77", "#4dabf7", "#ffd43b", "#b197fc"];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function showEditorScreen() {
  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("editorScreen").style.display = "block";

  // Theme toggle
  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
  };
}

export function updateUserList(users) {
  const list = document.getElementById("users");
  list.innerHTML = "";

  users.forEach(user => {
    const color = getColor(user.username);

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="avatar" style="background:${color}"></div>
      <span>${user.username}</span>
    `;

    list.appendChild(li);
  });
}

export function showTyping(username) {
  const typing = document.getElementById("typing");
  typing.innerText = `${username} is typing...`;

  setTimeout(() => {
    typing.innerText = "";
  }, 1000);
}

export function showNotification(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
export function showEditorScreen() {
  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("editorScreen").style.display = "block";
}

export function updateUserList(users) {
  const list = document.getElementById("users");
  list.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");
    li.innerText = user.username;
    list.appendChild(li);
  });
}

export function showNotification(msg) {
  alert(msg);
}
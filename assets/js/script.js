document.addEventListener("DOMContentLoaded", () => {

    const config = {
        serverIP: "ger-05.malthe.cc:19132", // Trage hier deine Server Adresse ein für einen live Status
        offlineIcon: "./assets/img/offline.png",
        ranks: {
            Founder: "#ff4500",
            Developer: "#ffd700"
            // NeuerRang: "#RangFarbe"
        },
        teamMembers: [
            { name: "Biswajit", role: "Founder", head: "https://mc-heads.net/avatar/TheVelu/64" },
            { name: "DEVILxD", role: "Founder", head: "https://mc-heads.net/avatar/TheVelu/64" },
            { name: "AEDXDEV", role: "Developer", head: "https://mc-heads.net/avatar/TheVelu/64" },
            // { name: "USERNAME", role: "RANG", head: "https://mc-heads.net/avatar/USERNAME/64" }
        ],
        messages: [ // hier kannst du ganz einfach die Color Codes von Minecraft mit [&] benutzen.
            "&aWelcome to the FrostNetwork!",
            "&6Play Amd Enjoy With Us!",
            "&bVisit our Discord server for more info!",
            // "FÜGE HIER EINE WEITERE NACHRICHT HINZU"
        ],
        typeSpeed: 80, // Geschwindigkeit der Typ-Animation (ms)
        pauseBetweenMessages: 2000 // Pause zwischen Nachrichten (ms)
    };

    const teamGrid = document.getElementById("team-grid");
    const roleElement = document.getElementById("role");
    const usernameElement = document.getElementById("username");
    const userHeadElement = document.getElementById("user-head");
    const typingMessage = document.getElementById("typing-message");
    const serverIcon = document.getElementById("server-icon");
    const serverName = document.getElementById("server-name");
    const serverPlayers = document.getElementById("server-players");
    const serverBadge = document.getElementById("server-status");

    let messageIndex = 0;
    let charIndex = 0;

    /** Minecraft-Farbcodes **/
    const colorCodes = {
        "0": "#000000", "1": "#0000AA", "2": "#00AA00", "3": "#00AAAA",
        "4": "#AA0000", "5": "#AA00AA", "6": "#FFAA00", "7": "#AAAAAA",
        "8": "#555555", "9": "#5555FF", "a": "#55FF55", "b": "#55FFFF",
        "c": "#FF5555", "d": "#FF55FF", "e": "#FFFF55", "f": "#FFFFFF"
    };

    function parseMinecraftColors(text, currentLength) {
        let html = "";
        let color = "#FFFFFF";
        let visibleTextLength = 0;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === "&" && i + 1 < text.length) {
                const code = text[i + 1];
                if (colorCodes[code]) {
                    color = colorCodes[code];
                    i++;
                }
            } else {
                if (visibleTextLength < currentLength) {
                    html += `<span style="color: ${color};">${text[i]}</span>`;
                    visibleTextLength++;
                }
            }
        }

        return html;
    }

    function typeMessage(selectedMessage) {
        if (typingMessage) {
            if (charIndex < selectedMessage.replace(/&[0-9a-f]/g, "").length) {
                typingMessage.innerHTML = parseMinecraftColors(selectedMessage, charIndex + 1);
                charIndex++;
                setTimeout(() => typeMessage(selectedMessage), config.typeSpeed);
            } else {
                setTimeout(() => deleteMessage(selectedMessage), config.pauseBetweenMessages);
            }
        }
    }

    function deleteMessage(selectedMessage) {
        if (typingMessage) {
            if (charIndex > 0) {
                typingMessage.innerHTML = parseMinecraftColors(selectedMessage, charIndex - 1);
                charIndex--;
                setTimeout(() => deleteMessage(selectedMessage), config.typeSpeed);
            } else {
                const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
                const randomMember = config.teamMembers[Math.floor(Math.random() * config.teamMembers.length)];
                updateRandomTeamMember(randomMember);
                setTimeout(() => typeMessage(randomMessage), config.typeSpeed);
            }
        }
    }

    function updateRandomTeamMember(randomMember) {
        if (roleElement && usernameElement && userHeadElement) {
            roleElement.textContent = randomMember.role;
            roleElement.style.color = config.ranks[randomMember.role] || "#FFFFFF";
            usernameElement.textContent = randomMember.name;
            userHeadElement.src = randomMember.head;
        }
    }

    function displayTeamGrid() {
        if (teamGrid) {
            config.teamMembers.forEach(member => {
                const memberCard = document.createElement("div");
                memberCard.classList.add("team-member");

                memberCard.innerHTML = `
                    <img src="${member.head}" alt="${member.name}" class="team-head">
                    <h3 class="team-name">${member.name}</h3>
                    <p class="team-role" style="background-color: ${config.ranks[member.role] || "#FFFFFF"};">${member.role}</p>
                `;

                teamGrid.appendChild(memberCard);
            });
        }
    }

    function loadServerStatus() {
        const apiURL = `https://api.mcsrvstat.us/bedrock/3/ger-05.malthe.cc:19132`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                if (data.online) {
                    serverIcon.src = data.icon || config.offlineIcon;
                    serverName.textContent = data.motd?.clean[0] || config.serverIP;
                    serverPlayers.textContent = `Player: ${data.players.online} / ${data.players.max}`;
                    serverBadge.textContent = "ONLINE";
                    serverBadge.classList.add("online");
                    serverBadge.classList.remove("offline");
                } else {
                    displayServerOffline();
                }
            })
            .catch(() => displayServerOffline());
    }

    function displayServerOffline() {
        serverIcon.src = config.offlineIcon;
        serverName.textContent = config.serverIP;
        serverPlayers.textContent = "Spieler: 0 / 0";
        serverBadge.textContent = "OFFLINE";
        serverBadge.classList.add("offline");
        serverBadge.classList.remove("online");
    }

    const initialRandomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
    const initialRandomMember = config.teamMembers[Math.floor(Math.random() * config.teamMembers.length)];
    updateRandomTeamMember(initialRandomMember);
    typeMessage(initialRandomMessage);

    displayTeamGrid();
    loadServerStatus();
});

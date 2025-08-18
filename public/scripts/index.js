// elements
const $ = (id) => document.getElementById(id);
const main = $("main");
const openManageUsers = $("openManageUsers");
const openAddTemplate = $("openAddTemplate");
const openManageTemplates = $("openManageTemplates");
const openSettings = $("openSettings");
const userForm = $("userForm");
const scookie = $("scookie");
const jcookie = $("jcookie");
const submitUser = $("submitUser");
const manageUsers = $("manageUsers");
const userList = $("userList");
const checkUserStatus = $("checkUserStatus");
const addTemplate = $("addTemplate");
const convert = $("convert");
const details = $("details");
const size = $("size");
const ink = $("ink");
const templateCanvas = $("templateCanvas");
const templateForm = $("templateForm");
const templateFormTitle = $("templateFormTitle");
const convertInput = $("convertInput");
const templateName = $("templateName");
const tx = $("tx");
const ty = $("ty");
const px = $("px");
const py = $("py");
const userSelectList = $("userSelectList");
const selectAllUsers = $("selectAllUsers");
const canBuyMaxCharges = $("canBuyMaxCharges");
const canBuyCharges = $("canBuyCharges");
const antiGriefMode = $("antiGriefMode");
const submitTemplate = $("submitTemplate");
const manageTemplates = $("manageTemplates");
const templateList = $("templateList");
const startAll = $("startAll");
const stopAll = $("stopAll");
const settings = $("settings");
const drawingModeSelect = $("drawingModeSelect");
const turnstileNotifications = $("turnstileNotifications");
const accountCooldown = $("accountCooldown");
const purchaseCooldown = $("purchaseCooldown");
const dropletReserve = $("dropletReserve");
const antiGriefStandby = $("antiGriefStandby");
const chargeThreshold = $("chargeThreshold");
const chargeThresholdContainer = $("chargeThresholdContainer");
const totalCharges = $("totalCharges");
const totalMaxCharges = $("totalMaxCharges");
const messageBoxOverlay = $("messageBoxOverlay");
// add reference for new toggle
const alwaysDrawOnCharge = $("alwaysDrawOnCharge");
const messageBoxTitle = $("messageBoxTitle");
const messageBoxContent = $("messageBoxContent");
const messageBoxConfirm = $("messageBoxConfirm");
const messageBoxCancel = $("messageBoxCancel");
const paidColorsList = $("paidColorsList");
const selectAllPaidColors = $("selectAllPaidColors");
const clearAllPaidColors = $("clearAllPaidColors");

// Message Box
let confirmCallback = null;

const showMessage = (title, content) => {
    messageBoxTitle.textContent = title;
    messageBoxContent.textContent = content;
    messageBoxCancel.classList.add('hidden');
    messageBoxConfirm.textContent = 'OK';
    messageBoxOverlay.classList.remove('hidden');
    confirmCallback = null;
};

const showConfirmation = (title, content, onConfirm) => {
    messageBoxTitle.textContent = title;
    messageBoxContent.textContent = content;
    messageBoxCancel.classList.remove('hidden');
    messageBoxConfirm.textContent = 'Confirm';
    messageBoxOverlay.classList.remove('hidden');
    confirmCallback = onConfirm;
};

const closeMessageBox = () => {
    messageBoxOverlay.classList.add('hidden');
    confirmCallback = null;
};

messageBoxConfirm.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
    closeMessageBox();
});

messageBoxCancel.addEventListener('click', () => {
    closeMessageBox();
});

const handleError = (error) => {
    console.error(error);
    let message = "An unknown error occurred. Check the console for details.";

    if (error.code === 'ERR_NETWORK') {
        message = "Could not connect to the server. Please ensure the bot is running and accessible.";
    } else if (error.response && error.response.data && error.response.data.error) {
        const errMsg = error.response.data.error;
        if (errMsg.includes("(1015)")) {
            message = "You are being rate-limited by the server. Please wait a moment before trying again.";
        } else if (errMsg.includes("(500)")) {
            message = "Authentication failed. The user's cookie may be expired or invalid. Please try adding the user again with a new cookie.";
        } else {
            message = errMsg; // Show the full error if it's not a known one
        }
    }
    showMessage("Error", message);
};


// users
const loadUsers = async (f) => {
    try {
        const users = await axios.get("/users");
        if (f) f(users.data);
    } catch (error) {
        handleError(error);
    };
};
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/user', { cookies: { s: scookie.value, j: jcookie.value } });
        if (response.status === 200) {
            showMessage("Success", `Logged in as ${response.data.name} (#${response.data.id})!`);
            userForm.reset();
            openManageUsers.click(); // Refresh the view
        }
    } catch (error) {
        handleError(error);
    };
});

// templates
const free_colors = {
    "0,0,0": { id: 1, name: "Black" },
    "60,60,60": { id: 2, name: "Dark Gray" },
    "120,120,120": { id: 3, name: "Gray" },
    "210,210,210": { id: 4, name: "Light Gray" },
    "255,255,255": { id: 5, name: "White" },
    "96,0,24": { id: 6, name: "Deep Red" },
    "237,28,36": { id: 7, name: "Red" },
    "255,127,39": { id: 8, name: "Orange" },
    "246,170,9": { id: 9, name: "Gold" },
    "249,221,59": { id: 10, name: "Yellow" },
    "255,250,188": { id: 11, name: "Light Yellow" },
    "14,185,104": { id: 12, name: "Dark Green" },
    "19,230,123": { id: 13, name: "Green" },
    "135,255,94": { id: 14, name: "Light Green" },
    "12,129,110": { id: 15, name: "Dark Teal" },
    "16,174,166": { id: 16, name: "Teal" },
    "19,225,190": { id: 17, name: "Light Teal" },
    "40,80,158": { id: 18, name: "Dark Blue" },
    "64,147,228": { id: 19, name: "Blue" },
    "96,247,242": { id: 20, name: "Cyan" },
    "107,80,246": { id: 21, name: "Indigo" },
    "153,177,251": { id: 22, name: "Light Indigo" },
    "120,12,153": { id: 23, name: "Dark Purple" },
    "170,56,185": { id: 24, name: "Purple" },
    "224,159,249": { id: 25, name: "Light Purple" },
    "203,0,122": { id: 26, name: "Dark Pink" },
    "236,31,128": { id: 27, name: "Pink" },
    "243,141,169": { id: 28, name: "Light Pink" },
    "104,70,52": { id: 29, name: "Dark Brown" },
    "149,104,42": { id: 30, name: "Brown" },
    "248,178,119": { id: 31, name: "Beige" },
};
const paid_colors = {
    "170,170,170": { id: 32, name: "Medium Gray" },
    "165,14,30": { id: 33, name: "Dark Red" },
    "250,128,114": { id: 34, name: "Light Red" },
    "228,92,26": { id: 35, name: "Dark Orange" },
    "214,181,148": { id: 36, name: "Light Tan" },
    "156,132,49": { id: 37, name: "Dark Goldenrod" },
    "197,173,49": { id: 38, name: "Goldenrod" },
    "232,212,95": { id: 39, name: "Light Goldenrod" },
    "74,107,58": { id: 40, name: "Dark Olive" },
    "90,148,74": { id: 41, name: "Olive" },
    "132,197,115": { id: 42, name: "Light Olive" },
    "15,121,159": { id: 43, name: "Dark Cyan" },
    "187,250,242": { id: 44, name: "Light Cyan" },
    "125,199,255": { id: 45, name: "Light Blue" },
    "77,49,184": { id: 46, name: "Dark Indigo" },
    "74,66,132": { id: 47, name: "Dark Slate Blue" },
    "122,113,196": { id: 48, name: "Slate Blue" },
    "181,174,241": { id: 49, name: "Light Slate Blue" },
    "219,164,99": { id: 50, name: "Light Brown" },
    "209,128,81": { id: 51, name: "Dark Beige" },
    "255,197,165": { id: 52, name: "Light Beige" },
    "155,82,73": { id: 53, name: "Dark Peach" },
    "209,128,120": { id: 54, name: "Peach" },
    "250,182,164": { id: 55, name: "Light Peach" },
    "123,99,82": { id: 56, name: "Dark Tan" },
    "156,132,107": { id: 57, name: "Tan" },
    "51,57,65": { id: 58, name: "Dark Slate" },
    "109,117,141": { id: 59, name: "Slate" },
    "179,185,209": { id: 60, name: "Light Slate" },
    "109,100,63": { id: 61, name: "Dark Stone" },
    "148,140,107": { id: 62, name: "Stone" },
    "205,197,158": { id: 63, name: "Light Stone" }
};
var colors = { ...free_colors };
const all_colors = { ...free_colors, ...paid_colors };

const applyPaidPalette = (paidKeys = []) => {
    const add = Object.fromEntries((paidKeys || []).filter(k => paid_colors[k]).map(k => [k, paid_colors[k]]));
    colors = { ...free_colors, ...add };
};

const colorNameById = (id) => {
    const colorKey = Object.keys(all_colors).find(key => all_colors[key].id === id);
    if (!colorKey) return `Unknown (${id})`;
    return (typeof colorNames !== 'undefined' && colorNames[colorKey]) ? colorNames[colorKey] : (all_colors[colorKey]?.name || `Unknown (${colorKey})`);
};
const colorById = (id) => Object.keys(all_colors).find(key => all_colors[key].id === id);
const closest = color => {
    const [tr, tg, tb] = color.split(',').map(Number);
    return colors[Object.keys(colors).reduce((closest, current) => {
        const [cr, cg, cb] = current.split(',').map(Number);
        const [clR, clG, clB] = closest.split(',').map(Number);
        return Math.sqrt(Math.pow(tr - cr, 2) + Math.pow(tg - cg, 2) + Math.pow(tb - cb, 2)) < Math.sqrt(Math.pow(tr - clR, 2) + Math.pow(tg - clG, 2) + Math.pow(tb - clB, 2)) ? current : closest;
    })].id;
};
const drawTemplate = (template, canvas) => {
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, template.width, template.height);
    const imageData = new ImageData(template.width, template.height);
    for (let x = 0; x < template.width; x++) {
        for (let y = 0; y < template.height; y++) {
            const color = template.data[x][y];
            if (color === 0) continue;
            const i = (y * template.width + x) * 4;
            const key = colorById(color);
            if (!key) {
                // Unknown color ID; skip drawing this pixel gracefully
                continue;
            }
            const [r, g, b] = key.split(',').map(Number);
            imageData.data[i] = r;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = b;
            imageData.data[i + 3] = 255;
        };
    };
    ctx.putImageData(imageData, 0, 0);
};
const loadTemplates = async (f) => {
    try {
        const templates = await axios.get("/templates");
        if (f) f(templates.data);
    } catch (error) {
        handleError(error);
    };
};
let currentTemplate = { width: 0, height: 0, data: [] };
const processImageFile = (file, callback) => {
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                const template = { width: canvas.width, height: canvas.height, ink: 0, data: Array.from({ length: canvas.width }, () => []) };
                const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        const i = (y * canvas.width + x) * 4;
                        const [r, g, b, a] = [d.data[i], d.data[i + 1], d.data[i + 2], d.data[i + 3]];
                        if (a === 255) {
                            template.data[x][y] = closest(`${r},${g},${b}`);
                            template.ink += 1;
                        } else template.data[x][y] = 0;
                    };
                };
                canvas.remove();
                callback(template);
            };
        };
        reader.readAsDataURL(file);
    }
};
convertInput.addEventListener('change', async () => {
    processImageFile(convertInput.files[0], (template) => {
        currentTemplate = template;
        drawTemplate(template, templateCanvas);
        size.innerHTML = `${template.width}x${template.height}px`;
        ink.innerHTML = template.ink;
        details.style.display = "block";
    });
});

canBuyMaxCharges.addEventListener('change', () => {
    if (canBuyMaxCharges.checked) {
        canBuyCharges.checked = false;
    }
});

canBuyCharges.addEventListener('change', () => {
    if (canBuyCharges.checked) {
        canBuyMaxCharges.checked = false;
    }
});

const resetTemplateForm = () => {
    templateForm.reset();
    templateFormTitle.textContent = "Add Template";
    submitTemplate.innerHTML = '<img src="icons/addTemplate.svg">Add Template';
    delete templateForm.dataset.editId;
    details.style.display = "none";
    currentTemplate = { width: 0, height: 0, data: [] };
};

templateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEditMode = !!templateForm.dataset.editId;

    if (!isEditMode && (!currentTemplate || currentTemplate.width === 0)) {
        showMessage("Error", "Please convert an image before creating a template.");
        return;
    }
    const selectedUsers = Array.from(document.querySelectorAll('input[name="user_checkbox"]:checked')).map(cb => cb.value);
    if (selectedUsers.length === 0) {
        showMessage("Error", "Please select at least one user.");
        return;
    }

    const data = {
        templateName: templateName.value,
        coords: [tx.value, ty.value, px.value, py.value].map(Number),
        userIds: selectedUsers,
        canBuyCharges: canBuyCharges.checked,
        canBuyMaxCharges: canBuyMaxCharges.checked,
        antiGriefMode: antiGriefMode.checked
    };

    if (currentTemplate && currentTemplate.width > 0) {
        data.template = currentTemplate;
    }

    try {
        if (isEditMode) {
            await axios.put(`/template/edit/${templateForm.dataset.editId}`, data);
            showMessage("Success", "Template updated!");
        } else {
            await axios.post('/template', data);
            showMessage("Success", "Template created!");
        }
        resetTemplateForm();
        openManageTemplates.click();
    } catch (error) {
        handleError(error);
    };
});
startAll.addEventListener('click', async () => {
    for (const child of templateList.children) {
        try {
            await axios.put(`/template/${child.id}`, { running: true });
        } catch (error) {
            handleError(error);
        };
    };
    showMessage("Success", "Finished! Check console for details.");
    openManageTemplates.click();
});
stopAll.addEventListener('click', async () => {
    for (const child of templateList.children) {
        try {
            await axios.put(`/template/${child.id}`, { running: false });
        } catch (error) {
            handleError(error);
        };
    };
    showMessage("Success", "Finished! Check console for details.");
    openManageTemplates.click();
});


// tabs
let currentTab = main;
const changeTab = (el) => {
    currentTab.style.display = "none";
    el.style.display = "block";
    currentTab = el;
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
openManageUsers.addEventListener("click", () => {
    userList.innerHTML = "";
    userForm.reset();
    totalCharges.textContent = "?";
    totalMaxCharges.textContent = "?";
    loadUsers(users => {
        for (const id of Object.keys(users)) {
            const user = document.createElement('div');
            user.className = 'user';
            user.id = `user-${id}`;
            user.innerHTML = `
                <div class="user-info">
                    <span>${users[id].name}</span>
                    <span>(#${id})</span>
                    <div class="user-stats">
                        Charges: <b>?</b>/<b>?</b> | Level <b>?</b> <span class="level-progress">(?%)</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="delete-btn" title="Delete User"><img src="icons/remove.svg"></button>
                    <button class="json-btn" title="Get Raw User Info"><img src="icons/code.svg"></button>
                </div>`;

            user.querySelector('.delete-btn').addEventListener("click", () => {
                showConfirmation(
                    "Delete User",
                    `Are you sure you want to delete ${users[id].name} (#${id})?`,
                    async () => {
                        try {
                            await axios.delete(`/user/${id}`);
                            showMessage("Success", "User deleted.");
                            openManageUsers.click();
                        } catch (error) {
                            handleError(error);
                        };
                    }
                );
            });
            user.querySelector('.json-btn').addEventListener("click", async () => {
                try {
                    const response = await axios.get(`/user/status/${id}`);
                    showMessage("Raw User Info", JSON.stringify(response.data, null, 2));
                } catch (error) {
                    handleError(error);
                };
            });
            userList.appendChild(user);
        };
    });
    changeTab(manageUsers);
});

async function processInParallel(tasks, concurrency) {
    const queue = [...tasks];
    const workers = [];

    const runTask = async () => {
        while (queue.length > 0) {
            const task = queue.shift();
            if (task) await task();
        }
    };

    for (let i = 0; i < concurrency; i++) {
        workers.push(runTask());
    }

    await Promise.all(workers);
}

checkUserStatus.addEventListener("click", async () => {
    checkUserStatus.disabled = true;
    checkUserStatus.innerHTML = "Checking...";
    const userElements = Array.from(document.querySelectorAll('.user'));

    let totalCurrent = 0;
    let totalMax = 0;

    const tasks = userElements.map(userEl => async () => {
        const id = userEl.id.split('-')[1];
        const infoSpans = userEl.querySelectorAll('.user-info > span');
        const currentChargesEl = userEl.querySelector('.user-stats b:nth-of-type(1)');
        const maxChargesEl = userEl.querySelector('.user-stats b:nth-of-type(2)');
        const currentLevelEl = userEl.querySelector('.user-stats b:nth-of-type(3)');
        const levelProgressEl = userEl.querySelector('.level-progress');

        infoSpans.forEach(span => span.style.color = 'var(--warning-color)');
        try {
            const response = await axios.get(`/user/status/${id}`);
            const userInfo = response.data;

            const charges = Math.floor(userInfo.charges.count);
            const max = userInfo.charges.max;
            const level = Math.floor(userInfo.level);
            const progress = Math.round((userInfo.level % 1) * 100);

            currentChargesEl.textContent = charges;
            maxChargesEl.textContent = max;
            currentLevelEl.textContent = level;
            levelProgressEl.textContent = `(${progress}%)`;
            totalCurrent += charges;
            totalMax += max;

            infoSpans.forEach(span => span.style.color = 'var(--success-color)');
        } catch (error) {
            currentChargesEl.textContent = "ERR";
            maxChargesEl.textContent = "ERR";
            currentLevelEl.textContent = "?";
            levelProgressEl.textContent = "(?%)";
            infoSpans.forEach(span => span.style.color = 'var(--error-color)');
        }
    });

    await processInParallel(tasks, 5);

    totalCharges.textContent = totalCurrent;
    totalMaxCharges.textContent = totalMax;

    checkUserStatus.disabled = false;
    checkUserStatus.innerHTML = '<img src="icons/check.svg">Check Account Status';
});
openAddTemplate.addEventListener("click", async () => {
    resetTemplateForm();
    await populateUserSelectList();
    try {
        const { data } = await axios.get('/settings');
        applyPaidPalette(data.paidPalette || []);
    } catch (e) {
        // ignore, keep free palette
    }
    changeTab(addTemplate);
});

const createToggleButton = (template, id, buttonsContainer, statusSpan) => {
    const button = document.createElement('button');
    const isRunning = template.running;

    button.className = isRunning ? 'destructive-button' : 'primary-button';
    button.innerHTML = `<img src="icons/${isRunning ? 'pause' : 'play'}.svg">${isRunning ? 'Stop' : 'Start'} Template`;

    button.addEventListener('click', async () => {
        try {
            await axios.put(`/template/${id}`, { running: !isRunning });
            template.running = !isRunning;
            const newButton = createToggleButton(template, id, buttonsContainer, statusSpan);
            statusSpan.textContent = template.running ? " Running" : " Stopped";
            button.replaceWith(newButton);
        } catch (error) {
            handleError(error);
        }
    });
    return button;
};

openManageTemplates.addEventListener("click", () => {
    templateList.innerHTML = "";
    loadUsers(users => {
        loadTemplates(templates => {
            for (const id of Object.keys(templates)) {
                const t = templates[id];
                const userListFormatted = t.userIds.map(userId => {
                    const user = users[userId];
                    return user ? `${user.name}#${userId}` : `Unknown#${userId}`;
                }).join(", ");

                const template = document.createElement('div');
                template.id = id;
                template.className = "template";
                const infoSpan = document.createElement('span');
                infoSpan.innerHTML = [
                    `<b>Template Name:</b> ${t.name}`,
                    `<b>Assigned Accounts:</b> ${userListFormatted}`,
                    `<b>Coordinates:</b> ${t.coords.join(", ")}`,
                    `<b>Buy Max Charge Upgrades:</b> ${t.canBuyMaxCharges ? "Yes" : "No"}`,
                    `<b>Buy Extra Charges:</b> ${t.canBuyCharges ? "Yes" : "No"}`,
                    `<b>Anti-Grief Mode:</b> ${t.antiGriefMode ? "Yes" : "No"}`,
                    `<b>Status:</b> <a class="status-text">${t.status}</a>`
                ].join('<br>');
                template.appendChild(infoSpan);

                const canvas = document.createElement("canvas");
                drawTemplate(t.template, canvas);
                const buttons = document.createElement('div');
                buttons.className = "template-actions";

                const toggleButton = createToggleButton(t, id, buttons, infoSpan.querySelector('.status-text'));
                buttons.appendChild(toggleButton);

                const editButton = document.createElement('button');
                editButton.className = 'secondary-button';
                editButton.innerHTML = '<img src="icons/settings.svg">Edit Template';
                editButton.addEventListener('click', async () => {
                    resetTemplateForm();
                    changeTab(addTemplate);

                    templateFormTitle.textContent = `Edit Template: ${t.name}`;
                    submitTemplate.innerHTML = '<img src="icons/edit.svg">Save Changes';
                    templateForm.dataset.editId = id;

                    templateName.value = t.name;
                    [tx.value, ty.value, px.value, py.value] = t.coords;
                    canBuyCharges.checked = t.canBuyCharges;
                    canBuyMaxCharges.checked = t.canBuyMaxCharges;
                    antiGriefMode.checked = t.antiGriefMode;

                    await populateUserSelectList(t.userIds);
                });

                const delButton = document.createElement('button');
                delButton.className = 'destructive-button';
                delButton.innerHTML = '<img src="icons/remove.svg">Delete Template';
                delButton.addEventListener("click", () => {
                    showConfirmation(
                        "Delete Template",
                        `Are you sure you want to delete template "${t.name}"?`,
                        async () => {
                            try {
                                await axios.delete(`/template/${id}`);
                                openManageTemplates.click();
                            } catch (error) {
                                handleError(error);
                            };
                        }
                    );
                });
                buttons.append(editButton);
                buttons.append(delButton);
                template.append(canvas);
                template.append(buttons);
                templateList.append(template);
            };
        });
    });
    changeTab(manageTemplates);
});
openSettings.addEventListener("click", async () => {
    try {
        const response = await axios.get('/settings');
        const currentSettings = response.data;
        drawingModeSelect.value = currentSettings.drawingMethod;
        turnstileNotifications.checked = currentSettings.turnstileNotifications;
        accountCooldown.value = currentSettings.accountCooldown / 1000;
        purchaseCooldown.value = currentSettings.purchaseCooldown / 1000;
        dropletReserve.value = currentSettings.dropletReserve;
        antiGriefStandby.value = currentSettings.antiGriefStandby / 60000;
        chargeThreshold.value = currentSettings.chargeThreshold * 100;
        alwaysDrawOnCharge.checked = !!currentSettings.alwaysDrawOnCharge;
        // Show/hide the threshold input depending on the toggle
        chargeThresholdContainer.style.display = alwaysDrawOnCharge.checked ? 'none' : 'block';
        renderPaidColorsList(currentSettings.paidPalette || []);
    } catch (error) {
        handleError(error);
    }
    changeTab(settings);
});

// Settings
drawingModeSelect.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { drawingMethod: drawingModeSelect.value });
        showMessage("Success", "Drawing mode saved!");
    } catch (error) {
        handleError(error);
    }
});

turnstileNotifications.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { turnstileNotifications: turnstileNotifications.checked });
        showMessage("Success", "Notification setting saved!");
    } catch (error) {
        handleError(error);
    }
});

accountCooldown.addEventListener('change', async () => {
    try {
        const newCooldown = parseInt(accountCooldown.value, 10) * 1000;
        if (isNaN(newCooldown) || newCooldown < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { accountCooldown: newCooldown });
        showMessage("Success", "Account cooldown saved!");
    } catch (error) {
        handleError(error);
    }
});

purchaseCooldown.addEventListener('change', async () => {
    try {
        const newCooldown = parseInt(purchaseCooldown.value, 10) * 1000;
        if (isNaN(newCooldown) || newCooldown < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { purchaseCooldown: newCooldown });
        showMessage("Success", "Purchase cooldown saved!");
    } catch (error) {
        handleError(error);
    }
});

dropletReserve.addEventListener('change', async () => {
    try {
        const newReserve = parseInt(dropletReserve.value, 10);
        if (isNaN(newReserve) || newReserve < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { dropletReserve: newReserve });
        showMessage("Success", "Droplet reserve saved!");
    } catch (error) {
        handleError(error);
    }
});

antiGriefStandby.addEventListener('change', async () => {
    try {
        const newStandby = parseInt(antiGriefStandby.value, 10) * 60000;
        if (isNaN(newStandby) || newStandby < 60000) {
            showMessage("Error", "Please enter a valid number (at least 1 minute).");
            return;
        }
        await axios.put('/settings', { antiGriefStandby: newStandby });
        showMessage("Success", "Anti-grief standby time saved!");
    } catch (error) {
        handleError(error);
    }
});

chargeThreshold.addEventListener('change', async () => {
    try {
        const newThreshold = parseInt(chargeThreshold.value, 10);
        if (isNaN(newThreshold) || newThreshold < 1 || newThreshold > 100) {
            showMessage("Error", "Please enter a valid percentage between 1 and 100.");
            return;
        }
        await axios.put('/settings', { chargeThreshold: newThreshold / 100 });
        showMessage("Success", "Charge threshold saved!");
    } catch (error) {
        handleError(error);
    }
});

// New toggle: alwaysDrawOnCharge
alwaysDrawOnCharge.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { alwaysDrawOnCharge: alwaysDrawOnCharge.checked });
        showMessage("Success", "Always-draw-on-charge setting saved!");
        // Hide the threshold input if immediate-draw is enabled, show otherwise
        chargeThresholdContainer.style.display = alwaysDrawOnCharge.checked ? 'none' : 'block';
        // Wake running templates so they re-evaluate immediately
        // (server will also wake them; this keeps UI responsive)
    } catch (error) {
        handleError(error);
    }
});

function renderPaidColorsList(selectedKeys = []) {
    if (!paidColorsList) return;
    paidColorsList.innerHTML = '';
    const selected = new Set(selectedKeys.map(String));
    const keys = Object.keys(paid_colors);
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '8px';
    paidColorsList.appendChild(container);

    const calcTextColor = (r, g, b) => {
        // perceptual luminance -> pick black or white for contrast
        return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#000' : '#fff';
    };

    const createColorButton = (key) => {
        const data = paid_colors[key];
        const [r, g, b] = key.split(',').map(Number);

        // wrapper to allow absolute positioned checkmark
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '120px';
        wrapper.style.height = '56px';
        wrapper.style.flex = '0 0 auto';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'color-button';
        btn.dataset.key = key;
        btn.setAttribute('aria-pressed', selected.has(key) ? 'true' : 'false');

        // compact visual styles, system font (larger, more neutral)
        btn.style.width = '100%';
        btn.style.height = '100%';
        btn.style.border = '1px solid rgba(0,0,0,0.08)';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.justifyContent = 'center';
        btn.style.alignItems = 'flex-start';
        btn.style.padding = '8px 10px';
        btn.style.background = `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.04)), rgb(${key})`;
        btn.style.color = calcTextColor(r, g, b);
        // Changed font to neutral system UI and slightly larger, lighter weight
        btn.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
        btn.style.fontWeight = '500';
        btn.style.fontSize = '13px';
        btn.style.lineHeight = '1.1';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        btn.style.transition = 'transform .12s ease, box-shadow .12s ease, outline-color .12s ease';

        // subtle hover/active
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'none');
        btn.addEventListener('mousedown', () => btn.style.transform = 'translateY(0)');
        btn.addEventListener('mouseup', () => btn.style.transform = 'translateY(-2px)');

        // contents (only show color name — no rgb code)
        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.justifyContent = 'flex-start';
        topRow.style.width = '100%';
        topRow.style.alignItems = 'center';

        const nameSpan = document.createElement('div');
        nameSpan.textContent = data.name;
        nameSpan.style.textShadow = '0 1px 0 rgba(0,0,0,0.2)';
        nameSpan.style.fontSize = '13px';
        nameSpan.style.fontWeight = '500';

        topRow.appendChild(nameSpan);
        btn.appendChild(topRow);

        // checkmark overlay for selection clarity
        const check = document.createElement('div');
        check.style.position = 'absolute';
        check.style.top = '6px';
        check.style.right = '6px';
        check.style.width = '22px';
        check.style.height = '22px';
        check.style.borderRadius = '50%';
        check.style.display = selected.has(key) ? 'flex' : 'none';
        check.style.alignItems = 'center';
        check.style.justifyContent = 'center';
        check.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
        check.style.background = 'rgba(0,0,0,0.18)';
        check.style.color = '#fff';
        check.style.fontSize = '14px';
        check.style.fontWeight = '700';
        check.textContent = '✓';
        check.setAttribute('aria-hidden', selected.has(key) ? 'false' : 'true');

        // visual border when selected (accent)
        if (selected.has(key)) {
            btn.style.outline = '3px solid rgba(255,255,255,0.18)';
            btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
        } else {
            btn.style.outline = '3px solid transparent';
        }

        btn.addEventListener('click', () => {
            const isActive = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', isActive ? 'false' : 'true');
            if (isActive) {
                selected.delete(key);
                btn.style.outline = '3px solid transparent';
                btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                check.style.display = 'none';
                check.setAttribute('aria-hidden', 'true');
            } else {
                selected.add(key);
                btn.style.outline = '3px solid rgba(255,255,255,0.18)';
                btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
                check.style.display = 'flex';
                check.setAttribute('aria-hidden', 'false');
            }
            save();
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(check);
        return wrapper;
    };

    keys.forEach(k => {
        container.appendChild(createColorButton(k));
    });

    const save = async () => {
        const selectedArr = Array.from(selected);
        try {
            await axios.put('/settings', { paidPalette: selectedArr });
            applyPaidPalette(selectedArr);
            showMessage('Success', 'Paid color selection saved!');
        } catch (e) {
            handleError(e);
        }
    };

    // control bar (smaller, unobtrusive)
    const controlBar = document.createElement('div');
    controlBar.style.display = 'flex';
    controlBar.style.gap = '8px';
    controlBar.style.marginTop = '10px';
    controlBar.style.alignItems = 'center';

    const makeControl = (label, bg, handler) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.style.padding = '8px 12px';
        b.style.borderRadius = '8px';
        b.style.border = 'none';
        b.style.cursor = 'pointer';
        b.style.fontWeight = '600';
        b.style.fontSize = '13px';
        b.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
        b.style.color = '#fff';
        b.style.background = bg;
        b.addEventListener('click', handler);
        return b;
    };

    if (selectAllPaidColors) {
        selectAllPaidColors.onclick = () => {
            keys.forEach(k => selected.add(k));
            paidColorsList.querySelectorAll('div > button.color-button').forEach(btn => {
                btn.setAttribute('aria-pressed', 'true');
                btn.style.outline = '3px solid rgba(255,255,255,0.18)';
                btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
                const check = btn.parentElement.querySelector('div[aria-hidden]');
                if (check) { check.style.display = 'flex'; check.setAttribute('aria-hidden', 'false'); }
            });
            save();
        };
    }
    if (clearAllPaidColors) {
        clearAllPaidColors.onclick = () => {
            selected.clear();
            paidColorsList.querySelectorAll('div > button.color-button').forEach(btn => {
                btn.setAttribute('aria-pressed', 'false');
                btn.style.outline = '3px solid transparent';
                btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                const check = btn.parentElement.querySelector('div[aria-hidden]');
                if (check) { check.style.display = 'none'; check.setAttribute('aria-hidden', 'true'); }
            });
            save();
        };
    }

    paidColorsList.appendChild(controlBar);
}


tx.addEventListener('blur', () => {
    const value = tx.value.trim();
    const urlRegex = /pixel\/(\d+)\/(\d+)\?x=(\d+)&y=(\d+)/;
    const urlMatch = value.match(urlRegex);

    if (urlMatch) {
        tx.value = urlMatch[1];
        ty.value = urlMatch[2];
        px.value = urlMatch[3];
        py.value = urlMatch[4];
    } else {
        const parts = value.split(/\s+/);
        if (parts.length === 4) {
            tx.value = parts[0].replace(/[^0-9]/g, '');
            ty.value = parts[1].replace(/[^0-9]/g, '');
            px.value = parts[2].replace(/[^0-9]/g, '');
            py.value = parts[3].replace(/[^0-9]/g, '');
        } else {
            tx.value = value.replace(/[^0-9]/g, '');
        }
    }
});

[ty, px, py].forEach(input => {
    input.addEventListener('blur', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
    });
});

// Populate user selection list for templates (supports preselection)
async function populateUserSelectList(preselectedIds = []) {
    // Normalize to strings for comparison with object keys
    const preselected = new Set(preselectedIds.map(String));

    // Clear current list
    userSelectList.innerHTML = "";

    // Load users
    try {
        const res = await axios.get('/users');
        const users = res.data || {};
        const ids = Object.keys(users);

        if (ids.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'No users available. Add users first.';
            userSelectList.appendChild(empty);
            selectAllUsers.checked = false;
            selectAllUsers.disabled = true;
            return;
        }

        selectAllUsers.disabled = false;

        ids.forEach(id => {
            const u = users[id];
            const label = document.createElement('label');
            label.className = 'user-select-item';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.name = 'user_checkbox';
            cb.value = id;
            cb.checked = preselected.size > 0 ? preselected.has(id) : false;

            const text = document.createElement('span');
            text.textContent = `${u.name} (#${id})`;

            label.appendChild(cb);
            label.appendChild(text);
            userSelectList.appendChild(label);
        });

        // Update select-all based on current state
        const checkboxes = Array.from(userSelectList.querySelectorAll('input[name="user_checkbox"]'));
        const updateSelectAllState = () => {
            const allChecked = checkboxes.length > 0 && checkboxes.every(c => c.checked);
            const noneChecked = checkboxes.every(c => !c.checked);
            // Indeterminate when some but not all are checked
            selectAllUsers.indeterminate = !allChecked && !noneChecked;
            selectAllUsers.checked = allChecked;
        };

        // Attach listeners
        checkboxes.forEach(cb => cb.addEventListener('change', updateSelectAllState));
        selectAllUsers.onchange = () => {
            const checked = selectAllUsers.checked;
            selectAllUsers.indeterminate = false;
            checkboxes.forEach(c => { c.checked = checked; });
        };

        // Initialize state
        updateSelectAllState();
    } catch (error) {
        handleError(error);
    }
}
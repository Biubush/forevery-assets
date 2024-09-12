const noteContainer = document.getElementById('noteContainer');
let selectedTextBox = null;

// 添加新的文本框并使其可交互
noteContainer.addEventListener('dblclick', function (event) {
    const textBox = document.createElement('div');
    textBox.classList.add('absolute', 'cursor-move', 'select-none', 'p-1.5', 'text-box');
    textBox.contentEditable = 'true';
    textBox.textContent = '单击编辑';

    // 初始化位置
    textBox.style.left = `${event.clientX - noteContainer.offsetLeft}px`;
    textBox.style.top = `${event.clientY - noteContainer.offsetTop}px`;

    noteContainer.appendChild(textBox);

    makeInteractable(textBox);
    setSelectedTextBox(textBox);
});

function addCenteredTextBox() {
    const textBox = document.createElement('div');
    textBox.classList.add('absolute', 'cursor-move', 'select-none', 'p-1.5', 'text-box');
    textBox.contentEditable = 'true';
    textBox.textContent = '单击编辑';

    // 计算noteContainer的中心位置
    const containerRect = noteContainer.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // 设置textBox的初始位置为中心
    textBox.style.left = `${centerX}px`;
    textBox.style.top = `${centerY}px`;

    // 将textBox添加到noteContainer
    noteContainer.appendChild(textBox);

    // 假设makeInteractable和setSelectedTextBox函数已经定义
    makeInteractable(textBox);
    setSelectedTextBox(textBox);
}

// 为元素（文本框或贴纸）启用拖动、缩放、旋转功能
function makeInteractable(element) {
    interact(element)
        .draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: {
                move: dragMoveListener
            }
        })
        .gesturable({
            listeners: {
                start(event) {
                    const element = event.target;
                    element.setAttribute('data-angle', event.angle || 0);
                    element.setAttribute('data-scale', event.scale || 1);
                },
                move(event) {
                    const element = event.target;
                    const currentAngle = parseFloat(element.getAttribute('data-angle')) + event.da;
                    const currentScale = parseFloat(element.getAttribute('data-scale')) * (1 + event.ds);

                    element.style.transform =
                        'rotate(' + currentAngle + 'deg)' + 'scale(' + currentScale + ')';

                    element.setAttribute('data-angle', currentAngle);
                    element.setAttribute('data-scale', currentScale);

                    dragMoveListener(event);
                }
            }
        });

    element.addEventListener('click', () => setSelectedTextBox(element));
}

function setSelectedTextBox(element) {
    if (selectedTextBox) {
        selectedTextBox.classList.remove('selected');
    }
    selectedTextBox = element;
    selectedTextBox.classList.add('selected');
}

// 更改文字颜色
document.getElementById('colorPicker').addEventListener('input', function () {
    if (selectedTextBox) {
        selectedTextBox.style.color = this.value;
    }
});

// 调整文字大小
document.getElementById('fontSize').addEventListener('input', function () {
    if (selectedTextBox) {
        selectedTextBox.style.fontSize = this.value + 'px';
    }
    document.getElementById('fontSizeDisplay').innerText = this.value;
});

// 自定义背景图片
document.getElementById('backgroundInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // 设置背景图片的样式
                noteContainer.style.backgroundImage = `url(${e.target.result})`;
                noteContainer.style.backgroundSize = 'contain';
                noteContainer.style.backgroundPosition = 'center';
                noteContainer.style.backgroundRepeat = 'no-repeat';
                noteContainer.style.backgroundColor = 'transparent';
                document.getElementById('closeBackgroundSidebar').click();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function dragMoveListener(event) {
    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    const currentAngle = parseFloat(target.getAttribute('data-angle')) || 0;
    const currentScale = parseFloat(target.getAttribute('data-scale')) || 1;

    target.style.transform = `translate(${x}px, ${y}px) rotate(${currentAngle}deg) scale(${currentScale})`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;

// 保存便签
document.getElementById('saveNote').addEventListener('click', function () {
    const noteData = [];
    const author = toggleSwitch.checked ? '元' : '璐';
    noteData.push({ type: 'author', content: author });
    noteContainer.querySelectorAll('.text-box, .sticker').forEach(element => {
        const data = {
            type: element.classList.contains('text-box') ? 'text-box' : 'sticker',
            content: element.classList.contains('text-box')
                ? element.innerHTML.replace(/<br>/g, '\n')
                : element.querySelector('img').src, // This will now be the base64 data
            color: element.style.color || '',
            font_family: element.style.fontFamily || '',
            fontSize: element.style.fontSize || '',
            left: element.style.left,
            top: element.style.top,
            width: element.style.width || '',
            height: element.style.height || '',
            transform: element.style.transform || '',
            x: element.getAttribute('data-x') || 0,
            y: element.getAttribute('data-y') || 0,
            angle: element.getAttribute('data-angle') || 0,
            scale: element.getAttribute('data-scale') || 1
        };
        noteData.push(data);
    });

    // Convert background image to base64
    const backgroundImage = window.getComputedStyle(noteContainer).backgroundImage;
    const backgroundUrl = backgroundImage.slice(5, -2); // Remove url("") wrapper
    if (backgroundUrl) {
        fetch(backgroundUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = function() {
                    noteData.push({ type: 'background', content: reader.result });
                    finalizeSave();
                }
                reader.readAsDataURL(blob);
            });
    } else {
        noteData.push({ type: 'background', content: '' });
        finalizeSave();
    }

    function finalizeSave() {
        const nowDate = new Date();
        const nowTime = nowDate.toISOString().replace(/T/, '_').replace(/\..+/, '');
        noteData.push({ type: 'time', content: nowTime });
        document.getElementById('editTime').innerText = `最后编辑时间：${nowTime}`;

        noteData.push({ type: 'font', content: importFontList });

        const blob = new Blob([JSON.stringify(noteData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'note_data.json';
        link.click();
    }
});

// 导入便签
document.getElementById('importNoteInput').addEventListener('change', function () {
    document.querySelector('.loading-overlay').style.display = 'block';
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const noteData = JSON.parse(e.target.result);
            noteContainer.innerHTML = '';
            noteData.forEach(data => {
                let element;
                if (data.type === 'text-box') {
                    element = document.createElement('div');
                    element.classList.add('absolute', 'cursor-move', 'select-none', 'p-1.5', 'text-box');
                    element.contentEditable = 'true';
                    element.innerHTML = data.content.replace(/\n/g, '<br>');
                    element.style.color = data.color;
                    element.style.fontFamily = data.font_family;
                    element.style.fontSize = data.fontSize;
                } else if (data.type === 'sticker') {
                    element = document.createElement('div');
                    element.classList.add('absolute', 'cursor-move', 'select-none', 'sticker');
                    element.innerHTML = `<img src="${data.content}" alt="sticker" class="w-full h-full pointer-events-none">`;
                    element.style.width = data.width;
                    element.style.height = data.height;
                } else if (data.type === 'background') {
                    noteContainer.style.backgroundImage = `url(${data.content})`;
                    noteContainer.style.backgroundSize = 'contain';
                    noteContainer.style.backgroundPosition = 'center';
                    noteContainer.style.backgroundRepeat = 'no-repeat';
                    if (data.content !== '') {
                        if (noteContainer.classList.contains('bg-yellow-100')) {
                            noteContainer.classList.remove('bg-yellow-100');
                        }
                    } else {
                        noteContainer.classList.add('bg-yellow-100');
                    }
                } else if (data.type === 'time') {
                    document.getElementById('editTime').innerText = `最后编辑时间：${data.content}`;
                } else if (data.type === 'font') {
                    data.content.forEach(url => {
                        loadFontCSS(url);
                        importFontList.push(url);
                    });
                } else if (data.type === 'author') {
                    if (data.content === '元') {
                        document.getElementById('owner-toggle').checked = true;
                    } else {
                        document.getElementById('owner-toggle').checked = false;
                    }
                }
                if (element) {
                    element.style.left = data.left;
                    element.style.top = data.top;
                    element.style.transform = data.transform;

                    element.setAttribute('data-x', data.x);
                    element.setAttribute('data-y', data.y);
                    element.setAttribute('data-angle', data.angle);
                    element.setAttribute('data-scale', data.scale);

                    noteContainer.appendChild(element);
                    makeInteractable(element);
                }
            });
        };
        reader.readAsText(file);
    }
    document.querySelector('.loading-overlay').style.display = 'none';
});

function printComponentSize() {
    var component = document.getElementById("noteContainer");
    var width = component.offsetWidth;
    var height = component.offsetHeight;
    document.getElementById("output").innerText =
        "宽度: " + width + "px, 高度: " + height + "px";
}

// 在页面加载和窗口大小变化时打印宽高
window.onload = printComponentSize;
window.onresize = printComponentSize;

// 获取按钮元素
const toggleSwitch = document.getElementById('owner-toggle');

// 页面加载时检查本地存储中的状态并应用
window.addEventListener('load', () => {
    const isChecked = localStorage.getItem('toggleState') === 'true';
    toggleSwitch.checked = isChecked;
});

// 监听按钮状态变化，并将状态保存到本地存储
toggleSwitch.addEventListener('change', () => {
    localStorage.setItem('toggleState', toggleSwitch.checked);
});

// 发布便签
document.getElementById('publish-btn').addEventListener('click', function () {
    document.querySelector('.loading-overlay').style.display = 'block';
    const noteData = [];
    const author = toggleSwitch.checked ? '元' : '璐';
    noteData.push({ type: 'author', content: author });

    // 处理文本框和贴纸
    const elements = noteContainer.querySelectorAll('.text-box, .sticker');
    let processedCount = 0;

    function processElement(element) {
        const data = {
            type: element.classList.contains('text-box') ? 'text-box' : 'sticker',
            content: element.classList.contains('text-box')
                ? element.innerHTML.replace(/<br>/g, '\n')
                : element.querySelector('img').src,
            color: element.style.color || '',
            font_family: element.style.fontFamily || '',
            fontSize: element.style.fontSize || '',
            left: element.style.left,
            top: element.style.top,
            width: element.style.width || '',
            height: element.style.height || '',
            transform: element.style.transform || '',
            x: element.getAttribute('data-x') || 0,
            y: element.getAttribute('data-y') || 0,
            angle: element.getAttribute('data-angle') || 0,
            scale: element.getAttribute('data-scale') || 1
        };
        noteData.push(data);
        processedCount++;
        if (processedCount === elements.length) {
            processBackground();
        }
    }

    elements.forEach(processElement);

    // 处理背景图片
    function processBackground() {
        const backgroundImage = window.getComputedStyle(noteContainer).backgroundImage;
        const backgroundUrl = backgroundImage.slice(5, -2); // 移除 url("") 的包裹
        if (backgroundUrl && !backgroundUrl.startsWith('data:')) {
            // 如果背景不是 base64，则转换它
            fetch(backgroundUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        noteData.push({ type: 'background', content: reader.result });
                        finalizePublish();
                    }
                    reader.readAsDataURL(blob);
                });
        } else {
            // 如果背景已经是 base64 或为空，直接使用
            noteData.push({ type: 'background', content: backgroundUrl });
            finalizePublish();
        }
    }

    // 完成发布过程
    function finalizePublish() {
        const nowDate = new Date();
        const nowTime = nowDate.toISOString().replace(/T/, '_').replace(/\..+/, '');
        noteData.push({ type: 'time', content: nowTime });
        document.getElementById('editTime').innerText = `最后编辑时间：${nowTime}`;

        noteData.push({ type: 'font', content: importFontList });

        const blob = new Blob([JSON.stringify(noteData, null, 2)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', blob, 'note_data.json');

        fetch('/api/publish', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                return response.json().then(data => {
                    alert(data.msg);
                    document.querySelector('.loading-overlay').style.display = 'none';
                });
            });
    }
});
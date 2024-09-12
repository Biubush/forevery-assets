// 初始化 Quill 编辑器
var quill = new Quill('#editor', {
    modules: {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['italic', 'underline'],
            ['image', 'code-block'],
        ],
    },
    theme: 'snow'
});

// 处理图片上传
document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'draggable';
            img.style.width = '150px'; // 默认宽度
            img.style.height = 'auto'; // 自动调整高度
            img.style.left = '10px'; // 初始位置
            img.style.top = '10px'; // 初始位置
            document.querySelector('.textarea-container').appendChild(img);
            makeElementDraggable(img);
        };
        reader.readAsDataURL(file);
    }
});

// 使用 interact.js 实现拖动和缩放功能，并限定在编辑器内部
function makeElementDraggable(element) {
    interact(element)
        .draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            onmove: function (event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    endOnly: true
                }),
                interact.modifiers.restrictSize({
                    min: { width: 50, height: 50 }
                })
            ]
        })
        .on('resizemove', function (event) {
            const target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            // 更新元素的尺寸
            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            // 通过 transform 更新位置
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });
}

// 导出便签数据
document.getElementById('export-button').addEventListener('click', function () {
    const content = quill.root.innerHTML;
    const stickers = Array.from(document.querySelectorAll('.draggable')).map(sticker => {
        return {
            src: sticker.src,
            position: {
                x: parseFloat(sticker.getAttribute('data-x')) || 0,
                y: parseFloat(sticker.getAttribute('data-y')) || 0
            },
            size: {
                width: sticker.offsetWidth,
                height: sticker.offsetHeight
            }
        };
    });

    const data = {
        content: content,
        stickers: stickers
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.json';
    a.click();
    URL.revokeObjectURL(url);
});

// 导入便签数据
document.getElementById('import-file').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = JSON.parse(e.target.result);
            quill.root.innerHTML = data.content;

            // 清空现有贴纸
            const stickersContainer = document.querySelector('.textarea-container');
            stickersContainer.querySelectorAll('.draggable').forEach(sticker => sticker.remove());

            // 解析贴纸并添加到编辑框
            data.stickers.forEach(stickerData => {
                const img = document.createElement('img');
                img.src = stickerData.src;
                img.className = 'draggable';
                img.style.width = `${stickerData.size.width}px`;
                img.style.height = `${stickerData.size.height}px`;
                img.style.left = `${stickerData.position.x}px`;
                img.style.top = `${stickerData.position.y}px`;
                stickersContainer.appendChild(img);
                makeElementDraggable(img);
            });
        };
        reader.readAsText(file);
    }
});
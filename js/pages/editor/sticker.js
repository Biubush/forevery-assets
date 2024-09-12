let stickerData = []; // 存储当前显示的贴纸数据
let displayedStickers = 0; // 已显示贴纸的数量
const stickersPerLoad = 18; // 每次懒加载显示的贴纸数量
const stickersFileUrl = '../static/json/stickers/index.json';
let isInPackageView = false; // 标识当前是否在某个贴纸包内

document.addEventListener('DOMContentLoaded', function () {
    const stickerListElement = document.getElementById('stickerList');
    const searchInput = document.getElementById('sticker-search');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const backButton = document.getElementById('backButton');

    // 加载贴纸包列表
    loadStickerPackages();

    // 监听滚动事件以实现懒加载
    stickerListElement.addEventListener('scroll', lazyLoadStickers);

    // 搜索功能
    searchInput.addEventListener('input', function () {
        const searchText = this.value.toLowerCase();
        const filteredStickers = stickerData.filter(sticker => sticker.alt.toLowerCase().includes(searchText));
        displayedStickers = 0; // 重置显示的贴纸数量
        stickerListElement.innerHTML = ''; // 清空当前列表
        renderStickers(filteredStickers.slice(0, stickersPerLoad));
        displayedStickers = Math.min(filteredStickers.length, stickersPerLoad);
    });

    // 侧边栏打开和关闭
    document.getElementById('openStickersSidebar').addEventListener('click', function () {
        document.getElementById('stickersSidebar').classList.remove('translate-x-full');
    });

    document.getElementById('closeStickerSidebar').addEventListener('click', function () {
        document.getElementById('stickersSidebar').classList.add('translate-x-full');
    });

    // 返回上一级按钮
    backButton.addEventListener('click', function () {
        loadStickerPackages();
        backButton.classList.add('hidden');
        sidebarTitle.textContent = '贴纸库';
        searchInput.placeholder = '搜索贴纸包...';
        searchInput.value = '';
        isInPackageView = false;
    });
});

// 加载贴纸包列表
function loadStickerPackages() {
    fetch(stickersFileUrl)
        .then(response => response.json())
        .then(data => {
            stickerData = data;
            displayedStickers = 0;
            document.getElementById('stickerList').innerHTML = '';
            renderStickers(stickerData.slice(0, stickersPerLoad));
            displayedStickers = stickersPerLoad;
        });
}

// 渲染贴纸列表
function renderStickers(stickers) {
    const stickerList = document.getElementById('stickerList');

    stickers.forEach(sticker => {
        const stickerItem = document.createElement('div');
        stickerItem.className = 'text-center';

        const img = document.createElement('img');
        img.src = sticker.src;
        img.alt = sticker.alt;
        img.className = 'mx-auto mb-2 cursor-pointer w-16 h-16 object-contain';

        // 如果上一级按钮可见，点击贴纸时应添加到便签中，否则加载贴纸包
        img.addEventListener('click', function () {
            if (isInPackageView) {
                addStickerToPage(sticker.src);
                document.getElementById('stickersSidebar').classList.add('translate-x-full');
            } else {
                loadStickerPackage(sticker.target, sticker.alt);
            }
        });

        const label = document.createElement('div');
        label.textContent = sticker.alt;
        label.className = 'text-sm';

        stickerItem.appendChild(img);
        stickerItem.appendChild(label);
        stickerList.appendChild(stickerItem);
    });
}

// 加载单个贴纸包
function loadStickerPackage(targetFile, packageName) {
    fetch(`../static/json/stickers/${targetFile}`)
        .then(response => response.json())
        .then(data => {
            stickerData = data.imgList;
            displayedStickers = 0;
            document.getElementById('stickerList').innerHTML = '';
            renderStickers(stickerData.slice(0, stickersPerLoad));
            displayedStickers = stickersPerLoad;
            document.getElementById('sidebarTitle').textContent = packageName;
            document.getElementById('backButton').classList.remove('hidden');
            document.getElementById('sticker-search').placeholder = '搜索贴纸...';
            document.getElementById('sticker-search').value = '';
            isInPackageView = true;
        })
        .catch(error => {
            console.error('Error loading sticker package:', error);
        });
}

// 懒加载函数
function lazyLoadStickers() {
    const stickerList = document.getElementById('stickerList');
    if (stickerList.scrollTop + stickerList.clientHeight >= stickerList.scrollHeight - 50) {
        const nextStickers = stickerData.slice(displayedStickers, displayedStickers + stickersPerLoad);
        renderStickers(nextStickers);
        displayedStickers += nextStickers.length;
    }
}

// 导入贴纸
document.getElementById('stickerInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        document.querySelector('.loading-overlay').style.display = 'block';
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const aspectRatio = img.width / img.height;
                const defaultWidth = 100;
                const defaultHeight = defaultWidth / aspectRatio;

                const sticker = document.createElement('div');
                sticker.classList.add('absolute', 'cursor-move', 'select-none', 'sticker');
                sticker.style.width = `${defaultWidth}px`;
                sticker.style.height = `${defaultHeight}px`;
                sticker.style.left = '50%';
                sticker.style.top = '50%';
                sticker.style.transform = 'translate(-50%, -50%)';

                sticker.innerHTML = `<img src="${e.target.result}" alt="sticker" class="w-full h-full pointer-events-none">`;

                const noteContainer = document.getElementById('noteContainer');
                noteContainer.appendChild(sticker);
                makeInteractable(sticker);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    document.querySelector('.loading-overlay').style.display = 'none';
});

// 将贴纸添加到页面的通用函数
function addStickerToPage(src) {
    fetch(src)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64data = reader.result;

                const img = new Image();
                img.onload = function () {
                    const aspectRatio = img.width / img.height;
                    const defaultWidth = 100;
                    const defaultHeight = defaultWidth / aspectRatio;

                    const sticker = document.createElement('div');
                    sticker.classList.add('absolute', 'cursor-move', 'select-none', 'sticker');
                    sticker.style.width = `${defaultWidth}px`;
                    sticker.style.height = `${defaultHeight}px`;
                    sticker.style.left = '40%';
                    sticker.style.top = '40%';

                    sticker.innerHTML = `<img src="${base64data}" alt="sticker" class="w-full h-full pointer-events-none">`;

                    const noteContainer = document.getElementById('noteContainer');
                    noteContainer.appendChild(sticker);
                    makeInteractable(sticker);
                };
                img.src = base64data;
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.error('Error fetching image:', error);
        });
}
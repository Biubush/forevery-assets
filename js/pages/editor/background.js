const BACKGROUND_JS_PATH = '../static/json/background.json';
const STATIC_BASE_PATH = '../static/img/backgrounds';
let backgroundData = [];
let currentPath = [];
const backgroundsPerLoad = 18;
let displayedBackgrounds = 0;

document.addEventListener('DOMContentLoaded', function () {
    loadBackgrounds();

    // 懒加载
    document.getElementById('backgroundList').addEventListener('scroll', lazyLoadBackgrounds);

    // 打开侧边栏
    document.getElementById('openBackgroundSidebar').addEventListener('click', function () {
        document.getElementById('backgroundSidebar').classList.remove('translate-y-full');
    });

    // 关闭侧边栏
    document.getElementById('closeBackgroundSidebar').addEventListener('click', function () {
        document.getElementById('backgroundSidebar').classList.add('translate-y-full');
    });


    // 返回根目录
    document.getElementById('breadcrumbRoot').addEventListener('click', function () {
        currentPath = [];
        loadBackgrounds();
    });
});

function loadBackgrounds(path = []) {
    fetch(BACKGROUND_JS_PATH)
        .then(response => response.json())
        .then(data => {
            backgroundData = getBackgroundsAtPath(data, path);
            currentPath = path;
            displayedBackgrounds = 0;
            document.getElementById('backgroundList').innerHTML = '';
            renderBackgrounds(backgroundData.slice(0, backgroundsPerLoad));
            displayedBackgrounds = backgroundsPerLoad;
            updateBreadcrumb();
        });
}

function getBackgroundsAtPath(data, path) {
    let result = data;
    for (const part of path) {
        const folder = result.find(item => item.path === part);
        if (folder && folder.child) {
            result = folder.child;
        }
    }
    return result;
}

function renderBackgrounds(backgrounds) {
    const backgroundList = document.getElementById('backgroundList');

    backgrounds.forEach(background => {
        const backgroundItem = document.createElement('div');
        backgroundItem.className = 'text-center';

        const img = document.createElement('div');
        img.className = 'mx-auto fill-red-300 mb-2 cursor-pointer w-16 h-16 object-contain flex justify-center items-center';

        if (background.child && background.child.length > 0) {
            // 是文件夹，使用SVG图标
            img.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-16 h-16">
                                <path d="M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z"/>
                             </svg>`;
            img.addEventListener('click', function () {
                loadBackgrounds([...currentPath, background.path]);
            });
        } else {
            // 是文件
            img.innerHTML = `<img src="${STATIC_BASE_PATH}/${background.path}" alt="背景图" class="w-16 h-16 object-contain">`;
            img.addEventListener('click', function () {
                let imagePath = `${STATIC_BASE_PATH}/${background.path}`.replace(/ /g, '%20');
                console.log(imagePath);

                noteContainer.style.backgroundImage = `url(${imagePath})`;
                noteContainer.style.backgroundSize = 'contain';
                noteContainer.style.backgroundPosition = 'center';
                noteContainer.style.backgroundRepeat = 'no-repeat';
                noteContainer.style.backgroundColor = 'transparent';
                document.getElementById('closeBackgroundSidebar').click();
            });
        }

        const label = document.createElement('div');
        label.textContent = background.path.split('/').pop();
        label.className = 'text-sm';

        backgroundItem.appendChild(img);
        backgroundItem.appendChild(label);
        backgroundList.appendChild(backgroundItem);
    });
}

function lazyLoadBackgrounds() {
    const backgroundList = document.getElementById('backgroundList');
    if (backgroundList.scrollTop + backgroundList.clientHeight >= backgroundList.scrollHeight - 50) {
        const nextBackgrounds = backgroundData.slice(displayedBackgrounds, displayedBackgrounds + backgroundsPerLoad);
        renderBackgrounds(nextBackgrounds);
        displayedBackgrounds += nextBackgrounds.length;
    }
}

function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';

    const root = document.createElement('span');
    root.id = 'breadcrumbRoot';
    root.textContent = '根目录';
    root.className = 'cursor-pointer text-blue-500';
    root.addEventListener('click', function () {
        currentPath = [];
        loadBackgrounds();
    });
    breadcrumb.appendChild(root);

    currentPath.forEach((part, index) => {
        const separator = document.createElement('span');
        separator.textContent = ' / ';
        breadcrumb.appendChild(separator);

        const crumb = document.createElement('span');
        crumb.textContent = part.split('/').pop();
        crumb.className = 'cursor-pointer text-blue-500';
        crumb.addEventListener('click', function () {
            loadBackgrounds(currentPath.slice(0, index + 1));
        });
        breadcrumb.appendChild(crumb);
    });
}

const importFontList = []
let fontData = []; // 全局变量存储字体数据
let displayedFonts = 0; // 已显示字体数
const fontsPerLoad = 20; // 每次懒加载显示的字体数量

// 指定要读取的src文件URL
const fileUrl = '../static/json/chinese_font.json';

document.addEventListener('DOMContentLoaded', function () {

    // 使用fetch来获取文件
    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            fontData = data;
            renderFontList(fontData.slice(0, fontsPerLoad)); // 初始渲染部分字体
            displayedFonts = fontsPerLoad;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });



    // 监听字体列表滚动事件以实现懒加载
    document.getElementById('font-list').addEventListener('scroll', lazyLoadFonts);

    // 处理搜索功能
    document.getElementById('font-search').addEventListener('input', function () {
        const searchText = this.value.toLowerCase();
        const filteredFonts = fontData.filter(font => font.name.toLowerCase().includes(searchText));
        displayedFonts = 0; // 重置显示的字体数
        document.getElementById('font-list').innerHTML = ''; // 清空当前列表
        renderFontList(filteredFonts.slice(0, fontsPerLoad));
        displayedFonts = Math.min(filteredFonts.length, fontsPerLoad);
    });

    // 侧边栏展开和关闭功能
    const fontSidebar = document.getElementById('fontSidebar');
    const toggleButton = document.getElementById('fontSidebar-toggle');
    const closeFontSidebar = document.getElementById('closeFontSidebar');

    toggleButton.addEventListener('click', function () {
        const isClosed = fontSidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            fontSidebar.classList.remove('-translate-x-full');
        } else {
            fontSidebar.classList.add('-translate-x-full');
        }
    });

    // 内部关闭按钮事件处理
    closeFontSidebar.addEventListener('click', function () {
        fontSidebar.classList.add('-translate-x-full');
    });

});


// 动态添加CSS到页面头部
function loadFontCSS(url) {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

// 渲染字体列表
function renderFontList(fonts) {
    const fontList = document.getElementById('font-list');

    fonts.forEach(font => {
        // 创建字体项
        const listItem = document.createElement('li');
        listItem.className = 'p-2 mb-2 border-b cursor-pointer';
        listItem.style.fontFamily = font.font_family;
        listItem.textContent = font.name;

        // 点击字体项时更改#noteContainer的字体
        listItem.addEventListener('click', function () {
            loadFontCSS(font.import_url);
            if (selectedTextBox) {
                selectedTextBox.style.fontFamily = font.font_family;
            }
            //如果importFontList中没有这个字体，就添加进去
            if (!importFontList.includes(font.import_url)) {
                importFontList.push(font.import_url);
            }
            fontSidebar.classList.add('-translate-x-full');
        });

        fontList.appendChild(listItem);
    });
}

// 懒加载函数
function lazyLoadFonts() {
    const fontList = document.getElementById('font-list');
    if (fontList.scrollTop + fontList.clientHeight >= fontList.scrollHeight - 50) {
        const nextFonts = fontData.slice(displayedFonts, displayedFonts + fontsPerLoad);
        renderFontList(nextFonts);
        nextFonts.forEach(font => loadFontCSS(font.import_url));
        displayedFonts += nextFonts.length;
    }
}
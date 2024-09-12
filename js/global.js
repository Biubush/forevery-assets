window.onload = function () {
    document.querySelectorAll('.loading-overlay').forEach((overlay) => {
        overlay.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div class="bar">
                <div class="ball"></div>
            </div>
            <br>
            <h2 style="color: aliceblue;text-align: center;">加载中...</h2>
        </div>
    `;
    });
    document.querySelectorAll('.btn-gener').forEach((btn_gener) => {
        var inner_text = btn_gener.textContent;
        btn_gener.innerHTML = `
        <span>${inner_text}</span>
    `;
    });
    document.querySelectorAll('.hover-icon').forEach((element) => {
        element.classList.add('cursor-pointer', 'w-8', 'h-8', 'p-1', 'rounded-full', 'hover:p-0', 'flex', 'items-center', 'justify-center', 'transition-all', 'shadow-lg', 'bg-white', 'bg-opacity-80');
        element.querySelectorAll('svg').forEach((svg) => {
            //设置svg的fill属性
            svg.setAttribute('fill', 'var(--pink-normal');
        });
    });
    // 获取所有 .pink-btn 元素
    document.querySelectorAll('.pink-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white bg-gradient-to-r from-pink-400 inline-flex items-center via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .blue-btn 元素
    document.querySelectorAll('.blue-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white bg-gradient-to-r inline-flex items-center from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .green-btn 元素
    document.querySelectorAll('.green-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white bg-gradient-to-r inline-flex items-center from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .cyan-btn 元素
    document.querySelectorAll('.cyan-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white inline-flex items-center bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .teal-btn 元素
    document.querySelectorAll('.teal-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white inline-flex items-center bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .lime-btn 元素
    document.querySelectorAll('.lime-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-gray-900 inline-flex items-center bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .red-btn 元素
    document.querySelectorAll('.red-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white inline-flex items-center bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
    // 获取所有 .purple-btn 元素
    document.querySelectorAll('.purple-btn').forEach(button => {
        button.type = 'button';
        button.className = 'text-white inline-flex items-center bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

        const svg = button.querySelector('svg');
        if (svg) {
            svg.setAttribute('class', 'w-4 h-4 me-2');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('fill', 'currentColor');
        }
    });
};
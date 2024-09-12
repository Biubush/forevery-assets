document.querySelectorAll('.edit-btn').forEach((element) => {
    element.innerHTML = `
    <svg class="edit-svgIcon" viewBox="0 0 512 512">
        <path
            d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
        </path>
    </svg>
`;
});
document.querySelectorAll('.note-card').forEach((element) => {
    // 生成 -5 到 5 之间的随机数
    var randomRotation = Math.random() * 10 - 5;
    // 应用旋转变换
    element.style.transform = `rotate(${randomRotation}deg)`;
    // 在每个 .note-card 内查找 .background-image
    const backgroundImage = element.querySelector('.background-image');
    //将其添加class——rounded-lg
    element.classList.add('rounded-lg');

    // 检查 .background-image 是否存在
    if (backgroundImage) {
        // 获取图片的 src 属性
        const imageUrl = backgroundImage.src;

        // 将图片设置为 note-card 的背景
        element.style.backgroundImage = `url(${imageUrl})`;
        element.style.backgroundSize = 'cover'; // 背景覆盖
        element.style.backgroundPosition = 'center'; // 背景居中
        //背景透明度设置为0.5
        element.style.backgroundColor = 'rgba(1, 1, 1, 1.5)';
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const openBtn = document.querySelector(".fa-bars");
    const closeBtn = document.querySelector(".fa-times");
    const menuBar = document.querySelector("nav ul");

    openBtn.addEventListener("click", function() {
        menuBar.classList.add("active");
        openBtn.style.display = 'none';
        closeBtn.style.display = 'block';
    });

    closeBtn.addEventListener("click", function() {
        menuBar.classList.remove("active");
        openBtn.style.display = 'block';
        closeBtn.style.display = 'none';
    });

    function handleResize() {
        if (window.innerWidth > 778) {
            menuBar.classList.remove("active");
            openBtn.style.display = 'none';
            closeBtn.style.display = 'none';
        }
    }

    window.addEventListener("resize", handleResize);
    handleResize();
});

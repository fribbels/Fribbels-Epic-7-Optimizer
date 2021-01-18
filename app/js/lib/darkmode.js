module.exports = {
    initialize: () => {
        document.getElementById('darkModeToggle').addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            $('.ms-choice').addClass('dark-theme');
            $('.vertical').addClass('dark-theme');
            $('.gearPreviewButton').addClass('dark-theme');
            $('.rangeslider__fill__bg').addClass('dark-theme');
            $('.rangeslider__handle').addClass('dark-theme');
            $('.ag-theme-balham').addClass('ag-theme-alpine');
            $('.ag-theme-alpine').removeClass('ag-theme-balham');
        });
    }
}

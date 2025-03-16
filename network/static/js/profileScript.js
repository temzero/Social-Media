document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.querySelector(".overlay");
    const following_button = document.querySelector("#following-button");
    const followers_button = document.querySelector("#followers-button");
    const following_users = document.querySelector("#following-users");
    const followers_users = document.querySelector("#follower-users");

    toggleActive(following_button, following_users);

    toggleActive(followers_button, followers_users);

    function toggleActive(button, container) {
        button.addEventListener("click", function () {
            button.style.display = button.style.display = "none"? "block" : "none";
            overlay.classList.toggle("active");
            container.classList.toggle("active");
        });
    }

    overlay.addEventListener("click", function () {
        overlay.classList.remove("active");
        following_users.classList.remove("active");
        followers_users.classList.remove("active");
    });

});

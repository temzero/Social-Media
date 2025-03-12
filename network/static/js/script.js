document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById("content");
    const postForm = document.querySelector(".newPost-form");
    const toggleButton = document.getElementById("togglePostForm");
    const overlay = document.getElementById("overlay");
    const display = document.querySelector(".display");
    const allPosts = document.querySelectorAll(".post");

    // Auto-expand textarea based on content
    if (content) {
        content.addEventListener("input", function () {
            this.style.height = "auto"; // Reset height
            this.style.height = this.scrollHeight + "px"; // Expand dynamically
        });
    }

    // Toggle new post form and overlay visibility
    if (toggleButton) {
        toggleButton.addEventListener("click", function (event) {
            postForm.classList.toggle("active");
            overlay.classList.toggle("active");
            toggleButton.classList.toggle("hidden");

            if (postForm.classList.contains("active")) {
                content.focus();
            }

            event.stopPropagation(); // Prevent immediate closing
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function () {
            postForm.classList.remove("active");
            overlay.classList.remove("active");
            display.classList.remove("active");
            toggleButton.classList.remove("hidden");
        });
    }

    // Show post details when clicked
    allPosts.forEach(post => {
        post.addEventListener("click", () => {
            display.innerHTML = post.innerHTML;
            // Show the post display
            overlay.classList.add("active");
            display.classList.add("active");
            toggleButton.classList.add("hidden");

            // show edit and delete buttons
            const dots_container = display.querySelector(".dots-container");
            const dots_button = display.querySelector(".dots-button");
            dots_button.addEventListener("click", () => {
                if (dots_container.style.display === "block") {
                    dots_container.style.display = "none";
                } else {
                    dots_container.style.display = "block";
                }
            });

            // Show comment form when clicking the comment button
            const commentButton = display.querySelector(".comment-button");
            const commentForm = display.querySelector(".comment-form");
            const commentArea = display.querySelector(".comment-area");

            if (commentButton && commentForm) {
                commentButton.addEventListener("click", (event) => {
                    if (commentForm.style.display === "flex") {
                        commentForm.style.display = "none";
                    } else {
                        commentForm.style.display = "flex";
                    }
                    commentArea.focus();
                    event.stopPropagation();
                });

                // Apply auto-expansion to dynamically loaded commentArea
                commentArea.addEventListener("input", function () {
                    this.style.height = "auto"; 
                    this.style.height = this.scrollHeight + "px";
                });
            }
            
        });
    });
});

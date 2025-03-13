document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", (event) => {
        // Toggle comment form
        if (event.target.closest(".comment-button")) {
            const postContainer = event.target.closest(".post") || event.target.closest(".display");
            const commentForm = postContainer.querySelector(".comment-form");
            const commentArea = postContainer.querySelector(".comment-area");
    
            if (commentForm) {
                commentForm.style.display = commentForm.style.display === "flex" ? "none" : "flex";
                commentArea.focus();
            }
        }


    });

    const newPostForm = document.querySelector(".newPost-form");
    const newPostFormInput = document.querySelector("#newPost-input");
    const toggleNewPostForm = document.querySelector("#toggleNewPostForm");
    const overlay = document.querySelector("#overlay");
    const display = document.querySelector(".display");
    const allPosts = document.querySelectorAll(".post");

    // Auto-expand textarea based on newPostFormInput
    if (newPostFormInput) {
        newPostFormInput.addEventListener("input", function () {
            this.style.height = "auto"; // Reset height
            this.style.height = this.scrollHeight + "px"; // Expand dynamically
        });
    }

    // Toggle new post form and overlay visibility
    if (toggleNewPostForm) {
        toggleNewPostForm.addEventListener("click", function (event) {
            newPostForm.classList.toggle("active");
            overlay.classList.toggle("active");
            toggleNewPostForm.classList.toggle("hidden");

            if (newPostForm.classList.contains("active")) {
                newPostFormInput.focus();
            }

            event.stopPropagation(); // Prevent immediate closing
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function () {
            newPostForm.classList.remove("active");
            overlay.classList.remove("active");
            display.classList.remove("active");
            toggleNewPostForm.classList.remove("hidden");
        });
    }

    // Show post details when clicked
    allPosts.forEach(post => {
        post.addEventListener("click", () => {
            // Clear previous content inside display
            display.innerHTML = post.innerHTML;
            // display.appendChild(post.cloneNode(true));
    
            // Show the post display
            overlay.classList.add("active");
            display.classList.add("active");
            toggleNewPostForm.classList.add("hidden");
    
            // // Reassign event listeners to the cloned buttons
            // setupPostEvents(post);
            setupPostEvents(display);
        });
    });
    
    // Function to add event listeners to cloned post buttons
    function setupPostEvents(postElement) {
        const dots_button = postElement.querySelector("#dots-button");
        const delete_edit_buttons = postElement.querySelector("#delete-edit-buttons");
        const update_buttons = postElement.querySelector("#update-buttons");
    
        const edit_button = delete_edit_buttons?.querySelector("#edit-button");
        const edit_form = postElement.querySelector("#edit-form");
        const edit_content = edit_form?.querySelector("#edit-content");
        const post_content = postElement.querySelector("#post-content");
    
        if (dots_button && delete_edit_buttons) {
            dots_button.addEventListener("click", () => {
                delete_edit_buttons.style.display = delete_edit_buttons.style.display === "none" ? "flex" : "none";
                dots_button.style.display = "none";
            });
        }
    
        if (edit_button && edit_form && post_content && edit_content && update_buttons) {
            edit_button.addEventListener("click", () => {
                post_content.style.display = post_content.style.display === "none" ? "flex" : "none";
                edit_form.style.display = edit_form.style.display === "none" ? "flex" : "none";
                delete_edit_buttons.style.display = delete_edit_buttons.style.display === "none" ? "flex" : "none";
                update_buttons.style.display = update_buttons.style.display === "none" ? "flex" : "none";
    
                // Focus on the last word
                edit_content.focus();
                edit_content.selectionStart = edit_content.selectionEnd = edit_content.value.length;
            });
        }
    }
    
});

document.addEventListener("DOMContentLoaded", function () {
    function toggleVisibility(...elements) {
        elements.forEach(element => {
            if (element) { // Ensure the element exists before modifying its display
                element.style.display = element.style.display === "none" ? "flex" : "none";
            }
        });
    }    

    function expandTextarea(textarea) {
        textarea.addEventListener("input", function () {
            textarea.style.height = "auto"; // Reset height to recalculate
            textarea.style.height = textarea.scrollHeight + "px"; // Set new height based on content
        });
    }    

    // ✅ Define toggleMoreNav properly
    function toggleMoreNav() {
        const moreNav = document.querySelector("#more-nav");
        const moreNavButton = document.querySelector("#more-nav-button");
    
        if (moreNav && moreNavButton) {
            moreNavButton.addEventListener("click", () => {
                toggleVisibility(moreNav, moreNavButton);
            });
        }
    }

    toggleMoreNav();

    const newPostForm = document.querySelector("#newPost-form");
    const newPostFormInput = document.querySelector("#newPost-input");
    const toggleNewPostForm = document.querySelector("#toggleNewPostForm");
    const overlay = document.querySelector(".overlay");
    const overlay_content = document.querySelector(".overlay-content");
    const allPosts = document.querySelectorAll(".post");

    expandTextarea(newPostFormInput);
    
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
            overlay_content.classList.remove("active");
            toggleNewPostForm.classList.remove("hidden");
        });
    }

    // Show post details when clicked
    allPosts.forEach(post => {
        post.addEventListener("click", () => {
            // Clear previous content inside display
            overlay_content.innerHTML = post.innerHTML;
    
            // Show the post display
            overlay.classList.add("active");
            overlay_content.classList.add("active");
            toggleNewPostForm.classList.add("hidden");
    
            // // Reassign event listeners to the cloned buttons
            // setupPostEvents(post);
            setupPostEvents(overlay_content);
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
        const cancel_edit_button = update_buttons?.querySelector("#cancel-edit");
        const confirm_edit_button = update_buttons?.querySelector("#confirm-edit");
        const comments = postElement.querySelector(".comments");
        const post_buttons_container = postElement.querySelector("#post-buttons-container");

        const comment_button = postElement.querySelector("#comment-button");
        const comment_form = postElement.querySelector("#comment-form");
        const comment_area = postElement.querySelector("#comment-area");
    
        if (dots_button && delete_edit_buttons) {
            dots_button.addEventListener("click", () => {
                toggleVisibility(delete_edit_buttons, dots_button)
            });
        }
    
        if (edit_button && edit_form && post_content && edit_content && update_buttons && delete_edit_buttons) {  
            edit_button.addEventListener("click", () => {
                toggleVisibility(post_content, edit_form, delete_edit_buttons, update_buttons, post_buttons_container);
                expandTextarea(edit_content);
                edit_content.focus();
                edit_content.selectionStart = edit_content.selectionEnd = edit_content.value.length;

                comments.style.opacity = 0.4;
                comment_form.style.display = "none";
            });
        
            if (confirm_edit_button && cancel_edit_button) {
                confirm_edit_button.addEventListener("click", () => {
                    edit_form.submit();
                });
        
                cancel_edit_button.addEventListener("click", () => {
                    toggleVisibility(post_content, edit_form, delete_edit_buttons, update_buttons, post_buttons_container);
                    comments.style.opacity = 1;
                });
            }
        }

        if (comment_button && comment_form && comment_area) {
            comment_button.addEventListener("click", () => {
                toggleVisibility(comment_form);
                expandTextarea(comment_area);
                comment_area.focus();
            });
        }      
    }
    
});

document.addEventListener("DOMContentLoaded", function () {
    const newPostForm = document.querySelector("#newPost-form");
    const newPostFormInput = document.querySelector("#newPost-input");
    const toggleNewPostForm = document.querySelector("#toggleNewPostForm");
    const overlay = document.querySelector(".overlay");
    const overlay_content = document.querySelector(".overlay-content");
    const allPosts = document.querySelectorAll(".post");
    const following_button = document.querySelector("#following-button");
    const followers_button = document.querySelector("#followers-button");
    const following_users = document.querySelector("#following-users");
    const followers_users = document.querySelector("#follower-users");

    toggleMoreNav();
    expandTextarea(newPostFormInput);
    
    // toggleActive following, followers;
    if (following_button && following_users) {
        following_button.addEventListener("click", () => {
            toggleActive(following_users, overlay);
        });
    }
    if (followers_button && followers_users) {
        followers_button.addEventListener("click", () => {
            toggleActive(followers_users, overlay);
        });
    }
    
    if (toggleNewPostForm) {
        toggleNewPostForm.addEventListener("click", function (event) {
            toggleActive(newPostForm, overlay);
            if (newPostForm.classList.contains("active")) {
                newPostFormInput.focus();
            }

            event.stopPropagation();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function () {
            overlay.classList.remove("active");
            if (newPostForm) newPostForm.classList.remove("active");
            if (overlay_content) overlay_content.classList.remove("active");
            if (following_users) following_users.classList.remove("active");
            if (followers_users) followers_users.classList.remove("active");
            if (comment_form) comment_form.style.display = "none";
        });
    }
    

    allPosts.forEach(post => {
        const comment_button = post.querySelector(".comment-button");
        comment_button.addEventListener("click", () => {
            overlay_content.innerHTML = post.innerHTML;
            toggleActive(overlay, overlay_content);
            setupPostEvents(overlay_content, 'comment');
        });

        post.addEventListener("click", () => {
            overlay_content.innerHTML = post.innerHTML;
            toggleActive(overlay, overlay_content);
            setupPostEvents(overlay_content);
        });
    });


    // Functions
    function toggleVisibility(...elements) {
        elements.forEach(element => {
            if (element) {
                element.style.display = element.style.display === "none" ? "flex" : "none";
            }
        });
    }

    function toggleActive(...elements) {
        elements.forEach(element => {
            if (element) {
                element.classList.toggle("active");
            }
        });
    }

    function toggleMoreNav() {
        const moreNav = document.querySelector("#more-nav");
        const moreNavButton = document.querySelector("#more-nav-button");
    
        if (moreNav && moreNavButton) {
            moreNavButton.addEventListener("click", () => {
                toggleVisibility(moreNav, moreNavButton);
            });
        }
    }

    function expandTextarea(textarea) {
        textarea.addEventListener("input", function () {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    }   
    
    function setupPostEvents(postElement, state) {
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
                toggleVisibility(delete_edit_buttons, dots_button);
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

        if (state === 'comment') {
            toggleVisibility(comment_form);
            expandTextarea(comment_area);
            comment_area.focus();
        }
    }
});

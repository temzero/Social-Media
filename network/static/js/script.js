document.addEventListener("DOMContentLoaded", function () {
    const newPostForm = document.querySelector("#newPost-form");
    const newPostFormInput = document.querySelector("#newPost-input");
    const toggleNewPostForm = document.querySelector("#toggleNewPostForm");
    const overlay = document.querySelector(".overlay");
    const overlay_content = document.querySelector(".overlay-content");
    const following_button = document.querySelector("#following-button");
    const followers_button = document.querySelector("#followers-button");
    const following_users = document.querySelector("#following-users");
    const followers_users = document.querySelector("#follower-users");

    toggleMoreNav();
    inputEvent(newPostFormInput);
    
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

    const postDetail = document.querySelector(".post-detail");
    if (postDetail) {
        console.log('postDetail: ', postDetail)
        setupPostEvents(postDetail);
    }

    document.addEventListener("click", function (event) {
        const post = event.target.closest(".post");
        if (post) {
            const buttonType = event.target.closest("#dots-button") ? "dots" :
                               event.target.closest("#comment-button") ? "comment" :
                               event.target.closest(".comment-dots-button") ? 
                                {type: 'comment-dots', comment_id: event.target.closest(".comment-dots-button").id}
                               : null;
            
            overlay_content.innerHTML = post.innerHTML;
            toggleActive(overlay, overlay_content);
            setupPostEvents(overlay_content, buttonType);
    
            const postButton = overlay_content.querySelector("#post-btn");
            const commentInput = overlay_content.querySelector("#comment-area");
            const confirmEditButton = overlay_content.querySelector("#confirm-edit");
            const editInput = overlay_content.querySelector("#edit-content");
            inputEvent(commentInput, postButton);
            inputEvent(editInput, confirmEditButton);

            event.stopPropagation();
            return;
        };
    });

    // enable post btn when has input
    function inputEvent(input, button) {
        if (!input) return
        input.addEventListener("input", function () {
            if (button) {
                button.disabled = input.value.trim() === "";
            }
            input.style.height = "auto";
            input.style.height = input.scrollHeight + "px";
        });        
    }

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
    
    function setupPostEvents(postElement, buttonType) {
        const dots_button = postElement.querySelector("#dots-button");
        const edit_delete_buttons_container = postElement.querySelector("#edit-delete-button-container");
        const confirm_cancel_button_container = postElement.querySelector("#confirm_cancel_button_container");
        const edit_button = edit_delete_buttons_container?.querySelector("#edit-button");
        const edit_form = postElement.querySelector("#edit-form");
        const edit_content = edit_form?.querySelector("#edit-content");
        const post_content = postElement.querySelector("#post-content");
        const cancel_edit_button = confirm_cancel_button_container?.querySelector("#cancel-edit");
        const confirm_edit_button = confirm_cancel_button_container?.querySelector("#confirm-edit");
        const comments = postElement.querySelector(".comments");
        const commentItems = postElement.querySelectorAll(".comment");

        const post_buttons_container = postElement.querySelector("#post-buttons-container");
        const comment_button = postElement.querySelector("#comment-button");
        const comment_form = postElement.querySelector(".comment-form");
        const comment_area = postElement.querySelector("#comment-area");

        if (commentItems) {
            commentItems.forEach(comment => {
                const comment_edit_form = comment.querySelector(".comment-edit-form");
                const comment_edit_content = comment_edit_form?.querySelector("#comment-edit-content");
                const comment_edit_delete_buttons_container = comment.querySelector(".comment-edit-delete-button-container");
                const comment_confirm_edit_button = comment.querySelector("#comment-confirm-edit");
        
                // Define the event handler as a named function
                function handleCommentClick(event) {
                    const comment_dots_btn = event.target.closest('.comment-dots-button');
                    if (comment_dots_btn) {
                        toggleVisibility(comment_edit_delete_buttons_container, comment_dots_btn);
                        inputEvent(comment_edit_content, comment_confirm_edit_button);
                    }             
                    initializeCommentEditFunctionality(comment)
                }
        
                // Remove any existing event listener before adding a new one
                comment.removeEventListener('click', handleCommentClick);
                comment.addEventListener('click', handleCommentClick);
            });
        }

        setupEditFunctionality(
            dots_button, edit_button, edit_form, 
            post_content, edit_content, edit_delete_buttons_container, 
            confirm_cancel_button_container, 
            post_buttons_container, comments, comment_form, confirm_edit_button, cancel_edit_button
        );

        if (dots_button && edit_delete_buttons_container) {
            dots_button.addEventListener("click", () => {
                toggleVisibility(edit_delete_buttons_container, dots_button);
            });
        }
    
        function setupEditFunctionality(
            dots_button, edit_button, edit_form, content, edit_content, 
            edit_delete_buttons_container, confirm_cancel_button_container, 
            buttons_container, comments, comment_form, confirm_edit_button, cancel_edit_button
        ) {        
            // console.log('dots_button', dots_button)
            // console.log('edit_button', edit_button)
            // console.log('edit_form', edit_form)
            // console.log('content', content)

            // console.log('edit_delete_buttons_container', edit_delete_buttons_container)
            // console.log('confirm_cancel_button_container', confirm_cancel_button_container)
            // console.log('buttons_container', buttons_container)
            // console.log('comments', comments)
            // console.log('comment_form', comment_form)

            // console.log('confirm_edit_button', confirm_edit_button)
            // console.log('cancel_edit_button', cancel_edit_button)

            if (!(edit_button && edit_form && content && edit_content && confirm_cancel_button_container && edit_delete_buttons_container)) {
                console.log('Not enough elements');
                return;
            }
        
            // Define named event handlers
            function handleEditClick() {
                console.log('edit_form', edit_form)
                console.log('content', content)
                toggleVisibility(content, edit_form, edit_delete_buttons_container, confirm_cancel_button_container, comments);
                if (buttons_container) toggleVisibility(buttons_container);
                inputEvent(edit_content);
                edit_content.focus();
                edit_content.setSelectionRange(edit_content.value.length, edit_content.value.length); // Move cursor to the end
                if (comment_form) comment_form.style.display = "none";
            }
        
            function handleConfirmEditClick() {
                edit_form.submit();
            }
        
            function handleCancelEditClick() {
                toggleVisibility(content, edit_form, dots_button, confirm_cancel_button_container, comments, buttons_container);
            }
    
            // edit_button.removeEventListener("click", handleEditClick);
            edit_button.addEventListener("click", handleEditClick);
        
            if (confirm_edit_button && cancel_edit_button) {
                confirm_edit_button.removeEventListener("click", handleConfirmEditClick);
                confirm_edit_button.addEventListener("click", handleConfirmEditClick);
        
                cancel_edit_button.removeEventListener("click", handleCancelEditClick);
                cancel_edit_button.addEventListener("click", handleCancelEditClick);
            }
        }

        if (comment_button && comment_form && comment_area) {
            function handleCommentButtonClick() {
                toggleVisibility(comment_form);
                inputEvent(comment_area);
                comment_area.focus();
            }
        
            // Remove previous event listener before adding a new one
            comment_button.removeEventListener("click", handleCommentButtonClick);
            comment_button.addEventListener("click", handleCommentButtonClick);
        } 

        if (buttonType) {
            if (buttonType === 'comment') {
                toggleVisibility(comment_form);
                inputEvent(comment_area);
                comment_area.focus();
            } else if (buttonType.type === 'comment-dots') {
                const comment_dots_button = overlay_content.querySelector(`.comment-dots-button[id="${buttonType.comment_id}"]`);
                const comment = overlay_content.querySelector(`.comment[id="${buttonType.comment_id}"]`);
                const comment_edit_delete_buttons_container = overlay_content.querySelector(`.comment-edit-delete-button-container[id="${buttonType.comment_id}"]`);
                toggleVisibility(comment_edit_delete_buttons_container, comment_dots_button);
                initializeCommentEditFunctionality(comment)
            } else if (buttonType === 'dots') {
                toggleVisibility(edit_delete_buttons_container, dots_button);
            }
        }

        function initializeCommentEditFunctionality(comment) {
            if (!comment) return;
        
            const comment_dots_button = comment.querySelector(".comment-dots-button");
            const comment_edit_button = comment.querySelector("#comment-edit-button");
            const comment_edit_form = comment.querySelector(".comment-edit-form");
            const comment_content = comment.querySelector("#comment-content");
            const comment_edit_content = comment_edit_form?.querySelector("#comment-edit-content");
            const comment_edit_delete_buttons_container = comment.querySelector(".comment-edit-delete-button-container");
            const comment_confirm_cancel_button_container = comment.querySelector("#comment-confirm-cancel-button-container");
            const comment_confirm_edit_button = comment.querySelector("#comment-confirm-edit");
            const comment_cancel_edit_button = comment.querySelector("#comment-cancel-edit");
        
            setupEditFunctionality(
                comment_dots_button, comment_edit_button, comment_edit_form, comment_content, comment_edit_content,
                comment_edit_delete_buttons_container, comment_confirm_cancel_button_container,
                null, null, null, comment_confirm_edit_button, comment_cancel_edit_button
            );
        }
    }
});

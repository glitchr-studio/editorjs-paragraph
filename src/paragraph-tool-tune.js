
import { create } from './utils';

var throttleTimer;
const throttle = (callback, e, time) => {

    if (throttleTimer) return;
    throttleTimer = true;

    setTimeout(() => {

        callback(e);
        throttleTimer = false;

    }, time);
}

const nSpacers = 41;

function observeEditableContentElements(elementId, fn) {

    const targetNode = document.getElementById(elementId);
    const config = { childList: true, subtree: true };
    const callback = function (mutationsList, observer) {

        mutationsList.forEach(function(mutation) {

            mutation.addedNodes.forEach(function(target) {

                var classList = target.classList;
                if (classList && classList.contains("ce-block")) {

                    var editableContent = target.querySelectorAll("[contenteditable*='true']");
                        editableContent.forEach(function(e) {
                            fn(e);
                        });
                }
            });
        });
    };

    const observer = new MutationObserver(callback);
          observer.observe(targetNode, config);
}

function preg_quote (str, delimiter) {
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

/**
 * User Mention Primary API class
 */
export default class MentionTool {

       constructor({config, api}) {

            /**
             * Property to hold holder.
             */
            this.api = api;
            this.config = config;
            this.holder = api.ui.nodes.wrapper.parentNode.id;
            this.onSave = config.onSave || function(savedData) { };

            /**
              * Property which holds all users data.
              */
            this.cacheUsers = {};
            this.users = config.users ?? [];
            
            /**
              * Property which stores the base url
              */
            this.endpoint = config.endpoint ?? "";
            if(this.endpoint != "" && !this.endpoint.endsWith("/")) this.endpoint += "/";

            /**
              * Throttle between two ajax call
              */
            this.throttle = config.throttle || 100;
            if(this.endpoint == "") this.throttle = 0;

            this.typingTimer = undefined;

            /**
              * Property which stores the base url
              */
            this.readyToAccess = true;
            this.accessKey = config.accessKey || "@";
            var suggestionList = ["@", "$", "%", "#"];
            if( suggestionList.indexOf(this.accessKey) < 0 ) {
                console.error("Invalid access key provided. (expected key list: [`@`, `$`, `%`, `#`])");
            }

            /**
              * Property which holds previous active element
              * for inserting the user mention link once user selects the required option.
              */
            this.prevActiveElement = null;

            /**
              * Creates ans stores users list and user mention toolbar container.
              */
            this.nodes = {
                usersList: this.createUserList(),
                searchBar: this.createSearchbar(this.accessKey, this.users),
                userMentionToolbar: null
            }

            /**
              * Creates main user mention toolbar component.
              */
            this.nodes.userMentionToolbar = this.createUserMentionToolbar(this.nodes.searchBar, this.nodes.usersList);
            document.body.appendChild(this.nodes.userMentionToolbar);
            
            /**
              * Hides the user mention toolbar and changes the focus to previously focused input.
              */
            this.hideUserMentionToolbarAndChangeFocus(this.holder);

            observeEditableContentElements(this.holder, function(el) {

                var regex = new RegExp("("+this.accessKey+"[]+)", "ig");

                var userSlug = el.innerHTML.replaceAll(regex, '$1');
                const userMentionLink = create('a', [], {
                    contentEditable: false,
                    class: this.CSS.userMention
                }, [
                    document.createTextNode(this.accessKey + userSlug)
                ]);

            }.bind(this));
       }

    /**
     * CSS Styles
     */
    get CSS() {
        return {
            /**
             * User Mention Toolbar related styles.
             */
            userMentionToolbar: 'user-mention-toolbar',
            userMentionToolbarShowed: 'user-mention-toolbar--showed',
            userMentionToolbarLeftOriented: 'user-mention-toolbar--left-oriented',
            userMentionToolbarLeftOrientedShowed: 'user-mention-toolbar--left-oriented--showed',
            userMentionToolbarRightOriented: 'user-mention-toolbar--right-oriented',
            userMentionToolbarRightOrientedShowed: 'user-mention-toolbar--right-oriented--showed',
            userMentionToolbarShortcut: 'user-mention-toolbar__shortcut',
            /**
             * Search bar styles
             */
            searchBar: 'user-mention-search-bar',
            searchIcon: 'search-icon',
            searchTextbox: 'search-textbox',
            /**
             * User list styles
             */
            usersListWrapper: 'users-list-wrapper',
            /**
             * User list item styles
             */
            userListItemWrapper: 'user-list-item-wrapper',
            userProfileContainer: 'user-profile-container',
            userSlugInitial: 'user-name-initial',
            imageAvatar: 'user-image-avatar',
            userMetadataContainer: 'user-metadata-container',
            userSlug: 'user-name',
            userHref: 'user-href',

            userMention: 'user-mention'
        };
    };

    /**
     * Returns the caret position and the selected node in the contentEditable element.
     * 
     * @param {HTMLElement} editableDiv 
     * 
     * @returns {object} res
     * @returns {integer} res.caretPos
     * @returns {HTMLTextElement} res.selectedNode
     */
    getCaretPositionAndSelectedNode(editableDiv) {

        var caretPos = 0, sel, range;

        if (window.getSelection) {

            sel = window.getSelection();

            if (sel.rangeCount) {

                range = sel.getRangeAt(0);
                
                if (range.commonAncestorContainer.parentNode == editableDiv) {
                    caretPos = range.endOffset;
                }
            }

        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();

            if (range.parentElement() == editableDiv) {
                var tempEl = document.createElement("span");
                editableDiv.insertBefore(tempEl, editableDiv.firstChild);

                var tempRange = range.duplicate();
                tempRange.moveToElementText(tempEl);
                tempRange.setEndPoint("EndToEnd", range);

                caretPos = tempRange.text.length;
            }
        }

        // var selectedNode = range == undefined ? undefined : range.endContainer;
        // if (selectedNode == editableDiv) selectedNode = editableDiv.childNodes[editableDiv.childNodes.length - 1];
        
        // return {
        //     caretPos: caretPos,
        //     selectedNode: selectedNode
        // };

        return {
            caretPos: caretPos,
            selectedNode: range == undefined ? undefined : range.endContainer
        }
    }

    /**
     * Focuses on the starting position of the provided textNode.
     * 
     * @param textNode - text node element
     * 
     * @returns null
     */
    focusOnElement(textNode) {
        var range = document.createRange()

        range.setStart(textNode, 0)
        range.setEnd(textNode, 0)

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    /**
     * Returns the exact caret position inside an editable div 
     * from top point in terms of left and right.
     * 
     * @returns {object} res
     * @returns {integer} res.left - left position co-ordinate.
     * @returns {integer} res.top - top position co-ordinate.
     */
    getUserMentionToolbarPosition(offsetX = -16, offsetY = -4) {

        const sel = document.getSelection();
        const r = sel.getRangeAt(0);

        let rect;
        let r2;

        const node = r.startContainer;
        const offset = r.startOffset;

        offsetX += window.scrollX;
        offsetY += window.scrollY;
        if (offset > 0) {

            r2 = document.createRange();
            r2.setStart(node, (offset - 1));
            r2.setEnd(node, offset);

            rect = r2.getBoundingClientRect();

            return { left: rect.right + offsetX, top: rect.top + offsetY };

        } else if (offset < node.length) {

            r2 = document.createRange();

            r2.setStart(node, offset);
            r2.setEnd(node, (offset + 1));
            rect = r2.getBoundingClientRect();

            return { left: rect.left + offsetX, top: rect.top + offsetY };

        } else {

            rect = node instanceof HTMLElement ? node.getBoundingClientRect() : { left:0, top:0, bottom:0, right:0 };
                
            const styles = node instanceof HTMLElement ? getComputedStyle(node) : {};
            const lineHeight = parseInt(styles.lineHeight || 0);
            const fontSize = parseInt(styles.fontSize || 0);

            const delta = (lineHeight - fontSize) / 2;

            return { left: rect.left + offsetX, top: (rect.top + delta) + offsetY };
        }
    }

    /**
     * Creates and returns cache JSON object of user list item 
     * 
     * @param {Array} users 
     * 
     * @returns {object} userCache
     */
    cacheUsers(users, key) {

        if(key === undefined) return;

        this.userCache[key] = users;
    }

    /**
     * Creates and returns an array of all user list items.
     * 
     * @param {Array} users 
     * 
     * @returns {Array} userListItems - all user list item components.
     * @returns {HTMLElement} serListItems[i] - user list item component.
     */
    
    createUserListItems(users, searchQuery) {
        
        /**
         * Stores all user list items.
         */
        const userListItems = [];

        /**
         * Main class object to be used inside for Each loop.
         */
        const classObj = this;

        /**
         * Appends all user list item components in the provided order
         * for initial rnder and when no search query is provided.
         */        
        users.forEach(function (user) {

            const userListItem = classObj.createUserListItem(user.id, user?.name, user?.avatar, user?.link);
                  userListItem.getElementsByClassName("user-metadata-container")[0].childNodes.forEach(function(el) {

                      el.innerHTML = el.textContent.replace(new RegExp("(" + preg_quote(searchQuery) + ")", 'gi'), "<mark>$1</mark>");
                  });

            userListItems.push(userListItem);
        });


        /**
         * Returns all user list items.
         */
        return userListItems;
    }

    /**
     * Creates and returns user mention toolbar.
     * 
     * @param {HTMLElement} searchBar
     * @param {HTMLElement} usersList
     * 
     * @returns {HTMLElement} user mention toolbar component.
     */
    createUserMentionToolbar(searchBar, usersList) {
        
        /**
         * Creates user mention toolbar and appends the search bar and the users list component.
         */

        const userMentionToolbar = create('div', [this.CSS.userMentionToolbar], {}, [
            searchBar,
            usersList
        ]);

        /**
         * Hide it by default.
         */
        userMentionToolbar.style.display = 'none';

        /**
         * returns user mention toolbar
         */
        return userMentionToolbar;
    }

    /**
     * Displays the user mention toolbar.
     */
    showUserMentionToolbar(searchTextbox = "", offsetX, offsetY) {
        
        /**
         * Main class object.
         */
        const classObj = this;
        var searchTextboxElement = document.getElementsByClassName(classObj.CSS.searchBar)[0].getElementsByTagName('input')[0];
        if (searchTextboxElement) {
            searchTextboxElement.value = searchTextbox;
            searchTextboxElement.dispatchEvent(new Event('keyup'));
            searchTextboxElement.focus();
        }
            
        const toolbarPos = this.getUserMentionToolbarPosition(offsetX, offsetY);

        /**
         * Shows the hidden user mention toolbar.
         */
        this.nodes.userMentionToolbar.style.display = 'block';

        /**
         * Moves the user mention toolbar to the appropriate position of '@'.
         */
        this.nodes.userMentionToolbar.style.position = 'absolute';
        this.nodes.userMentionToolbar.style.left = toolbarPos.left + 'px';
        this.nodes.userMentionToolbar.style.top = toolbarPos.top + 'px';

        /**
         * Gets caret position and selected node from which the '@' in inputted.
         */
        const { caretPos, selectedNode } = classObj.getCaretPositionAndSelectedNode(classObj.prevActiveElement);

        const toolbarStyle = getComputedStyle(this.nodes.userMentionToolbar);
        console.log(toolbarStyle.width, toolbarStyle.word);
        
        /**
         * Slices the textNode into 2 parts where '@' is inputted.
         */
        const firstHalf  = document.createTextNode(selectedNode.textContent.slice(0, caretPos-1));
        const spacer     = document.createTextNode('\u00A0'.repeat(nSpacers));
        const secondHalf = document.createTextNode(selectedNode.textContent.slice(caretPos));

        /**
         * Inserts the link between the two halfs of the selected node.
         */
        classObj.prevActiveElement.insertBefore(firstHalf, selectedNode);
        classObj.prevActiveElement.insertBefore(spacer, selectedNode);
        classObj.prevActiveElement.insertBefore(secondHalf, selectedNode);

        /**
         * Removes the original text node.
         */
        classObj.prevActiveElement.removeChild(selectedNode);
        classObj.selectedNode = classObj.prevActiveElement.childNodes[classObj.prevActiveElement.childNodes.length - 1];
        classObj.caretPos     = caretPos;

        /**
         * Focus inside the search bar textbox
         */
        this.nodes.searchBar.children[1].focus();
    }

    /**
     * Hides the displayed user mention toolbar.
     */
    hideUserMentionToolbar(activeElement) {

        /**
         * Main class object.
         */
        const classObj = this;

        if(activeElement == undefined) {
        
            /**
             * Focuses on the previous element after hiding.
             */
            if (classObj.prevActiveElement && classObj.prevActiveElement != null) {
                classObj.prevActiveElement.focus();
            }
        
        } else {
        
            classObj.focusOnElement(activeElement);
        }

        /**
         * Removes the original text node and check if ready to access.
         */
        if (classObj.selectedNode != undefined) {
            
            const firstHalf = document.createTextNode(classObj.selectedNode.textContent.slice(0, classObj.caretPos - 1));
            classObj.prevActiveElement.insertBefore(firstHalf, classObj.selectedNode);
            const secondHalf = document.createTextNode(classObj.selectedNode.textContent.slice(classObj.caretPos + nSpacers - 1));
            classObj.prevActiveElement.insertBefore(secondHalf, classObj.selectedNode);

            classObj.prevActiveElement.removeChild(classObj.selectedNode);
            classObj.readyToAccess = classObj.selectedNode.textContent.replaceAll("&nbsp;", " ").trim() == '' || classObj.selectedNode.textContent.replaceAll("&nbsp;", " ").endsWith(" ");
            classObj.selectedNode = undefined;

            console.trace();
            classObj.focusOnElement(secondHalf);
        }

        /**
         * Shows the hidden user mention toolbar.
         */
        this.nodes.userMentionToolbar.style.display = 'none';

        /**
         * Empties the search bar text value.
         */
        this.nodes.searchBar.children[1].value = '';
    }

    /**
     * Hides the user mention toolbar and changes the focus to previously focused input.
     * 
     * @param {string} mainWrapper - editor holder property.
     */
    hideUserMentionToolbarAndChangeFocus(holder) {
        
        /**
         * Main class object.
         */
        const classObj = this;

        /**
         * Event listener to listen to changes in the current content editable.
         * if '@' is inserted, then shows the user mention toolbar.
         * 
         * @param {event} e 
         */
        const eventListener = function (e) {

            /**
             * Shows the user mention toolbar on inputting '@'.
             */
            if(classObj.prevActiveElement.hasAttribute("contenteditable") && classObj.prevActiveElement.getAttribute("contenteditable") == "true") {

                classObj.selectedNode = classObj.prevActiveElement.childNodes[classObj.prevActiveElement.childNodes.length - 1];
                const { caretPos, selectedNode } = classObj.getCaretPositionAndSelectedNode(classObj.prevActiveElement);

                this.selectedNode = selectedNode;
                this.caretPos = caretPos - 1;

                classObj.readyToAccess = (classObj.selectedNode != undefined && (classObj.selectedNode.textContent[this.caretPos-1] == " " || classObj.selectedNode.textContent[this.caretPos-1] == undefined));
                if (e.key == classObj.accessKey && classObj.readyToAccess) classObj.showUserMentionToolbar();
            }
        };

        /**
         * Event listener to listen for focus event on editor.
         */
        document.getElementById(holder).addEventListener('focusin', function () {

            /**
             * Checks if the focused element is not user mention toolbar.
             */
            if (classObj.nodes.userMentionToolbar != document.activeElement && !classObj.nodes.userMentionToolbar.contains(document.activeElement)) {

                /**
                 * Hides the user mention toolbar if it is being displayed.
                 */
                if (classObj.nodes.userMentionToolbar.style.display != 'none') {

                    // Remove from selected active element
                    classObj.prevActiveElement = document.activeElement;
                    classObj.selectedNode = classObj.prevActiveElement.childNodes[classObj.prevActiveElement.childNodes.length - 1];                    
                    classObj.hideUserMentionToolbar();

                } else {

                    /**
                     * Updates previous active element and add the above event listener to it.
                     */
                    classObj.prevActiveElement = document.activeElement;
                    classObj.prevActiveElement.addEventListener('keyup', eventListener);
                }
            }
        });
    }

    /**
     * Delete existing user list 
     */
    deleteUserList() {
    
        if(this.nodes.usersList == undefined) return;
        
        this.nodes.usersList.innerHTML = '';
    }

    /**
     * Creates and returns the user list compoennt which contains all the user list item components.
     * 
     * @param {Array} userListItems
     * 
     * @returns {HTMLElement} user list wrapper.
     */
    createUserList(userListItems = []) {
        /**
         * Creates a wrapper to hold all user list items.
         */
        const usersListWrapper = create('div', [this.CSS.usersListWrapper], {}, userListItems);

        /**
         * border-bottom of last user list item is removed.
         * Because ther eis already a border of users list wrapper.
         */
        if (usersListWrapper.childNodes.length > 0) {
            usersListWrapper.lastChild.style.borderBottom = 0;
        }

        /**
         * Returns users list component.
         */
        return usersListWrapper;
    }

    /**
     * Creates and returns search bar component.
     * 
     * @returns {HTMLElement} search bar.
     */
    createSearchbar(accessKey, users) {
        
        /**
         * Main class object
         */
        const classObj = this;

        /**
         * Creates search icon.
         */
        const searchIcon = create('div', [this.CSS.searchIcon], {}, [
            document.createTextNode(accessKey)
        ]);

        /**
         * Creates search textbox.
         */
        
        const searchTextbox = create('input', [this.CSS.searchTextbox], {
            type: 'text',
            placeholder: 'User'
        });

        this.prevValue = searchTextbox.value;

        /**
         * Event listener that fetches users based on the inputted query.
         */
        async function fetchUsers(searchQuery)
        {
            if(searchQuery.trim() == "") return {};

            var users = {};
            if(classObj.endpoint == "") {

                const items = classObj.users.filter(user => user?.name?.toLowerCase().includes(String(searchQuery).toLowerCase()) || user?.link?.label?.toLowerCase().includes(String(searchTextbox.value).toLowerCase()) );
                users = {"success": 1, "items": items};
            
            } else {

                const response = await fetch(classObj.endpoint + encodeURIComponent(searchQuery.trim()));
                users = await response.json();
            }

            return users;
        }

        function searchQueryListener(e = {}) {

            /**
             * Gets the inputted search query.
             */
            if(this.value.trim() == "") {

                classObj.deleteUserList();
                return;
            }

            if(this.value.trim() == classObj.prevValue.trim()) return;

            const searchQuery = this.value.trim();
            try {

                /**
                 * Fetch response from the search API
                */
                if(!(searchQuery in classObj.cacheUsers)) {
                    
                    fetchUsers(searchQuery).then(response => {
                
                        if(!response.success) return;

                        /**
                        * Creates user list items from the received user objects.
                        */
                        const userListItems = classObj.createUserListItems(response.items, searchQuery);

                        /**
                        * Removes all the current user list items.
                        */
                        classObj.deleteUserList();
                        
                        /**
                        * Creates a new user list from the created user list items.
                        */
                        classObj.cacheUsers[searchQuery] = classObj.createUserList(userListItems)
                        classObj.nodes.usersList.append(classObj.cacheUsers[searchQuery]);
                    });

                } else {
                            
                    /**
                    * Removes all the current user list items.
                    */
                    classObj.deleteUserList();
                    
                    classObj.nodes.usersList.append(classObj.cacheUsers[searchQuery]);
                }

            } catch (error) {

                console.error(error);
            }
        }

        //on keyup, start the countdown
        searchTextbox.addEventListener('keyup', function (e) {

            if(e != undefined && e.key == "Backspace") {

                classObj.deleteUserList();
                if (classObj.prevValue == "" && this.value == "") {
        
                    classObj.hideUserMentionToolbar();
                }
            }

            clearTimeout(classObj.typingTimer);
            classObj.typingTimer = setTimeout(function() {
                throttle(searchQueryListener.bind(searchTextbox), e, classObj.throttle)
            }, classObj.typingDelay);
        });

        //on keydown, clear the countdown 
        searchTextbox.addEventListener('keydown', function () { 
            classObj.prevValue = this.value.trim();
            clearTimeout(classObj.typingTimer); 
        });

        /**
         * Creates search bar.
         */
        const searchBar = create('div', [this.CSS.searchBar], {}, [
            searchIcon,
            searchTextbox
        ]);

        /**
         * returns search bar component.
         */
        return searchBar;
    }

    /**
     * Creates and returns user list item component.
     * 
     * @param {object} param
     * 
     * @param {property} param.userId
     * @param {property} param.userSlug
     * 
     * @returns {HTMLElement} user list item component.
     */
    createUserListItem(userId, userSlug, userAvatar, userLink) {

        /**
         * Main class object
         */
        const classObj = this;

        /**
         * Creates user full name container.
         */
        const userSlugContainer = create('span', [this.CSS.userSlug], {}, [document.createTextNode(this.accessKey + userSlug)]);

        /**
         * Creates user id container.
         */
        const userHrefContainer = create('a', [], {
            href: userLink?.url,
            target: "_blank",
            contentEditable: false
        }, [
            document.createTextNode(userLink?.label || "#" + userId)
        ]);

        /**
         * Creates user metadata container in which user full name and user id is appended.
         */
        const userMetadataContainer = create('div', [this.CSS.userMetadataContainer], {}, [
            userSlugContainer,
            userHrefContainer
        ]);

        /**
         * Creates user name initial to be at the center fo the profile container.
         */
        const userSlugInitial = create('span', [this.CSS.userSlugInitial], {}, [
            document.createTextNode(userSlug[0].toUpperCase())
        ]);

        /**
         * Creates user avatar to be at the center fo the profile container.
         */
        const userProfileAvatar = create('img', [this.CSS.imageAvatar], {
           src: userAvatar
        })

        /**
         * Creates user profile container.
         */
        const userProfileContainer = create('div', [this.CSS.userProfileContainer], {}, [
           userAvatar ? userProfileAvatar : userSlugInitial
        ]);

        /**
         * Creates user list item wrapper and appends profile and metadata container.
         */
        const userListItemWrapper = create('div', [this.CSS.userListItemWrapper], {}, [
            userProfileContainer,
            userMetadataContainer
        ]);

        userListItemWrapper.addEventListener('click', function (e) {

            /**
             * Creates user mention link to be added in the previous input or 
             * content editable element.
             */
            const userMentionLink = create('a', [], {
                contentEditable: false,
                class: classObj.CSS.userMention
            }, [
                document.createTextNode(classObj.accessKey + userSlug)
            ]);

            // userMentionLink.addEventListener('click', function (e) {

            //     const index = [...classObj.prevActiveElement.childNodes].indexOf(this);
            //     if(index < 0) return;

            //     // delete existing mention
            //     // find position.. add spacer.. 
            //     // dont use hide because if clicking outside text, the mention will be deleted
            //     // classObj.prevActiveElement.removeChild(this);
            //     // classObj.hideUserMentionToolbar(classObj.prevActiveElement.childNodes[index+1]);

            //     var searchTextbox = this.textContent.replaceAll(classObj.accessKey, "");
            //     // classObj.showUserMentionToolbar(searchTextbox, 0,0);
            //     console.log("EDIT: ", searchTextbox);
            // });

            classObj.selectedNode = classObj.prevActiveElement.childNodes[classObj.prevActiveElement.childNodes.length - 1];

            /**
             * Slices the textNode into 2 parts where '@' is inputted.
             */
            const firstHalf = document.createTextNode(classObj.selectedNode.textContent.slice(0, classObj.caretPos - 1));
            const secondHalf = document.createTextNode(classObj.selectedNode.textContent.slice(classObj.caretPos + nSpacers - 1));

            /**
             * Inserts the link between the two halfs of the selected node.
             */
            classObj.prevActiveElement.insertBefore(firstHalf, classObj.selectedNode);
            classObj.prevActiveElement.insertBefore(userMentionLink, classObj.selectedNode);
            classObj.prevActiveElement.insertBefore(document.createTextNode(" "), classObj.selectedNode);
            classObj.prevActiveElement.insertBefore(secondHalf, classObj.selectedNode);

            classObj.prevActiveElement.removeChild(classObj.selectedNode);
            
            classObj.selectedNode = undefined;
            classObj.hideUserMentionToolbar(secondHalf);

            /**
             * Save after inserting mention..
             */
            classObj.api.saver.save().then(classObj.onSave); // NB: onSave might be removed, if EditorJS.onChange could be triggered...
        });

        /**
         * Returns the user list item.
         */
        return userListItemWrapper;
    }
}

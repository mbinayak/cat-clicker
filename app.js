;(function() {
    var model = {
        init: function(modelData) {
            this.cats = modelData || [];
        },
        updateClickCount: function(catId) {
            var cat = this.cats[catId];
            if (!cat) return cat;
            
            cat.clickCount = cat.clickCount  || 0;
            cat.clickCount++;
            
            return cat;
        },
        getCat: function(id) {
            var cat = this.cats[id];
            cat.clickCount = cat.clickCount || 0;
            return cat;
        },
        addCat: function(cat) {
            this.cats.push(cat);
        },
        changeData: function(cat, newData) {
            if (newData.name) cat.name = newData.name;
            if (newData.image) cat.image = newData.image;
            if (newData.clickCount) {
                newData.clickCount = parseInt(newData.clickCount);
                cat.clickCount = newData.clickCount ? newData.clickCount : 0;
            }
            
            return cat;
        },
        setMoodPoint: function(id) {
            var cat = this.cats[id];
            while(!cat.moodPoint) cat.moodPoint = Math.floor(Math.random() * 10);
            
            return cat;
        },
        catReactions: ['Purr..', 'Meow']
    };
    
    var octopus = {
        init: function(container, modelData) {
            view.containerSelector = container;
            model.init(modelData);
            view.init(view.containerSelector);
        },
        getAllCats: function() {
            return model.cats;
        },
        catSelected: function(id) {
            if (!id) {
                view.init(view.containerSelector);
                view.catDisplay.updateCounter({clickCount: '--'});
                return;
            }
            
            octopus.currentSelectedCatId = octopus.currentSelectedCatId || 0;
            if (octopus.currentSelectedCatId === id) return;
            
            octopus.currentSelectedCatId = id;
            var cat = model.getCat(octopus.currentSelectedCatId);
            if (cat) view.catDisplay.render(cat);
            
            model.setMoodPoint(id);
            
            if (octopus.adminPanelOpen) view.admin.showPanel(cat);
            
        },
        catClicked: function() {
            var cat = model.updateClickCount(octopus.currentSelectedCatId);
            view.catDisplay.updateCounter(cat);
            this.catReaction(cat);
        },
        catReaction: function(cat) {
            if ((cat.clickCount % cat.moodPoint) == 0) {
                var index = cat.clickCount % model.catReactions.length;
                setTimeout(function() {
                    view.catDisplay.catReaction(model.catReactions[index]);
                    setTimeout(function() {
                        view.catDisplay.catReaction('');
                    }, 1000);
                }, 1000)
            }
        }, 
        toggleAdminPanel: function() {
            if (!octopus.currentSelectedCatId && octopus.currentSelectedCatId != 0) return;
            if (octopus.adminPanelOpen) {
                view.admin.hidePanel();
                octopus.adminPanelOpen = false;
            }
            else {
                view.admin.showPanel(model.getCat(octopus.currentSelectedCatId));
                octopus.adminPanelOpen = true;
            }
        },
        updateCatData: function(newCatData) {
            var newCat = model.changeData(model.getCat(octopus.currentSelectedCatId), newCatData);
            view.catDisplay.render(newCat);
            view.admin.showPanel(newCat);
        }
    };
    
    var container;
    var view = {
        catSelector : {
            init: function() {
                var cats = octopus.getAllCats();
                var noOfCats = cats.length;
                var html = '<select id="choose-cat"><option value=""> -- Choose a Cat by Name -- </option>';
                this.optionTemplate = this.optionTemplate || '<option value="{{id}}">{{name}}</option>';
                var option = '';
                for (var i = 0; i < noOfCats; i++) {
                    html += this.optionTemplate.replace(/({{id}})|({{name}})/g, function() {
                        switch(arguments[0]) {
                            case "{{id}}":
                                return i;
                                break;
                            case "{{name}}":
                                return cats[i].name;
                                break;
                        }
                    });
                }
                html += '</select>';
                
                var topDiv = document.createElement('div');
                topDiv.className = 'top';
                topDiv.innerHTML = html;
                container.appendChild(topDiv);
                
                document.querySelector('#choose-cat').addEventListener('change', function(e) {
                    octopus.catSelected(this.value);
                });
            }
        },
        loader: {
            init: function() {
                var boxOverlay = document.createElement('div');
                boxOverlay.className = 'box-overlay';
                boxOverlay.innerHTML = '<svg id="" width=\'40px\' height=\'40px\' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ripple"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g> <animate attributeName="opacity" dur="3s" repeatCount="indefinite" begin="0s" keyTimes="0;0.33;1" values="1;1;0"></animate><circle cx="50" cy="50" r="40" stroke="#4863f2" fill="none" stroke-width="2" stroke-linecap="round"><animate attributeName="r" dur="3s" repeatCount="indefinite" begin="0s" keyTimes="0;0.33;1" values="0;22;44"></animate></circle></g><g><animate attributeName="opacity" dur="3s" repeatCount="indefinite" begin="1.5s" keyTimes="0;0.33;1" values="1;1;0"></animate><circle cx="50" cy="50" r="40" stroke="#0d024f" fill="none" stroke-width="2" stroke-linecap="round"><animate attributeName="r" dur="3s" repeatCount="indefinite" begin="1.5s" keyTimes="0;0.33;1" values="0;22;44"></animate></circle></g></svg>';
                
                document.getElementsByTagName('body')[0].appendChild(boxOverlay);
                
                view.loader.overlay = document.querySelector('.box-overlay');
            },
            hide: function() {
                view.loader.overlay.style.display = "none";
            },
            show: function() {
                view.loader.overlay.style.display = "block";
            }
        },
        catDisplay: {
            init: function() {
                // init name header
                // init display area
                var catDisplayDiv = document.createElement('div');
                catDisplayDiv.innerHTML = '<h1 class="title"></h1><div class="cat-container"><img class="cat-pic" src=""><p class="cat-reaction"></p></div><p class="click-counter">Clicks: <i class="click-count">0</i></p>';
                container.appendChild(catDisplayDiv);
                
                view.catDisplay.catNameHeader = document.querySelector('.title');
                view.catDisplay.catContainer = document.querySelector('.cat-container');
                view.catDisplay.catPic = document.querySelector('.cat-pic');
                view.catDisplay.catReactBox = document.querySelector('.cat-reaction');
                view.catDisplay.clickCountBox = document.querySelector('.click-counter');
                view.catDisplay.clickCount = document.querySelector('.click-count');
                
                this.catContainer.addEventListener('click', function(e) {
                    octopus.catClicked();
                });
                
            },
            render: function(cat) {
                view.loader.show();
                
                var renderImagePanel = function(isNewNode) {
                    var oldImageNode = view.catDisplay.catContainer.childNodes[0];
                    view.catDisplay.catNameHeader.innerHTML = cat.name;
                    view.catDisplay.catContainer.replaceChild(cat.imageNode, oldImageNode);
                    view.catDisplay.updateCounter(cat);
                    
                    view.loader.hide();
                };
                
                if (cat.imageNode && cat.imageNode.src === cat.image) {
                    renderImagePanel(cat.imageNode);
                }
                else {
                    var imageNode = document.createElement('img');
                    imageNode.className = "cat-pic";
                    imageNode.onload = function() {
                        cat.imageNode = imageNode;
                        renderImagePanel(true);
                    };
                    imageNode.src = cat.image;
                }
            },
            updateCounter: function(cat) {
                view.catDisplay.clickCount.textContent = cat.clickCount;
                if (octopus.adminPanelOpen) view.admin.showPanel(cat);
            },
            catReaction: function(reaction) {
                view.catDisplay.catReactBox.textContent = reaction;
            }
        },
        admin: {
            init: function() {
                var div = document.createElement('div');
                div.className = 'admin-box';
                div.innerHTML = '<div><button id="admin-button">Admin</button></div><div class="input-box"><div><label>Name: <input type="text" name="name" size="20" maxlength="20"/></label></div><div><label>Image: <input type="text" name="image" size="35"/></label></div><div><label>Click Count: <input type="text" name="clickCount" size="4" maxlength="4"/></label></div></div>';
                container.appendChild(div);
                
                view.admin.adminButton = document.getElementById('admin-button');
                view.admin.inputBox = document.querySelector('.input-box');
                view.admin.nameInput = document.querySelector('input[name="name"');
                view.admin.imageInput = document.querySelector('input[name="image"');
                view.admin.clickInput = document.querySelector('input[name="clickCount"');
                // TODO bind event listeners to the input elements
                view.admin.adminButton.addEventListener('click', function() {
                    octopus.toggleAdminPanel();
                });
                
                var changeListener = function(e) {
                    var newCatData = {};
                    newCatData[e.target.name] = e.target.value;
                    octopus.updateCatData(newCatData);
                };
                view.admin.nameInput.addEventListener('change', changeListener);
                view.admin.imageInput.addEventListener('change', changeListener);
                view.admin.clickInput.addEventListener('change', changeListener);
                
                view.admin.activeClass = ' active';
                
            },
            hidePanel: function() {
                view.admin.adminButton.className = view.admin.adminButton.className.replace(view.admin.activeClass, '');
                view.admin.inputBox.style.display = 'none';
            },
            showPanel: function(cat) {
                view.admin.adminButton.className = view.admin.adminButton.className.replace(view.admin.activeClass, '');
                view.admin.adminButton.className += view.admin.activeClass;
                
                view.admin.nameInput.value = cat.name;
                view.admin.imageInput.value = cat.image;
                view.admin.clickInput.value = cat.clickCount;
                
                view.admin.inputBox.style.display = 'block';
            }
        },
        init: function(selector) {
            container = document.querySelector(selector);
            container.innerHTML = "";
            // initiate catSelector list
            // initiate catDisplay area
            this.loader.init();
            this.catSelector.init();
            this.catDisplay.init();
            this.admin.init();
        }
    };
  
    window.catClicker = {init: octopus.init};
}());
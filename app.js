;(function() {
    var model = {
        cats: [],
        init: function(modelData) {
            this.cats = modelData;
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
        }
        
    };
    
    var octopus = {
        init: function(container, modelData) {
            model.init(modelData);
            view.init(container);
        },
        getAllCats: function() {
            return model.cats;
        },
        catSelected: function(id) {
            octopus.currentSelectedCatId = octopus.currentSelectedCatId || 0;
            if (octopus.currentSelectedCatId === id) return;
            
            octopus.currentSelectedCatId = id;
            var cat = model.getCat(octopus.currentSelectedCatId);
            if (cat) view.catDisplay.render(cat);
            
        },
        catClicked: function() {
            var cat = model.updateClickCount(octopus.currentSelectedCatId);
            view.catDisplay.updateCounter(cat);
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
                    option = this.optionTemplate.replace(/{{id}}/g, i);
                    option = option.replace(/{{name}}/g, cats[i].name);
                    html += option;
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
        catDisplay: {
            init: function() {
                // init name header
                // init display area
                var catDisplayDiv = document.createElement('div');
                catDisplayDiv.innerHTML = '<h1 class="title"></h1><div class="cat-container"><img class="cat-pic" src=""><p class="cat-reaction"></p></div><p class="click-counter">Clicks: <i class="click-count">0</i></p>';
                container.appendChild(catDisplayDiv);
                
                this.catNameHeader = document.querySelector('.title');
                this.catContainer = document.querySelector('.cat-container');
                this.catPic = document.querySelector('.cat-pic');
                this.catReactBox = document.querySelector('.cat-reaction');
                this.clickCountBox = document.querySelector('.click-counter');
                this.clickCount = document.querySelector('.click-count');
                
                this.catPic.addEventListener('click', function(e) {
                    octopus.catClicked();
                });
                
            },
            render: function(cat) {
                this.catNameHeader.innerHTML = cat.name;
                this.catPic.src = cat.image;
                this.clickCount.textContent = cat.clickCount;
            },
            updateCounter: function(cat) {
                this.clickCount.textContent = cat.clickCount;
            }
        },
        init: function(selector) {
            container = document.querySelector(selector);
            container.innerHTML = "";
            // initiate catSelector list
            // initiate catDisplay area
            this.catSelector.init();
            this.catDisplay.init();
        }
    };
    
    var helper = {
        incrementCounter: function() {
            this.clicks++;
        }
    }
  
    window.app = {init: octopus.init};
}());
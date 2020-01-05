/*_________________________________________________________________________________________
Controls the application's data calculations*/

var budgetController = (function(){
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description,
        this.value = value
    };
    
    var Expens = function(id, description, value, precentage) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.precentage = -1;
    };
    
    Expens.prototype.calcPrecentage = function(totalIncom) {
        if (totalIncom > 0) {
           this.precentage = Math.round((this.value / totalIncom) * 100); 
        } else {
            this.precentage = -1;
        }
        
    };
    
    Expens.prototype.getPrecentage = function() {
        return this.precentage;
    }; 
    
    var calculateSum = function(type) {
        var sum = 0;
        data.items[type].forEach(function(cur) {
           sum = sum + cur.value;
        });
        data.totals[type] = sum;
    }
    
    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        precentage: -1
    }
    
    return {
        addItem: function(type, des, value) {
            var input, id;
            //Create new ID
            // [1 2 3 4 5 6]
            if (data.items[type].length > 0){
              id = data.items[type][data.items[type].length - 1].id + 1;    
            } else {
                id = 0;
            }
            
            if (type === 'exp') {
                input = new Expens(id, des, value);
            } else if (type === 'inc') {
                input = new Income(id, des, value);
            }
            
            data.items[type].push(input);
            return input;
        },
        
        deleteItem: function(type, id) {
            var IDs, index;
            IDs = data.items[type].map(function(current) {
               return current.id; 
            });
            
            index = IDs.indexOf(id);
            if (index !== -1) {
                data.items[type].splice(index, 1);
            };
        },
        
        returnData: function() {
            return data;
        },
        
        caculateBudget: function() {
            calculateSum('exp');
            calculateSum('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.precentage = -1;
            }
        },
        
        calculatePrecentage: function() {
            data.items.exp.forEach(function(cur){
                cur.calcPrecentage(data.totals.inc);
            });
        },
        
        getPrecen: function() {
            var allPrecentages = data.items.exp.map(function(cur) {
               return cur.getPrecentage(); 
            });
            
            return allPrecentages;
        },
        
        returnBudget: function() {
            return {
                sumExp: data.totals.exp,
                sumInc: data.totals.inc,
                budget: data.budget,
                precentage: data.precentage
            }
        },
        
        testing: function() {
            return data.items;
        }
    }
    
})();


/*__________________________________________________________________________________________
Controls the application's UI*/

var uiController = (function(){
    
    var DOMstatements = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        budgetLabel: '.budget__value',
        expensLabel: '.budget__expenses--value',
        incomLabel: '.budget__income--value',
        precentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expansesPrecentage: '.item__percentage'
    };
    
    var formatNumbers = function(number, type) {
        var numberSplit, int, dec, displayInt, sign;
        
        number = Math.abs(number);
        number = number.toFixed(2);
        
        numberSplit = number.split('.');
        int = numberSplit[0];
        dec = numberSplit[1];
        
        type === 'exp' ? sign = '-' : sign = '+';
        
        if (int.length >= 4) {
            displayInt = sign + ' ' + int.substr(0, (int.length - 3)) + ',' + int.substr((int.length - 3), 3) + '.' + dec;
        } else {
            displayInt = sign + ' ' + int + '.' + dec;
        }
        
        return displayInt;
    };
    

    return{
        readInput: function(){
            return {
                typeOfInput: document.querySelector(DOMstatements.type).value, //either 'exp' or 'inc'
                inputDescription: document.querySelector(DOMstatements.description).value,
                inputValue: document.querySelector(DOMstatements.value).value
                }
            },
        
        addInputToUi: function(obj, type) {
            var html, element, newHtml;
            
            if(type === 'inc') {
                element = DOMstatements.incomeList;
                
                html = ' <div class="item clearfix" id="inc-%id%" rr="roy"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstatements.expensesList;
                
                html = '<div class="item clearfix" id="exp-0"><div class="item__description">%description%</div>    <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));
            
            if (type === 'inc') {
                document.querySelector(DOMstatements.incomeList).insertAdjacentHTML('beforeend', newHtml);
            } else if (type === 'exp') {
                document.querySelector(DOMstatements.expensesList).insertAdjacentHTML('beforeend', newHtml);
            }
            
        },
        
        removeItemFromUI: function(IDselector) {
            
            var el = document.getElementById(IDselector);
            el.parentNode.removeChild(el);
        },
        
        DOMvars: function() {
            return DOMstatements;
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstatements.description + ', ' + DOMstatements.value);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(Element, Index, Array) {
                Element.value = "";
                document.querySelector(DOMstatements.description).focus();
            });
        },
        
        displayBudget: function(obj) {
            
            if (obj.budget > 0) {
               document.querySelector(DOMstatements.budgetLabel).textContent = formatNumbers(obj.budget, 'inc'); 
            } else if (obj.budget === 0) {
                document.querySelector(DOMstatements.budgetLabel).textContent = '0.00';
            } else {
                document.querySelector(DOMstatements.budgetLabel).textContent = formatNumbers(obj.budget, 'exp');
            }
            
            document.querySelector(DOMstatements.expensLabel).textContent = formatNumbers(obj.sumExp, 'exp');
            document.querySelector(DOMstatements.incomLabel).textContent = formatNumbers(obj.sumInc, 'inc');
            if (obj.precentage > 0) {
                document.querySelector(DOMstatements.precentageLabel).textContent = obj.precentage + '%';
            } else {
                document.querySelector(DOMstatements.precentageLabel).textContent = '-';
            }
        },
        
        displayPrecentages: function(precentage) {
            var fields = document.querySelectorAll(DOMstatements.expansesPrecentage);
            var precentageArray = Array.prototype.slice.call(fields);
            
            precentageArray.forEach(function(cur, index){
               cur.textContent = precentage[index] + "%"; 
            });           
        },
        
        formatNumbers: function(number, type) {
        var numberSplit, int, dec, displayInt;
        
        number = Math.abs(number);
        number = number.toFixed(2);
        
        numberSplit = number.split('.');
        int = numberSplit[0];
        dec = numberSplit[1];
        
        if (int.length >= 4) {
            displayInt = int.substr(0, (int.length - 3)) + ',' + int.substr((int.length - 3), 3) + '.' + dec;
        } else {
            displayInt = int + '.' + dec;
        };
        
        return displayInt;
    },
        
    }
    
})();


/*__________________________________________________________________________________________
App Controller*/

var globalController = (function(uiCrtl, budgetCrtl){
    
    var DOM = uiCrtl.DOMvars();
    
    var itemsFunctions = function() {
        addItem();
    }
    
    //Getting the user's input from the US
    var creatingAnEvent = function() {
        document.querySelector('.add__btn').addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                addItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', deleteItem);
    };
    
    var addItem = function() {
        //adding item to the application
        var input = uiCrtl.readInput();
        
        if (input.inputDescription !== "" && !(isNaN(input.inputValue)) && input.inputValue > 0) {
            var newItem = budgetCrtl.addItem(input.typeOfInput, input.inputDescription, parseFloat(input.inputValue));
            uiCrtl.addInputToUi(newItem, input.typeOfInput);
            uiCrtl.clearFields();
            updateBudget();
            updatePrecentages();

        }
    };
    
    var updateBudget = function() {
        budgetCrtl.caculateBudget();
        var budget = budgetCrtl.returnBudget();
        uiCrtl.displayBudget(budget);
    };
    
    var updatePrecentages = function() {
        budgetCrtl.calculatePrecentage();
        var precentage = budgetCrtl.getPrecen();
        uiCrtl.displayPrecentages(precentage);
    };
    
    var deleteItem = function(event) {
        var itemID, itemSplit, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        itemSplit = itemID.split('-');
        type = itemSplit[0];
        ID = parseInt(itemSplit[1]);
        
        //1. delete the item from the data structure
        budgetCrtl.deleteItem(type, ID);
        // 2. delete the item from the UI
        uiCrtl.removeItemFromUI(itemID);
        //3. update and show the new budget
        updateBudget();
        //4. Update precentages
        updatePrecentages();
    }
      
    return {
        init: function() {
            creatingAnEvent();
            uiCrtl.displayBudget({
                sumExp: 0,
                sumInc: 0,
                budget: 0,
                precentage: 0
            });
        }
    }
    
})(uiController, budgetController);

globalController.init();
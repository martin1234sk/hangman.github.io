
   // DOM ELEMENTS

   const mainContent = document.getElementById('main-content')
   const homePage = document.getElementById('home-page')
   const selectBtns = document.querySelectorAll('.select-btn')
   const homePageSubBtn = document.getElementById('home-page-sub-btn')
   const gameSection = document.getElementById('game-section')
   const letterBtns = document.querySelectorAll('.letter-btn')
   const wordLine = document.querySelector('.word')
   const lives = document.querySelector('.lives')
   const hint = document.getElementById('hint')
   const rightAnswer = document.querySelector('.right-answer')
   const correctWord = document.getElementById('correct-word')
   const canvas = document.getElementById('hangman')
   const hintBtn = document.getElementById('hint-btn')
   const playAgainBtn = document.getElementById('play-again-btn')
   

   // GENERAL FUNCTIONS

    // show and hide

    function show(item) {
        if(item.classList.contains('hide')){
            item.classList.remove('hide')
        }
        else{
            item.style.display = 'block'
        }
    }

    function hide(item) {
        item.classList.add('hide')
    }

    // fade in and fade out

    function fadeIn(item) {
        item.style.animation = 'fade-in .4s ease-in-out forwards'
    }

    function fadeOut(item) {
        item.style.animation = 'fade-out .4s ease-in-out forwards'
    }

    // OBJECTS

    //categories object
    const categoriesObject = {
        firstCategory: {
            categoryTitle: 'animals',
            wordsArray: ["dog", "cat", "wolf", "elephant", "bear", "beaver"],
            hints: ["friend", "the cutest animal in the universe", "the beast of the north", "big ears", "blakc, white or brown", "kurva gryze"]
        },
        secondCategory: {
            categoryTitle: 'people',
            wordsArray: ["john cena", "pewdiepie", "adam ondra", "joker", "eminem", "ozzy osbourne"],
            hints: ["badass", "fridays with...", "monkeys get jealous when they see him climbing", "the best laugh in the universe", "elevator", "he is never sobber"]
        },
        thirdCategory: {
            categoryTitle: 'food',
            wordsArray: ["fries", "apple", "dog", "rice", "cake", "ice cream"],
            hints: ["the most common side dish at McDonald's", "I have a pen, I have an...", "in china it is not a firend", "we can eat it with chicken", "something  sweet to coffe", "when it is summer, it is our savour"]
        },
    }

    // start game

    let startGameObject = {
        // chose category
        chosenCategory: undefined,
        randomWord: undefined,
        wordLength: undefined,
        hint: undefined,
        canvasContext: undefined,

        choseCategory:  function (selectedBtn) {
            let slectedBtnData = selectedBtn.dataset.category 
            
            // saveCategory
    
            switch ( slectedBtnData ) {
                case 'animals':
                    this.chosenCategory = categoriesObject.firstCategory
                    break;
                case 'people':
                    this.chosenCategory = categoriesObject.secondCategory
                    break;
                case 'food':
                    this.chosenCategory = categoriesObject.thirdCategory
                    break;
            }
    
            selectBtns.forEach(element =>{
                if(element.classList.contains('selected')){
                    element.classList.remove('selected')
                }
            })
    
            selectedBtn.classList.add('selected')

            // generate random word and assign hint to it

            let randomIndex = Math.floor(Math.random() * this.chosenCategory.wordsArray.length)
            this.randomWord = this.chosenCategory.wordsArray[randomIndex]
            this.wordLength = this.randomWord.length

            this.hint = this.chosenCategory.hints[randomIndex]

        },

        // start game

        startGame: function () {

            // validation
            const errorMessage = document.querySelector('.error-alert')

            if(this.chosenCategory == undefined){
                show(errorMessage)
                return
            }

            // show gaming section

            fadeOut(homePage)
    
            setTimeout(()=>{
                hide(homePage)
                selectBtns.forEach(element =>{
                    if(element.classList.contains('selected')){
                        element.classList.remove('selected')
                    }
                })
                show(gameSection)
                fadeIn(gameSection)
            },400)


            // show which category is selected

            const chosenCategorySpan = document.getElementById('chosen-category')
            chosenCategorySpan.innerHTML = this.chosenCategory.categoryTitle

            // create word line

            let lineCharacter = '_'

            for (let i = 0; i < this.wordLength; i++) {
                wordLine.innerHTML += lineCharacter
            }

            // create canvas
            this.canvasContext = canvas.getContext('2d')
            canvas.height = 300
            canvas.width = 400

            // refresh validation

            this.chosenCategory = undefined
            hide(errorMessage)

        },


    }

    // hangman object

    let hangmanObject = {

        // guesing the word
        livesCount: undefined,

        wordGuesing: function ( clickedBtn, clickedLetter ) {

            clickedBtn.classList.add('selected')

            // check correctnes

            const livesCounter = document.getElementById('remaining-lives')
            this.livesCount = parseFloat(livesCounter.innerHTML)
            let correctGues = undefined
            
            if(startGameObject.randomWord.includes(clickedLetter)){
                correctGues = true
            }

            if(correctGues != true){
                this.livesCount--
                if(this.livesCount == 0){
                    lives.innerHTML = 'GAME OVER'
                    show(rightAnswer)
                    correctWord.innerHTML = startGameObject.randomWord
                    return
                }
                livesCounter.innerHTML = this.livesCount
                return 
            }

            // add letters

            let lettersIndexes = []

            for (let i = 0; i < startGameObject.randomWord.length; i++) {
                if(startGameObject.randomWord[i] === clickedLetter){
                    lettersIndexes.push(i)
                } 
            }

            for (let i = 0; i < lettersIndexes.length ; i++) {
                let index = lettersIndexes[i]
                wordLine.innerHTML = wordLine.innerHTML.substring(0, index) + clickedLetter + wordLine.innerHTML.substring(index + 1)
            }

            if(startGameObject.randomWord.indexOf(' ')!== -1){
                let space = ' '
                let spaceIndex = startGameObject.randomWord.indexOf(space)
                wordLine.innerHTML = wordLine.innerHTML.substring(0, spaceIndex) + space + wordLine.innerHTML.substring(spaceIndex + 1)  
            } 


            if(!wordLine.innerHTML.includes('_')){
                lives.innerHTML = 'YOU WIN'
            }
        },
        drawHangman: function(){

            function drawLine (startX, startY, endX, endY) {
                startGameObject.canvasContext.moveTo(startX, startY)
                startGameObject.canvasContext.lineTo(endX, endY)

                startGameObject.canvasContext.strokeStyle = 'black'
                startGameObject.canvasContext.lineWidth = 2

                startGameObject.canvasContext.stroke()

            }

            function drawCircle(x,y) {
                startGameObject.canvasContext.beginPath()
                startGameObject.canvasContext.arc(x,y, 9, 0, Math.PI * 2, false)
                startGameObject.canvasContext.fillStyle = 'black'
                startGameObject.canvasContext.stroke()
                startGameObject.canvasContext.closePath()
            }

            switch (this.livesCount) {
                case 9:
                    drawLine(20, 280, 220, 280 )
                    break;
                
                case 8:
                    drawLine(30, 280, 30, 30)
                    break;
                
                case 7: 
                    drawLine(20, 42, 150, 42) 
                    break;   
                
                case 6:
                    drawLine(120, 42, 120, 62)
                    break;  
                    
                case 5:
                    drawCircle(120, 70)
                    break;
                
                case 4: 
                    drawLine(120, 77.2, 120, 160)
                    break;    

                case 3:
                    drawLine(120, 90, 85, 94)
                    break;

                case 2:
                    drawLine(120, 90, 155, 94)
                    break;

                case 1:
                    drawLine(120, 160, 90, 200)
                    break;
                
                case 0:
                    drawLine(120, 160, 155, 200)
                    break;    
            }
        },
        showHint: function () {
            hint.innerHTML = startGameObject.hint
            show(hint)
        },

        playAgain: function () {
            fadeOut(gameSection)
            setTimeout(()=>{
                wordLine.innerHTML = ''
                lives.innerHTML = 'you have <span id="remaining-lives">10</span> lives!'
                letterBtns.forEach(element =>{
                    if(element.classList.contains('selected')){
                        element.classList.remove('selected')
                    }
                })
                hide(gameSection)
                hide(hint)
                hide(rightAnswer)
                fadeIn(homePage)
                show(homePage)
            },400)
        }
    }

    // EVENTS

    // save category and start game

    selectBtns.forEach(element =>{
        element.addEventListener('click', (event)=>{
            startGameObject.choseCategory(event.target)
        })
    })

    homePageSubBtn.addEventListener('click', (event)=>{
        startGameObject.startGame()
    })

    document.addEventListener('keydown', (event)=>{
        if(event.key === 'Enter'){
            event.preventDefault()
            startGameObject.startGame()
        }
    })

    // play hangman

    letterBtns.forEach(element =>{
        element.addEventListener('click', (event)=>{
            hangmanObject.wordGuesing(event.target, event.target.innerHTML)  
            hangmanObject.drawHangman()
        })
    })

    hintBtn.addEventListener('click', () =>{
        hangmanObject.showHint()
    })

    playAgainBtn.addEventListener('click', ()=>{
        hangmanObject.playAgain()
    })

    // responsivity

        // responsive canvas

        window.addEventListener('resize', ()=>{
            if(window.innerWidth < 425){
                canvas.width = 300
            }

            if(window.innerWidth < 350){
                canvas.width = 280
            }

        })

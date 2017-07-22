/* main game function */
var fightingRPG = (function () {
    var public = {
        gameState: {
            start: true,
            battle: false,
            win: false,
            lose: false,
            hero: "",
            enemy: "",
            heroDamage: 0,
        },
        warriors: {
            luffy: {
                name: "Luffy",
                fullHealth: 90,
                health: 90,
                attack: 5,
                defense: 20
            },
            zoro: {
                name: "Zoro",
                fullHealth: 80,
                health: 80,
                attack: 7,
                defense: 10
            },
            sanji: {
                name: "Sanji",
                fullHealth: 60,
                health: 60,
                attack: 10,
                defense: 16
            },
            robin: {
                name: "Robin",
                fullHealth: 40,
                health: 40,
                attack: 8,
                defense: 17
            },
        },
        vsGifs: [
            "vs-luffy-sanji.gif",
            "vs-luffy-robin.gif",
            "vs-sanji-robin.gif",
            "vs-sanji-zoro.gif",
            "vs-zoro-luffy.gif",
            "vs-zoro-robin.gif",
        ]
    };

    function freezeGif($warrior) {
        var $imgElement = $warrior.find("img:visible");
        var $canvasElement = $warrior.find("canvas");
        $canvasElement.css("opacity", "1");
        // find the correct canvas on the page
        var canvas = $canvasElement[0];
        var context = canvas.getContext("2d");

        var h = $imgElement[0].naturalHeight;
        var w = $imgElement[0].naturalWidth;

        context.drawImage($imgElement[0], 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        $imgElement.hide();
    }

    function playGif() {
        var $imgElement = $(this).find("img");
        var $canvasElement = $(this).find("canvas");
        $canvasElement.remove();
        $imgElement.css("display", "block");
    }

    function returnShuffledList(list){
        // temporary array for shuffling
        var temp = [];
        // shuffle array into temp array
        var counter = 20;
        while (counter > 0 && list.length > 0){
            // safety counter for while loop
            counter--;
            // a random number between 0 and the length of names array, rounded down
            var randIndex = Math.floor( Math.random() * list.length );
            // use random number to add element to temporary array
            temp.push(list[randIndex]);
            // remove from original array
            list.splice(randIndex, 1);
        }
        // shuffle the array using utility in utils.js, return it
        // names = shuffle(names);
        return temp;
    }

    function displayStats(currentWarrior) {
        // display warrior name
        $(`.${currentWarrior}`).find(".name").html(
            public.warriors[currentWarrior].name
        );
        // display warrior health
        $(`.${currentWarrior}`).find("h3.health").html(
            `&#128151;${public.warriors[currentWarrior].health}`
        );
        // display attack and attack growth for hero
        if ( $(`.${currentWarrior}`).hasClass("hero") ) {
            console.log(`${currentWarrior} has class hero`);
            $(`.${currentWarrior}`).find("h3.attack").html(
                `&#9876;${public.gameState.heroDamage}`
            );
            $(`.${currentWarrior}`).find("h3.defense").html(
                `&#9876;${public.warriors[currentWarrior].attack}`
            );
        }
        if ( !($(`.${currentWarrior}`).hasClass("monster")) ) {
            // display attack for warriors while not a monster
            $(`.${currentWarrior}`).find("h3.attack").html(
                `&#9876;${public.warriors[currentWarrior].attack}`
            );
        }
        if ( ($(`.${currentWarrior}`).hasClass("monster")) ) {
            console.log(`${currentWarrior} has class monster`);
            // display attack for warriors while not a monster
            $(`.${currentWarrior}`).find("h3.attack").hide();
        }
        // display warrior and enemy defense
        if ( !($(`.${currentWarrior}`).hasClass("hero")) ) {
            $(`.${currentWarrior}`).find("h3.defense").html(
            `&#128737;${public.warriors[currentWarrior].defense}`
            );
        }
    }

    function displayInstructions() {
        $(".contentContainer").prepend("<div class='gameInfo'></div>");
        $(".gameInfo").append(`<h1>One Piece RPG Battle</h1>`);
        $(".gameInfo").append(`<p>Click to select a warrior to be your hero.</p>`);
        $(".gameInfo").append(`<p>Then click to select a warrior to battle.</p>`);
        $(".gameInfo").append(`<p>Click the red battle button to fight.</p>`);
        $(".gameInfo").append(`<p>Have your hero defeat all enemies and win!</p>`);
        $(".gameInfo").append(`<p>But beware, if your hero is defeated you lose.</p>`);
    }


    function resetGame(){
        var game = public.gameState;
        for (var stat in game) {
            game.stat = false;
        }
        game.start = true;
        game.hero = "";
        game.enemy = "";
        game.heroDamage = 0;
        for (warriorIndex in public.warriors) {
            var warrior = public.warriors[warriorIndex];
            warrior.health = warrior.fullHealth;
        }
        displayInstructions();
        $(".warriorContainer").addClass("startPos");
        // name array
        var names = Object.keys(public.warriors);
        // create a shuffled array of warrior keys
        var warriorKeys = returnShuffledList(names);
        // display characters to screen, shuffled!
        $(".warriorContainer").each( function(index){
            var currentWarrior = warriorKeys[index];
            // remove unneeded classes
            $(this).hasClass("battlePos") ? $(this).removeClass("battlePos") : null;
            $(this).hasClass("monster") ? $(this).removeClass("monster") : null;
            $(this).hasClass("hero") ? $(this).removeClass("hero") : null;
            $(this).hasClass("defeated") ? $(this).removeClass("defeated") : null;
            $(this).hasClass("defend") ? $(this).removeClass("defend") : null;
            $(this).hasClass("firstMonster") ? $(this).removeClass("firstMonster") : null;
            // display attack title h3
            $(this).find("h3.attack").show();
            // display attack for warriors while not a monster
            $(this).find("h3.attack").html(
                `&#9876;${public.warriors[currentWarrior].attack}`
            );
            // if a previous warrior name is present as a class on element, remove it
            var matchesArray = $(this).attr("class").match(/luffy|robin|sanji|zoro/)
            if (matchesArray) {
                for (var i = 0; i < matchesArray.length; i++) {
                    $(this).removeClass(matchesArray[i]);
                }
            }
            // add class to container with warrior name
            $(this).addClass(currentWarrior);
            // display warrior image: normal
            $(this).find("img.normal").attr(
                "src",
                `assets/images/onePiece/warrior/warrior-${warriorKeys[index]}.gif`
            );
            // display warrior image: attack
            $(this).find("img.attack").attr(
                "src",
                `assets/images/onePiece/attack/attack-${warriorKeys[index]}.gif`
            );
            // display warrior image: defend
            $(this).find("img.defend").attr(
                "src",
                `assets/images/onePiece/defend/defend-${warriorKeys[index]}.gif`
            );
            // set normal image to visible, all others hidden
            $(this).find("img").hide();
            $(this).find("img.normal").show();
            // update stats on screen
            var $currentWarrior = $(`.${currentWarrior}`);
            console.log($currentWarrior.attr("class"));
            displayStats(currentWarrior);
        });
    }

    function buildVsPopUp(gifIndex){
        var gifList = public.vsGifs;
        $(".contentContainer").append("<div class='vsContainer'></div>");
        $(".vsContainer").append("<div class='vsTitleContainer'></div>");
        $(".vsContainer .vsTitleContainer").append(`<h2 class='vsTitle'>${public.gameState.hero} vs ${public.gameState.enemy}</h2>`);
        $(".vsContainer").append("<div class='imgContainer'></div>");
        $(".vsContainer .imgContainer").append(`<img class='vsImg' src='assets/images/onePiece/vs/${gifList[gifIndex]}'>`);
    }

    function createCanvases(){
        $(".imgContainer").each(function(index) {
            var $animation = $(this).find("img");
            var h = $animation.height();
            var w = $animation.width();

            var className = $(this).find("img").attr("class");
            $(this).append(
                `<canvas class="imgCanvas ${className}" width="${w}" height="${h}">`
            );
        });
    }

    /* display start screen */
    $().ready(function() {
        resetGame();
        $(".warriorContainer").addClass("startPos");
    });

    /* display vs screen */
    $(".warriorContainer").on("click", function() {
        // only run code if gameState is currently "start"
        if (!public.gameState.start) return null;
        // step the game state forward
        public.gameState.start = false;
        public.gameState.battle = true;
        // remove the instructions from screen
        $(".gameInfo").remove();
        // on first click on a warriorContainer, clicked warrior becomes hero
        // and all other warriors become monster
        if ( $(".warriorContainer").hasClass("startPos") ) {
            $(this).addClass("hero");
            // set hero name in gameState equal to selected hero in DOM
            public.gameState.hero = $(this).find("h2").text();
            var hero = public.gameState.hero.toLowerCase();
            // set heroDamage equal to appropriate starting number
            public.gameState.heroDamage = public.warriors[hero].attack;
            // hide defense stat on hero
            $(this).find("defense");
            // put special class on first monster for styling purposes
            var monsterCount = 0;
            $(".warriorContainer").each( function(index){
                if (!($(this).hasClass("hero")) ) {
                    if (monsterCount === 0) {
                        $(this).addClass("firstMonster");
                    }
                    $(this).addClass("monster");
                    monsterCount++;
                }
                var currentName = $(this).find("h2").text().toLowerCase();
                displayStats(currentName);
            });
        }
        // style the game state forward
        $(".warriorContainer").removeClass("startPos");
        $(".warriorContainer").addClass("battlePos");
        // only build a canvas if none exist
        $(this).find("canvas")[0] ? null : createCanvases();
        // freeze the gif
        $(".warriorContainer").each(function() {
            freezeGif($(this));
        });
    });

    /* display fighting screen */
    $(".warriorContainer").on("click", function() {
        // only continue with the function if element has class monster
        // only continue if enemy is empty
        // do nothing if enemy has already been defeated
        if (!$(this).hasClass("monster") ||
            (public.gameState.enemy) ||
            $(this).hasClass("defeated") ) {
            return null;
        }
        // set enemy name in gameState equal to selected enemy in DOM
        public.gameState.enemy = $(this).find("h2").text();
        // apply styling to selected enemy
        $(this).addClass("defend");
        // show the animation for the hero and the defending enemy
        playGif.apply(this);
        playGif.apply($(".hero")[0]);
        // set the hero and enemy values
        var hero = public.gameState.hero;
        var enemy = public.gameState.enemy;
        // store gifIndex, will become the index of gif to display
        var gifIndex = 0;
        // find the correct vs gif and set the variable in the outer scope
        for (var gif in public.vsGifs) {
            if ( public.vsGifs[gif].includes(hero.toLowerCase()) &&
                public.vsGifs[gif].includes(enemy.toLowerCase())
                ) {
                gifIndex = gif;
            }
        }
        // show the vs animation huge briefly, then an "attack" button
        $(".warriorContainer").css("display", "none");
        // build and display vs animation
        buildVsPopUp(gifIndex);
        // after a few seconds, shrink vs animation and display "battle" button
        setTimeout(function() {
            $(".vsContainer").addClass("vsContainerSmall");
            $(".vsContainerSmall").removeClass("vsContainer");
            $(".vsContainerSmall").append(`<button class="battleBtn"><img src="assets/images/onePiece/icon-fight.png" alt="fight" width="60px"></button>`);
            $(".warriorContainer").css("display", "block");
        }, 1000);
    });

    /* code for fighting */
    $(".contentContainer").on("click", ".battleBtn", function(){
        var hero = public.gameState.hero.toLowerCase();
        var enemy = public.gameState.enemy.toLowerCase();
        // hero has attack power
        var currentHeroAttack = public.gameState.heroDamage;
        // hide current warrior images
        $(`.${hero}`).find(`img`).hide();
        // hero has attack animation
        $(`.${hero}`).find(`img.attack`).show();
        // enemy has defend animation
        $(`.${enemy}`).find(`img`).hide();
        $(`.${enemy}`).find(`img.defend`).show();
        // enemy has health
        var enemyHealth = public.warriors[enemy].health;
        // hero deals damage to enemy
        public.warriors[enemy].health -= currentHeroAttack;
        // show change in enemy health on screen
        displayStats(enemy);
        // hero's damage increases
        public.gameState.heroDamage += currentHeroAttack;
        // if no monsters left, then win the game
        var monstersLeft = Object.values(public.warriors).filter(
            warrior => warrior.health > 0 && warrior.name !== public.gameState.hero
        ).length;
        if (!monstersLeft) {
            winGame();
            return;
        }

        // if enemy's health is less than 1, hero wins battle!
        if (public.warriors[enemy].health < 1) {
            var $hero = $(`.${hero}`);
            var $enemy = $(`.${enemy}`);
            // remove defend class from defeated enemy
            $enemy.removeClass("defend");
            $enemy.find(`img`).hide();
            $enemy.find("img.defend").show();
            // add defeated class to this enemy to style and prevent further battling
            $enemy.addClass("defeated");
            $(".vsContainerSmall").remove();
            $("button").remove();
            // reset hero to warrior image
            $hero.find(`img`).hide();
            $hero.find(`img.normal`).show();
            // create canvases to draw paused images on
            createCanvases();
            freezeGif($enemy);
            freezeGif($hero);
            public.gameState.enemy = "";
        }
        // enemy deals damage to hero
        public.warriors[hero].health -= public.warriors[enemy].defense;
        // show hero damage change on screen
        displayStats(hero);
        // if hero's health is less than 1 and player has not won yet, player loses game!
        if (public.warriors[hero].health < 1 && !public.gameState.win) {
            loseGame();
        }

    });

    /* display win screen */
    function winGame() {
        public.gameState.win = true;
        // if battle button still exists, remove it
        $("contentContainer").find("vsContainerSmall") ? $(".vsContainerSmall").remove() : null;
        // display win to screen
        $(".contentContainer").prepend(`<div class="win"></div>`);
        $(".win").append(`<h1>${public.gameState.hero} WINS!</h1>`);
        $(".win").append(`<h2>You defeated all of your opponents.</h2>`);
        $(".warriorContainer").hide();
        setTimeout(function(){
            $(".win").remove();
            $(".warriorContainer").show();
            resetGame();
        }, 2500);
    };

    /* display lose screen */
    function loseGame() {
        public.gameState.lose = true;
        // if battle button still exists, remove it
        $("contentContainer").find("vsContainerSmall") ? $(".vsContainerSmall").remove() : null;
        // display lose to screen
        $(".contentContainer").prepend(`<div class="lose"></div>`);
        $(".lose").append(`<h1>${public.gameState.hero} LOSES!</h1>`);
        $(".lose").append(`<h2>You were defeated by ${public.gameState.enemy}.</h2>`);
        $(".warriorContainer").hide();
        setTimeout(function(){
            $(".lose").remove();
            $(".warriorContainer").show();
            resetGame();
        }, 2500);
    };

    /* reload start screen on game end */

    return public;
})();

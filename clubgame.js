window.addEventListener( 'touchmove', function() {})

$(document).ready(function() {

    let character = "";

    $(".char-select > div").on( "click", function() {
        $(this).siblings("div").fadeOut();
        $(".start-game").fadeIn();
        $(".char-select > h2").hide();
        if ( $( this ).hasClass( "adam" ) ) {
            character = "adam";
        } else {
            character = "ryan";
        }
    });

    $(".start-game").on( "click", function() {
        $("#title").removeClass("active");
        $("#club").addClass("active");
        $("#info").addClass("active");
        $(".char-select").slideUp();
        $(".start-game").slideUp();

        //start game
        playGame();
    });

    function playGame() {
       
        // trying to get mobile address bar to hide, may not work
        setTimeout(function(){
            window.scrollTo(0, 1);
        }, 200);

        // declare initial global variables
        let time = 0;
        let timeString = "10:00 PM";
        let speechBubbleText = "";
        let bottle = false;
        let numGirls = 0;
        let numGuys = 0;
        let score = 0;
        let money = 1200;
        let alcohol = 0;
        let roomWidth = parseFloat($(".room").width());
        let roomHeight = parseFloat($(".room").height());
        
        
        // character-specific things
        if (character === "adam") {
            $(".character .adam").show();
            $('#seat')
            .append($('<div class="person girl">'))
            .append($('<div class="person girl">'))
            .append($('<div class="person girl">'))
            .append($('<div class="person girl">'))
            .append($('<div class="person girl">'));
        } else {
            $(".character .ryan").show();
            money += 1000;
        }

        //populate fields
        $(".money").text(money);
        $(".score").text(score);

        // place people randomly in room
        $('.room .person').each(function(){
            let newx = 2 * parseInt(roomWidth / 2 * Math.random());
            let newy = 10 * parseInt(roomHeight / 10 * Math.random());

            $(this)
            .css({
                top: newy, 
                left: newx
            })
            .css("z-index", parseInt(newy / 15) + 1)
            .css("animation-delay", Math.random() + "s");
        });

        //show stats in console
        showStats();

        // things to do per time interval (400ms)
        const t = setInterval(function () {
            time++;

            // time-related function
            timeline();
            
            function timeline() {

                // if time's up, end game
                if (time === 220) {
                    $("#title").hide();
                    $("#club").removeClass("active");
                    $("#info").hide();
                    $("#end").addClass("active");
                    $(".endscore").text(score);
                    if (score < 500) {
                        $(".endcomments").text("next time, stay home");
                    } else if (score < 1500) {
                        $(".endcomments").text("weird flex but ok");
                    } else if (score < 2000) {
                        $(".endcomments").text("...niiiice");
                    } else if (score >= 2000) {
                        $(".endcomments").text("GOD OF THE NIGHT, ZE SWEDES ARE YOURS");
                    }

                    clearInterval(t);
                
                    // at certain intervals, do things with time
                } else if (time % 25 === 0) {

                    // change clock
                    if (time === 25) {
                        timeString = "10:30 PM";
                    } else if (time === 50) {
                        timeString = "11:00 PM";
                    } else if (time === 75) {
                        timeString = "11:30 PM";
                    } else if (time === 100) {
                        timeString = "12:00 AM";
                    } else if (time === 125) {
                        timeString = "12:30 AM";
                    } else if (time === 150) {
                        timeString = "1:00 AM";
                    } else if (time === 175) {
                        timeString = "1:30 AM";
                    } else if (time === 200) {
                        timeString = "2:00 AM";
                        $("#time").css("color", "red");
                    }
                    
                    // update time display
                    $("#time")
                        .text(timeString)
                        .addClass("pulse")
                        .delay(1000)
                        .queue(function(){
                            $("#time").removeClass("pulse").dequeue();
                        });
                }
            };
            

            // set speech text

            // timer-based speech
            if (time === 1) {
                speechBubbleText = "drag girls to our table for points";
            } else if (time === 15 && $("#seat").children(".guy").length) {
                speechBubbleText = "with enough girls, the club will give you a free bottle";
            } else if (time === 30) {
                speechBubbleText = "...or just buy one yourself";
            } else if (time === 45) {
                speechBubbleText = "dudes make you lose points. no dudes";
            } else if (time === 60) {
                speechBubbleText = "...unless you want to click them to milk them for cash";
            } else if (time === 100 && !bottle && money >= 500) {
                speechBubbleText = "I guess we should just buy a bottle already";
            } else if (time === 110) {
                speechBubbleText = "get your score up before the club closes at 2AM";
            } else if (time === 140) {
                speechBubbleText = "you guyyyys";
            } else if (time === 150) {
                speechBubbleText = "i'm tired but we gotta go harder somehow";
            } else if (time === 170) {
                speechBubbleText = "where the hos at";
            } else if (time === 180) {
                speechBubbleText = "i guess... they're here";
            } else if (time === 210) {
                speechBubbleText = "gettin sleepy, y'all";
            }

            // show speech text
            $(".speech-bubble").text(speechBubbleText);


            //update money purchasing power
            if (money < 500) {
                $('.buy-bottle').prop("disabled",true);
            } else if (money >= 500) {
                $('.buy-bottle').prop("disabled",false);
            }
            
            let pointsString = "";
            numGirls = $("#seat").children(".girl").length;
            numGuys = $("#seat").children(".guy").length;
            
            // at table, girls = two points, guys = negative one point
            score += 2 * numGirls;
            score -= numGuys;

            $('#seat .person').each(function(){
                if ($(this).hasClass("girl")) {
                    pointsString += "+2 "
                } else if ($(this).hasClass("guy")) {
                    pointsString += "-1 "
                }
            });

            // show pointsstring, show score
            $("#points").text(pointsString);
            $(".score").text(score);

            // if low alcohol, people at table, and after a few seconds of game, people leave table
            if (Math.random() < .15 && alcohol < 30 && $("#seat").children().length) {

                let booted = $("#seat .person:last-child");
                // let xe = booted.offset.left;
                // let ye = booted.offset.top;
                let newx = roomWidth * Math.random();
                let newy = roomHeight * Math.random();

                booted
                .removeClass("selected")
                .addClass("pissed")
                .delay(2000);

                booted.animate({
                    top: -200,
                    left: 0     
                }, 550, function() {
                    $(".room").append(booted);
                    booted.removeClass("pissed");
                    booted.css({
                        top: newy, 
                        left: newx
                    })
                    .css("z-index", parseInt(newy / 15) + 1)
                    .css("animation-delay", Math.random() + "s");
                });
            }


            let freeBottle = false;
            // if enough people for bottle, give bottle with fancy hands
            if (Math.random() < .40 && !freeBottle && !bottle && alcohol < 20 && $("#seat").children(".girl").length > 5 && time > 5) {
                $("#hands")
                    .fadeIn(1500)
                    .fadeOut(1500);

                    bottle = true;
                    freeBottle = true;
                    alcohol+=200;
                    $(".bottle").fadeIn(1000)
            }

            // girls flock to bottle
            if (Math.random() < .2 && bottle && $("#seat").children().length <= 10) {
                
                var xi = $("#seat").offset().left;
                var yi = $("#seat").offset().top;

                let bottleRat = $(".room .person.girl:first-child");

                bottleRat.addClass("selected")
                .css("z-index", "1");
                bottleRat.animate({
                    top: yi,
                    left: xi     
                }, 1000, function() {
                    $("#seat").append(bottleRat);
                });
            }
            
            // things to do if there's a bottle
            if (bottle && alcohol > 0 && $("#seat").children().length) {
                // reduce alcohol
                alcohol = alcohol - $("#seat").children().length;

                // every second or so, make random table guests drink
                if (alcohol % 4 === 0) {
                    let random = Math.ceil(Math.random()*$("#seat").children().length);
                    console.log(random);
                    $("#seat").children().eq( random ).addClass("drinking");
                }

                // lower champagne bottle into ice bucket
                $("#champagne").css("transform", "rotate(-10deg) translateY(" + (100 - parseInt(alcohol / 2)) + "px)");

            // if bottle runs out, remove it
            } else if (bottle && alcohol < 1) {
                bottle = false;
                alcohol = 0;
                $(".bottle").fadeOut(2000);
            }

            
        }, 400); 
        // ***** end time-based stuff ***** 






        
        // people random movement logic
        function makeNewPosition(){
            var h = $($(".room")).height() - 50;
            var w = $($(".room")).width() - 50;
            
            var nh = Math.floor(Math.random() * h);
            var nw = Math.floor(Math.random() * w);
            
            return [nh,nw];    
        }
        function animateDiv(myElement){
            var newq = makeNewPosition();
            myElement.animate({ top: newq[0], left: newq[1] }, 
                2000, 
                "easeInOutElastic", 
                function(){
                    animateDiv(myElement);        
                });
        };

        //make people draggable
        $( ".person" ).draggable({
            cursor: 'move',
            stack: "div",
            distance: 0
        });

        // make seat droppable
        $( ".table" ).droppable({
            drop: function( event, ui ) {
            $( this )
                $("#seat").append($(ui.draggable))
                $(ui.draggable)
                .addClass("selected")
                .css("z-index", "1");
            }
        });

        // make room also droppable
        $( ".room" ).droppable({
            drop: function( event, ui ) {
            $( this )
                $(this).append($(ui.draggable))
                $(ui.draggable).removeClass("selected");
            }
        });


        // buy bottles
        $(".buy-bottle").on( "click", function() {
            if (!bottle && money >= 500) {
                $(".bottle").fadeIn(2000);
                bottle = true;

                money-=500;
                alcohol+=200;
                $(".money").text(money);
                showStats();
            }
        });

        // extract money from dudes
        $("#seat .person.guy").on("click", function() {
            console.log("clicked");
            if (Math.random() < .2) {
                console.log("money");
                money += 40;

                $(".money").text(money);
            } else {
                $(this).addClass("pissed").delay(1500).removeClass("pissed");
            }
        });


        $("#end .play-again").on("click", function() {
            window.location.reload();
        });

        function showStats() {
            console.log("bottleExists: " + bottle);
            console.log("numGirls:" + numGirls);
            console.log("numGuys:" + numGuys);
            console.log("score:" + score);
            console.log("money:" + money);
            console.log("alcohol level:" + alcohol);
        };

        // function resetGame() {

        // };
        
    }


});
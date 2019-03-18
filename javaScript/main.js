var heroesView = new Vue({
    el: "#app",
    data: { //data content heroes and pictures

        heroesStats: [],

        heroDetails: [], //created to push data on page heroDetails

        pictures: [], //picture of heroes

        teams: [],

        teamNumber: [],

        teamDetails: "",

        selectedPlayers: [],

        players: [],

        search: "",

        view: "index",

        historyView: ["index", ],

    },

    created() {

        this.previousButtonDisappear();

       

        var apiHeroStats = "https://api.opendota.com/api/heroStats";
        var apiHeroPictures = "https://api.myjson.com/bins/pwd8y";
        var apiTeams = "https://api.opendota.com/api/teams";
        var apiPlayers = "https://api.opendota.com/api/proPlayers";

        Promise.all([
            /* Alternatively store each in an array */
            // var [x, y, z] = await Promise.all([
            // parse results as json; fetch data response has several reader methods available:
            //.arrayBuffer()
            //.blob()
            //.formData()
            //.json()
            //.text()

        fetch(apiHeroStats).then((response) => response.json()).then((response) => heroesView.heroesStats = response), // parse each response as json
        fetch(apiHeroPictures).then((response) => response.json()).then((response) => heroesView.pictures = response),
        fetch(apiTeams).then((response) => response.json()).then((response) => heroesView.teams = response),
        fetch(apiPlayers).then((response) => response.json()).then((response) => heroesView.players = response),
      ]);
    },

    beforeUpdate() {
heroesView.previousButtonDisappear()
        //        heroesView.previousButtonDisappear()
        //        heroesView.whenPreviousButtonDisappear();
    },

    updated() {

        
    },

    methods: {

        getMyImageHeroes(id) {
            for (i = 0; i < this.pictures.length; i++) {
                var pictureFromJson = this.pictures[i].id
                if (id === pictureFromJson) return this.pictures[i].url_small_portrait
            }
        },

        getMatchingTeam(teamID) {
            this.teamNumber = teamID

        },

        getMyImageHeroesDetailed(id) {
            for (i = 0; i < this.pictures.length; i++) {
                var pictureFromJson = this.pictures[i].id
                if (id === pictureFromJson) return this.pictures[i].url_large_portrait
            }
        },

        setPage(page) {
            this.view = page;
            this.historyView.push(page)
            //this method must be remembered as I could not find it myself.
            //eachtime some portion of my code will be clicked:
            //1. data.view will be updated
            //2. the current value will be added on the selected array 
        },

        goPreviousPage() {

            var allView = this.historyView.length;
            var toGoBackTo = allView - 2;

            //-2 because when I click, i am already one step ahead, therefore the previous became the "before-previous" upon clicking on the button "previous"

            view = this.historyView[toGoBackTo];

            this.historyView.splice(toGoBackTo, 2);

            this.setPage(view);

        },

        getRatioWL() {

            var win = this.teamDetails.wins;
            var loss = this.teamDetails.losses;
            var total = win + loss;
            var ratio = (win / total) * 100;

            return ratio.toFixed(2)

        },

        login() {

            // https://firebase.google.com/docs/auth/web/google-signin

            //Provider
            var provider = new firebase.auth.GoogleAuthProvider();

            //How to signin
            firebase.auth().signInWithPopup(provider)

                // to push message in the app after connect

                .then(function (result) {
                    if (result.credential) {
                        heroesView.getPosts();
                    }

                }).catch(console.log("error"))

        },

        writeNewPost() {

            // https://firebase.google.com/docs/database/web/read-and-write

            //Values from HTML
            var text = document.getElementById("textInput").value;
            var name = firebase.auth().currentUser.displayName;

            var objectToSend = {
                message: text,
                author: name + " : ",
            }

            firebase.database().ref("firstChatEver").push(objectToSend)

            console.log(objectToSend)

            // Values


            console.log("write");

        },

        getPosts() {

            //  Get messages value and author

            firebase.database().ref('firstChatEver').on('value', function (data) {
                var posts = document.getElementById("posts");
                posts.innerHTML = "";

                //     console.log(data.val());
                var now = moment().format('LT');

                var messages = data.val();
                for (var key in messages) {
                    var text = document.createElement("div");
                    var element = messages[key];


                    text.append(element.author);
                    text.append(element.message);

                    text.append(now);

                    posts.append(text);
                }
            })

            //  console.log("getting posts");

        },

        previousButtonDisappear() {

            var previousButton = document.getElementById("back_button")

            if (this.historyView == "index") {
//                console.log("equal");
                document.getElementById("back_button").style.display = "none"
            } else {
                document.getElementById("back_button").style.display = "inline-block"
            };

            var buttonGone = document.getElementById("back_button").style.display;
            var positionTitle = document.getElementById("bonjour");

//            console.log(buttonGone)

            if (buttonGone == "none") {
                positionTitle.classList.remove("large")
                positionTitle.classList.add("xx-large")
            } else {
                positionTitle.classList.remove("xx-large")
                positionTitle.classList.add("large")
            };
        },

    },

    computed: {

        filteringHeroes() {

            return this.heroesStats.filter(hero =>
                hero.localized_name.toLowerCase().includes(this.search)
            )
        },

        filteringTeams() {

            return this.teams.filter(team =>
                team.tag.toLowerCase().includes(this.search)
            )
        },

        filteringPlayers() {

            return this.players.filter(player =>
                player.name.toLowerCase().includes(this.search)
            )
        },

        getPlayerByTeam() {

            for (i = 0; i < this.players.length; i++) {

                if (this.players[i].team_id == heroesView.teamNumber) {
                    this.selectedPlayers.push(this.players[i])
                }
            };

            return this.selectedPlayers;



        },



    },

    watch: {

    },

});

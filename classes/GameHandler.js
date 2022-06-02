const { vary } = require('express/lib/response');
const { User, Character, Encounter, Game, Inventory, Rewards } = require('../models');

class GameHandler {


    async createGame(user_id,char_id){
        //Get game grid
        const grid = await this.createGrid();
        //Get selected character
        const characterData = await Character.findByPk(char_id);
        const character = characterData.get({ plain: true });
        
        const newGame = await Game.create({
            user_id: user_id,
            game_status: 'active',
            character_id: char_id,
            game_health: character.character_health,
            game_strength: character.character_strength,
            game_endurance: character.character_endurance,
            game_Intelligence: character.character_Intelligence,
            game_grid: JSON.stringify(grid),
            game_position: '',
            game_points:0
        })

        return newGame;
    }

    async move(game_id){

        if (!game_id){return};

        //Get the game object
        const gameData = await Game.findByPk(1);
        //Clean
        const game = gameData.get({ plain: true });

        const grid = game.game_grid;
        const lastPos = game.game_position;


        return game;
        
    }

    async getEncounter(encounter_id){

        
    }

    async getReward(encounter_id){

        
    } 

    async createGrid() {

        const tiles = 30;
        const gridRows = 5;
        const gridCol = tiles/gridRows;
        var grid = [];

        //Get the encounters and rewards from the database
        const encounterData = await Encounter.findAll();
        const rewardData  = await Rewards.findAll();
        
        //Clean up responses
        const encounters = encounterData.map((encounter) => encounter.get({ plain: true }));
        const rewards = rewardData.map((reward) => reward.get({ plain: true }));

        //Get player starting position
        const playerPos = Math.floor(Math.random() * tiles);

        for (let row = 0; row < gridRows; row++) {

            let cols = [];

            for (let col = 0; col < gridCol; col++) {
                
                let obj = {};

                if (playerPos === (row * 6 + col + 1)) {
                    obj.type = 'player';
                    obj.refId= '';
                    obj.emoji= '🟢';
                }else{
                    //Randomly get an encounter/reward or blank tile
                    let option = Math.floor(Math.random() * 2);
                    //Get encounter or reward
                    if (option === 1) {

                        let subOption = Math.floor(Math.random() * 2);
                        if (subOption === 1) {
                            let selection = Math.floor(Math.random() * encounters.length);
                            obj.type = 'encounter';
                            obj.refId=encounters[selection].encounter_id;
                            obj.emoji='⚔️';
                        } else {
                            let selection = Math.floor(Math.random() * rewards.length);
                            obj.type = 'reward';
                            obj.refId= rewards[selection].reward_id;
                            obj.emoji= '💰';
                        }

                    //Get blank
                    } else {
                        obj.type = 'blank';
                        obj.refId= '';
                        obj.emoji= '';
                    }
                }
                    
                    cols[col] = obj;
            }

            grid[row] = cols;
        }

        return grid;
    }

}




//test data
encounters = 
[
    {
        encounter_name: "Enc 1",
        encounter_description: 'Enc 1 description',
        encounter_comment:"You got smashed",
        encounter_health:40,
        encounter_strength:25,
        encounter_endurance:40,
        encounter_intelligence: 20,
        encounter_game_points: -10
    },
    {
        encounter_name: "Enc 2",
        encounter_description: 'Enc 2 description',
        encounter_comment:"You won",
        encounter_health:10,
        encounter_strength:10,
        encounter_endurance:10,
        encounter_intelligence: 20,
        encounter_game_points: -20
    },
    {
        encounter_name: "Enc 1",
        encounter_description: 'Enc 1 description',
        encounter_comment:"You got smashed",
        encounter_health:40,
        encounter_strength:25,
        encounter_endurance:40,
        encounter_intelligence: 20,
        encounter_game_points: -10
    }
];

rewards = 
[
    {
        reward_id:1,
        reward_name: "Rew 1",
        reward_description: 'Rew 1 description',
        reward_comment:"Good stuff",
        reward_type:"Weapon",
        reward_health:0,
        reward_strength:30,
        reward_endurance:2,
        reward_intelligence: 0,
        reward_game_points: 10
    },
    {
        reward_id:2,
        reward_name: "Rew 1",
        reward_description: 'Rew 1 description',
        reward_comment:"Good stuff",
        reward_type:"Weapon",
        reward_health:0,
        reward_strength:30,
        reward_endurance:2,
        reward_intelligence: 0,
        reward_game_points: 10
    },
    {
        reward_id:3,
        reward_name: "Rew 3",
        reward_description: 'Rew 3 description',
        reward_comment:"Good stuff",
        reward_type:"Weapon",
        reward_health:0,
        reward_strength:30,
        reward_endurance:2,
        reward_intelligence: 0,
        reward_game_points: 10
    }
];

module.exports = GameHandler;
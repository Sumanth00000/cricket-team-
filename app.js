const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const initializeDBAndServer = async() =>{
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        });
    }catch(e){
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};
initializeDBAndServer();

const convertDBObjectToResponseObject = (dbObject) =>{
    return{
        playerId: dbObject.playerId,
        playerName: dbObject.player_name,
        jerseyNumber: dbObject.jersey_number,
        role: dbObject.role,
   
    };
};
app.get("/players/", async(request, response) => {
    const getPlayersArray = `
    SELECT * 
    FROM cricket_team`
    const playersArray = await db.all(getPlayersArray);
    response.send(
        playersArray.map((eachPlayer) => 
        convertDBObjectToResponseObject(eachPlayer)
        );
    );
});

app.get("/players/:playerId/", async(request, response) => {
    const {playerId} = request.params;
    const getPlayerQuery = `
    SELECT * 
    FRPM cricket_team 
    WHERE player_id = ${playerId}`;
    const player = await db.get(getPlayerQuery);
    response.send(convertDBObjectToResponseObject(player));
});

app.post("/players/", async(request, response) => {
    const {player_name, jersey_number, role} = request.body;
    const postPlayerQuery = `
    INSERT INTO 
    cricket_team (player_name, jersey_number, role)
    VALUES
    ('${player_name}', '${jersey_number}', '${role}');
    `
    const dbResponse = await db.run(postPlayerQuery);
    response.send("Player Added to Team");

});

app.put("/players/:playerId", async(request, response) => {
    const {player_name, jersey_number, role} = request.body;
    const {playerId} = request.params;
    const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET 
    player_name = '${player_name}'
    jersey_number = '${jersey_number}'
    role = '${role}'
    WHERE 
    player_id = ${player_id};`

    await db.run(updatePlayerQuery);
    response.send("Player Details Updated");
});



app.delete("/players/:playerId", async(request, response) => {
    const {player_id} = request.params;
    const deletePlayerQuery = `
    DELETE FROM 
    cricket_team
    WHERE 
    player_id = ${player_id};`
    await db.run(deletePlayerQuery);
    response.send("Player Removed");
})

module.exports = app;
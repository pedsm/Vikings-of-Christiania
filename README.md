# Vikings-of-Christiania
Vikings of Christiania is an online multiplayer IO style game. It is based on a Node.js Server written in typescript. 

## Start compilation 
```bash
npm run dev
```
## Run game server
```bash
npm start
```

### File descriptions

| File | Description     |
| :------------- | :------------- |
| game.html | Main landing page. Takes care of all the socket connections(soon will be moved) |
| package.json | npm configuration file |
| tsconfig.json | tsc configuration file |
| src/app.ts| Node server |
| src/player.ts| Classes and interfaces (soon to be renamed)|
| src/consts.ts| Holds constants for game settings|
| src/sketch.ts| Holds all the client logic|
| src/test.ts| Tests LOL like we have them |  

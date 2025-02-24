# Project 1 Proposal : Space Invaders clone

For my first project, I'd like to make a Space Invaders style browser game. 

Here's how I'm envisioning the overall flow for the game will go:

1. Landing Screen, hit "space" to start

2. On keypress, game begins: player starts at bottom center of screen, moves from left to right, and fires shots at oncoming enemies, coming from top of screen and moving from left to right, firing occasionally anddescending as they reach the wall of the game window. Each alien ship destroyed awards the user 10 points. 

3. upon destroying all enemies on the screen, a "You won!" screen is displayed, and prompts the user to start again. 

	
4. I'd like to implement different levels to the game as well, with certain ships being able to withstand more shots than others, descending toward the player faster, etc. In the original game there are also barriers the player can hide behind to dodge incoming attacks that can only withstand a certain amount of damage before they are destroyed as well. 

Here's a rough sketch of what I intend for the UI to look like.
```
 __________________________________
|				   |
|     Score : 10  | Health : 5     |
|__________________________________|
|                                  |                                         
|    ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽   |        
|  ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽  <----- enemies, descending toward player
|    ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽   |                    
|			           |
|                                  |                                         
|                                  |        
| 			  	   |
|                                  |                    
|		* <----- shot fired|
|     ■■■■ ■■■■   ■■■■ ■■■■ <------ Barriers
|		 		   |
|               ▲      		   |
|_______________^ _________________|
  		|
		|
             Player
```
## Stretch Goals 
1. I think power-ups, like a faster rate of fire for the gun, multiple shots per keypress, etc would be interesting to implement, but maybe not essential to the core of the gameplay. 

2. A High score feature using localStorage could encourage repeat plays.

3. I'm still trying to conceptualize how I might do this but infinite gameplay is something that might add more challenge to the game, with difficulty constantly increasing. This might make the high score feature more interesting as well. 



## Code Flow:

As far as code goes, the gameplay control should be fairly simple, using event listeners to monitor keypresses ("left keyboard arrow" and "right keyboard arrow" to control player movement and "spacebar"). 

The enemy mechanics are a little more interesting: the individual alien ships move from right to left, moving down one row as they reach the end of the gameplay screen. In the original game, they move and shoot faster as they get closer so I'll implement that logic as well.  

Aside from the mechanics, the enemies are also a major component of the game: I'm imagining not just one enemy but multiple similar enemies so I think classes and subclasses would be the natural choice for representing them. 




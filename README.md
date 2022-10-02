# Suger Cube cheat extension for Firefox
A Cheat Menu for the Sugar Cube Game engine.

It supports search, reading and changing for variables.
## Usage:
Consider the following example: 

You are playing a Game in the browser and want to get more money but don't have the time to grind for it.
With this Extension you can click on the button in the top right of the browser. A menu with all variables of the game will open.
Now you can use the searchbar and start typing "money".
If you're lucky you can now see a variable by that name and change it to the value you want. Sometimes the value you are looking for will be nested within an Object.

(Note that not all developers use the same name for their variables so you might need to try different keywords like "cash" or "currency")

## Variable Menu
The menu of the extension shows all present Variables used by the game. 
There are three supportet types of Variables: 
1. Booleans (true or false)
2. Numbers
3. Objects (including lists)

Booleans can be set to either true with the "set" button or false with the "unset" button and the current state is highlighted by the outlined button.

Numbers can be changed to any other number and the current value is displayed in an editable field. Using the "set" button next to the field the value can be updated in the game.

Objects are variables that contain other variables. You can see what Variables are within any Object by clicking the "Show More" button.





## Planned Features:

Planned is the feature to select a value for numerical variables and keep them fixed to that value.
For example, if you want to set the "energy" value and keep it at a certain level, so you never run out of energy while playing a game.

Im also exploring the possibility to use it as a cheat menu for all JavaScript-Browser games.

import 'phaser';
import Loading from './scenes/Loading';
import MainMenu from './scenes/MainMenu';
import Game from './scenes/Game';

var game = new Phaser.Game({
    type: Phaser.AUTO, // Choose WebGL or Canvas automatically
    parent: 'game', // The ID of the div in index.html
    width: 960,
    height: 540,
    scene: [Loading, MainMenu, Game]
});


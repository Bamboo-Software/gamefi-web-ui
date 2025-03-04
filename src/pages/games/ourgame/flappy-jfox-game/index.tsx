/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';


import { useState, useEffect, useRef } from 'react';
import {    background_day,
    background_night,
    bird_blue,
    gameover,
    ground_sprite,
    message_initial,
    pipe_green_bot,
    pipe_green_top,
    pipe_red_bot,
    pipe_red_top,
    restart_btn,
    number0,
    number1,
    number2,
    number3,
    number4,
    number5,
    number6,
    number7,
    number8,
    number9
} from "@/assets/images/flappy_game"

export default function FlappyJfoxGame() {
    const gameRef = useRef<HTMLDivElement>(null);

    const [gameKey, setGameKey] = useState(0);
    const reloadGame = () => {
        setGameKey(prev => prev + 1); 
    };
    const GAME_WIDTH = 415;
    const GAME_HEIGHT = 900;
    // const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;
    
    
    const assets = {
        bird: {
            red: 'bird-red',
            yellow: 'bird-yellow',
            blue: 'bird-blue'
        },
        obstacle: {
            pipe: {
                green: {
                    top: 'pipe-green-top',
                    bottom: 'pipe-green-bottom'
                },
                red: {
                    top: 'pipe-red-top',
                    bottom: 'pipe-red-bo'
                }
            }
        },
        scene: {
            width: GAME_WIDTH/2,
            background: {
                day: 'background-day',
                night: 'background-night'
            },
            ground: 'ground',
            gameOver: 'game-over',
            restart: 'restart-button',
            messageInitial: 'message-initial'
        },
        scoreboard: {
            width: 35,
            base: 'number',
            number0: 'number0',
            number1: 'number1',
            number2: 'number2',
            number3: 'number3',
            number4: 'number4',
            number5: 'number5',
            number6: 'number6',
            number7: 'number7',
            number8: 'number8',
            number9: 'number9'
        },
        animation: {
            bird: {
                red: {
                    clapWings: 'red-clap-wings',
                    stop: 'red-stop'
                },
                blue: {
                    clapWings: 'blue-clap-wings',
                    stop: 'blue-stop'
                },
                yellow: {
                    clapWings: 'yellow-clap-wings',
                    stop: 'yellow-stop'
                }
            },
            ground: {
                moving: 'moving-ground',
                stop: 'stop-ground'
            }
        }
    }
    
    let gameOver: boolean
    let gameStarted: boolean
    let upButton: Phaser.Input.Keyboard.Key
    let restartButton: Phaser.GameObjects.Image
    let gameOverBanner: Phaser.GameObjects.Image
    let messageInitial: Phaser.GameObjects.Image
    let player: { destroy: () => void; setCollideWorldBounds: (arg0: boolean) => void; anims: { play: (arg0: string, arg1: boolean) => void; }; body: { allowGravity: boolean; }; setVelocityY: (arg0: number) => void; angle: number; }
    let birdName: string
    let framesMoveUp: number
    let backgroundDay: Phaser.GameObjects.Image
    let backgroundNight: Phaser.GameObjects.Image
    let ground: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    let pipesGroup: Phaser.Physics.Arcade.Group
    let gapsGroup: Phaser.Physics.Arcade.Group
    let nextPipes: number
    let currentPipe: { top: any; bottom: any; }
    let scoreboardGroup: Phaser.Physics.Arcade.StaticGroup
    let score: string | number
    function getRandomBird() {
        switch (Phaser.Math.Between(0, 2)) {
            case 0:
                return assets.bird.red
            case 1:
                return assets.bird.blue
            case 2:
            default:
                return assets.bird.yellow
        }
    }
    
    function getAnimationBird(birdColor: string) {
        switch (birdColor) {
            case assets.bird.red:
                return assets.animation.bird.red
            case assets.bird.blue:
                return assets.animation.bird.blue
            case assets.bird.yellow:
            default:
                return assets.animation.bird.yellow
        }
    }
    
    function updateScoreboard() {
        scoreboardGroup.clear(true, true)
    
        const scoreAsString = score.toString()
        if (scoreAsString.length == 1)
            scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.base + score).setDepth(10)
        else {
            let initialPosition = assets.scene.width - ((score.toString().length * assets.scoreboard.width) / 2)
    
            for (let i = 0; i < scoreAsString.length; i++) {
                scoreboardGroup.create(initialPosition, 30, assets.scoreboard.base + scoreAsString[i]).setDepth(10)
                initialPosition += assets.scoreboard.width
            }
        }
    }
    
    function updateScore(_: any, gap: { destroy: () => void; }) {
        score++
        gap.destroy()
    
        if (score % 10 == 0) {
            backgroundDay.visible = !backgroundDay.visible
            backgroundNight.visible = !backgroundNight.visible
    
            if (currentPipe === assets.obstacle.pipe.green)
                currentPipe = assets.obstacle.pipe.red
            else
                currentPipe = assets.obstacle.pipe.green
        }
    
        updateScoreboard()
    }
    
    
    
    function prepareGame(scene: Phaser.Scene) {
        scene.data.set('gameOver', false);
        scene.data.set('gameStarted', false);
        scene.data.set('score', 0);
        framesMoveUp = 0
        nextPipes = 0
        currentPipe = assets.obstacle.pipe.green
        score = 0
        gameOver = false
        backgroundDay.visible = true
        backgroundNight.visible = false
        messageInitial.visible = true
    
        birdName = getRandomBird()
        player = scene.physics.add.sprite(60, 265, birdName)
        player.setCollideWorldBounds(true)
        player.anims.play(getAnimationBird(birdName).clapWings, true)
        player.body.allowGravity = false
    
        scene.physics.add.collider(player, ground, hitBird, null, scene)
        scene.physics.add.collider(player, pipesGroup, hitBird, null, scene)
    
        scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)
    
        ground.anims.play(assets.animation.ground.moving, true)
    }
    function hitBird(player: { anims: { play: (arg0: string) => void; }; }) {
        this.physics.pause()
    
        gameOver = true
        gameStarted = false
    
        player.anims.play(getAnimationBird(birdName).stop)
        ground.anims.play(assets.animation.ground.stop)
    
        gameOverBanner.visible = true
        restartButton.visible = true
    }
    
    function makePipes(scene: Phaser.Scene) {
        if (!gameStarted || gameOver) return
    
        const pipeTopY = Phaser.Math.Between(-120, 120)
    
        const gap = scene.add.line(GAME_WIDTH, pipeTopY + 210, 0, 0, 0, 98)
        gapsGroup.add(gap)
        gap.body.allowGravity = false
        gap.visible = false
    
        const pipeTop = pipesGroup.create(GAME_WIDTH, pipeTopY, currentPipe.top)
        pipeTop.body.allowGravity = false
    
        const pipeBottom = pipesGroup.create(GAME_WIDTH, pipeTopY + 420, currentPipe.bottom)
        pipeBottom.body.allowGravity = false
    }
    function startGame(scene: Phaser.Scene) {
        gameStarted = true
        messageInitial.visible = false
    
        const score0 = scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.number0)
        score0.setDepth(20)
    
        makePipes(scene)
    }
    
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameRef.current,
        scale: {
            mode: Phaser.Scale.RESIZE,
            width: '100%',
            height: '100%',
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {x: 0, y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    const [game, setGame] = useState<Phaser.Game>(new Phaser.Game(config));

    function moveBird() {
        if (gameOver)
            return
    
        if (!gameStarted)
            startGame(game.scene.scenes[0])
    
        player.setVelocityY(-400)
        player.angle = -15
        framesMoveUp = 5
    }

    function restartGame() {
        // const scene = game.scene.scenes[0];
        // scene.data.set('gameOver', false);
        // scene.data.set('gameStarted', false);
        // scene.data.set('score', 0);
        // pipesGroup.clear(true, true); 
        // gapsGroup.clear(true, true);  
        // scoreboardGroup.clear(true, true);
        // if (player) player.destroy(); 
        // gameOverBanner.visible = false;
        // restartButton.visible = false;
    
        // const gameScene = game.scene.scenes[0];
        // gameScene.physics.resume();  
        // console.log(scene);
        
        // location.reload()
        reloadGame()

    }

    function preload(this: Phaser.Scene) {
        // Load assets here
        this.load.image(assets.scene.background.day, background_day);
        this.load.image(assets.scene.background.night, background_night);
        this.load.spritesheet(assets.scene.ground, ground_sprite, {
            frameWidth: 346,
            frameHeight: 112
        });
    
         // Pipes
         this.load.image(assets.obstacle.pipe.green.top, pipe_green_top)
         this.load.image(assets.obstacle.pipe.green.bottom, pipe_green_bot)
         this.load.image(assets.obstacle.pipe.red.top, pipe_red_top)
         this.load.image(assets.obstacle.pipe.red.bottom, pipe_red_bot)
     
         // Start game
         this.load.image(assets.scene.messageInitial, message_initial)
     
         // End game
         this.load.image(assets.scene.gameOver, gameover)
         this.load.image(assets.scene.restart, restart_btn)
     
         // Birds
         this.load.spritesheet(assets.bird.blue,bird_blue, {
             frameWidth: 34,
             frameHeight: 24
         })
    
         this.load.spritesheet(assets.bird.red,bird_blue, {
            frameWidth: 34,
            frameHeight: 24
        })
    
        this.load.spritesheet(assets.bird.yellow,bird_blue, {
            frameWidth: 34,
            frameHeight: 24
        })
    
     
         // Numbers
         this.load.image(assets.scoreboard.number0, number0)
         this.load.image(assets.scoreboard.number1, number1)
         this.load.image(assets.scoreboard.number2, number2)
         this.load.image(assets.scoreboard.number3, number3)
         this.load.image(assets.scoreboard.number4, number4)
         this.load.image(assets.scoreboard.number5, number5)
         this.load.image(assets.scoreboard.number6, number6)
         this.load.image(assets.scoreboard.number7, number7)
         this.load.image(assets.scoreboard.number8, number8)
         this.load.image(assets.scoreboard.number9, number9)
    }
    function create(this: Phaser.Scene) {
        this.data.set('gameOver', false);
        this.data.set('gameStarted', false);
        this.data.set('score', 0);
        backgroundDay = this.add.image(assets.scene.width, 280, assets.scene.background.day)
            .setInteractive()
            .setDisplaySize(GAME_WIDTH, GAME_HEIGHT); // Increase size by 20%
        backgroundDay.on('pointerdown', moveBird);
    
        backgroundNight = this.add.image(assets.scene.width, 280, assets.scene.background.night)
            .setInteractive()
            .setDisplaySize(GAME_WIDTH, GAME_HEIGHT); // Match day background size
        backgroundNight.visible = false;
        backgroundNight.on('pointerdown', moveBird);
    
        // Add game groups
        gapsGroup = this.physics.add.group();
        pipesGroup = this.physics.add.group();
        scoreboardGroup = this.physics.add.staticGroup();
    
        // Add ground with adjusted position to match new background size
        ground = this.physics.add.sprite(assets.scene.width, GAME_HEIGHT+20, assets.scene.ground);
        ground.setCollideWorldBounds(true);
        ground.setDepth(10);
        ground.setDisplaySize(GAME_WIDTH * 1.2, 112); // Increase ground width to match background
    
        // Initial message
        messageInitial = this.add.image(assets.scene.width, 256, assets.scene.messageInitial)
            .setDepth(30);
        messageInitial.visible = true;
    
        upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    
        // Ground animations
        this.anims.create({
            key: assets.animation.ground.moving,
            frames: this.anims.generateFrameNumbers(assets.scene.ground, {
                start: 0,
                end: 0
            }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: assets.animation.ground.stop,
            frames: [{
                key: assets.scene.ground,
                frame: 0
            }],
            frameRate: 20
        })
    
        // Red Bird Animations
        this.anims.create({
            key: assets.animation.bird.red.clapWings,
            frames: this.anims.generateFrameNumbers(assets.bird.red, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: assets.animation.bird.red.stop,
            frames: [{
                key: assets.bird.red,
                frame: 1
            }],
            frameRate: 20
        })
    
        // Blue Bird animations
        this.anims.create({
            key: assets.animation.bird.blue.clapWings,
            frames: this.anims.generateFrameNumbers(assets.bird.blue, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: assets.animation.bird.blue.stop,
            frames: [{
                key: assets.bird.blue,
                frame: 1
            }],
            frameRate: 20
        })
    
        // Yellow Bird animations
        this.anims.create({
            key: assets.animation.bird.yellow.clapWings,
            frames: this.anims.generateFrameNumbers(assets.bird.yellow, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: assets.animation.bird.yellow.stop,
            frames: [{
                key: assets.bird.yellow,
                frame: 1
            }],
            frameRate: 20
        })
    
        prepareGame(this)
    
        gameOverBanner = this.add.image(assets.scene.width, 206, assets.scene.gameOver)
        gameOverBanner.setDepth(20)
        gameOverBanner.visible = false
    
        restartButton = this.add.image(assets.scene.width, 300, assets.scene.restart).setInteractive()
        restartButton.on('pointerdown', restartGame)
        restartButton.setDepth(20)
        restartButton.visible = false
    }
    
    function update(this: Phaser.Scene) {
        if (gameOver || !gameStarted) {
            return;
        }
    
        if (framesMoveUp > 0) {
            framesMoveUp--;
        } else if (Phaser.Input.Keyboard.JustDown(upButton)) {
            moveBird();
        } else {
            player.setVelocityY(120);
    
            if (player.angle < 90) {
                player.angle += 1;
            }
        }
    
        // Update pipes
        pipesGroup.children.iterate((pipe: any) => {
            if (!pipe) return;
            
            if (pipe.x < -50) {
                pipe.destroy();
            } else {
                pipe.setVelocityX(-100);
            }
        });
    
        // Update gaps
        gapsGroup.children.iterate((gap: any) => {
            if (gap) {
                gap.body.setVelocityX(-100);
            }
        });
    
        // Generate new pipes
        nextPipes++;
        if (nextPipes === 130) {
            makePipes(this);
            nextPipes = 0;
        }
    }
    useEffect(() => {
        if (!gameRef.current) return;

        const newGame = new Phaser.Game(config);
        console.log("newGame: ",newGame);
        
        setGame(newGame);

        return () => {
            newGame.destroy(true);
        };
    }, [gameKey]);

    return (
        <div  className="w-full h-full flex items-center justify-center">
            <div
            key={gameKey}
            id='game-container'
                ref={gameRef}
                style={{
                     width: `${GAME_WIDTH}px`,
                    height: `${GAME_HEIGHT}px`
                }}
            />
        </div>
    );
}




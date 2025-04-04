/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';
import { 
    useHandleGameScoreSubmitMutation, 
    usePlayGameMutation } from '@/services/game';
import { useEffect, useRef, useState } from 'react';
import {
    background_day,
    background_night,
    bird_blue,
    gameover,
    // ground_sprite,
    leaderboard_btn,
    leaderboard_list,
    leaderboard_close_btn,
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
} from "@/assets/images/flappy_game";
import { useWindowSize } from 'react-use';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleError } from '@/utils/apiError';
import { toast } from 'sonner';
import routes from '@/constants/routes';
// import { useAppDispatch } from '@/stores/store';
// import { playSound } from '@/stores/sound/soundSlice';
// import { SoundType } from '@/enums/sound';
import { generateSecurePayload } from '@/utils/game';

// const { END_MIXED,JUMP } = SoundType;
const BIRD_JUMP_VELOCITY = -800;
const INITIAL_PIPE_VELOCITY = -190; // Starting pipe velocity
const BIRD_GRAVITY = 250;
const INITIAL_GAP_SIZE = 450; // Starting gap size
const INITIAL_PIPE_SPAWN_INTERVAL = 80;

let currentPipeVelocity = INITIAL_PIPE_VELOCITY;
let currentGapSize = INITIAL_GAP_SIZE;
let currentPipeSpawnInterval = INITIAL_PIPE_SPAWN_INTERVAL;


const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

let gameStartTime = 0;
let gamePlayTime = 0;
let scaleRatio = 1; 

export default function FlappyJfoxGame() {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);
    const { width, height } = useWindowSize();
    const [searchParams] = useSearchParams();
    const [handleGameScoreSubmit] = useHandleGameScoreSubmitMutation({});
    // const dispatch = useAppDispatch();

    const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
    // const dispatch = useAppDispatch();

    // Calculate game dimensions based on screen size
    useEffect(() => {
        // Calculate the best dimensions while maintaining aspect ratio
        let gameWidth, gameHeight;
        const aspectRatio = BASE_WIDTH / BASE_HEIGHT;
        
        if (width / height > aspectRatio) {
            // Screen is wider than our target ratio
            gameHeight = Math.min(height, BASE_HEIGHT);
            gameWidth = gameHeight * aspectRatio;
        } else {
            // Screen is taller than our target ratio
            gameWidth = Math.min(width, BASE_WIDTH);
            gameHeight = gameWidth / aspectRatio;
        }
        
        // Update scale ratio for game elements
        scaleRatio = gameWidth / BASE_WIDTH;
        
        setGameSize({
            width: gameWidth,
            height: gameHeight
        });
    }, [width, height]);

    const GAME_WIDTH = gameSize.width;
    const GAME_HEIGHT = gameSize.height;
    const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

    const assets = {
        bird: {
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
                    bottom: 'pipe-red-bottom'
                }
            }
        },
        scene: {
            width: GAME_WIDTH / 2,
            background: {
                day: 'background-day',
                night: 'background-night'
            },
            ground: 'ground',
            gameOver: 'game-over',
            restart: 'restart-button',
            messageInitial: 'message-initial',
            leaderboard: 'leaderboard-button',
            leaderboardCloseButton: 'leaderboard-close-button',
            leaderboardList: 'leaderboard-list'
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
                blue: {
                    clapWings: 'blue-clap-wings',
                    stop: 'blue-stop'
                },
            },
        }
    }

    let gameOver: boolean
    let gameStarted: boolean
    let upButton: Phaser.Input.Keyboard.Key
    let restartButton: Phaser.GameObjects.Image
    let gameOverBanner: Phaser.GameObjects.Image
    let messageInitial: Phaser.GameObjects.Image
    let timerText: Phaser.GameObjects.Text
    let player: { destroy: () => void; setCollideWorldBounds: (arg0: boolean) => void; anims: { play: (arg0: string, arg1: boolean) => void; }; body: { allowGravity: boolean; }; setVelocityY: (arg0: number) => void; angle: number; }
    let birdName: string
    let framesMoveUp: number
    let backgroundDay: Phaser.GameObjects.Image
    let backgroundNight: Phaser.GameObjects.Image
    let pipesGroup: Phaser.Physics.Arcade.Group
    let gapsGroup: Phaser.Physics.Arcade.Group
    let nextPipes: number
    let currentPipe: { top: any; bottom: any; }
    let scoreboardGroup: Phaser.Physics.Arcade.StaticGroup
    let score: string | number
    let pipePool: Phaser.GameObjects.GameObject[] = []
    let activePipes: Phaser.GameObjects.GameObject[] = []

    const navigate = useNavigate();
    const { GAMES } = routes
    const [playGame] = usePlayGameMutation();
    const handlePlayGame = async (gameId: string) => {
        try {
          const response = await playGame({ gameId }).unwrap();
          if (response.success) {
            toast.success(`You have joined the game! 2000 points deducted.`);
          }
        } catch (error: any) {
          // Check for the specific error message about insufficient points
          if (error?.data?.message === "Insufficient points to play game") {
            toast.error("You don't have enough points to play this game!");
            // Navigate to home page after showing the error
            setTimeout(() => {
              navigate(GAMES);
            }, 1000);
          } else {
            // Handle other errors
            handleError(error);
          }
        }
      };

      
    function getRandomBird() {
        return assets.bird.blue;
    }

    function getAnimationBird() {
        return assets.animation.bird.blue
    }

    function updateScoreboard() {
        scoreboardGroup.clear(true, true)

        const scoreAsString = score.toString()
        if (scoreAsString.length == 1) {
            scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.base + score).setDepth(10)
        } else {
            let initialPosition = assets.scene.width - ((scoreAsString.length * assets.scoreboard.width) / 2)

            for (let i = 0; i < scoreAsString.length; i++) {
                scoreboardGroup.create(initialPosition, 30, assets.scoreboard.base + scoreAsString[i]).setDepth(10)
                initialPosition += assets.scoreboard.width
            }
        }
    }

    function updateScore(_: any, gap: { destroy: () => void; }) {
        score = Number(score) + 1
        gap.destroy()
        if (score % 10 === 0) {
            // Increase pipe speed
            currentPipeVelocity -= 15; // Make pipes move faster

            // Decrease gap size (but not below a minimum)
            if (currentGapSize > 350) {
                currentGapSize -= 10;
            }

            // Decrease spawn interval (but not below a minimum)
            if (currentPipeSpawnInterval > 40) {
                currentPipeSpawnInterval -= 5;
            }
        }
        if (score % 30 === 0) {
            backgroundDay.visible = !backgroundDay.visible
            backgroundNight.visible = !backgroundNight.visible

            if (currentPipe === assets.obstacle.pipe.green)
                currentPipe = assets.obstacle.pipe.red
            else
                currentPipe = assets.obstacle.pipe.green
        }

        updateScoreboard()
    }

    function getPipeFromPool(): Phaser.GameObjects.GameObject | null {
        for (let i = 0; i < pipePool.length; i++) {
            const pipe = pipePool[i];
            if (!pipe.active) {
                return pipe;
            }
        }
        return null; // Pool is empty
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
        currentPipeVelocity = INITIAL_PIPE_VELOCITY * scaleRatio; // Scale velocity
        currentGapSize = INITIAL_GAP_SIZE * scaleRatio; // Scale gap size
        currentPipeSpawnInterval = INITIAL_PIPE_SPAWN_INTERVAL;
        activePipes = [];
        gameStartTime = 0;
        gamePlayTime = 0;

        // Reset timer display
        if (timerText) {
            timerText.setText('Time: 0s');
            timerText.setVisible(false);
        }
        birdName = getRandomBird()
        player = scene.physics.add.sprite(60 * scaleRatio, 265 * scaleRatio, birdName)
        player.setCollideWorldBounds(true)
        // player.setScale(scaleRatio); // Scale the bird
        player.anims.play(getAnimationBird().clapWings, true)
        player.body.allowGravity = false

        scene.physics.add.collider(player as unknown as Phaser.GameObjects.GameObject, pipesGroup, hitBird as unknown as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, scene)
        scene.physics.add.overlap(player as unknown as Phaser.GameObjects.Sprite, gapsGroup, updateScore, undefined, scene)
    }
    async function hitBird(this: Phaser.Scene, player: { anims: { play: (arg0: string) => void; }; }) {
        this.physics.pause()
        // dispatch(playSound(SoundType.END_MIXED))

        const securePayload = await generateSecurePayload({
            gameId: searchParams.get('id') || '',
            score: score,
            duration: gamePlayTime,
            difficulty: "easy"
        });
        handleGameScoreSubmit(securePayload).unwrap();

        gameOver = true
        gameStarted = false

        gamePlayTime = Math.floor((Date.now() - gameStartTime) / 1000);

        player.anims.play(getAnimationBird().stop)

        gameOverBanner.visible = true
        restartButton.visible = true
        if (timerText) {
            timerText.setText(`Time: ${gamePlayTime}s`);
            timerText.setVisible(true);
        }
    }

    function makePipes(scene: Phaser.Scene) {
        if (!gameStarted || gameOver) return;

        // Scale pipe positions based on screen size
        const pipeTopY = Phaser.Math.Between(-50 * scaleRatio, 100 * scaleRatio);

        // Create gap with scaled position
        const gap = scene.add.line(GAME_WIDTH, pipeTopY + 150 * scaleRatio, 0, 0, 0, 98 * scaleRatio);
        gapsGroup.add(gap);
        if (gap.body && gap.body instanceof Phaser.Physics.Arcade.Body) {
            gap.body.allowGravity = false;
        }
        gap.visible = false;

        // Get pipes from pool
        const pipeTop = getPipeFromPool() as Phaser.Physics.Arcade.Sprite;
        const pipeBottom = getPipeFromPool() as Phaser.Physics.Arcade.Sprite;

        if (pipeTop && pipeBottom) {
            // Configure top pipe with scaled position
            pipeTop.setTexture(currentPipe.top);
            pipeTop.setPosition(GAME_WIDTH, pipeTopY);
            pipeTop.setScale(scaleRatio); // Scale the pipe sprite
            pipeTop.setActive(true).setVisible(true);

            // Configure bottom pipe with scaled position
            pipeBottom.setTexture(currentPipe.bottom);
            pipeBottom.setPosition(GAME_WIDTH + 20 * scaleRatio, pipeTopY + currentGapSize * scaleRatio);
            pipeBottom.setScale(scaleRatio); // Scale the pipe sprite
            pipeBottom.setActive(true).setVisible(true);

            // Add to active pipes
            activePipes.push(pipeTop);
            activePipes.push(pipeBottom);
        } else {
            // Fallback if pool is empty - with scaling
            const pipeTop = pipesGroup.create(GAME_WIDTH, pipeTopY, currentPipe.top);
            const pipeBottom = pipesGroup.create(GAME_WIDTH + 20 * scaleRatio, pipeTopY + currentGapSize * scaleRatio, currentPipe.bottom);
            
            pipeTop.setScale(scaleRatio);
            pipeBottom.setScale(scaleRatio);

            if (pipeTop.body) {
                (pipeTop.body as Phaser.Physics.Arcade.Body).allowGravity = false;
            }
            if (pipeBottom.body) {
                (pipeBottom.body as Phaser.Physics.Arcade.Body).allowGravity = false;
            }

            activePipes.push(pipeTop);
            activePipes.push(pipeBottom);
        }
    }
    function startGame(scene: Phaser.Scene) {
        gameStarted = true
        messageInitial.visible = false
        
        // Ensure gameStartTime is reset to current time
        gameStartTime = Date.now();
        gamePlayTime = 0;

        // Show timer and reset its text
        if (timerText) {
            timerText.setText('Time: 0s');
            timerText.setVisible(true);
        }

        const score0 = scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.number0)
        score0.setDepth(20)

        makePipes(scene)
    }


    function preload(this: Phaser.Scene) {
        this.load.image(assets.scene.background.day, background_day);
    this.load.image(assets.scene.background.night, background_night);

    // Pipes - Fix the frame dimensions
    // Instead of using spritesheet, load pipes as regular images
    this.load.image(assets.obstacle.pipe.green.top, pipe_green_top);
    this.load.image(assets.obstacle.pipe.green.bottom, pipe_green_bot);
    this.load.image(assets.obstacle.pipe.red.top, pipe_red_top);
    this.load.image(assets.obstacle.pipe.red.bottom, pipe_red_bot);

    // Start game
    this.load.image(assets.scene.messageInitial, message_initial);

    // End game
    this.load.image(assets.scene.gameOver, gameover);
    this.load.image(assets.scene.restart, restart_btn);

    this.load.image(assets.scene.leaderboard, leaderboard_btn);
    this.load.image(assets.scene.leaderboardList, leaderboard_list);
    this.load.image(assets.scene.leaderboardCloseButton, leaderboard_close_btn);

    // Birds
    this.load.spritesheet(assets.bird.blue, bird_blue, {
        frameWidth: 51,
        frameHeight: 21
    });

    // Numbers
    this.load.image(assets.scoreboard.number0, number0);
    this.load.image(assets.scoreboard.number1, number1);
    this.load.image(assets.scoreboard.number2, number2);
    this.load.image(assets.scoreboard.number3, number3);
    this.load.image(assets.scoreboard.number4, number4);
    this.load.image(assets.scoreboard.number5, number5);
    this.load.image(assets.scoreboard.number6, number6);
    this.load.image(assets.scoreboard.number7, number7);
    this.load.image(assets.scoreboard.number8, number8);
    this.load.image(assets.scoreboard.number9, number9);
    }
    function create(this: Phaser.Scene) {
        this.data.set('gameOver', false);
        this.data.set('gameStarted', false);
        this.data.set('score', 0);

        // Create backgrounds with scaled settings
        backgroundDay = this.add.image(assets.scene.width, 280 * scaleRatio, assets.scene.background.day)
            .setInteractive()
            .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        backgroundDay.on('pointerdown', moveBird);

        backgroundNight = this.add.image(assets.scene.width, 280 * scaleRatio, assets.scene.background.night)
            .setInteractive()
            .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        backgroundNight.visible = false;
        backgroundNight.on('pointerdown', moveBird);

        // Add game groups with optimized settings
        gapsGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        pipesGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        scoreboardGroup = this.physics.add.staticGroup();

        // Initial message with scaling
        messageInitial = this.add.image(assets.scene.width, 256 * scaleRatio, assets.scene.messageInitial)
            .setDepth(30)
            .setScale(scaleRatio);
        messageInitial.visible = true;

        // Add timer text with scaled font size
        // const textStyle = {
        //     fontFamily: 'Arial',
        //     fontSize: `${18 * scaleRatio}px`,
        //     color: '#ffffff',
        //     stroke: '#000000',
        //     strokeThickness: 3 * scaleRatio
        // };
        
        // Scale other UI elements
        timerText = this.add.text(assets.scene.width, 70 * scaleRatio, 'Time: 0s', {
            fontFamily: 'Arial',
            fontSize: `${24 * scaleRatio}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4 * scaleRatio
        })
            .setOrigin(0.5)
            .setDepth(40)
            .setVisible(false);

        upButton = this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP) as Phaser.Input.Keyboard.Key

        // Blue Bird animations
        this.anims.create({
            key: assets.animation.bird.blue.clapWings,
            frames: this.anims.generateFrameNumbers(assets.bird.blue, {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: assets.animation.bird.blue.stop,
            frames: [{
                key: assets.bird.blue,
                frame: 2
            }],
            frameRate: 10
        })

        prepareGame(this)

        // Scale game over elements
        gameOverBanner = this.add.image(assets.scene.width, 206 * scaleRatio, assets.scene.gameOver)
            .setDepth(20)
            .setScale(scaleRatio);
        gameOverBanner.visible = false

        restartButton = this.add.image(assets.scene.width, 300 * scaleRatio, assets.scene.restart)
            .setInteractive()
            .setScale(scaleRatio);
        restartButton.on('pointerdown', restartGame)
        restartButton.setDepth(20)
        restartButton.visible = false
    }

    function moveBird(this: any) {
        if (gameOver)
            return;

        if (!gameStarted) {
            startGame(this as Phaser.Scene)
            return;
        }
        // Scale jump velocity based on screen size
        player.setVelocityY(BIRD_JUMP_VELOCITY * scaleRatio)
        player.angle = -30
        framesMoveUp = 5
    }

    function restartGame() {
        
          handlePlayGame(searchParams.get('id') || '');
          if (gameInstance.current) {
            const scene = gameInstance.current.scene.getScene(gameInstance.current.scene.scenes[0].scene.key);
            if (scene) {
              scene.scene.restart();
            }
          }
    }

    function update(this: Phaser.Scene) {
        if (gameOver || !gameStarted) {
            return;
        }
        if ((player as unknown as Phaser.Physics.Arcade.Sprite).y >= GAME_HEIGHT -250) {
            hitBird.call(this, { anims: { play: (arg0: string) => player.anims.play(arg0, true) } });
            return; 
        }
        if (gameStarted && timerText) {
            // Only calculate time if gameStartTime is valid
            if (gameStartTime > 0) {
                const currentTime = Math.floor((Date.now() - gameStartTime) / 1000);
                timerText.setText(`Time: ${currentTime}s`);
            } else {
                // Reset timer if gameStartTime is invalid
                gameStartTime = Date.now();
                timerText.setText('Time: 0s');
            }
        }

        if (framesMoveUp > 0) {
            framesMoveUp--;
        } else if (Phaser.Input.Keyboard.JustDown(upButton)) {
            moveBird();
        } else {
            player.setVelocityY(BIRD_GRAVITY);

            if (player.angle < 90) {
                player.angle += 1;
            }
        }
        let minDistance = Number.MAX_VALUE;
        // Update pipes
        pipesGroup.children.iterate((pipe: Phaser.GameObjects.GameObject): any | null => {
            if (!pipe || !pipe.active) return;

            const gameObject = pipe as Phaser.GameObjects.Sprite;
            if (gameObject.x < -50) {
                // Instead of destroying, deactivate and return to pool
                gameObject.setActive(false).setVisible(false);

                // Remove from active pipes
                const index = activePipes.indexOf(pipe);
                if (index !== -1) {
                    activePipes.splice(index, 1);
                }
            } else {
                const physicsBody = gameObject.body as Phaser.Physics.Arcade.Body;
                physicsBody.setVelocityX(currentPipeVelocity);

                // Track nearest pipe for optimized collision
                const distance = gameObject.x - 60; // Player x position is 60
                if (distance > 0 && distance < minDistance) {
                    minDistance = distance;
                }
            }
        });

        // Update gaps
        gapsGroup.children.iterate((gap: Phaser.GameObjects.GameObject): any | null => {
            if (gap && gap.body) {
                const physicsBody = gap.body as Phaser.Physics.Arcade.Body;
                physicsBody.velocity.x = currentPipeVelocity;
            }
        });

        // Generate new pipes
        nextPipes++;
        if (nextPipes >= currentPipeSpawnInterval) {
            makePipes(this);
            nextPipes = 0;
        }
    }
    useEffect(() => {
        if (!gameRef.current || gameSize.width === 0 || gameSize.height === 0) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameRef.current,
            scale: {
              mode: Phaser.Scale.FIT,
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            physics: {
              default: 'arcade',
              arcade: {
                gravity: { x: 0, y: 300 * ASPECT_RATIO * scaleRatio }, // Scale gravity
                debug: false,
              },
            },
            scene: {
              preload: preload,
              create: create,
              update: update,
            },
          };

        // Destroy previous game instance if it exists
        if (gameInstance.current) {
            gameInstance.current.destroy(true);
        }

        const newGame = new Phaser.Game(config);
        gameInstance.current = newGame;

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
            }
            pipePool = [];
            activePipes = [];
        };
    }, [gameSize.width, gameSize.height]); 

    return (
<div className="w-full relative h-full flex items-center justify-center">
            {gameSize.width > 0 && (
                <div
                    id='game-container'
                    ref={gameRef}
                    style={{
                        width: `${gameSize.width}px`,
                        height: `${gameSize.height}px`,
                        maxWidth: '100vw',
                        maxHeight: '85vh'
                    }}
                />
            )}
        </div>
    );
}
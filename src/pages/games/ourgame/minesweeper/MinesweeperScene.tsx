/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';
import tiles from "@/assets/images/minesweeper/tiles.png";
import grass from '@/assets/images/minesweeper/grass.png';
import bomb from "@/assets/images/minesweeper/bomb.png"
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaCircleChevronRight, FaRankingStar } from 'react-icons/fa6';
import MissionDialog from '@/pages/missions/components/MissionDialog';
import { useGetGameLeaderboardQuery, useHandleGameScoreSubmitMutation, usePlayGameMutation } from '@/services/game';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IFilter } from '@/interfaces/IFilter';
import { toast } from 'sonner';
import { handleError } from '@/utils/apiError';
import routes from '@/constants/routes';
// import { SoundType } from '@/enums/sound';
// import { playSound } from '@/stores/sound/soundSlice';
// import { useAppDispatch } from '@/stores/store';
import { generateSecurePayload } from '@/utils/game';
import { useWindowSize } from 'react-use';

interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  sprite: Phaser.GameObjects.Sprite;
  text?: Phaser.GameObjects.Text;
}

enum DifficultyEnum {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  INSANE = 'insane'
}

const Difficulty = [
  {
    key: DifficultyEnum.Easy,
    label: 'Easy'
  },
  {
    key: DifficultyEnum.Medium,
    label: 'Medium'
  },
  {
    key: DifficultyEnum.Hard,
    label: 'Hard'
  },
  {
    key: DifficultyEnum.INSANE,
    label: 'Insane'
  }
]


class MinesweeperSceneClass extends Phaser.Scene {
  private grid: Cell[][] = [];
  private gridSize = { width: 0, height: 0 };
  private cellSize = 32;
  private scaleRatio = 1;
  private mineCount = 0;
  private flagsPlaced = 0;
  private gameOver = false;
  private gameWon = false;
  private statusText!: Phaser.GameObjects.Text;
  private mineCountText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private timer = 0;
  private timerEvent?: Phaser.Time.TimerEvent;
  private difficulty: string = 'easy';
  private background!: Phaser.GameObjects.Graphics;
  private score = 0;
  private difficultyMultiplier = 1;
  private baseScore = 1000;
  private timeBonus = 0;
  private revealedCells = 0;
  private totalNonMineCells = 0;
  private leaderboard: any[] = [];
  private textPool: Phaser.GameObjects.Text[] = [];
  private onScoreChange: (score: number) => void;
  private onGameEnd: (won: boolean, score: number, duration: number) => void;

  constructor(onScoreChange: (score: number) => void, onGameEnd: (won: boolean, score: number, duration: number) => void, scaleRatio = 1) {
    super('MinesweeperScene');
    this.onScoreChange = onScoreChange;
    this.onGameEnd = onGameEnd;
    this.scaleRatio = scaleRatio;
    this.cellSize = 32 * this.scaleRatio;
  }

  init(data: { scaleRatio?: number } = {}) {
    // Get difficulty from registry
    this.difficulty = this.game.registry.get('difficulty') || 'easy';
    if (data.scaleRatio) {
      this.scaleRatio = data.scaleRatio;
      this.cellSize = 32 * this.scaleRatio;
    }
    this.setupDifficulty();
    this.leaderboard = this.game.registry.get('leaderboard') || [];
  }
  updateScore() {
    const totalScore = this.score + this.timeBonus;
    this.onScoreChange(totalScore);
  }
  setupDifficulty() {
    switch (this.difficulty) {
      case 'easy':
        this.gridSize = { width: 9, height: 10 };
        this.mineCount = 10;
        this.difficultyMultiplier = 1;
        break;
      case 'medium':
        this.gridSize = { width: 12, height: 10 };
        this.mineCount = 18;
        this.difficultyMultiplier = 1.5;
        break;
      case 'hard':
        this.gridSize = { width: 16, height: 10 };
        this.mineCount = 32;
        this.difficultyMultiplier = 2;
        break;
      case 'insane':
        this.gridSize = { width: 16, height: 10 };
        this.mineCount = 50;
        this.difficultyMultiplier = 3;
        break;
      default:
        this.gridSize = { width: 12, height: 10 };
        this.mineCount = 18;
        this.difficultyMultiplier = 1.5;
        break;
    }
    this.totalNonMineCells = this.gridSize.width * this.gridSize.height - this.mineCount;
  }

  preload() {
    // Load assets
    this.load.spritesheet('tiles', tiles, {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('grass', grass, {
      frameWidth: 40,
      frameHeight: 40
    });
    this.load.spritesheet('bomb', bomb, {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    // Reset game state
    this.gameOver = false;
    this.gameWon = false;
    this.flagsPlaced = 0;
    this.timer = 0;
    this.score = 0;
    this.revealedCells = 0;

    this.background = this.add.graphics();
    this.background.fillStyle(0x333237, 0.1);
    const x = this.cameras.main.width / 2 - this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2 - this.cameras.main.height / 2;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const radius = 30;
    this.background.fillRoundedRect(x, y, width, height, radius);

    const gradientBg = this.add.graphics();
    gradientBg.fillGradientStyle(0x333237, 0x333237, 0x222222, 0x222222, 0.3);
    gradientBg.fillRect(x, y, width, height);

    // Calculate grid offset to center it
    const gridWidth = this.gridSize.width * this.cellSize;
    const gridHeight = this.gridSize.height * this.cellSize;
    const offsetX = (this.cameras.main.width - gridWidth) / 2;
    const offsetY = (this.cameras.main.height - gridHeight) / 2 + 30;

    // Create UI
    this.createUI(offsetX, offsetY - 30);

    // Create grid
    this.createGrid(offsetX, offsetY);

    // Place mines
    this.placeMines();

    // Calculate adjacent mines
    this.calculateAdjacentMines();

    // Start timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }
  createUI(offsetX: number, offsetY: number) {
    // Create status text with scaled font size
    this.statusText = this.add.text(
      this.cameras.main.width / 2,
      offsetY - 25 * this.scaleRatio,
      'Find the mines!',
      { fontSize: `${16 * this.scaleRatio}px`, color: '#ffffff' }
    ).setOrigin(0.5);

    // Create mine counter with scaled font size
    this.mineCountText = this.add.text(
      offsetX,
      offsetY - 10 * this.scaleRatio,
      `Mines: ${this.mineCount - this.flagsPlaced}`,
      { fontSize: `${16 * this.scaleRatio}px`, color: '#fff' }
    );

    // Create timer with scaled font size
    this.timerText = this.add.text(
      this.cameras.main.width - offsetX - 100 * this.scaleRatio,
      offsetY - 10 * this.scaleRatio,
      'Time: 0',
      { fontSize: `${16 * this.scaleRatio}px`, color: '#fff' }
    );

    // Create score text with scaled font size
    this.scoreText = this.add.text(
      this.cameras.main.width / 2,
      offsetY + 20 * this.scaleRatio,
      'Score: 0',
      { fontSize: `${19.2 * this.scaleRatio}px`, color: '#ffff00', fontStyle: 'bold' }
    ).setOrigin(0.5);
    this.scoreText.setVisible(false);
  }

  createGrid(offsetX: number, offsetY: number) {
    this.grid = [];

    for (let y = 0; y < this.gridSize.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridSize.width; x++) {
        const isAlternate = (x + y) % 2 === 0;
        const bgColor = isAlternate ? 0xa9d046 : 0xb1d67e;

        // Create cell sprite with scaling
        const sprite = this.add.sprite(
          offsetX + x * this.cellSize + this.cellSize / 2,
          offsetY + y * this.cellSize + this.cellSize / 2,
          'grass',
          0
        );

        sprite.setScale(this.scaleRatio);
        sprite.setTint(bgColor);

        // Make cell interactive
        sprite.setInteractive();
        sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (this.gameOver || this.gameWon) return;

          if (pointer.rightButtonDown()) {
            this.toggleFlag(x, y);
          } else {
            this.revealCell(x, y);
          }
        });

        // Create cell object
        this.grid[y][x] = {
          x,
          y,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
          sprite
        };
      }
    }
  }

  placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < this.mineCount) {
      const x = Phaser.Math.Between(0, this.gridSize.width - 1);
      const y = Phaser.Math.Between(0, this.gridSize.height - 1);

      if (!this.grid[y][x].isMine) {
        this.grid[y][x].isMine = true;
        minesPlaced++;
      } else {
        this.grid[y][x].sprite.setTexture('bomb');
        this.grid[y][x].sprite.setTint(0xffffff)
      }
    }
  }

  calculateAdjacentMines() {
    for (let y = 0; y < this.gridSize.height; y++) {
      for (let x = 0; x < this.gridSize.width; x++) {
        if (!this.grid[y][x].isMine) {
          let count = 0;

          // Check all 8 surrounding cells
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;

              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && nx < this.gridSize.width &&
                ny >= 0 && ny < this.gridSize.height &&
                this.grid[ny][nx].isMine) {
                count++;
              }
            }
          }

          this.grid[y][x].adjacentMines = count;
        }
      }
    }
  }

  revealCell(x: number, y: number) {
    const cell = this.grid[y][x];

    // Skip if cell is already revealed or flagged
    if (cell.isRevealed || cell.isFlagged) return;

    // Reveal the cell
    cell.isRevealed = true;

    if (cell.isMine) {
      this.endGame(false);
      cell.sprite.setTexture('bomb');
    } else {
      // Increment revealed cells counter for score calculation
      this.revealedCells++;

      cell.sprite.setTexture('tiles');
      cell.sprite.setTint(0xffffff);

      if (cell.adjacentMines > 0) {
        // Use text pool for better performance
        cell.text = this.getTextFromPool(
          cell.sprite.x,
          cell.sprite.y,
          cell.adjacentMines.toString(),
          {
            fontSize: '1.2rem',
            color: this.getNumberColor(cell.adjacentMines),
            fontStyle: 'bold'
          }
        ).setOrigin(0.5);
      }

      // If cell has no adjacent mines, collect neighboring cells for batch reveal
      if (cell.adjacentMines === 0) {
        const cellsToReveal: { x: number, y: number }[] = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;

            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < this.gridSize.width &&
              ny >= 0 && ny < this.gridSize.height &&
              !this.grid[ny][nx].isRevealed &&
              !this.grid[ny][nx].isFlagged) {
              cellsToReveal.push({ x: nx, y: ny });
            }
          }
        }

        // Reveal in batches for better performance
        this.revealCellBatch(cellsToReveal);
      }

      // Update progress-based score
      this.updateProgressScore();

      // Check if game is won
      this.checkWinCondition();
    }
  }
  updateProgressScore() {
    // Calculate progress percentage
    const progressPercent = this.revealedCells / this.totalNonMineCells;

    // Base score calculation based on progress
    this.score = Math.floor(progressPercent * this.baseScore * this.difficultyMultiplier);
  }
  private getNumberColor(num: number): string {
    const colors = [
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff'
    ];
    return colors[num] || '#ffffff';
  }
  revealAdjacentCells(x: number, y: number) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < this.gridSize.width &&
          ny >= 0 && ny < this.gridSize.height) {
          this.revealCell(nx, ny);
        }
      }
    }
  }

  toggleFlag(x: number, y: number) {
    const cell = this.grid[y][x];

    // Skip if cell is already revealed
    if (cell.isRevealed) return;

    if (cell.isFlagged) {
      // Remove flag
      cell.isFlagged = false;
      // const isAlternate = (x + y) % 2 === 0;
      // const bgColor = isAlternate ? 0xa9d046 : 0xb1d64e;
      // cell.sprite.setTint(bgColor);
      cell.sprite.setTexture('tiles');
      this.flagsPlaced--;
    } else {
      // Add flag if we haven't used all flags
      if (this.flagsPlaced < this.mineCount) {
        cell.isFlagged = true;
        cell.sprite.setTexture('tiles');
        cell.sprite.setFrame(10); // Flag frame
        this.flagsPlaced++;
      }
    }
    this.mineCountText.setText(`Mines: ${this.mineCount - this.flagsPlaced}`);
  }

  checkWinCondition() {
    // Check if all non-mine cells are revealed
    for (let y = 0; y < this.gridSize.height; y++) {
      for (let x = 0; x < this.gridSize.width; x++) {
        const cell = this.grid[y][x];
        if (!cell.isMine && !cell.isRevealed) {
          return; // Game not won yet
        }
      }
    }

    // All non-mine cells are revealed, game is won
    this.endGame(true);
  }

  endGame(won: boolean) {
    this.gameOver = true;
    this.gameWon = won;

    if (this.timerEvent) {
      this.timerEvent.remove();
    }

    const totalScore = this.score + this.timeBonus;
    this.onGameEnd(won, totalScore, this.timerEvent?.getElapsed() ? this.timerEvent.getElapsed() / 1000 : 0);

    // Rest of the implementation remains the same
    if (won) {
      this.statusText.setText('You Win!');
      this.statusText.setColor('#00ff00');
      console.log(this.score);

      // Flag all mines
      for (let y = 0; y < this.gridSize.height; y++) {
        for (let x = 0; x < this.gridSize.width; x++) {
          const cell = this.grid[y][x];
          if (cell.isMine && !cell.isFlagged) {
            cell.isFlagged = true;
            cell.sprite.setTexture('tiles');
            cell.sprite.setFrame(10); // Flag frame
          }
        }
      }
    } else {
      this.statusText.setText('Game Over!');
      this.statusText.setColor('#ff0000');
      this.scoreText.setText("Score: " + Number(this.score).toString());
      // Reveal all mines
      for (let y = 0; y < this.gridSize.height; y++) {
        for (let x = 0; x < this.gridSize.width; x++) {
          const cell = this.grid[y][x];
          if (cell.isMine && !cell.isRevealed && !cell.isFlagged) {
            this.grid[y][x].sprite.setTint(0xffffff);
            cell.sprite.setTexture('bomb');
          } else if (cell.isFlagged && !cell.isMine) {
            // Wrong flag
            cell.sprite.setTexture('tiles');
            cell.sprite.setFrame(11); // Wrong flag frame
          }
        }
      }
    }
  }

  updateTimer = () => {
    this.timer++;
    this.timerText.setText(`Time: ${this.timer}`);
  }

  update() {
    if (!this.gameOver && !this.gameWon) {
      // Calculate time bonus (decreases as time increases)
      this.timeBonus = Math.max(0, 500 - Math.floor(this.timer / 10) * 25);

      // Update total score with time bonus
      const totalScore = this.score + this.timeBonus;

      // Only update UI when needed to improve performance
      if (this.timer % 2 === 0) {
        // Update score text if visible
        if (this.revealedCells > 0 && !this.scoreText.visible) {
          this.scoreText.setVisible(true);
        }

        if (this.scoreText.visible) {
          this.scoreText.setText(`Score: ${totalScore}`);
          this.updateScore();
        }
      }
    }
  }

  getTextFromPool(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    // Reuse a text object from the pool or create a new one
    let textObj: Phaser.GameObjects.Text;

    if (this.textPool.length > 0) {
      textObj = this.textPool.pop()!;
      textObj.setPosition(x, y);
      textObj.setText(text);
      textObj.setStyle(style);
      textObj.setVisible(true);
    } else {
      textObj = this.add.text(x, y, text, style);
    }

    return textObj;
  }

  // Optimize performance by batching cell reveals
  revealCellBatch(cellsToReveal: { x: number, y: number }[]) {
    if (cellsToReveal.length === 0) return;

    // Process cells in batches to avoid frame drops
    const batchSize = 10;
    const batch = cellsToReveal.splice(0, batchSize);

    batch.forEach(({ x, y }) => {
      this.revealCell(x, y);
    });

    if (cellsToReveal.length > 0) {
      this.time.delayedCall(5, () => {
        this.revealCellBatch(cellsToReveal);
      }, [], this);
    }
  }

  // Optimize the revealCell method to use the text pool


  // Optimize game restart
  restartGame() {
    // Return text objects to pool
    this.grid.forEach(row => {
      row.forEach(cell => {
        if (cell.text) {
          cell.text.setVisible(false);
          this.textPool.push(cell.text);
          cell.text = undefined;
        }
      });
    });

    // Reset game state
    this.scene.restart();
  }

  // Add a method to clean up resources when scene is shut down
  shutdown() {
    if (this.timerEvent) {
      this.timerEvent.remove();
    }

    // Clear text pool
    this.textPool.forEach(text => {
      text.destroy();
    });
    this.textPool = [];

    // Clear grid references
    this.grid = [];

    // super.shutdown();
  }
}

const MinesweeperScene: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [score, setScore] = useState({
    score: 0,
    duration: 0
  });
  const [difficulty, setDifficulty] = useState('medium');
  const [searchParams] = useSearchParams();
  const [handleGameScoreSubmit] = useHandleGameScoreSubmitMutation({});
  const [leaderboardItems, setLeaderboardItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    limit: 5,
    page: 1
  });
  const { width, height } = useWindowSize();
  const [gameSize, setGameSize] = useState({ width: 800, height: 600 });
  const [scaleRatio, setScaleRatio] = useState(1);
  const navigate = useNavigate();
  const { GAMES } = routes;
  const [playGame] = usePlayGameMutation();
// const dispatch = useAppDispatch();
const { data, isError, isFetching } = useGetGameLeaderboardQuery({ 
  id: searchParams.get('id') || '', 
  page: filter.page || 1, 
  limit: filter.limit || 5 
});

  const handleDifficultyChange = (act: string) => {
    let newDifficulty = difficulty;

    if (act === 'left') {
      const currentIndex = Difficulty.findIndex(diff => diff.key === difficulty);
      newDifficulty = Difficulty[(currentIndex - 1 + Difficulty.length) % Difficulty.length].key;
    } else {
      const currentIndex = Difficulty.findIndex(diff => diff.key === difficulty);
      newDifficulty = Difficulty[(currentIndex + 1) % Difficulty.length].key;
    }

    setDifficulty(newDifficulty);

    if (game) {
      // Set the actual difficulty value in the registry, not 'left' or 'right'
      game.registry.set('difficulty', newDifficulty);
      game.scene.getScene('MinesweeperScene').scene.restart();
    }
  };

  // Handle score changes from the Phaser scene
  const handleScoreChange = (newScore: number) => {
    setScore({ ...score, score: newScore });
    // dispatch(playSound(SoundType.GRASS_STEP))
  };


  // Handle game end from the Phaser scene
  const handleGameEnd = async (won: boolean, finalScore: number, duration: number) => {
    setScore({ score: finalScore, duration });
    // dispatch(playSound(SoundType.END_MIXED))

    const securePayload = await generateSecurePayload({
      gameId: searchParams.get('id') || '',
      score: finalScore - 500,
      duration,
      difficulty: "easy"
    });
    handleGameScoreSubmit(securePayload).unwrap();
  };

  // Initialize the game
  useEffect(() => {
    if (!gameRef.current) return;

    // Base dimensions
    const baseWidth = 800;
    const baseHeight = 600;
    
    // Calculate available space
    const containerWidth = Math.min(width - 40, 1200); // Max width with some padding
    const containerHeight = Math.min(height - 200, 800); // Max height with space for controls
    
    // Calculate scale ratio based on available space
    const widthRatio = containerWidth / baseWidth;
    const heightRatio = containerHeight / baseHeight;
    const newScaleRatio = Math.min(widthRatio, heightRatio, 1.5); // Cap at 1.5x
    
    // Calculate new dimensions
    const newWidth = Math.floor(baseWidth * newScaleRatio);
    const newHeight = Math.floor(baseHeight * newScaleRatio);
    
    setGameSize({ width: newWidth, height: newHeight });
    setScaleRatio(newScaleRatio);
    
    // Update game config if it exists
    if (game) {
      game.scale.resize(newWidth, newHeight);
      game.registry.set('scaleRatio', newScaleRatio);
      
      // Restart the scene to apply new scale
      const scene = game.scene.getScene('MinesweeperScene');
      if (scene) {
        scene.scene.restart({ scaleRatio: newScaleRatio });
      }
    }
  }, [width, height, game]);

  useEffect(() => {
    if (!gameRef.current || game) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: gameSize.width,
      height: gameSize.height,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [new MinesweeperSceneClass(handleScoreChange, handleGameEnd, scaleRatio)],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }
        }
      }
    };

    const newGame = new Phaser.Game(config);
    // Set initial difficulty and scale ratio
    newGame.registry.set('difficulty', difficulty);
    newGame.registry.set('scaleRatio', scaleRatio);
    setGame(newGame);

    return () => {
      if (newGame) {
        newGame.destroy(true);
      }
    };
  }, []);

  useEffect(() => {
    if (data?.data?.items) {
        if (filter.page === 1) {
          setLeaderboardItems(data?.data.items);
        } else {
          setLeaderboardItems(prev => [...prev, ...(data?.data?.items || [])]);
        }
    }
}, [filter.page, data?.data?.items]);

  const hasMore = leaderboardItems.length < (data?.data?.total || 0);
  const loadMore = () => {
      if (hasMore && !isFetching) {
          setFilter(prev => ({
              ...prev,
              page: (prev.page ?? 1) + 1
          }));
      }
  };

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

  const restartGame = () => {
    if (game) {
      game.scene.getScene('MinesweeperScene').scene.restart();
      setScore({
        score: 0,
        duration: 0
      });
      handlePlayGame(searchParams.get('id') || '')
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex flex-col">

        <div className='flex flex-row w-auto justify-center space-x-1 items-center'>
          <Button
            variant={'ghost'}
            className=" mt-2 bg-transparent w-full border-2 border-gray-100 rounded-full text-white"
            onClick={restartGame}
          >
            New Game
          </Button>
          <MissionDialog
            triggerBtn={
              <Button
                variant={'ghost'}
                className="mt-2 bg-transparent border-2 border-gray-100 rounded-full text-white"
              >
                <FaRankingStar />
              </Button>
            }
            title={
              <div>
                    <span>Leaderboard</span>
                    <p className='text-gray-100 my-1 text-xs mt-2'>Your ranking: #{data?.data?.currentUserRank ?? "Unknown"}</p>
                </div>
            }
            description={
              !isError ? (

                <div id="scrollableDiv" className="h-[30vh] overflow-auto">
                  <InfiniteScroll
                    dataLength={leaderboardItems.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<div className="text-center py-4">Loading more items...</div>}
                    endMessage={
                      <p className="text-center py-4 text-white/70">
                        {leaderboardItems.length > 0
                          ? "You've seen all your leaderboard!"
                          : "Data not found"}
                      </p>
                    }
                    scrollableTarget="scrollableDiv"
                  >
                    <div className='flex flex-col justify-center items-center w-full'>
                      <table className='w-full border-collapse'>
                        <thead>
                          <tr className='text-left border-b border-gray-700'>
                            <th className='py-2 px-4 text-center'>#</th>
                            <th className='py-2 pl-8 text-sm font-bold text-gray-400'>Name</th>
                            <th className='py-2 px-4 text-xs font-bold text-gray-400 text-right'>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboardItems.map((item: any, index: number) => (
                            <tr key={index} className='border-b border-gray-700'>
                              <td className='py-2 px-4 text-center'>
                                <div className='size-5 rounded-full bg-gray-100 flex justify-center items-center mx-auto'>
                                  <p className='text-xs font-bold text-gray-800'>{index + 1}</p>
                                </div>
                              </td>
                              <td className='py-2 text-sm font-bold text-gray-400'>{item.user.firstName}</td>
                              <td className='py-2 px-4 text-xs font-bold text-gray-400 text-right'>{item.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </InfiniteScroll>
                </div>
              ) : <div>Error get leaderboard</div>
            }
          />
        </div>
        <div className='flex flex-row space-x-3 mt-2 w-auto justify-between items-center'>
          <FaCircleChevronRight
            onClick={() => handleDifficultyChange('left')}
            className="w-fit rotate-180 h-10 bg-transparent border-2 border-gray-200 rounded-full text-white"
          />
          <p className='uppercase'>{difficulty}</p>
          <FaCircleChevronRight
            onClick={() => handleDifficultyChange('right')}
            className="w-fit h-10 bg-transparent border-2 border-gray-200 rounded-full text-white"
          />
        </div>
      </div>


      <div
        ref={gameRef}
        className=""
        style={{ 
          width: `${gameSize.width}px`, 
          height: `${gameSize.height}px`,
          maxWidth: '100%',
          maxHeight: '70vh'
        }}
      />
    </div>
  );
};

export default MinesweeperScene;
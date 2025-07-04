        // Game variables
        let cards = [];
        let flippedCards = [];
        let matches = 0;
        let moves = 0;
        let timer = 0;
        let gameTimer;
        let gameStarted = false;
        let gameEnded = false;
        let gamePaused = false;
        let lives = 50;
        let score = 0;
        let streak = 0;
        let difficulty = 'easy';
        let gridSize = 4;
        let totalPairs = 8;
        let timeLimit = 0;
        let currentMultiplier = 1;
        let specialCardsEnabled = false;
        let bombCards = [];
        let frozenCards = [];
        let powerUps = {
            hint: 3,
            freeze: 2,
            shuffle: 1
        };

        // Card symbols for different difficulties
        const easySymbols = ['🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🎺', '🎸'];
        const mediumSymbols = ['🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🎺', '🎸', '🎊', '🎈', '🎁', '🎀', '🎃', '🎄', '🎆', '🎇', '🎉', '🎟'];
        const hardSymbols = ['🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🎺', '🎸', '🎊', '🎈', '🎁', '🎀', '🎃', '🎄', '🎆', '🎇', '🎉', '🎟', '🎲', '🎪', '🎭', '🎨', '🎺', '🎸', '🎊', '🎈', '🎁', '🎀', '🎃', '🎄', '🎆', '🎇'];

        // Initialize game
        function initGame() {
            setupDifficulty();
            createGameBoard();
            resetGameStats();
            loadBestScores();
            updatePowerUpDisplay();
        }

        // Setup difficulty
        function setupDifficulty() {
            switch(difficulty) {
                case 'easy':
                    gridSize = 4;
                    totalPairs = 8;
                    lives = 50;
                    timeLimit = 0; // No time limit
                    specialCardsEnabled = false;
                    break;
                case 'medium':
                    gridSize = 6;
                    totalPairs = 18;
                    lives = 50;
                    timeLimit = 300; // 5 minutes
                    specialCardsEnabled = true;
                    break;
                case 'hard':
                    gridSize = 8;
                    totalPairs = 32;
                    lives = 50;
                    timeLimit = 900; // 15 minutes
                    specialCardsEnabled = true;
                    break;
            }
        }

        // Create game board
        function createGameBoard() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '';
            gameBoard.className = `game-board board-${gridSize}x${gridSize}`;
            cards = [];
            bombCards = [];
            frozenCards = [];

            // Get symbols based on difficulty
            let symbols;
            switch(difficulty) {
                case 'easy':
                    symbols = easySymbols;
                    break;
                case 'medium':
                    symbols = mediumSymbols;
                    break;
                case 'hard':
                    symbols = hardSymbols;
                    break;
            }

            // Create pairs
            const cardSymbols = [];
            for (let i = 0; i < totalPairs; i++) {
                cardSymbols.push(symbols[i % symbols.length]);
                cardSymbols.push(symbols[i % symbols.length]);
            }

            // Shuffle cards
            shuffleArray(cardSymbols);

            // Add special cards for medium/hard difficulty
            if (specialCardsEnabled) {
                // Add bomb cards (2-4 bombs)
                const bombCount = Math.floor(Math.random() * 3) + 2;
                for (let i = 0; i < bombCount; i++) {
                    if (Math.random() < 0.1) { // 10% chance per card
                        const randomIndex = Math.floor(Math.random() * cardSymbols.length);
                        bombCards.push(randomIndex);
                    }
                }
            }

            // Create cards
            for (let i = 0; i < cardSymbols.length; i++) {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.symbol = cardSymbols[i];
                card.dataset.id = i;
                card.addEventListener('click', flipCard);
                
                // Add special effects
                if (bombCards.includes(i)) {
                    card.classList.add('bomb');
                }
                
                gameBoard.appendChild(card);
                cards.push(card);
            }
        }

        // Shuffle array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Flip card
        function flipCard(event) {
            if (gameEnded || gamePaused) return;
            
            const card = event.target;
            const cardId = parseInt(card.dataset.id);
            
            // Can't flip already flipped, matched, or frozen cards
            if (card.classList.contains('flipped') || card.classList.contains('matched') || frozenCards.includes(cardId)) {
                return;
            }

            // Start timer on first move
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }

            // Can't flip more than 2 cards
            if (flippedCards.length >= 2) {
                return;
            }

            // Check for bomb card
            if (bombCards.includes(cardId)) {
                explodeBomb(card);
                return;
            }

            // Flip the card
            card.classList.add('flipped');
            card.textContent = card.dataset.symbol;
            flippedCards.push(card);

            // Check for match when 2 cards are flipped
            if (flippedCards.length === 2) {
                moves++;
                updateMoves();
                checkMatch();
            }
        }

        // Explode bomb
        function explodeBomb(card) {
            card.classList.add('penalty');
            card.textContent = '💣';
            
            // Lose life and points
            lives--;
            score = Math.max(0, score - 50);
            streak = 0;
            
            updateLives();
            updateScore();
            updateStreak();
            
            // Check game over
            if (lives <= 0) {
                endGame(false);
            }
            
            setTimeout(() => {
                card.classList.remove('penalty');
                card.textContent = '';
            }, 1000);
        }

        // Check for match
        function checkMatch() {
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                // Match found
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    matches++;
                    streak++;
                    
                    // Calculate score with multiplier
                    const baseScore = 100;
                    const streakBonus = streak > 1 ? streak * 10 : 0;
                    const timeBonus = Math.max(0, 60 - timer) * 2;
                    const totalScore = (baseScore + streakBonus + timeBonus) * currentMultiplier;
                    
                    score += totalScore;
                    
                    // Show combo indicator
                    if (streak > 1) {
                        showComboIndicator();
                    }
                    
                    updateMatches();
                    updateScore();
                    updateStreak();
                    flippedCards = [];
                    
                    // Check if game is won
                    if (matches === totalPairs) {
                        endGame(true);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.add('penalty');
                    card2.classList.add('penalty');
                    
                    // Lose life
                    lives--;
                    streak = 0;
                    
                    updateLives();
                    updateStreak();
                    
                    setTimeout(() => {
                        card1.classList.remove('flipped', 'penalty');
                        card2.classList.remove('flipped', 'penalty');
                        card1.textContent = '';
                        card2.textContent = '';
                        flippedCards = [];
                        
                        // Check game over
                        if (lives <= 0) {
                            endGame(false);
                        }
                    }, 500);
                }, 1000);
            }
        }

        // Show combo indicator
        function showComboIndicator() {
            const indicator = document.getElementById('comboIndicator');
            const multiplier = document.getElementById('comboMultiplier');
            
            currentMultiplier = Math.min(5, Math.floor(streak / 2) + 1);
            multiplier.textContent = currentMultiplier;
            
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }

        // Power-up functions
        function useHint() {
            if (powerUps.hint <= 0 || gameEnded || gamePaused) return;
            
            powerUps.hint--;
            updatePowerUpDisplay();
            
            // Find a matching pair and highlight briefly
            const unmatched = cards.filter(card => !card.classList.contains('matched'));
            const symbols = {};
            
            unmatched.forEach(card => {
                const symbol = card.dataset.symbol;
                if (!symbols[symbol]) {
                    symbols[symbol] = [];
                }
                symbols[symbol].push(card);
            });
            
            // Find first pair
            for (let symbol in symbols) {
                if (symbols[symbol].length >= 2) {
                    const pair = symbols[symbol].slice(0, 2);
                    pair.forEach(card => {
                        card.classList.add('highlighted');
                        setTimeout(() => {
                            card.classList.remove('highlighted');
                        }, 2000);
                    });
                    break;
                }
            }
        }

        function useFreeze() {
            if (powerUps.freeze <= 0 || gameEnded || gamePaused) return;
            
            powerUps.freeze--;
            updatePowerUpDisplay();
            
            // Freeze time for 10 seconds
            clearInterval(gameTimer);
            
            setTimeout(() => {
                if (gameStarted && !gameEnded && !gamePaused) {
                    startTimer();
                }
            }, 10000);
            
            // Visual feedback
            cards.forEach(card => {
                if (!card.classList.contains('matched')) {
                    card.classList.add('frozen');
                    setTimeout(() => {
                        card.classList.remove('frozen');
                    }, 1000);
                }
            });
        }

        function useShuffle() {
            if (powerUps.shuffle <= 0 || gameEnded || gamePaused) return;
            
            powerUps.shuffle--;
            updatePowerUpDisplay();
            
            // Shuffle remaining cards
            const unmatched = cards.filter(card => !card.classList.contains('matched'));
            const symbols = unmatched.map(card => card.dataset.symbol);
            
            shuffleArray(symbols);
            
            unmatched.forEach((card, index) => {
                card.dataset.symbol = symbols[index];
                if (card.classList.contains('flipped')) {
                    card.textContent = symbols[index];
                }
            });
        }

        // Update power-up display
        function updatePowerUpDisplay() {
            document.getElementById('hintCount').textContent = powerUps.hint;
            document.getElementById('freezeCount').textContent = powerUps.freeze;
            document.getElementById('shuffleCount').textContent = powerUps.shuffle;
            
            document.getElementById('hintPowerUp').classList.toggle('used', powerUps.hint <= 0);
            document.getElementById('freezePowerUp').classList.toggle('used', powerUps.freeze <= 0);
            document.getElementById('shufflePowerUp').classList.toggle('used', powerUps.shuffle <= 0);
        }

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                difficulty = e.target.dataset.level;
                restartGame();
            });
        });

        // Timer functions
        function startTimer() {
            gameTimer = setInterval(() => {
                timer++;
                updateTimer();
                
                // Check time limit
                if (timeLimit > 0 && timer >= timeLimit) {
                    endGame(false);
                }
            }, 1000);
        }

        function stopTimer() {
            clearInterval(gameTimer);
        }

        function pauseGame() {
            if (gameEnded) return;
            
            gamePaused = true;
            stopTimer();
            document.getElementById('pausedOverlay').style.display = 'flex';
        }

        function resumeGame() {
            gamePaused = false;
            document.getElementById('pausedOverlay').style.display = 'none';
            if (gameStarted && !gameEnded) {
                startTimer();
            }
        }

        // Update display functions
        function updateTimer() {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Show time limit if applicable
            if (timeLimit > 0) {
                const remaining = timeLimit - timer;
                const remMinutes = Math.floor(remaining / 60);
                const remSeconds = remaining % 60;
                timeDisplay = `${remMinutes.toString().padStart(2, '0')}:${remSeconds.toString().padStart(2, '0')}`;
                
                // Change color when time is running out
                const timerElement = document.getElementById('timer');
                if (remaining <= 30) {
                    timerElement.style.color = '#ff4757';
                } else if (remaining <= 60) {
                    timerElement.style.color = '#ffa502';
                } else {
                    timerElement.style.color = '#333';
                }
            }
            
            document.getElementById('timer').textContent = timeDisplay;
        }

        function updateMoves() {
            document.getElementById('moves').textContent = moves;
        }

        function updateMatches() {
            document.getElementById('matches').textContent = `${matches}/${totalPairs}`;
        }

        function updateLives() {
            document.getElementById('lives').textContent = lives;
            const livesElement = document.getElementById('lives');
            
            if (lives <= 1) {
                livesElement.style.color = '#ff4757';
                livesElement.style.animation = 'pulse 1s infinite';
            } else if (lives <= 2) {
                livesElement.style.color = '#ffa502';
            } else {
                livesElement.style.color = '#ff4757';
                livesElement.style.animation = 'none';
            }
        }

        function updateScore() {
            document.getElementById('score').textContent = score;
        }

        function updateStreak() {
            document.getElementById('streak').textContent = streak;
            const streakElement = document.getElementById('streak');
            
            if (streak > 3) {
                streakElement.style.color = '#2ed573';
                streakElement.style.animation = 'pulse 0.5s';
            } else {
                streakElement.style.color = '#ffa502';
                streakElement.style.animation = 'none';
            }
        }

        // Reset game stats
        function resetGameStats() {
            matches = 0;
            moves = 0;
            timer = 0;
            lives = 50;
            score = 0;
            streak = 0;
            gameStarted = false;
            gameEnded = false;
            gamePaused = false;
            flippedCards = [];
            currentMultiplier = 1;
            
            // Reset power-ups based on difficulty
            powerUps = {
                hint: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 2 : 1,
                freeze: difficulty === 'easy' ? 2 : 1,
                shuffle: 1
            };
            
            updateTimer();
            updateMoves();
            updateMatches();
            updateLives();
            updateScore();
            updateStreak();
            updatePowerUpDisplay();
            
            if (gameTimer) {
                stopTimer();
            }
            
            document.getElementById('gameOver').style.display = 'none';
            document.getElementById('pausedOverlay').style.display = 'none';
        }

        // End game
        function endGame(won) {
            gameEnded = true;
            stopTimer();
            
            const gameOverDiv = document.getElementById('gameOver');
            const titleElement = document.getElementById('gameOverTitle');
            const statsElement = document.getElementById('finalStats');
            
            if (won) {
                titleElement.textContent = '🎉 Поздравления!';
                gameOverDiv.className = 'game-over';
                const finalStats = `Завърши ${difficulty === 'easy' ? 'лесното' : difficulty === 'medium' ? 'средното' : 'трудното'} ниво за ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')} с ${moves} хода!
                Крайни точки: ${score} | Максимално комбо: ${Math.max(...[streak])}`;
                statsElement.textContent = finalStats;
                
                // Save best score
                saveBestScore(timer, moves, score, difficulty);
            } else {
                titleElement.textContent = '💥 Край на играта!';
                gameOverDiv.className = 'game-over failed';
                const reason = lives <= 0 ? 'Останахте без животи!' : 'Времето изтече!';
                statsElement.textContent = `${reason} Точки: ${score} | Намерени: ${matches}/${totalPairs}`;
            }
            
            gameOverDiv.style.display = 'block';
            loadBestScores();
        }

        // Save best score to localStorage
        function saveBestScore(time, moves, score, difficulty) {
            const bestScores = JSON.parse(localStorage.getItem(`mindmatch-scores-${difficulty}`) || '[]');
            const newScore = {
                time: time,
                moves: moves,
                score: score,
                difficulty: difficulty,
                date: new Date().toLocaleDateString('bg-BG')
            };
            
            bestScores.push(newScore);
            bestScores.sort((a, b) => {
                // Sort by score first (higher is better), then by time (lower is better)
                if (a.score !== b.score) {
                    return b.score - a.score;
                }
                return a.time - b.time;
            });
            
            // Keep only top 5 scores per difficulty
            bestScores.splice(5);
            
            localStorage.setItem(`mindmatch-scores-${difficulty}`, JSON.stringify(bestScores));
        }

        // Load best scores from localStorage
        function loadBestScores() {
            const bestScoresDiv = document.getElementById('bestScores');
            bestScoresDiv.innerHTML = '';
            
            ['easy', 'medium', 'hard'].forEach(level => {
                const scores = JSON.parse(localStorage.getItem(`mindmatch-scores-${level}`) || '[]');
                
                if (scores.length > 0) {
                    const levelHeader = document.createElement('h4');
                    levelHeader.textContent = `${level === 'easy' ? 'Лесно' : level === 'medium' ? 'Средно' : 'Трудно'} ниво`;
                    levelHeader.style.marginTop = '15px';
                    levelHeader.style.marginBottom = '10px';
                    levelHeader.style.color = '#666';
                    bestScoresDiv.appendChild(levelHeader);
                    
                    scores.forEach((score, index) => {
                        const scoreItem = document.createElement('div');
                        scoreItem.className = 'score-item';
                        const timeStr = `${Math.floor(score.time / 60)}:${(score.time % 60).toString().padStart(2, '0')}`;
                        scoreItem.innerHTML = `
                            <span>${index + 1}. ${score.score} т. | ${timeStr} | ${score.moves} хода</span>
                            <span>${score.date}</span>
                        `;
                        bestScoresDiv.appendChild(scoreItem);
                    });
                }
            });
            
            if (bestScoresDiv.children.length === 0) {
                bestScoresDiv.innerHTML = '<p style="color: #666; font-style: italic;">Няма записани резултати</p>';
            }
        }

        // Restart game
        function restartGame() {
            resetGameStats();
            initGame();
        }

        // Add CSS for pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Initialize game when page loads
        window.addEventListener('load', initGame);

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                if (gamePaused) {
                    resumeGame();
                } else {
                    pauseGame();
                }
            } else if (e.key === 'r' || e.key === 'R') {
                restartGame();
            } else if (e.key === 'h' || e.key === 'H') {
                useHint();
            } else if (e.key === 'f' || e.key === 'F') {
                useFreeze();
            } else if (e.key === 's' || e.key === 'S') {
                useShuffle();
            }
        });

        // Add achievement system
        function checkAchievements() {
            const achievements = [];
            
            // Perfect game
            if (moves === totalPairs && lives === (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 4 : 3)) {
                achievements.push('🏆 Перфектна игра!');
            }
            
            // Speed demon
            if (timer < 60 && difficulty === 'easy') {
                achievements.push('⚡ Скоростен демон!');
            }
            
            // Combo master
            if (streak >= 5) {
                achievements.push('🔥 Майстор на комбото!');
            }
            
            // High score
            if (score > 1000) {
                achievements.push('💰 Високи точки!');
            }
            
            // Display achievements
            if (achievements.length > 0) {
                const achievementDiv = document.createElement('div');
                achievementDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(145deg, #ffd700, #ffed4e);
                    color: #333;
                    padding: 15px 25px;
                    border-radius: 20px;
                    font-weight: bold;
                    z-index: 1000;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                    animation: slideIn 0.5s ease;
                `;
                achievementDiv.textContent = achievements.join(' ');
                document.body.appendChild(achievementDiv);
                
                setTimeout(() => {
                    achievementDiv.remove();
                }, 4000);
            }
        }

        // Update endGame function to include achievements
        const originalEndGame = endGame;
        endGame = function(won) {
            if (won) {
                checkAchievements();
            }
            originalEndGame(won);
        };
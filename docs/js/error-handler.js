/**
 * Gamification System
 * Manages points, achievements, streaks, and avatar progression
 */

export class GamificationSystem {
  constructor() {
    this.loadState();
  }

  /**
   * Load gamification state from localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem('python-tutor-gamification');
      if (saved) {
        const state = JSON.parse(saved);
        this.points = state.points || 0;
        this.achievements = state.achievements || [];
        this.streak = state.streak || 0;
        this.lastActive = state.lastActive || null;
        this.totalLessonsCompleted = state.totalLessonsCompleted || 0;
        this.totalCodeRuns = state.totalCodeRuns || 0;
      } else {
        this.resetState();
      }
    } catch (error) {
      console.error('Error loading gamification state:', error);
      this.resetState();
    }
  }

  /**
   * Reset gamification state to defaults
   */
  resetState() {
    this.points = 0;
    this.achievements = [];
    this.streak = 0;
    this.lastActive = null;
    this.totalLessonsCompleted = 0;
    this.totalCodeRuns = 0;
  }

  /**
   * Save gamification state to localStorage
   */
  saveState() {
    try {
      const state = {
        points: this.points,
        achievements: this.achievements,
        streak: this.streak,
        lastActive: this.lastActive,
        totalLessonsCompleted: this.totalLessonsCompleted,
        totalCodeRuns: this.totalCodeRuns
      };
      localStorage.setItem('python-tutor-gamification', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving gamification state:', error);
    }
  }

  /**
   * Get avatar progression based on total points
   */
  getAvatar() {
    const avatars = [
      { level: 0, emoji: '🥚', name: 'Baby Egg' },
      { level: 50, emoji: '🐣', name: 'Hatchling' },
      { level: 100, emoji: '🐍', name: 'Python Apprentice' },
      { level: 250, emoji: '🦎', name: 'Code Wizard' },
      { level: 500, emoji: '🦖', name: 'Code Champion' },
      { level: 1000, emoji: '🐉', name: 'Master Coder' }
    ];

    let currentAvatar = avatars[0];
    for (const avatar of avatars) {
      if (this.points >= avatar.level) {
        currentAvatar = avatar;
      }
    }

    return {
      ...currentAvatar,
      progress: this.calculateProgressToNextAvatar(currentAvatar)
    };
  }

  /**
   * Calculate progress percentage to next avatar
   */
  calculateProgressToNextAvatar(currentAvatar) {
    const avatars = [
      { level: 0, emoji: '🥚', name: 'Baby Egg' },
      { level: 50, emoji: '🐣', name: 'Hatchling' },
      { level: 100, emoji: '🐍', name: 'Python Apprentice' },
      { level: 250, emoji: '🦎', name: 'Code Wizard' },
      { level: 500, emoji: '🦖', name: 'Code Champion' },
      { level: 1000, emoji: '🐉', name: 'Master Coder' }
    ];

    const currentIndex = avatars.findIndex(a => a.level === currentAvatar.level);
    if (currentIndex === avatars.length - 1) {
      return 100; // Max level
    }

    const nextAvatar = avatars[currentIndex + 1];
    const pointsNeeded = nextAvatar.level - currentAvatar.level;
    const pointsEarned = this.points - currentAvatar.level;
    
    return Math.min(100, Math.round((pointsEarned / pointsNeeded) * 100));
  }

  /**
   * Award points
   */
  awardPoints(amount, reason = '') {
    const oldPoints = this.points;
    this.points += amount;
    const oldAvatar = this.getAvatar();
    
    this.saveState();
    
    const newAvatar = this.getAvatar();
    
    // Check if avatar changed
    if (newAvatar.emoji !== oldAvatar.emoji) {
      this.showAvatarUpgrade(oldAvatar, newAvatar);
    }

    // Show notification
    this.showPointsAwarded(amount, reason);
    
    // Check for achievements
    this.checkAchievements();
    
    return { oldPoints, newPoints: this.points };
  }

  /**
   * Award achievement
   */
  awardAchievement(achievementId) {
    if (this.achievements.includes(achievementId)) {
      return false; // Already earned
    }

    const achievement = this.getAchievementById(achievementId);
    if (!achievement) {
      return false;
    }

    this.achievements.push(achievementId);
    this.awardPoints(achievement.points || 0, `Achievement: ${achievement.name}`);
    this.saveState();
    
    this.showAchievementUnlocked(achievement);
    return true;
  }

  /**
   * Get achievement by ID
   */
  getAchievementById(id) {
    return this.achievementsData.find(a => a.id === id);
  }

  /**
   * Get all achievements
   */
  getAchievementsData() {
    return this.achievementsData;
  }

  /**
   * Check and unlock achievements
   */
  checkAchievements() {
    const achievementsToCheck = this.achievementsData.filter(a => 
      !this.achievements.includes(a.id)
    );

    for (const achievement of achievementsToCheck) {
      if (this.shouldUnlockAchievement(achievement)) {
        this.awardAchievement(achievement.id);
      }
    }
  }

  /**
   * Check if achievement should be unlocked
   */
  shouldUnlockAchievement(achievement) {
    switch (achievement.id) {
      case 'first_print':
        return this.totalCodeRuns >= 1;
      
      case 'code_runner_10':
        return this.totalCodeRuns >= 10;
      
      case 'code_runner_50':
        return this.totalCodeRuns >= 50;
      
      case 'lesson_complete_1':
        return this.totalLessonsCompleted >= 1;
      
      case 'lesson_complete_5':
        return this.totalLessonsCompleted >= 5;
      
      case 'lesson_complete_10':
        return this.totalLessonsCompleted >= 10;
      
      case 'points_100':
        return this.points >= 100;
      
      case 'points_500':
        return this.points >= 500;
      
      case 'streak_7':
        return this.streak >= 7;
      
      case 'streak_30':
        return this.streak >= 30;
      
      default:
        return false;
    }
  }

  /**
   * Update streak
   */
  updateStreak() {
    const today = new Date().toDateString();
    
    if (this.lastActive === today) {
      return; // Already updated today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (this.lastActive === yesterday.toDateString()) {
      // Streak continues
      this.streak++;
    } else if (this.lastActive !== today) {
      // Streak broken (or first time)
      this.streak = 1;
    }

    this.lastActive = today;
    this.saveState();

    // Check streak achievements
    this.checkAchievements();

    return this.streak;
  }

  /**
   * Get current streak
   */
  getStreak() {
    const today = new Date().toDateString();
    if (this.lastActive !== today) {
      this.updateStreak();
    }
    return this.streak;
  }

  /**
   * Record code run
   */
  recordCodeRun() {
    this.totalCodeRuns++;
    this.updateStreak();
    this.saveState();
    this.checkAchievements();
  }

  /**
   * Record lesson completion
   */
  recordLessonCompletion() {
    this.totalLessonsCompleted++;
    this.updateStreak();
    this.saveState();
    this.checkAchievements();
  }

  /**
   * Show points awarded notification
   */
  showPointsAwarded(amount, reason) {
    const notification = document.createElement('div');
    notification.className = 'points-notification success-pop';
    notification.innerHTML = `
      <span style="font-size: 2rem;">⭐</span>
      <span style="font-weight: 700; font-size: 1.25rem;">+${amount}</span>
      ${reason ? `<span style="font-size: 0.875rem;">${reason}</span>` : ''}
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 2rem;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  /**
   * Show avatar upgrade notification
   */
  showAvatarUpgrade(oldAvatar, newAvatar) {
    const modal = document.createElement('div');
    modal.className = 'celebration-modal';
    modal.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-emoji">🎉</div>
        <h2 class="celebration-title">Avatar Upgrade!</h2>
        <div style="display: flex; gap: 2rem; align-items: center; justify-content: center; margin: 2rem 0;">
          <div style="text-align: center;">
            <div style="font-size: 4rem; opacity: 0.5;">${oldAvatar.emoji}</div>
            <div style="font-size: 2rem;">➡️</div>
            <div style="font-size: 4rem;">${newAvatar.emoji}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 2rem; opacity: 0.5;">${oldAvatar.name}</div>
            <div style="font-size: 1.25rem; font-weight: 700;">Level ${oldAvatar.level}</div>
          </div>
        </div>
        <button id="close-upgrade-modal" class="btn-fun">Awesome! 🎊</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Add confetti
    this.createConfetti();

    document.getElementById('close-upgrade-modal').addEventListener('click', () => {
      modal.remove();
    });
  }

  /**
   * Show achievement unlocked notification
   */
  showAchievementUnlocked(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification success-pop';
    notification.innerHTML = `
      <div style="font-size: 3rem;">${achievement.icon}</div>
      <div style="font-weight: 700; font-size: 1.25rem;">Achievement Unlocked!</div>
      <div style="font-weight: 600;">${achievement.name}</div>
      <div style="font-size: 0.875rem;">${achievement.description}</div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 2rem;
      border-radius: var(--border-radius);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
      z-index: 1000;
      animation: pop-in 0.5s ease;
      text-align: center;
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Add confetti
    this.createConfetti();

    setTimeout(() => {
      notification.style.animation = 'pop-out 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  /**
   * Create confetti celebration
   */
  createConfetti() {
    const colors = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
      }, i * 50);
    }
  }

  /**
   * Achievement definitions
   */
  achievementsData = [
    {
      id: 'first_print',
      name: 'Hello World!',
      description: 'Run your first code',
      icon: '🖨️',
      points: 10
    },
    {
      id: 'code_runner_10',
      name: 'Practice Makes Perfect',
      description: 'Run code 10 times',
      icon: '💪',
      points: 25
    },
    {
      id: 'code_runner_50',
      name: 'Code Marathon',
      description: 'Run code 50 times',
      icon: '🏃',
      points: 50
    },
    {
      id: 'lesson_complete_1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '👣',
      points: 50
    },
    {
      id: 'lesson_complete_5',
      name: 'Halfway There',
      description: 'Complete 5 lessons',
      icon: '🎯',
      points: 100
    },
    {
      id: 'lesson_complete_10',
      name: 'Lesson Master',
      description: 'Complete 10 lessons',
      icon: '🏆',
      points: 200
    },
    {
      id: 'points_100',
      name: 'Rising Star',
      description: 'Earn 100 points',
      icon: '⭐',
      points: 0
    },
    {
      id: 'points_500',
      name: 'Super Star',
      description: 'Earn 500 points',
      icon: '🌟',
      points: 0
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      points: 100
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '💎',
      points: 250
    }
  ];
}

// Add keyframe animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  @keyframes pop-in {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes pop-out {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export singleton instance
export const gamification = new GamificationSystem();

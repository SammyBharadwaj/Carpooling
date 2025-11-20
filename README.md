# 🎮 Shotgun AI - Retro Carpool Tracker

A fully functional React component for tracking carpools with a retro arcade/8-bit aesthetic. Features a unique HP-based system where drivers gain health and passengers lose health!

## ✨ Features

### 🎨 Retro Arcade Design
- **Press Start 2P** Google Font for authentic 8-bit typography
- **CRT Scanline Effect** overlay for old monitor aesthetic
- **Neon Color Scheme**: Lime green, hot pink, and bright yellow accents
- **Pixelated borders** and chunky arcade-style buttons
- **Animated background** with twinkling stars
- **Glowing text effects** on key elements

### 🎯 Core Functionality
- **Player Management**: Add unlimited players, each starting with 100 HP
- **HP System**:
  - Drivers GAIN HP when they drive (healing)
  - Passengers LOSE HP when they ride (taking damage)
  - HP changes based on trip distance (5 HP per km)
  - Max HP is 200, min is 0
- **Trip Logging**: Record driver, distance, and passengers for each trip
- **Smart Health Bars**: Color-coded based on HP level (green → yellow → orange → red)
- **Boss Battle Mode**: Identifies the player with lowest HP who should drive next
- **Quest Log**: Historical record of all completed trips

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Usage

The component is fully self-contained and ready to use:

```jsx
import ShotgunAI from './components/ShotgunAI';

function App() {
  return <ShotgunAI />;
}
```

## 🎮 How to Use

1. **Add Players**: Enter player names in the "NEW_PLAYER.NAME" field
2. **Log a Trip**:
   - Select the driver from the dropdown
   - Enter distance in kilometers
   - Select passengers (checkbox selection)
   - Click "EXECUTE MISSION"
3. **Check Status**: View player HP in the leaderboard with color-coded health bars
4. **Find Next Driver**: Click "WHO DRIVES NEXT?" to identify the player with lowest HP

## 🧮 The Math

- **Starting HP**: Every player begins with 100 HP
- **HP Calculation**: `HP change = distance × 5`
- **Driver**: Gains HP (heals) up to max 200 HP
- **Passengers**: Lose HP (take damage) down to min 0 HP
- **Example**: 10 km trip = +50 HP for driver, -50 HP for each passenger

## 🎨 Design Features

### Color Scheme
- Background: `slate-950` (almost black)
- Primary: `lime-400` (neon green)
- Secondary: `pink-500` (hot pink)
- Accent: `yellow-400` (bright yellow)
- Danger: `red-500` (critical HP)

### Typography
- Font: **Press Start 2P** (Google Fonts)
- Fully responsive sizing
- Glowing text effects on headers

### Effects
- **CRT Scanlines**: Repeating gradient overlay
- **Pixel Borders**: Box-shadow based chunky borders
- **Arcade Buttons**: 3D effect with press animation
- **HP Bars**: Smooth animated transitions
- **Star Background**: Randomly positioned twinkling elements

## 📦 Dependencies

- **React**: ^18.3.1
- **React DOM**: ^18.3.1
- **Lucide React**: ^0.263.1 (for icons)
- **Tailwind CSS**: ^3.4.1 (for styling)
- **Vite**: ^5.4.2 (build tool)

## 🛠️ Tech Stack

- **React** with Hooks (useState)
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Vite** for lightning-fast development
- **Google Fonts** for retro typography

## 📱 Responsive Design

The component is fully responsive and works on:
- Desktop (optimal experience)
- Tablets
- Mobile devices

## 🎯 Component Structure

```
ShotgunAI/
├── State Management
│   ├── Players (id, name, hp)
│   ├── Trips (driver, distance, passengers)
│   └── UI State (modals, forms)
│
├── UI Sections
│   ├── Header (title, subtitle)
│   ├── Leaderboard (player status, HP bars)
│   ├── Action Panel (trip logging form)
│   ├── Quest Log (trip history)
│   └── Boss Battle Modal
│
└── Styling
    ├── Google Fonts import
    ├── CRT scanline effects
    ├── Retro input styling
    ├── Arcade button effects
    └── HP bar animations
```

## 🎪 Features Breakdown

### Player Management
- Add unlimited players
- Each player starts with 100 HP
- Real-time HP updates
- Visual health status with color-coded bars

### Trip Logging
- Select driver from existing players
- Enter distance in kilometers
- Multi-select passengers
- Automatic HP calculation
- Form validation

### Boss Battle System
- Finds player with lowest HP
- Displays dramatic modal
- Encourages fair driver rotation
- Shows current HP status

### Quest Log
- Chronological trip history
- Shows driver, passengers, distance
- Displays HP changes
- Timestamp for each trip

## 🎨 Customization

All styling uses Tailwind CSS classes, making it easy to customize:

- Colors: Change utility classes (e.g., `bg-lime-400` → `bg-blue-400`)
- Sizes: Adjust text sizes with `text-{size}` classes
- Spacing: Modify padding/margins with `p-{size}` and `m-{size}`
- Effects: Tweak shadow/glow effects in the `<style>` blocks

## 📝 License

This component is provided as-is for your carpooling needs. Feel free to modify and use as needed!

## 🎮 Credits

Created with ❤️ by Claude (Anthropic) for epic carpool tracking adventures!

---

**INSERT COIN TO CONTINUE** 🕹️

# Polycast User Guide

Welcome to Polycast! This guide will teach you everything you need to know to start trading on prediction markets, even if you've never done anything like this before.

---

## Table of Contents

1. [What is Polycast?](#what-is-polycast)
2. [How Prediction Markets Work](#how-prediction-markets-work)
3. [Getting Started (Quick Start)](#getting-started-quick-start)
4. [Navigating the App](#navigating-the-app)
5. [Understanding Market Cards](#understanding-market-cards)
6. [Understanding the Market Detail Page](#understanding-the-market-detail-page)
7. [How to Place a Trade (Step by Step)](#how-to-place-a-trade-step-by-step)
8. [Ten Hands-On Use Cases](#ten-hands-on-use-cases)
9. [Understanding Your Portfolio](#understanding-your-portfolio)
10. [Tips for New Traders](#tips-for-new-traders)
11. [Frequently Asked Questions](#frequently-asked-questions)

---

## What is Polycast?

Polycast is a **prediction market platform** where you trade on real-world events. Instead of buying stocks in companies, you're buying and selling shares in questions about the future.

Here's what makes Polycast special:

- **Play Money Only**: You start with $1,000 in virtual currency. This is not real money, so you can learn and experiment without any financial risk.
- **Predict the Future**: Trade on questions like "Will Bitcoin hit $110,000?" or "Will a Democrat win the next election?"
- **Profit from Being Right**: If you predict correctly, you make a profit. If you're wrong, you lose your investment.
- **Learn About Probability**: Prediction markets teach you to think in terms of odds and probabilities, which is a valuable skill.

**Think of it like a stock market, but instead of companies, you trade on questions about the future.**

The best part? You're competing against other traders, which means the market prices reflect what everyone collectively thinks will happen. When you disagree with the crowd and you're right, you profit!

---

## How Prediction Markets Work

If you've never invested or traded before, don't worry. We'll explain everything from scratch.

### The Basic Concept

Every market on Polycast is built around a **YES/NO question**. For example:

- "Will Bitcoin be above $110,000 by December 31, 2026?"
- "Will the EU pass comprehensive AI regulation by mid-2026?"
- "Will a fully AI-generated film win a major festival award by 2027?"

For each question, there are only two possible outcomes: YES (it happens) or NO (it doesn't happen).

### YES and NO Shares

You can buy **YES shares** or **NO shares** in any market.

- **YES shares**: You get paid $1.00 per share if the event happens. You get $0 if it doesn't.
- **NO shares**: You get paid $1.00 per share if the event does NOT happen. You get $0 if it does.

### Understanding Prices

Each market shows two prices: a **YES price** and a **NO price**. These prices always add up to $1.00.

For example:
- YES price: $0.65
- NO price: $0.35
- Total: $1.00

**What does the YES price mean?**

The YES price represents the market's collective estimate of the probability. A YES price of $0.65 means the market thinks there's a **65% chance** that the event will happen.

Think about it this way: if the event has a 65% chance of happening, then a fair price for a YES share (which pays $1.00 if it happens) is $0.65.

### How You Make Money

Your profit comes from the difference between what you pay and what you receive.

**If you buy YES shares:**
- You pay the YES price per share (for example, $0.42)
- If the event happens, you get $1.00 per share
- Your profit = $1.00 - $0.42 = $0.58 per share

**If you buy NO shares:**
- You pay the NO price per share (for example, $0.58)
- If the event does NOT happen, you get $1.00 per share
- Your profit = $1.00 - $0.58 = $0.42 per share

### A Concrete Example

Let's say you think Bitcoin will hit $110,000 by the end of 2026. You check the market and see:

- **Question**: "Will BTC be above $110K by Dec 31, 2026?"
- **YES price**: $0.42
- **NO price**: $0.58

You think the market is wrong and Bitcoin has a much better chance than 42%. So you decide to buy YES shares.

**You buy 100 YES shares at $0.42 each.**

- **Total cost**: 100 shares × $0.42 = $42.00
- **Potential payout if YES**: 100 shares × $1.00 = $100.00
- **Potential profit if YES**: $100.00 - $42.00 = $58.00

**What happens next?**

If Bitcoin reaches $110,000 by December 31, 2026:
- You win! You get $100.00 back.
- Your profit is $58.00 (that's a 138% return on your $42 investment!)

If Bitcoin does NOT reach $110,000:
- You lose. Your shares are worth $0.
- You've lost your $42.00 investment.

### Why This Works

Prediction markets work because they aggregate information from many people. When thousands of traders put their money where their mouth is, the resulting prices tend to be surprisingly accurate estimates of real-world probabilities.

When you trade, you're essentially saying, "I think the market has this probability wrong, and I'm willing to bet on it."

---

## Getting Started (Quick Start)

Ready to start trading? Here's how to get up and running in just a few minutes.

### Step 1: Open the App

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the Polycast home page with a grid of prediction markets.

### Step 2: Browse the Markets

You'll see the **Markets page** showing 15 different prediction markets. Each market is displayed as a card showing:

- The question being asked
- The current YES and NO probabilities (shown as green and red bars)
- How much money has been traded in this market
- When the market closes

### Step 3: Explore Categories

At the top of the page, you'll see category tabs:

- **All**: Shows all markets
- **Crypto**: Markets about cryptocurrency
- **Politics**: Markets about political events
- **Sports**: Markets about sports outcomes
- **AI**: Markets about artificial intelligence
- **Entertainment**: Markets about movies, TV, and media

Click each tab to filter the markets by category.

### Step 4: View a Market Detail Page

Click on any market card to see the full detail page. This page shows:

- A large probability chart
- The order book (pending orders from other traders)
- A trade panel where you can place orders
- Recent trades that have executed

### Step 5: Create an Account

To start trading, you need to create an account. Click the **"Sign up"** button in the top-right corner of the page.

You'll see a signup form asking for:

- **Username**: Choose any username (must be at least 3 characters)
- **Email**: Your email address
- **Password**: Choose a password (must be at least 6 characters)

Fill in the form and click **"Sign up"**.

### Step 6: Welcome Bonus!

Congratulations! You now have a Polycast account with **$1,000 in play money** automatically added to your balance. You can see your balance displayed in the navigation bar at the top of the page.

### Step 7: Place Your First Trade

Now you're ready to trade! Here's how:

1. Go to any market that interests you
2. In the Trade Panel on the right side, choose **"Buy Yes"** or **"Buy No"**
3. Set your **Price** (how much you're willing to pay per share)
4. Set your **Shares** (how many shares you want to buy)
5. Review the summary showing your total cost and potential profit
6. Click **"Place Order"**

That's it! You've just placed your first trade on Polycast.

---

## Navigating the App

Polycast has five main pages. Here's what you'll find on each one.

### Home Page (/)

The **Home page** is your main hub for browsing markets. It shows a grid of market cards, each representing a prediction market you can trade on.

**What you'll see:**

- **Category tabs** at the top: Click these to filter markets by topic (All, Crypto, Politics, Sports, AI, Entertainment)
- **Market cards** in a grid layout: Each card shows:
  - The question being asked
  - A category badge (top-right corner)
  - YES and NO probability bars (green for YES, red for NO)
  - Volume: How much money has been traded
  - Closing date: When the market will be resolved
- **Navigation bar** at the top: Links to Leaderboard, Portfolio, and Login/Signup

**How markets are sorted:**

Markets are sorted by trading volume, with the most actively traded markets appearing first. This helps you find the markets where the most action is happening.

### Market Detail Page (/markets/...)

When you click on a market card, you'll go to the **Market Detail page** for that specific market. This is where you'll spend most of your time when trading.

**What you'll see:**

- **Market title and description** at the top
- **Probability Chart**: A large visual showing the current YES probability as a percentage
- **Order Book**: Shows all pending orders from traders waiting to be matched
  - YES Bids: Orders to buy YES shares (shown in green)
  - NO Bids: Orders to buy NO shares (shown in red)
  - Each order shows the price and number of shares
- **Trade Panel**: A panel on the right where you can place your own orders
  - Choose YES or NO
  - Set your price and number of shares
  - See a summary of cost, payout, and profit
  - Click "Place Order" to submit
- **Recent Trades**: A list of the latest trades that have executed, showing the price and size of each trade

### Leaderboard Page (/leaderboard)

The **Leaderboard** ranks all traders by their performance. This is where you can see who's winning and how you compare to other traders.

**What you'll see:**

- **Rankings table** with columns:
  - Rank (1st, 2nd, 3rd, etc.)
  - Username
  - Balance (current cash + value of positions)
  - P&L (Profit and Loss): How much they've made or lost
  - Trades: Number of trades they've placed
- **Badges**: Gold, silver, and bronze medals for the top 3 traders
- **Your position**: If you're logged in, your own ranking is highlighted

**How rankings work:**

Traders are ranked by their overall performance, which considers both their balance and their P&L. The best traders have high balances and positive P&L.

### Portfolio Page (/portfolio)

The **Portfolio** page is your personal trading dashboard. This is where you track your positions, balance, and performance.

**What you'll see:**

- **Summary cards** at the top:
  - **Balance**: Your available cash
  - **Unrealized P&L**: Paper profit/loss based on current market prices
  - **Realized P&L**: Actual profit/loss from resolved markets
- **Positions table**: Shows all markets where you currently hold shares
  - Market name
  - Side (YES or NO)
  - Number of shares
  - Average price you paid
  - Current market price
  - Unrealized P&L (how much you're up or down)
- **Open Orders**: Orders you've placed that haven't been matched yet

**Why this page is important:**

Your portfolio is where you monitor your trading performance and make decisions about which positions to adjust.

### Login/Signup Pages (/auth/...)

These pages handle account creation and login.

- **Signup page**: Create a new account with username, email, and password
- **Login page**: Sign in with your email and password
- **Logout**: Click "Logout" in the navigation bar to sign out

Once you're logged in, the navigation bar will show your username and balance.

---

## Understanding Market Cards

Each market is displayed as a card on the home page. Here's how to read them.

### Market Title

The title is the question being asked. For example:

- "Will BTC be above $110K by Dec 31, 2026?"
- "Will the EU pass comprehensive AI regulation by mid-2026?"

This is the event you're trading on. Read it carefully to understand exactly what you're betting on.

### Category Badge

In the top-right corner of each card, you'll see a colored badge indicating the category:

- **Crypto**: Blue badge
- **Politics**: Purple badge
- **Sports**: Orange badge
- **AI**: Green badge
- **Entertainment**: Pink badge

Categories help you quickly identify markets in topics you care about.

### YES and NO Probability Bars

Below the title, you'll see two horizontal bars:

- **Green bar (YES)**: Shows the probability of YES as a percentage
- **Red bar (NO)**: Shows the probability of NO as a percentage

**How to read them:**

- A **wider green bar** means YES is more likely (higher probability)
- A **wider red bar** means NO is more likely (lower probability)
- The bars always add up to 100%

For example:
- YES: 42% (green bar is 42% wide)
- NO: 58% (red bar is 58% wide)

### Volume

The **Volume** shows how much money has been traded in this market. For example, "Volume: $2,450" means traders have bought and sold a total of $2,450 worth of shares.

**Why volume matters:**

Higher volume usually means:
- More traders are interested in this market
- Prices are more reliable (more people agreeing on the probability)
- Your orders are more likely to get filled quickly

### Closing Date

The **"Closes"** date tells you when the market will be resolved. For example, "Closes: Dec 31, 2026" means the outcome will be determined on December 31, 2026.

**Why this matters:**

- Your money is locked up until the market resolves
- Markets that close sooner are less risky (less time for things to change)
- Markets that close far in the future are more speculative

---

## Understanding the Market Detail Page

When you click on a market, you'll see much more information. Here's what each section means.

### Probability Chart

At the top of the page, you'll see a large visual chart showing the current YES probability. For example, "42%" means the market thinks there's a 42% chance the event will happen.

**How to use it:**

Ask yourself: "Do I think the real probability is higher or lower than this?"

- If you think the real probability is **higher** than 42%, buy YES shares
- If you think the real probability is **lower** than 42%, buy NO shares

### Order Book

The **Order Book** shows all pending orders that traders have placed but haven't been matched yet.

You'll see two sections:

**YES Bids (green):**
These are orders from traders wanting to buy YES shares. Each order shows:
- **Price**: How much they're willing to pay per share
- **Size**: How many shares they want to buy

**NO Bids (red):**
These are orders from traders wanting to buy NO shares. Each order shows:
- **Price**: How much they're willing to pay per share
- **Size**: How many shares they want to buy

**How orders get matched:**

When a YES bid price + NO bid price add up to $1.00 or more, the orders can be matched. For example:
- Alice wants to buy YES at $0.60
- Bob wants to buy NO at $0.40
- Total: $1.00 — these orders match!

The trade executes, and both traders get their shares at the prices they specified.

**Why the order book is useful:**

- You can see what other traders think is a fair price
- You can see how much demand exists at different prices
- You can place orders slightly better than existing ones to get filled faster

### Trade Panel

The **Trade Panel** is where you place your own orders. It's located on the right side of the page.

Here's what you'll see:

1. **YES/NO toggle**: Choose whether you want to buy YES or NO shares
2. **Price field**: Enter the price you're willing to pay per share (between $0.01 and $0.99)
3. **Shares field**: Enter how many shares you want to buy
4. **Summary section**: Shows:
   - Total Cost: Price × Shares
   - Potential Payout: Shares × $1.00 (if you win)
   - Potential Profit: Payout - Cost
5. **Place Order button**: Click to submit your order

**Important notes:**

- Your order might execute immediately if there's a matching order on the other side
- If there's no match, your order will sit in the order book waiting for someone to take the other side
- You can see your open orders in your Portfolio page

### Recent Trades

At the bottom of the page, you'll see a list of the **Recent Trades** that have executed in this market.

Each trade shows:
- **Price**: What price the trade executed at
- **Size**: How many shares were traded
- **Time**: When the trade happened

**Why this is useful:**

Recent trades show you the "price action" — how the market is moving. If you see a lot of trades at $0.45, you know that's the current market price.

---

## How to Place a Trade (Step by Step)

Ready to place your first trade? Here's a detailed walkthrough of the entire process.

### Step 1: Navigate to a Market

Go to the home page and browse the markets. Click on any market that interests you. For this example, let's say you click on:

**"Will BTC be above $110K by Dec 31, 2026?"**

You're now on the Market Detail page.

### Step 2: Choose YES or NO

In the Trade Panel on the right side, you'll see a toggle with two options:

- **Buy Yes**: You think the event WILL happen
- **Buy No**: You think the event will NOT happen

For this example, let's say you believe Bitcoin will reach $110,000. Click **"Buy Yes"**.

### Step 3: Set Your Price

Now you need to decide how much you're willing to pay per share.

The current YES price is shown at the top of the trade panel (for example, $0.42). This is the market's current estimate.

**Your options:**

- **Pay the current market price** ($0.42): Your order will likely execute immediately because you're matching existing orders
- **Pay less than market price** (for example, $0.38): You might wait longer, but if your order fills, you'll get a better deal
- **Pay more than market price** (for example, $0.45): Your order will definitely execute fast, but you're paying a premium

For this example, let's say you're willing to pay the current price. Enter **0.42** in the Price field.

**Important:** The price must be between $0.01 and $0.99.

### Step 4: Set Your Shares

Now decide how many shares you want to buy.

Let's say you want to buy **100 shares**. Enter **100** in the Shares field.

### Step 5: Review the Summary

The Trade Panel will automatically calculate:

- **Total Cost**: 100 shares × $0.42 = $42.00
- **Potential Payout**: 100 shares × $1.00 = $100.00 (if YES wins)
- **Potential Profit**: $100.00 - $42.00 = $58.00

**Make sure you understand:**

- You're about to spend $42.00 from your balance
- If Bitcoin reaches $110K, you'll get $100.00 back (a $58 profit)
- If Bitcoin doesn't reach $110K, you'll get $0 (a $42 loss)

### Step 6: Place Your Order

If you're happy with the trade, click the **"Place Order"** button.

**What happens next depends on the order book:**

**Scenario A: Immediate Execution**

If there's a matching NO order on the other side (someone willing to buy NO at $0.58 or less), your order executes immediately.

You'll see:
- A success message confirming your trade
- Your balance decreases by $42.00
- The trade appears in the "Recent Trades" section
- Your position appears in your Portfolio

**Scenario B: Order Sits on the Book**

If there's no matching order, your order will be added to the order book as a pending order.

You'll see:
- A message saying your order was placed
- Your balance decreases by $42.00 (the money is reserved)
- Your order appears in the "Order Book" section
- Your order appears in your Portfolio under "Open Orders"

Later, when someone places a matching order, your order will execute automatically.

### Step 7: Check Your Portfolio

After placing your order, go to the **Portfolio** page to see your position.

You should see:
- Your balance has decreased by $42.00
- If your order executed, you'll see a position showing 100 YES shares in the Bitcoin market
- If your order is still pending, you'll see it under "Open Orders"

**Congratulations! You've just placed your first trade on Polycast!**

---

## Ten Hands-On Use Cases

The best way to learn Polycast is by doing. Here are ten practical use cases that will teach you how to use every feature of the app.

### Use Case 1: Browse and Explore Markets

**Goal:** Get familiar with the app and see what kinds of questions you can trade on.

**Steps:**

1. Visit the home page at http://localhost:3000
2. Look at the grid of market cards. Notice the different questions being asked.
3. Click the **"Crypto"** tab to see only cryptocurrency markets
4. Click the **"Politics"** tab to see political markets
5. Click the **"Sports"** tab to see sports markets
6. Click the **"AI"** tab to see artificial intelligence markets
7. Click the **"Entertainment"** tab to see entertainment and media markets
8. Click **"All"** to see all markets again

**What you'll notice:**

- Markets are sorted by trading volume (most active markets first)
- Each category has 3 markets
- The questions cover a wide range of topics and timeframes
- Some markets have high YES probabilities (like 72%), while others are very low (like 8%)

**What you learned:**

How to navigate the app and filter markets by category. You now know what kinds of questions are available to trade on.

---

### Use Case 2: Create Your Account

**Goal:** Set up your trading account and get your starting balance.

**Steps:**

1. Click the **"Sign up"** button in the top-right corner
2. Fill in the form:
   - **Username**: mytrader
   - **Email**: mytrader@example.com
   - **Password**: mypassword
3. Click **"Sign up"**
4. You'll be automatically logged in and redirected to the home page
5. Look at the navigation bar at the top — you should see your username and **"$1,000"** displayed

**What happened:**

- Your account was created in the database
- You were given $1,000 in play money automatically
- You're now logged in and ready to trade

**What you learned:**

Creating an account is quick and easy. You get $1,000 in virtual money to start trading immediately.

---

### Use Case 3: Place Your First YES Trade

**Goal:** Buy YES shares on a market where you believe the event will happen.

**Steps:**

1. Go to the home page and click on: **"Will the EU pass comprehensive AI regulation by mid-2026?"**
2. Look at the YES probability — it's around **72%**
3. This is a high-probability event. The market thinks it's very likely to happen.
4. In the Trade Panel, select **"Buy Yes"**
5. Set **Price** to **0.72** (the current market price)
6. Set **Shares** to **50**
7. Review the summary:
   - Total Cost: $36.00
   - Potential Payout: $50.00
   - Potential Profit: $14.00
8. Click **"Place Order"**
9. Your order should execute immediately (or very quickly)
10. Go to your **Portfolio** page to see your new position

**What happened:**

- You spent $36.00 to buy 50 YES shares
- If the EU passes AI regulation by mid-2026, you'll get $50.00 back (a $14 profit)
- If they don't, you'll get $0 (a $36 loss)
- Since the probability is 72%, you have a good chance of winning, but your profit is limited

**What you learned:**

Buying YES on a high-probability market is relatively safe, but the profit potential is limited. You're paying $0.72 for something that pays $1.00 — only a 39% return even if you win.

---

### Use Case 4: Place Your First NO Trade

**Goal:** Bet against something you think won't happen.

**Steps:**

1. Go to the home page and click on: **"Will a fully AI-generated film win a major festival award by 2027?"**
2. Look at the YES probability — it's around **12%**
3. This is a low-probability event. The market thinks it's unlikely to happen.
4. In the Trade Panel, select **"Buy No"**
5. Set **Price** to **0.88** (since YES is 0.12, NO is 0.88)
6. Set **Shares** to **50**
7. Review the summary:
   - Total Cost: $44.00
   - Potential Payout: $50.00
   - Potential Profit: $6.00
8. Click **"Place Order"**
9. Go to your **Portfolio** page to see your position

**What happened:**

- You spent $44.00 to buy 50 NO shares
- If an AI film does NOT win a major award by 2027, you'll get $50.00 back (a $6 profit)
- If an AI film does win, you'll get $0 (a $44 loss)
- Since the probability of YES is only 12%, you have an 88% chance of winning

**What you learned:**

Buying NO on a low-probability event is relatively safe, but the profit is very small. You're essentially collecting a small premium for taking on the unlikely risk. This is similar to "selling insurance."

---

### Use Case 5: Find a Bargain (Contrarian Trading)

**Goal:** Make a high-risk, high-reward bet by disagreeing with the market.

**Steps:**

1. Go to the home page and click on: **"Will ETH flip BTC in market cap by 2027?"**
2. Look at the YES probability — it's around **8%**
3. The market thinks this is very unlikely. But maybe you disagree!
4. In the Trade Panel, select **"Buy Yes"**
5. Set **Price** to **0.08**
6. Set **Shares** to **100**
7. Review the summary:
   - Total Cost: $8.00
   - Potential Payout: $100.00
   - Potential Profit: $92.00!
8. Click **"Place Order"**
9. Go to your **Portfolio** page

**What happened:**

- You spent only $8.00 to buy 100 YES shares
- If Ethereum does flip Bitcoin in market cap by 2027, you'll get $100.00 back (a $92 profit — that's an 1,150% return!)
- If it doesn't happen, you've only lost $8.00

**What you learned:**

Low-probability events offer huge potential returns, but they're unlikely to pay out. This is like buying a lottery ticket — you risk a small amount for a chance at a big win. These trades are called "contrarian" because you're betting against what the market thinks.

**When to do this:**

Only when you have special knowledge or insight that makes you think the market is wrong. Don't just buy random low-probability events hoping to get lucky!

---

### Use Case 6: Check Your Portfolio

**Goal:** See all your positions and understand your profit and loss.

**Steps:**

1. Click **"Portfolio"** in the navigation bar
2. Look at the three summary cards at the top:
   - **Balance**: How much cash you have left
   - **Unrealized P&L**: Your paper profit/loss based on current prices
   - **Realized P&L**: Actual profit/loss from markets that have resolved (should be $0 if no markets have resolved yet)
3. Scroll down to the **Positions** table
4. You should see three rows (from the trades you placed in Use Cases 3, 4, and 5):
   - EU AI regulation — 50 YES shares
   - AI film award — 50 NO shares
   - ETH flip BTC — 100 YES shares
5. For each position, look at:
   - **Shares**: How many shares you own
   - **Avg Price**: What you paid per share on average
   - **Current Price**: What the market price is now
   - **Unrealized P&L**: How much you're up or down (changes as prices move)

**What you see:**

Your balance is now around $912 (started with $1,000, spent $88 on trades).

Your positions show:
- EU AI regulation: 50 YES shares at $0.72 avg price
- AI film award: 50 NO shares at $0.88 avg price
- ETH flip BTC: 100 YES shares at $0.08 avg price

**What you learned:**

The Portfolio page is your dashboard for monitoring all your trading activity. Unrealized P&L shows how you're doing right now, but it's not locked in until markets resolve.

---

### Use Case 7: Compare Probabilities Across Categories

**Goal:** Understand how the market prices different types of events and find potentially mispriced markets.

**Steps:**

1. Go to the home page
2. Click the **"Crypto"** tab and note the YES probabilities:
   - BTC above $110K: ~42%
   - ETH flip BTC: ~8%
   - New Bitcoin legal tender: ~31%
3. Click the **"Politics"** tab and note the YES probabilities:
   - Government shutdown: ~55%
   - EU AI regulation: ~72%
   - Voter turnout above 68%: ~38%
4. Click the **"Sports"** tab:
   - Super Bowl viewers above 125M: ~65%
   - Sub-2-hour marathon: ~15%
   - US at least 45 Olympic golds: ~44%
5. Click the **"AI"** tab:
   - AI model >90% MMLU: ~58%
   - AI film wins festival: ~12%
   - AI-designed drug approved: ~28%
6. Click the **"Entertainment"** tab:
   - Streaming surpasses cable: ~81%
   - Indie game in top 10: ~22%
   - Major studio AI backlash: ~49%

**What you'll notice:**

- Markets with probabilities near **50%** are the most uncertain (like government shutdown at 55% or AI backlash at 49%)
- Markets with very high probabilities (like 72% or 81%) are considered "safe bets"
- Markets with very low probabilities (like 8% or 12%) are considered long shots

**What you learned:**

Markets near 50/50 are the most interesting to trade because there's genuine uncertainty. These are where you can potentially find the best opportunities if you have an informed opinion.

---

### Use Case 8: Understand the Order Book

**Goal:** Learn how the order book works and how trades get matched.

**Steps:**

1. Go to any market detail page (for example, "Will BTC be above $110K?")
2. Scroll down to the **Order Book** section
3. Look at the **YES Bids** (green section):
   - These are pending orders from people wanting to buy YES shares
   - Each row shows a **Price** and **Size** (number of shares)
   - For example, you might see: Price $0.40, Size 50
4. Look at the **NO Bids** (red section):
   - These are pending orders from people wanting to buy NO shares
   - For example: Price $0.58, Size 30

**How matching works:**

Let's say the order book shows:
- YES bid: $0.42 for 100 shares
- NO bid: $0.58 for 100 shares
- Total: $0.42 + $0.58 = $1.00

These orders match! Here's what happens:
- The person who wanted YES gets 100 YES shares at $0.42 (cost: $42)
- The person who wanted NO gets 100 NO shares at $0.58 (cost: $58)
- Total money: $42 + $58 = $100 (which will be paid out as $1 per share to whoever wins)

**If the order book shows:**
- YES bid: $0.38 for 50 shares
- NO bid: $0.55 for 50 shares
- Total: $0.38 + $0.55 = $0.93

These orders do NOT match (they add up to less than $1.00). Both orders will sit on the book waiting for someone else.

**What you learned:**

The order book shows supply and demand. Orders match when YES + NO prices add up to $1.00 or more. More orders at a price level = more liquidity and faster execution.

---

### Use Case 9: Check the Leaderboard

**Goal:** See who's winning and compare your performance to other traders.

**Steps:**

1. Click **"Leaderboard"** in the navigation bar
2. Look at the rankings table
3. You'll see columns:
   - **Rank**: Position (1st, 2nd, 3rd, etc.)
   - **Username**: Trader name
   - **Balance**: Current cash + value of positions
   - **P&L**: Total profit or loss
   - **Trades**: Number of trades placed
4. Notice the gold, silver, and bronze badges next to the top 3 traders
5. Find yourself in the rankings (if you've made trades, you should be on the list)

**What you'll see:**

Some traders have positive P&L (they're making money), while others have negative P&L (they're losing money). The top traders have made smart bets that paid off.

**What you learned:**

The leaderboard gives you a benchmark. If you're ranked highly, you're doing well! If you're near the bottom, you might want to rethink your trading strategy.

Trading is competitive — you're trying to be smarter than other traders about predicting the future.

---

### Use Case 10: Build a Diversified Portfolio

**Goal:** Spread your risk across multiple markets to reduce the impact of any single bad trade.

**Steps:**

1. Place small trades across different categories. Let's buy 20 shares in four different markets:

**Trade 1: Crypto**
- Market: "Will BTC be above $110K by Dec 31, 2026?"
- Buy: 20 YES shares at $0.42
- Cost: $8.40

**Trade 2: Politics**
- Market: "Will there be a US government shutdown before 2026?"
- Buy: 20 NO shares at $0.45
- Cost: $9.00

**Trade 3: AI**
- Market: "Will an AI model achieve >90% on MMLU by 2026?"
- Buy: 20 YES shares at $0.58
- Cost: $11.60

**Trade 4: Entertainment**
- Market: "Will streaming revenue surpass cable by 2026?"
- Buy: 20 YES shares at $0.81
- Cost: $16.20

2. Total invested: $8.40 + $9.00 + $11.60 + $16.20 = $45.20
3. Go to your **Portfolio** page
4. You should now see four different positions across four different categories

**What happened:**

Instead of putting all your money into one market, you've spread it across four different events in four different categories. This is called **diversification**.

**Why this matters:**

- If one trade loses, the others might win
- You're not dependent on a single outcome
- Your overall risk is lower

**What you learned:**

Diversifying across different categories reduces your risk. Professional traders rarely put all their money into one bet — they spread it across many bets to increase their chances of overall success.

---

### Use Case 11 (Bonus): Understanding Risk vs Reward

**Goal:** See how the price you pay affects your risk and profit potential.

**Scenario:**

Let's compare two different trades on the same market: "Will BTC be above $110K by Dec 31, 2026?"

**Trade A: Pay Market Price**
- Buy 100 YES shares at $0.42
- Cost: $42.00
- If you win: Get $100, profit = $58 (138% return)
- Your order will likely execute immediately

**Trade B: Try to Get a Better Price**
- Buy 100 YES shares at $0.30
- Cost: $30.00
- If you win: Get $100, profit = $70 (233% return)
- Your order might NOT execute (it might sit on the book forever)

**The tradeoff:**

Trade B has better profit potential ($70 vs $58), BUT it's much harder to get filled. The market currently thinks 42% is the fair probability. Finding someone willing to sell at 30% (implying only 30% probability) is difficult.

You might place your order and wait days without it filling. Meanwhile, you've tied up $30 of your capital in a pending order.

**What you learned:**

Lower buy prices mean more profit potential, but less certainty of execution. You need to balance:
- **Price**: How much you pay (lower is better for profit)
- **Execution**: How likely your order is to fill (paying market price is faster)

This is one of the core tradeoffs in trading.

---

### Use Case 12 (Bonus): Log Out and Log Back In

**Goal:** Verify that your account data persists across sessions.

**Steps:**

1. Go to your **Portfolio** page
2. Note your current balance and the positions you hold
3. Click **"Logout"** in the navigation bar
4. You'll be logged out and redirected to the home page
5. Notice that "Sign up" and "Login" buttons have reappeared
6. Click **"Login"**
7. Enter your email and password from earlier (mytrader@example.com / mypassword)
8. Click **"Login"**
9. You're now logged back in
10. Go to your **Portfolio** page

**What you see:**

All your data is still there! Your balance, positions, and open orders are exactly as you left them.

**What you learned:**

Your account data is stored in a database and persists across sessions. You can log out and come back anytime — your trades and balance will still be there.

---

## Understanding Your Portfolio

Your Portfolio page is the most important page in the app. Here's a detailed breakdown of every element.

### Summary Cards

At the top of the Portfolio page, you'll see three cards:

**1. Balance**

This shows your **available cash** — money you can use to place new trades.

- You started with $1,000
- When you buy shares, your balance decreases by the cost
- When markets resolve in your favor, your balance increases by the payout
- When you cancel open orders, the reserved money returns to your balance

**2. Unrealized P&L (Profit and Loss)**

This shows your **paper profit or loss** based on current market prices. It's called "unrealized" because it's not locked in yet — the prices might change.

**How it's calculated:**

For each position you hold, the unrealized P&L is:
- (Current market price - Your average purchase price) × Number of shares

**Example:**

You bought 100 YES shares at $0.42. The current YES price is now $0.50.
- Unrealized P&L = ($0.50 - $0.42) × 100 = $8.00

You're "up" $8, but you haven't actually made that money yet. If the price drops back to $0.42, your unrealized P&L goes back to $0.

**3. Realized P&L**

This shows your **actual profit or loss** from markets that have already resolved. This is locked in — it's real money you've made or lost.

**Example:**

You bought 100 YES shares at $0.42 (cost: $42). The market resolved as YES, so you received $100. Your realized P&L for this market is $100 - $42 = $58 profit.

Realized P&L only changes when markets close and are resolved.

### Positions Table

The Positions table shows all the markets where you currently hold shares.

**Columns:**

- **Market**: The name of the market
- **Side**: Whether you hold YES or NO shares
- **Shares**: How many shares you own
- **Avg Price**: The average price you paid per share (if you made multiple purchases at different prices, this is the weighted average)
- **Current Price**: What the current market price is
- **Unrealized P&L**: How much you're up or down based on current prices

**Example row:**

| Market | Side | Shares | Avg Price | Current Price | Unrealized P&L |
|--------|------|--------|-----------|---------------|----------------|
| Will BTC be above $110K? | YES | 100 | $0.42 | $0.45 | +$3.00 |

This means:
- You own 100 YES shares
- You paid an average of $0.42 per share (total cost: $42)
- The current YES price is $0.45
- If you could sell right now, you'd make a $3 profit

### Open Orders

The Open Orders section shows orders you've placed that haven't been matched yet.

**Example:**

You placed an order to buy 50 YES shares at $0.35, but the current market price is $0.42. Your order is sitting on the book waiting for the price to drop to $0.35.

**What you can do:**

- **Wait**: Your order might eventually fill if the price moves in your direction
- **Cancel**: You can cancel the order and get your reserved money back to your balance

---

## Tips for New Traders

Ready to start trading seriously? Here are some tips to help you succeed.

### 1. Start Small

When you're first learning, place small trades ($5-$20) to get a feel for how the mechanics work. Don't risk your entire $1,000 balance on your first trade!

**Why:** You'll make mistakes as you learn. Small trades let you learn cheaply.

### 2. Diversify Your Portfolio

Don't put all your money into one market. Spread it across 5-10 different markets in different categories.

**Why:** If one trade goes wrong, you won't lose everything.

### 3. Think in Probabilities

The YES price represents the market's probability estimate. A YES price of $0.60 means the market thinks there's a 60% chance.

**Ask yourself:** Do I think the real probability is higher or lower than this?

- If you think the probability is **higher** than 60%, buy YES
- If you think the probability is **lower** than 60%, buy NO

### 4. Look for Mispriced Markets

The best trades are when you disagree with the market and you're right.

**Example:** The market says there's a 20% chance of something happening, but you think it's more like 40%. Buy YES shares!

### 5. Markets Near 50% Are the Most Interesting

Markets with YES prices around $0.45 - $0.55 are the most uncertain. These are where informed opinions can make the biggest difference.

**Why:** When the market is very confident (like 85% YES), it's hard to find mispricing. But when it's close to 50/50, there's genuine uncertainty.

### 6. Understand Your Risk Tolerance

**Safe trades:** High-probability markets (YES price above 70% or below 30%)
- Lower profit potential
- Higher chance of winning
- Example: Buy YES at 72% — even if you win, you only make 39% profit

**Risky trades:** Low-probability markets (YES price below 20%)
- Huge profit potential
- Low chance of winning
- Example: Buy YES at 8% — if you win, you make 1,150% profit!

**Decide:** Do you want to make small, steady profits or go for big wins with higher risk?

### 7. Check the Leaderboard for Inspiration

See what successful traders are doing. If someone has high positive P&L, they're doing something right!

### 8. Don't Chase Losses

If you make a bad trade and lose money, don't immediately place a huge risky trade to "make it back." This usually leads to bigger losses.

**Better approach:** Take a break, analyze what went wrong, and make a thoughtful trade later.

### 9. Read the Market Carefully

Make sure you understand exactly what the question is asking.

**Example:** "Will BTC be above $110K **by Dec 31, 2026**?"

This means Bitcoin needs to hit $110K at any point before or on December 31, 2026. It doesn't need to stay above $110K — even one second above counts as YES.

### 10. Markets Take Time to Resolve

Remember that your money is locked up until the market closes and is resolved. Don't invest money you might need for other trades!

---

## Frequently Asked Questions

### General Questions

**Q: Is this real money?**

No! Polycast uses play money. Everyone starts with $1,000 in virtual currency. You can't lose real money, and you can't cash out for real money. This is a learning and simulation environment.

---

**Q: How do I make money?**

You make money by predicting correctly. Buy shares at a low price, and if you're right, you get $1.00 per share when the market resolves. Your profit is the difference between $1.00 and what you paid.

---

**Q: What happens when a market resolves?**

When the closing date arrives, someone (usually an administrator) determines the outcome (YES or NO). If the outcome is YES:
- Everyone holding YES shares gets $1.00 per share
- Everyone holding NO shares gets $0

If the outcome is NO, it's reversed.

The money is added to your balance automatically.

---

**Q: Can I cancel an order?**

Yes, if your order hasn't been matched yet, it will appear in your Portfolio under "Open Orders" with a cancel button. Click it to cancel the order and get your money back.

---

**Q: What does the percentage mean?**

The YES percentage is the market's collective estimate of the probability that the event will happen. A YES price of $0.65 = 65% probability.

---

**Q: Why can't I trade?**

You need to be logged in to place trades. If you're not logged in, click "Sign up" to create an account or "Login" if you already have one.

---

**Q: What is volume?**

Volume is the total dollar amount that has been traded in a market. For example, if the volume is $2,500, it means traders have bought and sold a combined total of $2,500 worth of shares.

Higher volume usually means more interest and more reliable prices.

---

**Q: What is P&L?**

P&L stands for "Profit and Loss" — it's how much money you've made or lost.

- **Unrealized P&L**: Paper profit/loss based on current prices (not locked in)
- **Realized P&L**: Actual profit/loss from resolved markets (locked in)

---

**Q: What is unrealized P&L?**

Unrealized P&L is your "paper profit" — how much you're up or down based on current market prices. It's not real yet because prices can change and markets haven't resolved.

**Example:** You bought YES at $0.40, and the current price is $0.50. You're "up" $0.10 per share, but you haven't actually made that money until the market resolves.

---

**Q: What is realized P&L?**

Realized P&L is your actual profit or loss from markets that have already closed and been resolved. This is real, locked-in money.

**Example:** You bought YES at $0.40 for $40 total. The market resolved as YES, so you got $100. Your realized P&L is $60 profit.

---

**Q: What does 'partial fill' mean for an order?**

If you place an order for 100 shares but only 50 shares get matched, you have a "partial fill." 50 shares executed, and the remaining 50 are still on the order book waiting.

---

**Q: Why didn't my order execute?**

Your order only executes if there's a matching order on the other side. If you want to buy YES at $0.35 but everyone else is only willing to sell at $0.42, your order sits on the book waiting.

**To get faster execution:** Pay a price closer to the current market price.

---

**Q: What are the categories?**

There are five categories:
1. **Crypto**: Cryptocurrency markets (Bitcoin, Ethereum, etc.)
2. **Politics**: Political events (elections, legislation, etc.)
3. **Sports**: Sports outcomes (championships, records, etc.)
4. **AI**: Artificial intelligence developments
5. **Entertainment**: Movies, TV, streaming, and media

---

**Q: How many markets are there?**

The app comes with **15 pre-loaded markets** across the five categories (3 markets per category).

---

**Q: Can I create my own markets?**

Yes! If you're logged in, you can create markets using the API. This is an advanced feature — check the Developer Guide for details.

---

**Q: What happens to my money if I log out?**

Nothing! Your balance, positions, and orders are all saved in the database. When you log back in, everything will be exactly as you left it.

---

**Q: Can I sell my shares before the market resolves?**

Not directly, but you can effectively "exit" a position by placing the opposite trade. For example, if you hold 100 YES shares, you can buy 100 NO shares to hedge your position.

(Note: The current version doesn't have a direct "sell" feature, but this is a common request for future updates!)

---

**Q: What if I run out of money?**

If you lose all your play money, you'll need to create a new account or wait for the administrator to reset your balance. Trade carefully!

---

**Q: How are markets resolved?**

When the closing date arrives, an administrator checks the real-world outcome and marks the market as resolved with the outcome (YES or NO). Winners get paid automatically.

---

**Q: Is my password secure?**

Yes, passwords are hashed using industry-standard encryption before being stored in the database. Even the administrators can't see your actual password.

---

**Q: Can I change my username or email?**

Not currently, but this is a potential future feature. For now, choose carefully when you sign up!

---

## Conclusion

Congratulations! You now know how to use Polycast.

**You've learned:**
- What prediction markets are and how they work
- How to create an account and get your starting balance
- How to navigate the app and find markets
- How to read market cards and detail pages
- How to place YES and NO trades
- How to manage your portfolio
- How to interpret probabilities and make smart trades
- 12 hands-on use cases to practice with

**What's next?**

1. **Start trading!** Put what you've learned into practice
2. **Experiment with different strategies** — try safe trades and risky trades
3. **Track your performance** on the leaderboard
4. **Learn from your mistakes** — not every trade will be a winner
5. **Have fun!** Prediction markets are a great way to test your knowledge and judgment

Remember: This is play money, so don't be afraid to experiment. The best way to learn is by doing.

**Happy trading!**

---

*Last updated: February 7, 2026*
*Polycast version: 1.0*
*For technical documentation, see the Developer Guide.*

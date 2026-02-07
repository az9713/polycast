# Prediction Markets: Zero to Hero Tutorial

A hands-on tutorial that teaches you what prediction markets are, how they work, and how to trade like a pro using the Polycast application. No prior knowledge required.

---

## Table of Contents

- [Part I: What Is a Prediction Market?](#part-i-what-is-a-prediction-market)
  - [The Core Idea](#the-core-idea)
  - [How Prices Work](#how-prices-work)
  - [How You Make (or Lose) Money](#how-you-make-or-lose-money)
  - [What Is an Order Book?](#what-is-an-order-book)
  - [Why Prediction Markets Matter](#why-prediction-markets-matter)
- [Part II: Getting Started](#part-ii-getting-started)
  - [Starting the Application](#starting-the-application)
  - [What You See on First Load](#what-you-see-on-first-load)
- [Workflow 1: Your First Trade — Betting on What You Believe](#workflow-1-your-first-trade--betting-on-what-you-believe)
- [Workflow 2: The Counterparty — Making a Trade Actually Execute](#workflow-2-the-counterparty--making-a-trade-actually-execute)
- [Workflow 3: The Contrarian — Profiting by Betting Against the Crowd](#workflow-3-the-contrarian--profiting-by-betting-against-the-crowd)
- [Workflow 4: The Market Maker — Earning the Spread](#workflow-4-the-market-maker--earning-the-spread)
- [Workflow 5: Portfolio Strategy — Diversifying Across Markets](#workflow-5-portfolio-strategy--diversifying-across-markets)
- [Part III: Concepts That Make You Dangerous](#part-iii-concepts-that-make-you-dangerous)
  - [Reading the Order Book Like a Pro](#reading-the-order-book-like-a-pro)
  - [Understanding P&L](#understanding-pl)
  - [Common Mistakes Beginners Make](#common-mistakes-beginners-make)
  - [Strategy Cheat Sheet](#strategy-cheat-sheet)
- [Quick Reference Card](#quick-reference-card)

---

## Part I: What Is a Prediction Market?

### The Core Idea

Imagine you could bet on whether something will happen — not sports betting, but anything: "Will Bitcoin hit $110K this year?", "Will the EU pass AI regulation?", "Will an AI-generated film win a festival award?"

That is a prediction market. People trade on the outcomes of real-world events.

Here is the simplest way to think about it:

- A prediction market asks a **YES or NO question** about the future.
- You can buy **YES shares** (you believe it WILL happen) or **NO shares** (you believe it WON'T happen).
- If you are right, each share pays you **$1.00**.
- If you are wrong, each share pays you **$0.00**.
- You always pay LESS than $1.00 per share — the difference is your potential profit.

**Real-world analogy:** Think of it like buying a lottery ticket, except the "lottery" is whether a real event happens, and the ticket price reflects how likely people think it is.

### How Prices Work

Every market has two prices that always add up to $1.00:

```
YES price + NO price = $1.00    (always)
```

The YES price is the market's estimate of the probability that the event will happen.

| YES Price | NO Price | What the Market Thinks |
|-----------|----------|----------------------|
| $0.80 | $0.20 | "80% likely to happen" |
| $0.50 | $0.50 | "Coin flip — nobody knows" |
| $0.15 | $0.85 | "Only 15% chance" |
| $0.42 | $0.58 | "Unlikely but possible" |

**Key insight:** The price IS the probability. A YES price of $0.65 means the market collectively thinks there is a 65% chance of YES.

### How You Make (or Lose) Money

Let's walk through a concrete example:

**The market:** "Will BTC be above $110K by Dec 31, 2026?"
**Current YES price:** $0.42 (market thinks 42% chance)

**Scenario A: You buy YES at $0.42**

You buy 100 YES shares. Cost: 100 x $0.42 = **$42.00**

- If BTC goes above $110K (YES wins): You get 100 x $1.00 = $100.00. **Profit: $58.00**
- If BTC stays below $110K (NO wins): You get 100 x $0.00 = $0.00. **Loss: $42.00**

**Scenario B: You buy NO at $0.58**

You buy 100 NO shares. Cost: 100 x $0.58 = **$58.00**

- If BTC stays below $110K (NO wins): You get 100 x $1.00 = $100.00. **Profit: $42.00**
- If BTC goes above $110K (YES wins): You get 100 x $0.00 = $0.00. **Loss: $58.00**

Notice the relationship:
- **Buying YES is cheap when the market thinks it's unlikely** (high potential profit, but higher risk of losing)
- **Buying NO is cheap when the market thinks it's likely** (you're betting against the consensus)

### What Is an Order Book?

You don't buy shares from a vending machine. You buy them from OTHER PEOPLE.

An **order book** is a list of all the buy orders waiting to be matched. Think of it like a marketplace:

```
=== YES Side ===           === NO Side ===
65¢ — 50 shares            45¢ — 30 shares
60¢ — 100 shares           40¢ — 80 shares
55¢ — 25 shares            35¢ — 60 shares
```

When does a trade happen? When a YES buyer and a NO buyer agree on a combined price of $1.00 or more.

**Example:**
- Alice places: "Buy 10 YES shares at $0.60"
- Bob places: "Buy 10 NO shares at $0.40"
- The system sees: $0.60 + $0.40 = $1.00. **Match!**
- Alice gets 10 YES shares, Bob gets 10 NO shares, a trade is recorded.

If the prices don't add up to $1.00 or more, both orders sit on the book waiting.

**Example of NO match:**
- Alice places: "Buy 10 YES at $0.50"
- Bob places: "Buy 10 NO at $0.40"
- The system sees: $0.50 + $0.40 = $0.90. **No match.** Both orders wait.

### Why Prediction Markets Matter

Prediction markets are not just gambling. They are **information aggregation machines**.

When real money is on the line, people have a financial incentive to be right. Prices quickly absorb news, expert opinions, and insider knowledge. Academic research has shown that prediction markets are often more accurate than polls, pundits, and expert panels.

Polymarket (the real platform this app is based on) handled billions of dollars in trading volume during the 2024 US presidential election and was more accurate than most major polling organizations.

---

## Part II: Getting Started

### Starting the Application

Open your terminal and run:

```bash
cd polycast
npm install        # Only needed the first time
npm run dev        # Starts the app
```

Open your browser to **http://localhost:3000**.

The database is created and seeded automatically on first load. You will see 15 markets across 5 categories and 10 pre-populated traders on the leaderboard.

### What You See on First Load

**Home page (http://localhost:3000):**
- A grid of **market cards**, each showing a YES/NO question
- **Category tabs** at the top: All, Crypto, Politics, Sports, AI, Entertainment
- Each card shows: the question, the category badge, YES/NO percentages, and trading volume

**What the cards tell you at a glance:**
- A market showing "YES 42% / NO 58%" means the crowd thinks there's a 42% chance of YES
- Higher volume = more people have traded = the price signal is more reliable
- The category badge helps you find markets in your area of expertise

You can browse and read markets without an account. But to trade, you need to sign up.

---

## Workflow 1: Your First Trade — Betting on What You Believe

### What This Workflow Does

You will create an account, analyze a market, and place your first YES trade. This teaches the core mechanics: how to read a market, what the numbers mean, and how to place an order.

### Why This Matters

Every prediction market trader starts here. Before you can do anything fancy, you need to understand the basic cycle: read a market, form an opinion, place an order, and track your position.

### Step-by-Step

**Step 1: Create your account**

1. Click **"Sign up"** in the top-right corner of the page
2. Enter a username (3+ characters), email, and password (6+ characters)
3. Click **"Sign up"**
4. You now have an account with **$1,000 in play money**

You are automatically logged in. Your username appears in the top-right corner.

**Step 2: Find a market you have an opinion about**

1. On the home page, click the **"AI"** category tab
2. Look at the three AI markets. Let's pick: **"Will an AI model score >90% on all MMLU categories?"**
3. Notice the current price: **YES 58%**. The crowd thinks there's a 58% chance this will happen.
4. Click on the market card to open the detail page.

**Step 3: Read the market detail page**

On the market detail page, you see:

- **Title and description:** The exact question and resolution criteria
- **Probability bar:** A visual representation of YES 58% / NO 42%
- **Order Book:** Two columns showing existing buy orders on each side (may be empty if no one has placed orders yet)
- **Trade Panel:** The form on the right where you place orders
- **Market metadata:** Resolution source (Papers with Code), resolution date, trading volume

**Step 4: Decide your position**

Ask yourself: "Do I think an AI model will score >90% on ALL MMLU categories by end of 2026?"

Let's say you believe **YES** — you think AI progress is fast enough.

The current YES price is $0.58. This means:
- **Cost per share:** $0.58
- **Payout if right:** $1.00 per share
- **Profit per share:** $0.42 (that's a 72% return on investment!)
- **Risk if wrong:** You lose your $0.58 per share

**Step 5: Place your order**

1. In the Trade Panel on the right:
   - **"Buy Yes"** should already be selected (highlighted in green)
   - **Price** is pre-filled with `0.58` (the current market price)
   - Enter **Shares:** `50`

2. Look at the cost breakdown that appears:
   - **Total Cost:** $29.00 (50 shares x $0.58)
   - **Potential Payout:** $50.00 (50 shares x $1.00)
   - **Potential Profit:** $21.00

3. Click **"Place Order"**

4. You should see a green success message: **"Order placed successfully!"**

**Step 6: Understand what just happened**

Your order is now sitting on the order book. Here's what happened behind the scenes:

1. Your balance was debited: $1,000 - $29.00 = **$971.00**
2. The system created a limit order: "Buy 50 YES shares at $0.58"
3. The system checked: is there anyone selling NO at $0.42 or higher? (Because $0.58 + $0.42 = $1.00)
4. If yes: your order matches and you get shares immediately
5. If no: your order sits on the YES side of the order book, waiting for someone to place a matching NO order

**Step 7: Check your portfolio**

1. Click **"Portfolio"** in the top navigation bar
2. You will see one of two things:
   - **If your order matched:** Your positions table shows 50 YES shares in this market, with your average price and unrealized P&L
   - **If your order is waiting:** Your Open Orders table shows your pending order with status "open"

3. Check your balance at the top. It should show approximately $971.00.

**What you learned:**
- How to read a market and what the price/percentage means
- The relationship between price, cost, payout, and profit
- How orders go onto the book and wait for a counterparty
- How to check your portfolio and see your positions

---

## Workflow 2: The Counterparty — Making a Trade Actually Execute

### What This Workflow Does

You will create a second account using `curl` commands, and use it to place the opposite side of a trade. This makes the matching engine execute and creates an actual filled trade. You'll see both sides of the transaction and understand how counterparties work.

### Why This Matters

In Workflow 1, your order may have just sat on the book. In real markets, orders need counterparties. This workflow shows you the full lifecycle of a trade: two people with opposite opinions, a match, and resulting positions for both. This is the heartbeat of every prediction market.

### Step-by-Step

**Step 1: Note the market and your existing order**

From Workflow 1, you placed a YES order at $0.58 for 50 shares on the MMLU market. Let's find the market ID.

Open a new terminal window (keep the app running in the first one):

```bash
curl -s http://localhost:3000/api/markets?category=ai | python3 -c "
import sys, json
markets = json.load(sys.stdin)
for m in markets:
    print(f'{m[\"id\"][:8]}...  YES:{m[\"yes_price\"]}  {m[\"title\"][:50]}')"
```

(On Windows without python3, you can use `curl http://localhost:3000/api/markets?category=ai` and find the `id` of the MMLU market in the JSON output.)

Copy the full market ID of the MMLU market. We'll call it `MARKET_ID` below.

**Step 2: Create a second trader account**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"counter_trader","email":"counter@test.com","password":"password123"}' \
  -c counter_cookies.txt
```

This creates a second account with $1,000 and saves the auth cookie to `counter_cookies.txt`.

**Step 3: Place the opposite order**

Your first account bought YES at $0.58. For a match, the second account needs to buy NO at $0.42 or higher (because $0.58 + $0.42 = $1.00).

```bash
curl -X POST "http://localhost:3000/api/markets/MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b counter_cookies.txt \
  -d '{"side":"no","type":"limit","price":0.42,"quantity":50}'
```

Replace `MARKET_ID` with the actual ID you copied.

**Step 4: Check the response**

The response will look something like:

```json
{
  "order": {
    "side": "no",
    "price": 0.42,
    "quantity": 50,
    "filled_quantity": 50,
    "status": "filled"
  },
  "trades": [
    {
      "price": 0.58,
      "quantity": 50
    }
  ],
  "tradesCount": 1
}
```

**The trade executed!** Notice:
- `filled_quantity: 50` — all 50 shares were filled
- `status: "filled"` — the order is complete
- `tradesCount: 1` — one trade was generated
- `trades[0].price: 0.58` — the trade executed at the YES price of $0.58

**Step 5: Check both portfolios**

Check the second trader's portfolio:

```bash
curl -s http://localhost:3000/api/portfolio -b counter_cookies.txt | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'Balance: \${d[\"balance\"]:.2f}')
for p in d['positions']:
    print(f'  {p[\"side\"].upper()} {p[\"shares\"]} shares @ \${p[\"avg_price\"]:.2f} — P&L: \${p[\"unrealized_pnl\"]:.2f}')"
```

Expected output:
```
Balance: $979.00
  NO 50 shares @ $0.42 — P&L: $0.00
```

Now go back to your browser and refresh the Portfolio page for your first account. You should see:
- **Balance:** ~$971.00
- **Position:** YES 50 shares at $0.58 avg price

**Step 6: Understand the trade**

Here's what happened:

| | Your Account (YES buyer) | counter_trader (NO buyer) |
|---|---|---|
| **Belief** | AI will score >90% | AI won't score >90% |
| **Action** | Buy 50 YES at $0.58 | Buy 50 NO at $0.42 |
| **Cost** | $29.00 (50 x $0.58) | $21.00 (50 x $0.42) |
| **Total in pot** | $29.00 + $21.00 = **$50.00** | |
| **If YES wins** | Gets $50.00 (profit: $21.00) | Gets $0.00 (loss: $21.00) |
| **If NO wins** | Gets $0.00 (loss: $29.00) | Gets $50.00 (profit: $29.00) |

The $50.00 in the pot is exactly 50 shares x $1.00. One side wins it all, the other side loses their bet. This is why it's called a "binary" market.

**Step 7: Check the market detail page**

Go back to the market detail page in your browser and refresh. You should now see:
- **Recent Trades** section showing the trade that just executed (50 shares at 58¢)
- The order book should show your orders as filled (removed from the book)

**What you learned:**
- Trades require two people with opposite opinions
- The matching rule: YES price + NO price >= $1.00
- Both sides pay less than $1.00 combined — the $1.00 goes to whoever is right
- How to verify trades executed by checking portfolios

---

## Workflow 3: The Contrarian — Profiting by Betting Against the Crowd

### What This Workflow Does

You will find a market where the crowd has a strong opinion and bet AGAINST them. Specifically, you'll buy NO shares on a market where YES is trading high. This teaches you contrarian thinking and shows that the most profitable trades come from correctly disagreeing with the consensus.

### Why This Matters

The biggest profits in prediction markets come from buying cheap. NO shares are cheap when most people think YES will happen. If you are right and the crowd is wrong, you earn a massive return. This is the same principle that makes Warren Buffett's famous advice work: "Be fearful when others are greedy."

### Step-by-Step

**Step 1: Find a market where the crowd has a strong opinion**

Go to the home page and look for markets with high YES percentages. These are the ones where the crowd is very confident. Look at these seeded markets:

| Market | YES Price | What the Crowd Thinks |
|--------|-----------|----------------------|
| "Will streaming surpass cable TV worldwide by 2027?" | 81% | Almost certain YES |
| "Will the EU pass comprehensive AI regulation?" | 72% | Very likely YES |
| "Will the Super Bowl have over 120M viewers?" | 65% | Likely YES |

Let's pick **"Will streaming surpass cable TV subscribers worldwide by 2027?"** at **YES 81%**.

Click on this market card in the **Entertainment** category.

**Step 2: Analyze the contrarian opportunity**

The crowd says 81% chance. But you think cable companies and bundling deals will keep cable relevant longer than people expect. You want to bet NO.

Look at the economics:

| | Buying YES (with the crowd) | Buying NO (against the crowd) |
|---|---|---|
| **Price per share** | $0.81 | $0.19 |
| **Cost for 100 shares** | $81.00 | $19.00 |
| **Payout if right** | $100.00 | $100.00 |
| **Profit if right** | $19.00 (23% return) | $81.00 (426% return!) |
| **Loss if wrong** | $81.00 | $19.00 |

The contrarian bet has a much higher potential return (426% vs 23%) and a much lower maximum loss ($19 vs $81). The tradeoff? The crowd thinks you're probably wrong.

**Step 3: Place the contrarian NO trade**

1. In the Trade Panel, click **"Buy No"** (the red button)
2. Notice the price automatically changes to `0.19` (the NO price)
3. Enter **Shares:** `100`
4. Review the cost breakdown:
   - **Total Cost:** $19.00
   - **Potential Payout:** $100.00
   - **Potential Profit:** $81.00
5. Click **"Place Order"**

**Step 4: Create a counterparty to fill the trade**

In your terminal, use the second account to buy YES at $0.81:

```bash
# First get the market ID for the streaming market
curl -s http://localhost:3000/api/markets?category=entertainment

# Then place the opposite order (replace MARKET_ID)
curl -X POST "http://localhost:3000/api/markets/MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b counter_cookies.txt \
  -d '{"side":"yes","type":"limit","price":0.81,"quantity":100}'
```

**Step 5: Check the result**

Go to your Portfolio page. You should now see:

- A new position: **NO 100 shares** on the streaming market
- Average price: $0.19
- Current price: $0.19 (just traded, so current = entry)
- Unrealized P&L: $0.00 (hasn't moved yet)

Your balance dropped by $19.00 for this trade.

**Step 6: Understand the contrarian payoff**

If the market eventually resolves NO (streaming does NOT surpass cable):
- Your 100 NO shares are each worth $1.00
- You get $100.00 back
- You spent $19.00
- **Net profit: $81.00 — a 426% return**

If the market resolves YES (streaming DOES surpass cable):
- Your 100 NO shares are each worth $0.00
- **Net loss: $19.00**

This is the risk/reward tradeoff of contrarian betting. You don't need to be right often — you just need to be right when the payout is huge.

**What you learned:**
- How to buy NO shares and what it means to bet against the crowd
- The math of contrarian investing: cheap entry, massive potential return
- Why high-confidence markets are the most interesting for contrarians
- The risk/reward tradeoff: low probability of winning but huge payout if you do

---

## Workflow 4: The Market Maker — Earning the Spread

### What This Workflow Does

You will place orders on BOTH sides of a market — buying YES at a low price and buying NO at a low price — so that the combined cost is LESS than $1.00. If both orders fill, you lock in a guaranteed profit regardless of the outcome. This is called **market making**.

### Why This Matters

Market makers are the backbone of every financial market. They provide liquidity (make it possible for others to trade) and earn a small profit for doing so. Understanding market making teaches you the deepest concept in prediction markets: you don't have to predict the future to make money. You just have to set your prices right.

On real platforms like Polymarket, sophisticated traders use algorithms to make markets. Here, you'll do it by hand to understand the mechanics.

### Step-by-Step

**Step 1: Choose a market**

Let's use: **"Will OpenAI or Anthropic IPO by end of 2026?"** (AI category, YES 35%)

Click into this market from the home page.

**Step 2: Understand the spread opportunity**

The current YES price is $0.35, which means the NO price is $0.65.

As a market maker, you want to:
- Buy YES at a price BELOW the current price
- Buy NO at a price BELOW the current NO price
- Make sure: your_YES_price + your_NO_price < $1.00

If both fill, no matter what happens, you spend less than $1.00 and receive exactly $1.00 per share.

Here's the plan:

| Order | Side | Price | Per-Share Cost |
|-------|------|-------|---------------|
| Order A | Buy YES | $0.30 | $0.30 |
| Order B | Buy NO | $0.60 | $0.60 |
| **Combined** | | | **$0.90** |

If both fill, you pay $0.90 per share-pair and receive $1.00 when the market resolves (one side wins). **Guaranteed profit: $0.10 per share, or an 11% return.**

**Step 3: Place the YES side**

1. In the Trade Panel, make sure **"Buy Yes"** is selected
2. Change the **Price** to `0.30` (below the market's current 0.35)
3. Enter **Shares:** `50`
4. Review: Total Cost $15.00
5. Click **"Place Order"**

This order sits on the book. It will fill when someone buys NO at $0.70 or higher (because $0.30 + $0.70 = $1.00).

**Step 4: Place the NO side**

1. Click **"Buy No"**
2. Change the **Price** to `0.60` (below the market's current 0.65)
3. Enter **Shares:** `50`
4. Review: Total Cost $30.00
5. Click **"Place Order"**

This order sits on the book. It will fill when someone buys YES at $0.40 or higher.

**Step 5: Check the order book**

Look at the Order Book section on the left side of the page. You should now see:

```
=== YES Bids ===           === NO Bids ===
30¢ — 50 shares            60¢ — 50 shares
```

Your orders are providing liquidity to the market. Anyone who comes along wanting to trade can fill against your orders.

**Step 6: Fill the orders with counterparties**

In your terminal, use the second account to fill both sides:

```bash
# Fill the YES side: counter_trader buys NO at 0.70 (matches your YES at 0.30)
curl -X POST "http://localhost:3000/api/markets/MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b counter_cookies.txt \
  -d '{"side":"no","type":"limit","price":0.70,"quantity":50}'

# Fill the NO side: counter_trader buys YES at 0.40 (matches your NO at 0.60)
curl -X POST "http://localhost:3000/api/markets/MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b counter_cookies.txt \
  -d '{"side":"yes","type":"limit","price":0.40,"quantity":50}'
```

**Step 7: Check your portfolio**

Go to your Portfolio page. You should now see TWO positions on the same market:

| Position | Side | Shares | Avg Price |
|----------|------|--------|-----------|
| Position 1 | YES | 50 | $0.30 |
| Position 2 | NO | 50 | $0.60 |

**Total cost:** $15.00 + $30.00 = **$45.00**

**Step 8: Understand the guaranteed payoff**

No matter what happens when the market resolves:

**If the market resolves YES:**
- Your 50 YES shares pay: 50 x $1.00 = $50.00
- Your 50 NO shares pay: 50 x $0.00 = $0.00
- **Total received: $50.00. Cost was $45.00. Profit: $5.00**

**If the market resolves NO:**
- Your 50 YES shares pay: 50 x $0.00 = $0.00
- Your 50 NO shares pay: 50 x $1.00 = $50.00
- **Total received: $50.00. Cost was $45.00. Profit: $5.00**

**Either way, you profit $5.00.** That's $0.10 per share-pair, or an 11% return on your $45.00 investment. You didn't need to predict anything — you just needed to buy both sides for less than $1.00 combined.

**Step 9: Why this works and when it doesn't**

This strategy works when:
- You can get both sides filled at prices that sum to less than $1.00
- The market has enough trading activity that counterparties show up

This strategy fails when:
- Only one side fills (you end up with a directional bet, not a hedge)
- You set prices too far from the market and nobody fills your orders

Professional market makers manage this risk by constantly adjusting their prices as the market moves. They make tiny profits on each trade but do thousands of trades.

**What you learned:**
- How to provide liquidity by placing orders on both sides
- The spread concept: buy both sides for less than $1.00, profit regardless of outcome
- Why market makers are essential to prediction markets
- The risk of one-sided fills

---

## Workflow 5: Portfolio Strategy — Diversifying Across Markets

### What This Workflow Does

You will build a diversified portfolio by placing trades across 5 different markets in different categories, based on a coherent investment thesis. Then you'll analyze your portfolio dashboard to understand your total exposure, risk, and P&L.

### Why This Matters

Putting all your money in one market is gambling. Building a diversified portfolio across multiple markets with different risk profiles is investing. This workflow teaches you to think like a portfolio manager: allocate capital based on conviction, manage risk through diversification, and track performance across your entire book.

### Step-by-Step

**Step 1: Define your investment thesis**

Before placing any trades, decide what you believe about the world. Here's an example thesis:

> "AI is advancing faster than people expect, crypto will have a strong year, and government institutions move slowly."

This thesis leads to specific trades:

| Market | Your View | Action | Confidence |
|--------|----------|--------|------------|
| "AI model >90% on MMLU" | AI is advancing fast | Buy YES | High |
| "Will AI pass the Turing test?" | Not by 2027 — too hard | Buy NO | Medium |
| "Will BTC be above $110K?" | Crypto is bullish | Buy YES | Medium |
| "US government shutdown in 2026?" | Government is dysfunctional | Buy YES | High |
| "AI-generated film wins festival?" | Too early for that | Buy NO | Low |

**Step 2: Allocate your capital**

You have $1,000 (or whatever is left from previous workflows). A good rule: never put more than 10-15% in one market. Scale your position size by conviction:

| Market | Conviction | Allocation | Budget |
|--------|-----------|-----------|--------|
| MMLU AI model | High | 15% | ~$100 |
| Turing test | Medium | 10% | ~$70 |
| BTC above $110K | Medium | 10% | ~$70 |
| Government shutdown | High | 15% | ~$100 |
| AI film festival | Low | 5% | ~$35 |
| **Cash reserve** | — | **45%** | ~$450 |

Keeping 45% in cash gives you flexibility to trade later if prices move.

**Step 3: Place all five trades**

Go to each market and place orders. Here's what to enter:

**Trade 1 — MMLU (AI category):**
- Click "Buy Yes", Price: `0.58`, Shares: `170`
- Cost: ~$98.60

**Trade 2 — Turing Test (AI category):**
- Click "Buy No", Price: `0.78`, Shares: `90`
- Cost: ~$70.20

**Trade 3 — BTC above $110K (Crypto category):**
- Click "Buy Yes", Price: `0.42`, Shares: `165`
- Cost: ~$69.30

**Trade 4 — Government Shutdown (Politics category):**
- Click "Buy Yes", Price: `0.55`, Shares: `180`
- Cost: ~$99.00

**Trade 5 — AI Film Festival (Entertainment category):**
- Click "Buy No", Price: `0.88`, Shares: `40`
- Cost: ~$35.20

**Total invested:** ~$372.30
**Cash remaining:** ~$627.70

**Step 4: Fill the orders with counterparties**

For each order, use the terminal to create matching counterparty orders. For example, for Trade 1 (YES at $0.58 for 170 shares), the counterparty buys NO at $0.42:

```bash
curl -X POST "http://localhost:3000/api/markets/MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b counter_cookies.txt \
  -d '{"side":"no","type":"limit","price":0.42,"quantity":170}'
```

Repeat for each market with the opposite side and complement price.

**Step 5: Review your portfolio dashboard**

Go to **http://localhost:3000/portfolio** and examine the three stat cards:

- **Balance:** Your remaining cash (~$627.70)
- **Unrealized P&L:** How much your positions have gained/lost since you bought them (starts near $0.00 for freshly placed trades)
- **Realized P&L:** Profit/loss from markets that have already resolved ($0.00 if none resolved yet)

**Step 6: Analyze your positions table**

Your Open Positions table should show all 5 positions:

| Market | Side | Shares | Avg Price | Current | Unreal. P&L |
|--------|------|--------|-----------|---------|-------------|
| MMLU AI model | YES | 170 | $0.58 | $0.58 | $0.00 |
| Turing test | NO | 90 | $0.78 | $0.78 | $0.00 |
| BTC above $110K | YES | 165 | $0.42 | $0.42 | $0.00 |
| Govt shutdown | YES | 180 | $0.55 | $0.55 | $0.00 |
| AI film festival | NO | 40 | $0.88 | $0.88 | $0.00 |

The P&L is $0.00 because you just entered. As market prices change from future trades, the "Current" price will diverge from your "Avg Price" and your unrealized P&L will update.

**Step 7: Calculate your portfolio's risk profile**

Think about the best and worst cases for your portfolio:

**Best case (all 5 correct):**
- MMLU YES wins: 170 x $1.00 = $170 (invested $98.60, profit $71.40)
- Turing NO wins: 90 x $1.00 = $90 (invested $70.20, profit $19.80)
- BTC YES wins: 165 x $1.00 = $165 (invested $69.30, profit $95.70)
- Shutdown YES wins: 180 x $1.00 = $180 (invested $99.00, profit $81.00)
- AI Film NO wins: 40 x $1.00 = $40 (invested $35.20, profit $4.80)
- **Total profit: $272.70 (73% return on invested capital)**

**Worst case (all 5 wrong):**
- All positions worth $0.00
- **Total loss: $372.30 (37% of total capital)**

**Most likely case (3 of 5 correct):**
- Rough profit: ~$100-150 from winners, ~$100-130 in losses
- **Net: roughly breakeven to small profit**

The key insight: even if you're only right 60% of the time, you can be profitable if you size your bets correctly.

**Step 8: Check the leaderboard**

Go to **http://localhost:3000/leaderboard**. You'll see your account among the pre-seeded traders. Your ranking depends on your total P&L (balance - $1,000 starting + realized P&L).

**What you learned:**
- How to build a thesis-driven portfolio across multiple markets
- Position sizing: allocating more to high-conviction bets
- Capital management: keeping a cash reserve
- Reading the portfolio dashboard: balance, unrealized P&L, realized P&L
- Risk analysis: best case, worst case, and expected outcomes

---

## Part III: Concepts That Make You Dangerous

### Reading the Order Book Like a Pro

The order book tells you more than just current prices. Here's how to read the signals:

**Depth = Conviction.** If the YES side has 500 shares at 60¢ and the NO side has only 20 shares at 40¢, it means YES buyers are more committed. There's real money backing the YES thesis.

**Gaps = Opportunity.** If the best YES bid is at 55¢ and the best NO bid is at 35¢, there's a 10¢ gap in the middle (55¢ + 35¢ = 90¢, less than $1.00). You could place orders inside this gap and potentially earn the spread.

**Thin books = Risk.** If there are very few orders on the book, any large trade will move the price dramatically. Small books mean high volatility.

**Stacked orders = Support/Resistance.** If you see a wall of orders at a specific price (e.g., 200 shares at 50¢), the price is unlikely to move past that level without significant buying pressure on the other side.

### Understanding P&L

There are two types of profit and loss in Polycast:

**Unrealized P&L** — paper gains or losses on positions you still hold.

```
Unrealized P&L = (Current Price - Your Avg Price) x Shares
```

Example: You bought 100 YES shares at $0.40. The current YES price is $0.55.
Unrealized P&L = ($0.55 - $0.40) x 100 = **+$15.00**

This is not real money yet. The price could go back down before the market resolves.

**Realized P&L** — actual money gained or lost when a market resolves.

When a market resolves YES:
- YES holders: Realized P&L = ($1.00 - avg_price) x shares (positive)
- NO holders: Realized P&L = ($0.00 - avg_price) x shares (negative)

Example: Market resolves YES. You held 100 YES shares at avg price $0.40.
Realized P&L = ($1.00 - $0.40) x 100 = **+$60.00** (locked-in profit)

### Common Mistakes Beginners Make

**Mistake 1: "The YES price is 80%, so it's going to happen."**
The price reflects what the crowd thinks, not what will happen. Crowds are often wrong. An 80% YES price means there's still a 20% chance of NO — and that 20% scenario pays 5x your money.

**Mistake 2: Buying at the current price when you could get a better deal.**
The displayed YES/NO price is the LAST trade price, not necessarily the best available price. Check the order book. You might find better prices sitting there. Or place a limit order below the current price and wait.

**Mistake 3: Going all-in on one market.**
If you put $900 of your $1,000 in one bet and you're wrong, you're nearly wiped out. Spread your bets. Professional traders rarely put more than 5-10% on any single position.

**Mistake 4: Ignoring the resolution criteria.**
Every market has specific resolution criteria in its description. "Will BTC be above $110K" might resolve based on CoinMarketCap's price, not Binance's. Read the description carefully before trading.

**Mistake 5: Confusing price with value.**
A YES share at $0.10 is not "cheap" — it's cheap because the market thinks there's only a 10% chance. The real question is: do YOU think the probability is higher than 10%? If you think it's 25%, then $0.10 is a bargain. If you agree it's 10%, it's fairly priced.

### Strategy Cheat Sheet

| Strategy | When to Use | Risk Level | How It Works |
|----------|------------|------------|-------------|
| **Conviction Bet** | You strongly believe YES or NO | High | Buy one side in size. High profit if right, high loss if wrong. |
| **Contrarian** | Crowd is overconfident | Medium-High | Buy the cheap side. Massive return if the crowd is wrong. |
| **Market Making** | You don't have a strong opinion | Low | Buy both sides below $1.00 combined. Small guaranteed profit. |
| **Diversified Portfolio** | General strategy | Medium | Spread bets across multiple markets. Win rate matters more than any one bet. |
| **Wait and Watch** | You're unsure | None | Keep cash. Monitor markets. Place orders when you see a clear opportunity. |

---

## Quick Reference Card

**Prediction Market Fundamentals:**
- YES + NO = $1.00 (always)
- Price = Market's probability estimate
- Winners get $1.00/share, losers get $0.00/share
- Profit = $1.00 minus what you paid (if you win)

**Matching Rule:**
- YES buy at price P matches NO buy at price (1 - P) or higher
- Example: YES $0.60 matches NO $0.40+

**Order Types:**
- **Limit order:** sits on the book at your price until filled
- **Market order:** fills immediately at best price, unfilled portion cancelled

**Key Pages:**
| Page | URL | What You See |
|------|-----|-------------|
| Home | `/` | All markets with category filters |
| Market Detail | `/markets/{id}` | Order book, price chart, trade panel |
| Portfolio | `/portfolio` | Your positions, P&L, open orders |
| Leaderboard | `/leaderboard` | Ranked traders |
| Sign Up | `/auth/signup` | Create account ($1,000 play money) |
| Log In | `/auth/login` | Sign into existing account |

**Math Formulas:**
```
Total Cost       = Price x Shares
Potential Payout = Shares x $1.00
Potential Profit = Payout - Cost
Unrealized P&L   = (Current Price - Avg Price) x Shares
Return on Invest. = Profit / Cost x 100%
```

**The One Rule That Matters:**
> Buy when you think the true probability is HIGHER than the market price.
> The bigger the gap between your estimate and the market price, the better the trade.

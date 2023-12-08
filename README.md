# Bubble-Trader
In this project I attempt to recreate a stock market using random agents as traders. The goal is to build a game that simulates day trading as realistically as possible.

## What Is Going On Inside
There are three main components.
### Trading Floor
This is an SVG frame containing many procedurally generated circles each representing a Trader that move around the frame bouncing off of walls and each other. There is one or more Podiums on the trade floor that represent the asset being traded. This is to simulate the stock exchange where floor traders must go to the podium to buy or sell stock. Every time one of the circles bounces off a podium it decides whether to buy or sell that podium's stock. Each trader decides based on internal State whether and how many shares to trade. Complexity is achieved by updating each trader's internal state based on interactions with other traders. In other words, each trader will potentially modify its own bullishness or bearishness every time it bounces off another trader.
### Price Chart
This is an SVG that displays the price history of the selected asset. The chart component composes the data into 1 second long pixels then each pixel is rendered on the screen as either a Candlestick pattern or a simple line representing the average price throughout the pixel. There are two moving averages that can be customized as well as toggled on and off in the Chart Housing element. Additionally, the volume of the shares traded during that pixel are displayed as a column chart at the bottom. The design of this was based on popular trading software platforms.
In addition to the price which is set by trading activity on the trading floor the underlying value of the stock can also be seen (this is for development only).
### Asset
This is represented by the Podium on the Trading Floor. This is meant to represent the actual company being traded. In the real world the value of a company is a mix of objective metrics like the value of the physical property like desks and chairs, and subjective metrics like how the company will do in the future. The value of the asset is meant to represent the objective metrics while the Trading Floor is meant to represent the subjective valuations of individual traders.
## Future Adds
### Trading Ticket
This will be an interface where the user can place trades in the market.
### Status Board
This will show each trader's networth including the user
### More To Do On The Market Dynamics
The connection between the asset value and the market price needs further work. 
## Tech
This is built in React. An earlier iteration was built in [C#](https://github.com/TheFreck/RiskGame.API/blob/master/Logic/EconLogic.cs)

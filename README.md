# brainvita-solver

![yarn test](https://github.com/sushiljainam/brainvita-solver/actions/workflows/npm-test.yml/badge.svg) ![CodeQL](https://github.com/sushiljainam/brainvita-solver/actions/workflows/codeql-analysis.yml/badge.svg)
---
A marble puzzle game Brainvita Solver.

This open source software code is an attempt to solve a single-player puzzle game called 'Brainvita' also called 'Marble puzzle' by some.

## What's the game?

* Initially, In 33 total cells of board (of 7x3, 3x7 plus shape) 32 are marbles are placed as shown in video, 1 cell in center is left empty. ref: https://www.youtube.com/watch?v=hmBPyHMy6Lc
* OBJECTIVE: To win the game, player need to discard all marbles off the board except one marble.
* HOW GAME ENDS: game can end any time if board is such in position that no marble can be moved anymore according to rules. so like board and marbles are frozen. remaining marbles at the end of game decides results.
  * if remaining marble is 1: player can be considered ULTIMATE winner.
  * if remaining marbles are more than 1: player can improve.

### How to play?

* for any empty cell, a marble can be played by jumping exactly one marble and be placed in empty space. doing so the marble which was jumped on is dicarded, kept out of board.
* as a result of any move, one marble switches place/cell, one marble gets discarded.
* so possible MAXIMUM MOVES in game are 31 so that 31 marbles can be discarded.

## Objective of this PROJECT

1. **Find all possible solutions.**

To learn multiple levels of optimization to achieve this in optimum time and CPU effort, as this can take months of code execution for a normal PC.

## What's done in this PROJECT?

* All possibles moves are found and applied on previous boards.
* All possible move paths picked are saved in database.

## How can I contribute?

* You can think more optimization possibilities and implement them, raise PRs.
* You can improve code coverage to make code more reliable.
* Eventually, we want to make it able to run on multiple nodes and share/save results/progress at one place. - you can think of that and plan.

## PROGRESS so far and definition of DONE

```txt
┌─────────┬────────┬───────────┬────────┬────────────┬─────────┬───────┬─────────┐
│ (index) │ blanks │  status   │ total  │ uniqBoards │ similar │ doing │ pending │
├─────────┼────────┼───────────┼────────┼────────────┼─────────┼───────┼─────────┤
│    0    │   1    │  'DONE'   │   1    │     1      │    0    │   0   │    0    │
│    1    │   2    │  'DONE'   │   4    │     1      │    3    │   0   │    0    │
│    2    │   3    │  'DONE'   │   3    │     2      │    1    │   0   │    0    │
│    3    │   4    │  'DONE'   │   10   │     8      │    2    │   0   │    0    │
│    4    │   5    │  'DONE'   │   51   │     39     │   12    │   0   │    0    │
│    5    │   6    │  'DONE'   │  294   │    171     │   123   │   0   │    0    │
│    6    │   7    │  'DONE'   │  1453  │    719     │   734   │   0   │    0    │
│    7    │   8    │  'DONE'   │  6606  │    2757    │  3849   │   0   │    0    │
│    8    │   9    │  'DONE'   │ 26912  │    9751    │  17161  │   0   │    0    │
│    9    │   10   │  'DONE'   │ 99280  │   31312    │  67968  │   0   │    0    │
│   10    │   11   │ 'RUNNING' │ 325332 │    3937    │  5096   │   0   │ 316299  │
└─────────┴────────┴───────────┴────────┴────────────┴─────────┴───────┴─────────┘
```

This table shows that I have executed this code so much that all possible combinations of boards till '10 marbles are discarded' are found and saved. And to find for '11 marbles discarded' execution is going on.

For '11 marbles discarded' there are total `325332` boards, but many of them are duplicate/symmetric, so we need to find unique boards (matrices) among them, and that's a CPU heavy task.

### definition of DONE (DOD):
This project can be considered finished when this table has 31 rows till `blanks:31` and for each row 'pending', and 'doing' are having value as zero (0).


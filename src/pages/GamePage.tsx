import { Button } from "antd";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  mockGames,
  type PlayerType,
  type PlayerCards,
} from "../data/mockGames";
import HandCards from "../components/HandCards";
import PlayedCards from "../components/PlayedCards";
import { type CardValue } from "../components/Card";

/** 玩家出牌顺序 */
const playerOrder: PlayerType[] = ["landlord", "farmer1", "farmer2"];

/**
 * 对局页面组件 - 正常模式
 * 展示斗地主对局的游戏界面，包含地主、下家、顶家的手牌和操作
 */
function GamePage() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  /**
   * 根据 gameId 获取对局信息
   */
  const currentGame = mockGames.find((game) => game.id === Number(gameId));

  /** 当前玩家选中的牌索引 */
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  /** 当前轮到的玩家 */
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("landlord");

  /** 牌堆中的牌（最近一次出牌） */
  const [playedCards, setPlayedCards] = useState<CardValue[]>([]);

  /** 当前对局的手牌状态（可变） */
  const [currentCards, setCurrentCards] = useState<PlayerCards>({
    landlord: [],
    farmer1: [],
    farmer2: [],
  });

  /** 游戏是否已结束 */
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  /**
   * 检查游戏是否结束
   * @param cards - 当前手牌状态
   * @returns 获胜玩家，如果游戏未结束则返回null
   */
  const checkGameEnd = (cards: PlayerCards): PlayerType | null => {
    // 检查每个玩家的手牌数量
    if (cards.landlord.length === 0) return "landlord";
    if (cards.farmer1.length === 0) return "farmer1";
    if (cards.farmer2.length === 0) return "farmer2";
    return null;
  };

  /**
   * 切换到下一个玩家
   * 如果游戏已结束（任意玩家手牌数量为0），则不进行切换
   */
  const switchToNextPlayer = () => {
    // 检查游戏是否已结束，如果已结束则不切换玩家
    if (isGameEnded) {
      return;
    }

    const currentIndex = playerOrder.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % playerOrder.length;
    setCurrentPlayer(playerOrder[nextIndex]);
    // 切换玩家时清空选中的牌
    setSelectedCards([]);
  };

  /**
   * 根据对局数据设置首发玩家和初始手牌
   */
  useEffect(() => {
    if (currentGame) {
      setCurrentPlayer(currentGame.firstPlayer);
      // 初始化手牌状态，深拷贝避免修改原始数据
      setCurrentCards({
        landlord: [...currentGame.cards.landlord],
        farmer1: [...currentGame.cards.farmer1],
        farmer2: [...currentGame.cards.farmer2],
      });
    }
  }, [gameId, currentGame]);

  /**
   * 监听手牌变化，检查游戏是否结束
   */
  useEffect(() => {
    // 只在手牌状态有效时检查游戏结束
    if (
      currentCards.landlord.length > 0 ||
      currentCards.farmer1.length > 0 ||
      currentCards.farmer2.length > 0
    ) {
      const gameWinner = checkGameEnd(currentCards);
      if (gameWinner && !isGameEnded) {
        setIsGameEnded(true);
        console.log(`游戏结束！获胜者: ${gameWinner}`);
      }
    }
  }, [currentCards, isGameEnded]);

  /**
   * 返回首页
   */
  const handleGoBack = () => {
    navigate("/");
  };

  /**
   * 处理过牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePass = (player: PlayerType) => {
    // 检查游戏是否已结束
    if (isGameEnded) {
      console.log(`游戏已结束，无法进行过牌操作`);
      return;
    }

    // 检查是否轮到该玩家
    if (player !== currentPlayer) {
      console.log(`还没轮到 ${player}，当前轮到 ${currentPlayer}`);
      return;
    }

    console.log(`${player} 过牌`);
    // 切换到下一个玩家（会自动清空选中的牌）
    switchToNextPlayer();
  };

  /**
   * 处理出牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePlayCards = (player: PlayerType) => {
    // 检查游戏是否已结束
    if (isGameEnded) {
      console.log(`游戏已结束，无法进行出牌操作`);
      return;
    }

    // 检查是否轮到该玩家
    if (player !== currentPlayer) {
      console.log(`还没轮到 ${player}，当前轮到 ${currentPlayer}`);
      return;
    }

    if (selectedCards.length === 0) {
      console.log(`${player} 没有选中任何牌`);
      return;
    }

    const playerCards = currentCards[player];
    const selectedCardValues = selectedCards.map((index) => playerCards[index]);

    console.log(`${player} 出牌:`, selectedCardValues);

    // 将选中的牌显示在牌堆中（覆盖之前的牌）
    setPlayedCards(selectedCardValues);

    // 从玩家手牌中移除已出的牌
    const newPlayerCards = playerCards.filter(
      (_, index) => !selectedCards.includes(index)
    );

    // 更新手牌状态
    const newCards = {
      ...currentCards,
      [player]: newPlayerCards,
    };
    setCurrentCards(newCards);

    // 检查游戏是否结束
    const gameWinner = checkGameEnd(newCards);
    if (gameWinner) {
      setIsGameEnded(true);
      console.log(`游戏结束！获胜者: ${gameWinner}`);
      // 清空选中的牌，但不切换到下一个玩家
      setSelectedCards([]);
    } else {
      // 切换到下一个玩家（会自动清空选中的牌）
      switchToNextPlayer();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部操作栏 */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Button onClick={handleGoBack}>返回</Button>
          <div className="flex flex-col items-center">
            {/* 对局名称 */}
            <h1 className="text-xl font-semibold">{currentGame!.title}</h1>
          </div>
        </div>
      </div>

      {/* 对局区域 */}
      <div className="flex-1 p-6 flex flex-col !lg:flex-row gap-4">
        <div className="flex flex-col justify-between gap-4 lg:w-screen-xl">
          {/* 地主 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "landlord" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              地主
            </div>
            {/* 手牌展示 */}
            <HandCards
              cards={currentCards.landlord}
              selectedIndexes={
                currentPlayer === "landlord" ? selectedCards : []
              }
              disabled={currentPlayer !== "landlord"}
              onSelectionChange={setSelectedCards}
            />
            {currentPlayer === "landlord" && !isGameEnded && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handlePass("landlord")}
                >
                  过牌
                </Button>
                <Button
                  className="flex-1"
                  type="primary"
                  onClick={() => handlePlayCards("landlord")}
                >
                  出牌
                </Button>
              </div>
            )}
          </div>
          {/* 下家 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "farmer1" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              下家
            </div>
            {/* 手牌展示 */}
            <HandCards
              cards={currentCards.farmer1}
              selectedIndexes={currentPlayer === "farmer1" ? selectedCards : []}
              disabled={currentPlayer !== "farmer1"}
              onSelectionChange={setSelectedCards}
            />
            {currentPlayer === "farmer1" && !isGameEnded && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handlePass("farmer1")}
                >
                  过牌
                </Button>
                <Button
                  className="flex-1"
                  type="primary"
                  onClick={() => handlePlayCards("farmer1")}
                >
                  出牌
                </Button>
              </div>
            )}
          </div>
          {/* 顶家 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "farmer2" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              顶家
            </div>
            {/* 手牌展示 */}
            <HandCards
              cards={currentCards.farmer2}
              selectedIndexes={currentPlayer === "farmer2" ? selectedCards : []}
              disabled={currentPlayer !== "farmer2"}
              onSelectionChange={setSelectedCards}
            />
            {currentPlayer === "farmer2" && !isGameEnded && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handlePass("farmer2")}
                >
                  过牌
                </Button>
                <Button
                  className="flex-1"
                  type="primary"
                  onClick={() => handlePlayCards("farmer2")}
                >
                  出牌
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* 牌堆 */}
        <div className="flex-1">
          <PlayedCards playedCards={playedCards} />
        </div>
      </div>
    </div>
  );
}

export default GamePage;
